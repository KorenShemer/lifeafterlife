// shared/components/ConditionalLayout.tsx
"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ReactNode, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types/database.types";

type User = Database["public"]["Tables"]["users"]["Row"];

interface ConditionalLayoutProps {
  children: ReactNode;
}

export const ConditionalLayout = ({ children }: ConditionalLayoutProps) => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheckIn, setLastCheckIn] = useState<any>(null);

  // Pages that should NOT have the sidebar/header
  const publicPages = ["/", "/login", "/signup", "/forgot-password"];
  const isPublicPage = publicPages.includes(pathname);

  useEffect(() => {
    if (isPublicPage) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const supabase = createClient();

        // Get authenticated user
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser) {
          console.error("Auth error:", authError);
          // Redirect to login if not authenticated
          window.location.href = "/login";
          return;
        }

        // Fetch user profile from users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (userError) {
          console.error("User fetch error:", userError);
          return;
        }

        setUser(userData);

        // Fetch last check-in
        const { data: checkInData } = await supabase
          .from("checkins")
          .select("*")
          .eq("user_id", authUser.id)
          .order("checked_in_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (checkInData) setLastCheckIn(checkInData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pathname, isPublicPage]);

  // Calculate days since last check-in
  const calculateDaysSinceCheckIn = () => {
    if (!lastCheckIn?.checked_in_at) return "Never";
    
    const checkInDate = new Date(lastCheckIn.checked_in_at);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - checkInDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  // If it's a public page, just render children
  if (isPublicPage) {
    return <>{children}</>;
  }

  // Show loading state while fetching user
  if (loading) {
    return (
      <div className="flex h-screen bg-[#0a0e1a] items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If no user data, don't render (will redirect to login)
  if (!user) {
    return null;
  }

  // Format user data for components
  const formattedUser = {
    name: user.full_name || user.username || "User",
    email: user.email,
    avatar:
      user.avatar_url ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || user.email}`,
  };

  // Otherwise, render with sidebar and header
  return (
    <div className="flex h-screen bg-[#0a0e1a]">
      <Sidebar user={formattedUser} />
      <main className="flex-1 overflow-auto flex flex-col">
        <Header user={formattedUser} lastVerified={calculateDaysSinceCheckIn()} />
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
};