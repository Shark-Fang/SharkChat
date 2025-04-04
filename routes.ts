import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { log } from "./vite";
import { ChatEvent, insertMessageSchema } from "@shared/schema";
import { randomBytes } from "crypto";

// Track connected clients for each room
const roomClients = new Map<string, Map<string, { ws: WebSocket, username: string }>>();

// Create a room if it doesn't exist
function ensureRoom(roomCode: string) {
  if (!roomClients.has(roomCode)) {
    roomClients.set(roomCode, new Map());
  }
  return roomClients.get(roomCode)!;
}

// Get user count in a room
function getUserCount(roomCode: string): number {
  return roomClients.get(roomCode)?.size || 0;
}

// Get all usernames in a room
function getUsernames(roomCode: string): string[] {
  const room = roomClients.get(roomCode);
  if (!room) return [];
  return Array.from(room.values()).map(client => client.username);
}

// Broadcast to all clients in a room
function broadcastToRoom(roomCode: string, message: ChatEvent, excludeClientId?: string) {
  const room = roomClients.get(roomCode);
  if (!room) return;

  const messageStr = JSON.stringify(message);
  
  room.forEach((client, clientId) => {
    if (excludeClientId && clientId === excludeClientId) return;
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(messageStr);
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Create a WebSocket server
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws'
  });
  
  app.get("/api/rooms/:roomCode/messages", async (req, res) => {
    const { roomCode } = req.params;
    const messages = await storage.getMessagesByRoom(roomCode);
    res.json(messages);
  });
  
  app.post("/api/rooms", async (req, res) => {
    try {
      const roomCode = await storage.createRoom();
      res.json({ roomCode });
    } catch (error) {
      res.status(500).json({ message: "Failed to create room" });
    }
  });

  // WebSocket connection handler
  wss.on("connection", (ws, req) => {
    // Generate a unique client ID
    const clientId = randomBytes(16).toString("hex");
    let userRoomCode: string | null = null;
    let username: string | null = null;

    log(`WebSocket client connected: ${clientId}`);

    // Handle incoming messages
    ws.on("message", async (data) => {
      try {
        const event: ChatEvent = JSON.parse(data.toString());
        
        if (!event.type || !event.roomCode) {
          return ws.send(JSON.stringify({ 
            type: "error", 
            content: "Invalid message format" 
          }));
        }

        // Store the room code for this connection
        userRoomCode = event.roomCode;
        
        // Handle different event types
        switch (event.type) {
          case "join":
            if (!event.sender) {
              return ws.send(JSON.stringify({ 
                type: "error", 
                content: "Username is required to join" 
              }));
            }
            
            username = event.sender;
            
            // Add this client to the room
            const roomClients = ensureRoom(userRoomCode);
            roomClients.set(clientId, { ws, username });
            
            // Send welcome message to the new user
            ws.send(JSON.stringify({
              type: "system",
              roomCode: userRoomCode,
              content: `Welcome to SharkChat! You've joined the room.`,
              timestamp: new Date().toISOString()
            }));
            
            // Broadcast join message to other users
            broadcastToRoom(userRoomCode, {
              type: "system",
              roomCode: userRoomCode,
              content: `${username} has joined the chat.`,
              timestamp: new Date().toISOString()
            }, clientId);
            
            // Notify all clients about updated user list
            broadcastToRoom(userRoomCode, {
              type: "users",
              roomCode: userRoomCode,
              users: getUsernames(userRoomCode),
              timestamp: new Date().toISOString()
            });
            break;
            
          case "message":
            if (!username) {
              return ws.send(JSON.stringify({ 
                type: "error", 
                content: "You must join a room before sending messages" 
              }));
            }
            
            if (!event.content) {
              return ws.send(JSON.stringify({ 
                type: "error", 
                content: "Message content is required" 
              }));
            }
            
            // Store message in database
            try {
              const messageData = {
                roomCode: userRoomCode,
                sender: username,
                content: event.content
              };
              
              const validatedData = insertMessageSchema.parse(messageData);
              const savedMessage = await storage.createMessage(validatedData);
              
              // Broadcast message to all users in the room
              broadcastToRoom(userRoomCode, {
                type: "message",
                roomCode: userRoomCode,
                sender: username,
                content: event.content,
                id: savedMessage.id,
                timestamp: savedMessage.timestamp.toISOString()
              });
            } catch (error) {
              ws.send(JSON.stringify({ 
                type: "error", 
                content: "Failed to save message" 
              }));
            }
            break;
            
          default:
            ws.send(JSON.stringify({ 
              type: "error", 
              content: "Unknown event type" 
            }));
        }
      } catch (error) {
        ws.send(JSON.stringify({ 
          type: "error", 
          content: "Invalid message format" 
        }));
      }
    });

    // Handle disconnection
    ws.on("close", () => {
      if (userRoomCode && username) {
        // Remove client from room
        const room = roomClients.get(userRoomCode);
        if (room) {
          room.delete(clientId);
          
          // If room is empty, clean it up
          if (room.size === 0) {
            roomClients.delete(userRoomCode);
          } else {
            // Notify others about user leaving
            broadcastToRoom(userRoomCode, {
              type: "system",
              roomCode: userRoomCode,
              content: `${username} has left the chat.`,
              timestamp: new Date().toISOString()
            });
            
            // Update user list
            broadcastToRoom(userRoomCode, {
              type: "users",
              roomCode: userRoomCode,
              users: getUsernames(userRoomCode),
              timestamp: new Date().toISOString()
            });
          }
        }
      }
      
      log(`WebSocket client disconnected: ${clientId}`);
    });
  });

  return httpServer;
}
