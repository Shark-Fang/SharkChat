import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatHeaderProps {
  roomCode: string | null;
  userCount: number;
  toggleShareMenu: () => void;
  copyRoomLink: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  roomCode,
  userCount,
  toggleShareMenu,
  copyRoomLink
}) => {
  const roomLink = roomCode ? `${window.location.origin}/room/${roomCode}` : '';

  return (
    <header className="bg-primary text-white py-3 px-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <span className="mr-2">💬</span>
          <h1 className="text-xl font-semibold">SharkChat</h1>
        </div>
        <div className="flex items-center">
          <div className="mr-4 hidden md:flex items-center bg-shark-700 rounded-md px-3 py-1">
            <Input
              type="text"
              readOnly
              value={roomLink}
              className="bg-transparent text-sm border-none outline-none w-48 md:w-64"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={copyRoomLink}
              aria-label="Copy link"
              className="ml-2 text-accent hover:text-white transition duration-150 p-0"
            >
              <span className="text-sm">📋</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleShareMenu}
            aria-label="Share"
            className="md:hidden bg-shark-700 rounded-md p-2"
          >
            <span className="text-sm">📤</span>
          </Button>
          <div className="flex items-center text-sm ml-2">
            <span className="text-sm mr-1">👥</span>
            <span>{userCount}</span> online
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
