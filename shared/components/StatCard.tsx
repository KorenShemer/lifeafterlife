import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from './Card';

interface StatCardProps {
  value: string | number;
  label: string;
  sublabel: string;
  icon: LucideIcon;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, sublabel, icon: Icon }) => {
  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-3xl font-bold text-white">{value}</div>
          <div className="text-sm text-gray-400 mt-1">{label}</div>
        </div>
        <div className="p-2 bg-emerald-400/10 rounded-lg">
          <Icon className="w-5 h-5 text-emerald-400" />
        </div>
      </div>
      <div className="text-xs text-gray-500">{sublabel}</div>
    </Card>
  );
};