// shared/components/Header.tsx
"use client";

import { Bell } from "lucide-react";
import { SearchInput } from "./SearchInput";
import { Avatar } from "./Avatar";

interface HeaderProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  lastVerified: string;
}

export const Header = ({ user, lastVerified }: HeaderProps) => {
  return (
    <header className="bg-[#0f1419] border-b border-gray-800 px-6 py-5 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Welcome back, {user.name}
          </h2>
          <p className="text-sm text-gray-400">
            Your legacy is{" "}
            <span className="text-emerald-400 font-medium">secure</span>. Last
            verified {lastVerified}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput placeholder="Search memories..." className="w-56" />
          <button className="relative p-2 text-gray-400 hover:text-white transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-gray-700">
            <div className="text-right">
              <div className="text-sm font-medium text-white">
                {user.name}
              </div>
              <div className="text-xs text-gray-400">Premium</div>
            </div>
            <Avatar src={user.avatar} alt={user.name} />
          </div>
        </div>
      </div>
    </header>
  );
};