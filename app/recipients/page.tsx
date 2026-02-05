"use client";

import {
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  MoreVertical,
} from "lucide-react";

import { Button, Card, Badge } from "@/shared/components";
import { PageTransition } from "@/shared/components/PageTransition";

export default function RecipientsPage() {
  const stats = {
    verified: 3,
    pending: 1,
  };

  type Recipient = {
    id: number;
    name: string;
    email: string;
    initials: string;
    status: "verified" | "pending";
    statusText: string;
    memoriesAssigned: number;
  };

  const recipients: Recipient[] = [
    {
      id: 1,
      name: "Emma Johnson",
      email: "emma.j@email.com",
      initials: "EJ",
      status: "verified",
      statusText: "This recipient is verified and will receive memories.",
      memoriesAssigned: 4,
    },
    {
      id: 2,
      name: "James Johnson",
      email: "james.j@email.com",
      initials: "JJ",
      status: "verified",
      statusText: "This recipient is verified and will receive memories.",
      memoriesAssigned: 5,
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "m.chen@email.com",
      initials: "MC",
      status: "pending",
      statusText: "Waiting for email verification.",
      memoriesAssigned: 1,
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah.w@email.com",
      initials: "SW",
      status: "verified",
      statusText: "This recipient is verified and will receive memories.",
      memoriesAssigned: 2,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <PageTransition>
      <div className="p-8 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-white">Recipients</h1>
            </div>
            <p className="text-gray-400">
              Manage who will receive your memories
            </p>
          </div>
          <Button variant="primary" size="lg">
            <Plus className="w-5 h-5" />
            Add Recipient
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-white mb-2">
                  {stats.verified}
                </div>
                <div className="text-sm text-gray-300 font-medium">
                  Verified
                </div>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-white mb-2">
                  {stats.pending}
                </div>
                <div className="text-sm text-gray-300 font-medium">
                  Pending
                </div>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recipients List */}
        <Card>
          <h3 className="text-xl font-bold text-white mb-6">
            All Recipients
          </h3>

          <div className="space-y-3">
            {recipients.map((recipient) => (
              <div
                key={recipient.id}
                className="flex items-center justify-between p-4 bg-[#0a0e1a] rounded-lg border border-gray-800 hover:border-gray-700 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-lg">
                    {recipient.initials}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-white font-semibold">
                        {recipient.name}
                      </h4>
                      {getStatusBadge(recipient.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>{recipient.email}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {recipient.statusText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-400">
                      {recipient.memoriesAssigned} memories assigned
                    </div>
                  </div>

                  <button className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}