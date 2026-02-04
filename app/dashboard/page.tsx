// app/dashboard/page.tsx
"use client";

import {
  Plus,
  Shield,
  CheckCircle,
  Users,
  HardDrive,
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

export default function DashboardPage() {
  const stats = {
    totalMemories: 6,
    scheduledRecipients: 5,
    storageUsed: 2.4,
    storageTotal: 10,
  };

  const proofOfLife = {
    daysLeft: 14,
    currentDay: 16,
    totalDays: 60,
    nextVerificationDays: 14,
    isVerified: true,
  };

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

  const memories: Memory[] = [
    {
      id: 1,
      type: "text",
      title: "Letter to My Children",
      preview: "My dearest Emma and James, if you're reading this...",
      recipients: ["Emma", "James"],
      recipientCount: 2,
      date: "Dec 15, 2025",
    },
    {
      id: 2,
      type: "photos",
      title: "Family Photos - Summer 2024",
      photoCount: 12,
      recipients: ["Emma", "James"],
      recipientCount: 3,
      date: "Nov 28, 2025",
    },
  ];

  const recipients = [
    {
      id: 1,
      name: "Emma Johnson",
      email: "emma.j@email.com",
      initials: "EJ",
      verified: true,
      memoryCount: 4,
    },
    {
      id: 2,
      name: "James Johnson",
      email: "james.j@email.com",
      initials: "JJ",
      verified: true,
      memoryCount: 5,
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "m.chen@email.com",
      initials: "MC",
      verified: false,
      memoryCount: 2,
    },
  ];

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
              <Badge variant="success">
                <CheckCircle className="w-3 h-3" />
                Verified
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
              <span className="text-emerald-400 font-medium">
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
              <Button variant="primary" className="w-full">
                <CheckCircle className="w-4 h-4" />
                Verify Now
              </Button>
              <Button variant="secondary" className="w-full">
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

          <StatCard
            value={`${stats.storageUsed} GB`}
            label="Storage Used"
            sublabel={`of ${stats.storageTotal} GB`}
            icon={HardDrive}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Your Memories */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Your Memories</h3>
              <div className="flex items-center gap-2">
                <button className="text-sm text-emerald-400 hover:text-emerald-300">
                  View All
                </button>
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4" />
                  New Memory
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {memories.map((memory) => (
                <MemoryCard key={memory.id} memory={memory} />
              ))}
            </div>
          </Card>

          {/* Recipients */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Recipients</h3>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>

            <div className="space-y-2.5">
              {recipients.map((recipient) => (
                <RecipientCard key={recipient.id} recipient={recipient} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}