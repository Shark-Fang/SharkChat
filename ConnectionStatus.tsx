import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ConnectionStatusProps {
  status: 'connected' | 'connecting' | 'disconnected';
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status }) => {
  if (status === 'connected') return null;

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
      <Alert variant="destructive" className="bg-red-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center">
        <AlertDescription>
          {status === 'connecting' 
            ? 'Connecting to chat server...' 
            : 'Connection lost. Reconnecting...'}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ConnectionStatus;
