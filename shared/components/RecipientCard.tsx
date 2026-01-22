import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

interface Recipient {
  id: number;
  name: string;
  email: string;
  initials: string;
  verified: boolean;
  memoryCount: number;
}

interface RecipientCardProps {
  recipient: Recipient;
}

export const RecipientCard: React.FC<RecipientCardProps> = ({ recipient }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-[#1a1f2e] border border-gray-700 rounded-lg hover:border-emerald-400/50 transition cursor-pointer">
      <Avatar initials={recipient.initials} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-white truncate">
            {recipient.name}
          </div>
          {recipient.verified ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
          )}
        </div>
        <div className="text-xs text-gray-400 truncate">{recipient.email}</div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={recipient.verified ? 'success' : 'warning'}>
            {recipient.verified ? 'Verified' : 'Pending'}
          </Badge>
          <span className="text-xs text-gray-500">
            • {recipient.memoryCount} memories
          </span>
        </div>
      </div>
    </div>
  );
};