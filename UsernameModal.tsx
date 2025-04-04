import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface UsernameModalProps {
  isVisible: boolean;
  displayName: string;
  setDisplayName: (name: string) => void;
  onSubmit: () => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({
  isVisible,
  displayName,
  setDisplayName,
  onSubmit
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim()) {
      onSubmit();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center mb-4">
            <span className="text-primary text-4xl mr-2">🦈</span>
            <h2 className="text-2xl font-bold text-primary">SharkChat</h2>
          </div>
          <p className="text-center mb-6 text-gray-600">
            Join the conversation! Enter your display name to continue.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username-input" className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <Input
                id="username-input"
                ref={inputRef}
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                required
                autoComplete="off"
                className="w-full px-4 py-2"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-shark-600 text-white font-medium py-2"
            >
              Join Chat
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsernameModal;
