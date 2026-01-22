import React from 'react';
import { Shield, FileText, Users, Settings } from 'lucide-react';

interface SidebarProps {
  user: {
    name: string;
    email: string;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  return (
    <aside className="w-64 bg-[#0f1419] border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-semibold">Life After Life</h1>
            <p className="text-xs text-gray-500">Secure Memories</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <a 
          href="#" 
          className="flex items-center gap-3 px-4 py-3 text-emerald-400 bg-emerald-400/10 rounded-lg"
        >
          <FileText className="w-5 h-5" />
          <span className="font-medium">My Memories</span>
        </a>
        <a 
          href="#" 
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition"
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">Recipients</span>
        </a>
        <a 
          href="#" 
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition"
        >
          <Shield className="w-5 h-5" />
          <span className="font-medium">Proof of Life Settings</span>
          <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
        </a>
        <a 
          href="#" 
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Security</span>
        </a>
      </nav>

      {/* Account Settings */}
      <div className="p-4 border-t border-gray-800">
        <a 
          href="#" 
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Account Settings</span>
        </a>
      </div>
    </aside>
  );
};