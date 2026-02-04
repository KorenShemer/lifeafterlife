"use client";

import { useState } from "react";
import {
  Shield,
  Smartphone,
  Fingerprint,
  Mail,
  Lock,
  Monitor,
  Eye,
  EyeOff,
  LogOut,

} from "lucide-react";
import { Card, Button, Badge } from "../../shared/components";
import { PageTransition } from "@/shared/components/PageTransition";

export default function SecurityPage() {
  // Two-Factor Authentication toggles
  const [authenticatorEnabled, setAuthenticatorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Security Notifications toggles
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [verificationReminders, setVerificationReminders] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  // Password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Password inputs
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Active sessions
  const sessions = [
    {
      device: "MacBook Pro",
      location: "San Francisco, CA",
      status: "Current",
      time: "Now",
      icon: Monitor,
    },
    {
      device: "iPhone 15 Pro",
      location: "San Francisco, CA",
      time: "2 hours ago",
      icon: Smartphone,
    },
    {
      device: "Windows Desktop",
      location: "New York, NY",
      time: "3 days ago",
      icon: Monitor,
    },
  ];

  return (
    <PageTransition>
      <div className="p-5 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">

            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-emerald-400" />
                <h1 className="text-2xl font-bold text-white">
                  Security Settings
                </h1>
              </div>
              <p className="text-sm text-gray-400">
                Protect your account and memories
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Two-Factor Authentication */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                Two-Factor Authentication
              </h3>
            </div>

            <div className="space-y-4">
              {/* Authenticator App */}
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      Authenticator App
                    </p>
                    <p className="text-xs text-gray-400">
                      Use an app like Google Authenticator
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAuthenticatorEnabled(!authenticatorEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    authenticatorEnabled ? "bg-emerald-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      authenticatorEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Biometric Login */}
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      Biometric Login
                    </p>
                    <p className="text-xs text-gray-400">
                      Use Face ID or fingerprint
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setBiometricEnabled(!biometricEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    biometricEnabled ? "bg-emerald-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      biometricEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Status Badge */}
              {authenticatorEnabled && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">
                    2FA Enabled - Your account is protected
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Security Notifications */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Mail className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                Security Notifications
              </h3>
            </div>

            <div className="space-y-4">
              {/* Login Alerts */}
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div>
                  <p className="text-white font-medium text-sm">Login Alerts</p>
                  <p className="text-xs text-gray-400">
                    Get notified of new sign-ins
                  </p>
                </div>
                <button
                  onClick={() => setLoginAlerts(!loginAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    loginAlerts ? "bg-emerald-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      loginAlerts ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Verification Reminders */}
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div>
                  <p className="text-white font-medium text-sm">
                    Verification Reminders
                  </p>
                  <p className="text-xs text-gray-400">
                    Email before proof of life check
                  </p>
                </div>
                <button
                  onClick={() =>
                    setVerificationReminders(!verificationReminders)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    verificationReminders ? "bg-emerald-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      verificationReminders ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Security Alerts */}
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div>
                  <p className="text-white font-medium text-sm">
                    Security Alerts
                  </p>
                  <p className="text-xs text-gray-400">
                    Unusual activity notifications
                  </p>
                </div>
                <button
                  onClick={() => setSecurityAlerts(!securityAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    securityAlerts ? "bg-emerald-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securityAlerts ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Change Password */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Change Password</h3>
            </div>

            <div className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="text-sm text-white font-medium">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 pr-10"
                  />
                  <button
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-sm text-white font-medium">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 pr-10"
                  />
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Update Button */}
              <Button variant="primary" className="w-full">
                Update Password
              </Button>
            </div>
          </Card>

          {/* Active Sessions */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">
                  Active Sessions
                </h3>
              </div>
              <button className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1 transition-colors">
                <LogOut className="w-4 h-4" />
                Sign out all
              </button>
            </div>

            <div className="space-y-3">
              {sessions.map((session, index) => {
                const Icon = session.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium text-sm">
                            {session.device}
                          </p>
                          {session.status && (
                            <Badge
                              variant="success"
                              className="text-[10px] px-2 py-0.5"
                            >
                              {session.status}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">
                          {session.location} · {session.time}
                        </p>
                      </div>
                    </div>
                    {!session.status && (
                      <button className="text-red-400 hover:text-red-300 transition-colors">
                        <LogOut className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* End-to-End Encryption */}
        <Card className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  End-to-End Encryption Active
                </h3>
                <p className="text-sm text-gray-400">
                  All your memories are encrypted with AES-256. Only you and
                  your designated recipients can access them.
                </p>
              </div>
            </div>
            <Badge
              variant="default"
              className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1.5"
            >
              <Lock className="w-3 h-3 mr-1" />
              AES-256
            </Badge>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
