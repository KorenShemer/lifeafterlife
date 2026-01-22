import React from 'react';
import { FileText, Image, Users } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';

interface Memory {
  id: number;
  type: 'text' | 'photos';
  title: string;
  preview?: string;
  photoCount?: number;
  recipients: string[];
  recipientCount: number;
  date: string;
}

interface MemoryCardProps {
  memory: Memory;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory }) => {
  return (
    <Card hover className="bg-[#1a1f2e] border-gray-700">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-emerald-400/10 rounded-lg">
          {memory.type === 'text' ? (
            <FileText className="w-6 h-6 text-emerald-400" />
          ) : (
            <Image className="w-6 h-6 text-emerald-400"/>
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">{memory.title}</h4>
          {memory.preview && (
            <p className="text-sm text-gray-400 mb-3">{memory.preview}</p>
          )}
          {memory.photoCount && (
            <p className="text-sm text-gray-400 mb-3">{memory.photoCount} photos</p>
          )}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {memory.recipientCount} recipients
            </div>
            <span>{memory.date}</span>
          </div>
          <div className="flex gap-2 mt-3">
            {memory.recipients.map((recipient, idx) => (
              <Badge key={idx}>{recipient}</Badge>
            ))}
            {memory.recipientCount > memory.recipients.length && (
              <Badge>+{memory.recipientCount - memory.recipients.length}</Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};