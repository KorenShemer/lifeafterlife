// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Shield,
  CheckCircle,
  Users,
  FileText,
  Settings,
} from "lucide-react";

import {
  Button,
  Card,
  Badge,
  ProgressBar,
  StatCard,
  CircularProgress,
  MemoryCard,
  RecipientCard,
} from "../../shared/components";
import { PageTransition } from "@/shared/components/PageTransition";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types/database.types";
import { User } from "@supabase/supabase-js";

type DbMemory = Database['public']['Tables']['memories']['Row'];
type DbRecipient = Database['public']['Tables']['recipients']['Row'];
type CheckIn = Database['public']['Tables']['checkins']['Row'];

// Component types (what your components expect)
type Memory = {
  id: number;
  type: "text" | "photos";
  title: string;
  preview?: string;
  photoCount?: number;
  recipients: string[];
  recipientCount: number;
  date: string;
};

type Recipient = {
  id: number;
  name: string;
  email: string;
  initials: string;
  verified: boolean;
  memoryCount: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [memories, setMemories] = useState<DbMemory[]>([]);
  const [recipients, setRecipients] = useState<DbRecipient[]>([]);
  const [lastCheckIn, setLastCheckIn] = useState<CheckIn | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const supabase = await createClient();

      // Get authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        router.push('/login');
        return;
      }

      setUser(authUser);

      // Fetch memories
      const { data: memoriesData } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (memoriesData) setMemories(memoriesData);

      // Fetch recipients
      const { data: recipientsData } = await supabase
        .from('recipients')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recipientsData) setRecipients(recipientsData);

      // Fetch last check-in
      const { data: checkInData } = await supabase
        .from('checkins')
        .select('*')
        .eq('user_id', authUser.id)
        .order('checked_in_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (checkInData) setLastCheckIn(checkInData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProofOfLife = () => {
    if (!lastCheckIn) {
      return {
        daysLeft: 60,
        currentDay: 0,
        totalDays: 60,
        nextVerificationDays: 60,
        isVerified: false,
      };
    }

    const lastCheckInDate = new Date(lastCheckIn.checked_in_at);
    const now = new Date();
    const daysSinceCheckIn = Math.floor((now.getTime() - lastCheckInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalDays = 60; // Default check-in period
    const daysLeft = Math.max(0, totalDays - daysSinceCheckIn);

    return {
      daysLeft,
      currentDay: Math.min(daysSinceCheckIn, totalDays),
      totalDays,
      nextVerificationDays: daysLeft,
      isVerified: daysSinceCheckIn < totalDays,
    };
  };

  const handleVerifyNow = async () => {
    try {
      const supabase = await createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) return;

      const { error } = await supabase
        .from('checkins')
        .insert({
          user_id: authUser.id,
          method: 'manual',
          status: 'verified',
          checked_in_at: new Date().toISOString(),
        });

      if (!error) {
        // Refresh data
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error verifying:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const proofOfLife = calculateProofOfLife();
  const stats = {
    totalMemories: memories.length,
    scheduledRecipients: recipients.length,
  };

  // Format memories for display - convert DB types to component types
  const formattedMemories: Memory[] = memories.map((memory, index) => ({
    id: index + 1, // Use index as numeric ID for display
    type: (memory.media_type === 'image' ? 'photos' : 'text') as "text" | "photos",
    title: memory.title,
    preview: memory.content?.substring(0, 50),
    photoCount: memory.media_type === 'image' ? 1 : undefined,
    recipients: [], // You'll need to join with memory_recipients table
    recipientCount: 0, // Same as above
    date: new Date(memory.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  }));

  // Format recipients for display - convert DB types to component types
  const formattedRecipients: Recipient[] = recipients.map((recipient, index) => ({
    id: index + 1, // Use index as numeric ID for display
    name: recipient.name,
    email: recipient.email,
    initials: recipient.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2),
    verified: true, // You might want to add a verified field to recipients table
    memoryCount: 0, // You'll need to count from memory_recipients table
  }));

  return (
    <PageTransition>
      <div className="p-5 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Proof of Life Card */}
          <Card variant="gradient" className="md:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h3 className="text-white font-semibold">Proof of Life</h3>
              </div>
              <Badge variant={proofOfLife.isVerified ? "success" : "error"}>
                <CheckCircle className="w-3 h-3" />
                {proofOfLife.isVerified ? "Verified" : "Needs Verification"}
              </Badge>
            </div>

            <div className="flex items-center justify-center py-3">
              <div className="scale-90">
                <CircularProgress
                  value={proofOfLife.currentDay}
                  max={proofOfLife.totalDays}
                />
              </div>
            </div>

            <div className="text-center text-sm text-gray-400 mb-3">
              Next verification in{" "}
              <span className={`font-medium ${proofOfLife.daysLeft < 7 ? 'text-red-400' : 'text-emerald-400'}`}>
                {proofOfLife.nextVerificationDays} days
              </span>
            </div>

            <ProgressBar
              value={proofOfLife.currentDay}
              max={proofOfLife.totalDays}
              showLabels
              labels={["0", "30", "45", "52", "60"]}
            />

            <div className="space-y-2 mt-3">
              <Button 
                variant="primary" 
                className="w-full"
                onClick={handleVerifyNow}
              >
                <CheckCircle className="w-4 h-4" />
                Verify Now
              </Button>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => router.push('/settings')}
              >
                <Settings className="w-4 h-4" />
                View Settings
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-3">
              Your memories will be delivered if verification is missed.
            </p>
          </Card>

          {/* Stats Cards */}
          <StatCard
            value={stats.totalMemories}
            label="Total Memories"
            sublabel="All media types"
            icon={FileText}
          />

          <StatCard
            value={stats.scheduledRecipients}
            label="Recipients"
            sublabel="Active"
            icon={Users}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Your Memories */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Your Memories</h3>
              <div className="flex items-center gap-2">
                <button 
                  className="text-sm text-emerald-400 hover:text-emerald-300"
                  onClick={() => router.push('/memories')}
                >
                  View All
                </button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => router.push('/memories/new')}
                >
                  <Plus className="w-4 h-4" />
                  New Memory
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {formattedMemories.length > 0 ? (
                formattedMemories.map((memory) => (
                  <MemoryCard key={memory.id} memory={memory} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No memories yet</p>
                  <p className="text-sm mt-1">Create your first memory to get started</p>
                </div>
              )}
            </div>
          </Card>

          {/* Recipients */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Recipients</h3>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => router.push('/recipients')}
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>

            <div className="space-y-2.5">
              {formattedRecipients.length > 0 ? (
                formattedRecipients.map((recipient) => (
                  <RecipientCard key={recipient.id} recipient={recipient} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recipients yet</p>
                  <p className="text-sm mt-1">Add recipients to share your memories</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}