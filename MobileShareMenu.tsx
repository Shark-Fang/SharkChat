import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MobileShareMenuProps {
  isVisible: boolean;
  roomCode: string | null;
  copyRoomLink: () => void;
}

const MobileShareMenu: React.FC<MobileShareMenuProps> = ({
  isVisible,
  roomCode,
  copyRoomLink
}) => {
  if (!isVisible) return null;

  const roomLink = roomCode ? `${window.location.origin}/room/${roomCode}` : '';

  return (
    <div className="md:hidden bg-shark-700 text-white p-3">
      <div className="flex items-center justify-between">
        <Input
          type="text"
          readOnly
          value={roomLink}
          className="bg-transparent text-sm border-none outline-none flex-grow"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={copyRoomLink}
          aria-label="Copy link"
          className="ml-2 text-accent p-1"
        >
          <span className="text-sm">📋</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileShareMenu;
