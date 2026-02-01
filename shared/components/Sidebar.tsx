"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, FileText, Users, Settings, HeartPulse } from "lucide-react";
import Image from "next/image"; // Import Image from next/image


interface SidebarProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({}) => {
  const pathname = usePathname();

  const navItems = [
    {
      id: "memories",
      label: "My Memories",
      icon: FileText,
      href: "/dashboard",
    },
    { id: "recipients", label: "Recipients", icon: Users, href: "/recipients" },
    {
      id: "proof-of-life",
      label: "Proof of Life Settings",
      icon: HeartPulse,
      href: "/proof-of-life",
      hasNotification: true,
    },
    { id: "security", label: "Security", icon: Shield, href: "/security" },
  ];

  return (
    <aside className="w-64 bg-[#0f1419] border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <Image src="/logo.png" alt="Life After Life" width={24} height={24} className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-white font-semibold">Life After Life</h1>
            <p className="text-xs text-gray-500">Secure Memories</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "text-emerald-400 bg-emerald-400/10"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.hasNotification && (
                <span className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Account Settings */}
      <div className="p-4 border-t border-gray-800">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Account Settings</span>
        </Link>

        <div className="mt-4 px-4 py-3 rounded-lg bg-gray-800/30 border border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
