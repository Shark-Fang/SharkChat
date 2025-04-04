import { messages, type Message, type InsertMessage, type Room, type InsertRoom } from "@shared/schema";
import { randomBytes } from "crypto";

// Modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Room methods
  createRoom(): Promise<string>;
  getRoomByCode(roomCode: string): Promise<Room | undefined>;
  
  // Message methods
  getMessagesByRoom(roomCode: string, limit?: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private rooms: Map<string, Room>;
  private roomMessages: Map<string, Message[]>;
  currentId: number;
  currentMessageId: number;
  currentRoomId: number;

  constructor() {
    this.users = new Map();
    this.rooms = new Map();
    this.roomMessages = new Map();
    this.currentId = 1;
    this.currentMessageId = 1;
    this.currentRoomId = 1;
  }

  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Generate a random 6-character alphanumeric room code
  async createRoom(): Promise<string> {
    const roomCode = randomBytes(3).toString('hex');
    const id = this.currentRoomId++;
    const createdAt = new Date();
    const room: Room = { id, roomCode, createdAt };
    this.rooms.set(roomCode, room);
    this.roomMessages.set(roomCode, []);
    return roomCode;
  }

  async getRoomByCode(roomCode: string): Promise<Room | undefined> {
    return this.rooms.get(roomCode);
  }

  async getMessagesByRoom(roomCode: string, limit = 50): Promise<Message[]> {
    const messages = this.roomMessages.get(roomCode) || [];
    return messages.slice(-limit);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const timestamp = new Date();
    const message: Message = { ...insertMessage, id, timestamp };
    
    const roomMessages = this.roomMessages.get(insertMessage.roomCode) || [];
    roomMessages.push(message);
    this.roomMessages.set(insertMessage.roomCode, roomMessages);
    
    return message;
  }
}

export const storage = new MemStorage();
