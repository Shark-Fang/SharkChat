import React, { forwardRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id?: number;
  sender: string;
  content: string;
  timestamp: string;
  isSystem?: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  currentUser: string;
  messageEndRef: React.RefObject<HTMLDivElement>;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

function getRandomColor(name: string): string {
  const colors = ['indigo-500', 'green-500', 'amber-500', 'blue-500', 'purple-500', 'pink-500'];
  // Use a hash of the name to pick a consistent color
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ messages, currentUser, messageEndRef }, ref) => {
    return (
      <ScrollArea className="flex-grow overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-3">
          {messages.map((message, index) => (
            message.isSystem ? (
              // System message
              <div key={index} className="flex justify-center message-appear animate-fadeIn">
                <div className="bg-gray-200 text-gray-600 rounded-md px-4 py-2 text-sm max-w-md text-center">
                  {message.content}
                </div>
              </div>
            ) : message.sender === currentUser ? (
              // Current user message
              <div key={index} className="flex items-end justify-end message-appear animate-fadeIn">
                <div className="max-w-md">
                  <div className="text-xs text-gray-500 mb-1 mr-1 text-right">You</div>
                  <div className="bg-primary text-white rounded-lg rounded-br-none px-4 py-2 shadow-sm">
                    {message.content}
                  </div>
                </div>
              </div>
            ) : (
              // Other user message
              <div key={index} className="flex items-end message-appear animate-fadeIn">
                <div className="flex-shrink-0 mr-2">
                  <div className={`w-8 h-8 rounded-full bg-${getRandomColor(message.sender)} flex items-center justify-center text-white font-medium`}>
                    {getInitials(message.sender)}
                  </div>
                </div>
                <div className="max-w-md">
                  <div className="text-xs text-gray-500 mb-1 ml-1">{message.sender}</div>
                  <div className="bg-white rounded-lg rounded-bl-none px-4 py-2 shadow-sm">
                    {message.content}
                  </div>
                </div>
              </div>
            )
          ))}
          <div ref={messageEndRef} />
        </div>
      </ScrollArea>
    );
  }
);

ChatMessages.displayName = 'ChatMessages';

export default ChatMessages;
