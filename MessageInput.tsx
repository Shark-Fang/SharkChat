import React, { KeyboardEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EmojiPicker from './EmojiPicker';

interface MessageInputProps {
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  sendMessage: () => void;
  isEmojiPickerOpen: boolean;
  toggleEmojiPicker: () => void;
  addEmoji: (emoji: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  currentMessage,
  setCurrentMessage,
  sendMessage,
  isEmojiPickerOpen,
  toggleEmojiPicker,
  addEmoji
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
    // Focus the input after sending
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3 relative">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-center">
          <div className="relative flex-grow">
            <Input
              ref={inputRef}
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              autoComplete="off"
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleEmojiPicker}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary p-1"
            >
              😊
            </Button>
          </div>
          <Button
            type="submit"
            className="ml-2 bg-primary hover:bg-shark-600 text-white rounded-full p-2"
          >
            📤
          </Button>
        </form>
        <EmojiPicker 
          isVisible={isEmojiPickerOpen} 
          onEmojiSelect={addEmoji} 
        />
      </div>
    </div>
  );
};

export default MessageInput;
