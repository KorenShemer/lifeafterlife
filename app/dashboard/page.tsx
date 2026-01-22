import {
  Bell,
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
  Avatar,
  ProgressBar,
  SearchInput,
  StatCard,
  CircularProgress,
  Sidebar,
  MemoryCard,
  RecipientCard,
} from "../../shared/components";

export default function DashboardPage() {
  const user = {
    name: "Alexander",
    email: "alexander@email.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander",
  };

  const stats = {
    totalMemories: 6,
    scheduledRecipients: 5,
    storageUsed: 2.4,
    storageTotal: 10,
    lastVerified: "3 days ago",
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
  type: 'text' | 'photos';
  title: string;
  preview?: string;
  photoCount?: number;
  recipients: string[];
  recipientCount: number;
  date: string;
};

  const memories:Memory[] = [
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
    <div className="flex min-h-screen bg-[#0a0e1a]">
      <Sidebar user={user} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-[#0f1419] border-b border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Welcome back, {user.name}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Your legacy is{" "}
                <span className="text-emerald-400 font-medium">secure</span>.
                Last verified {stats.lastVerified}.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <SearchInput placeholder="Search memories..." className="w-64" />

              <button className="relative p-2 text-gray-400 hover:text-white transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full"></span>
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                <div>
                  <div className="text-sm font-medium text-white text-right">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-400 text-right">
                    Premium
                  </div>
                </div>
                <Avatar src={user.avatar} alt={user.name} />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Proof of Life Card */}
            <Card variant="gradient" className="md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-white font-semibold">Proof of Life</h3>
                </div>
                <Badge variant="success">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </Badge>
              </div>

              <div className="flex items-center justify-center py-6">
                <CircularProgress
                  value={proofOfLife.currentDay}
                  max={proofOfLife.totalDays}
                />
              </div>

              <div className="text-center text-sm text-gray-400 mb-4">
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

              <div className="space-y-2 mt-4">
                <Button variant="primary" className="w-full">
                  <CheckCircle className="w-4 h-4" />
                  Verify Now
                </Button>
                <Button variant="secondary" className="w-full">
                  <Settings className="w-4 h-4" />
                  View Timeline Settings
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Your memories will be delivered to recipients if verification is
                missed.
              </p>
            </Card>

            {/* Stats Cards */}
            <StatCard
              value={stats.totalMemories}
              label="Total Memories Saved"
              sublabel="Across all media types"
              icon={FileText}
            />

            <StatCard
              value={stats.scheduledRecipients}
              label="Scheduled Recipients"
              sublabel="Active recipients"
              icon={Users}
            />

            <StatCard
              value={`${stats.storageUsed} GB`}
              label="Storage Used"
              sublabel={`of ${stats.storageTotal} GB available`}
              icon={HardDrive}
            />
          </div>

          <Button variant="primary">
            <Plus className="w-5 h-5" />
            New Memory
          </Button>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Your Memories */}
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Your Memories</h3>
                <button className="text-sm text-emerald-400 hover:text-emerald-300">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {memories.map((memory) => (
                  <MemoryCard key={memory.id} memory={memory} />
                ))}
              </div>
            </Card>

            {/* Recipients */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Recipients</h3>
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>

              <div className="space-y-3">
                {recipients.map((recipient) => (
                  <RecipientCard key={recipient.id} recipient={recipient} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
