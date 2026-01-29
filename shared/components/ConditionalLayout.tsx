// shared/components/ConditionalLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ReactNode } from "react";
import { PageTransition } from "./PageTransition";

interface ConditionalLayoutProps {
  children: ReactNode;
}

export const ConditionalLayout = ({ children }: ConditionalLayoutProps) => {
  const pathname = usePathname();

  // Pages that should NOT have the sidebar/header
  const publicPages = ["/", "/login", "/signup", "/forgot-password"];
  const isPublicPage = publicPages.includes(pathname);

  const user = {
    name: "Alexander",
    email: "alexander@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander",
  };

  // If it's a public page, just render children
  if (isPublicPage) {
    return <>{children}</>;
  }

  // Otherwise, render with sidebar and header
  return (
    <div className="flex h-screen bg-[#0a0e1a]">
      <Sidebar user={user} />
      <main className="flex-1 overflow-auto flex flex-col">
        <Header user={user} lastVerified="3 days ago" />
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
};
