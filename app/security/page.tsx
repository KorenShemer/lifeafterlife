"use client";

import { useState, useEffect } from "react";
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

interface SecuritySettings {
  two_factor_enabled: boolean;
  biometric_enabled: boolean;
  login_alerts: boolean;
  verification_reminders: boolean;
  security_alerts: boolean;
}

interface Session {
  id: string;
  device_name: string;
  device_type: string;
  location: string;
  last_active: string;
  is_current: boolean;
}

export default function SecurityPage() {
  const [settings, setSettings] = useState<SecuritySettings>({
    two_factor_enabled: false,
    biometric_enabled: false,
    login_alerts: true,
    verification_reminders: true,
    security_alerts: true,
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      // Load settings
      const settingsRes = await fetch("/api/security/settings");
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
      }

      // Load sessions
      const sessionsRes = await fetch("/api/security/sessions");
      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData);
      }
    } catch (error) {
      console.error("Error loading security data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof SecuritySettings, value: boolean) => {
    try {
      const updatedSettings = { ...settings, [key]: value };
      
      const res = await fetch("/api/security/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings),
      });

      if (res.ok) {
        setSettings(updatedSettings);
      }
    } catch (error) {
      console.error("Error updating setting:", error);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (!newPassword) {
      setPasswordError("New password is required");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    try {
      const res = await fetch("/api/security/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || "Failed to update password");
        return;
      }

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      setPasswordError("Failed to update password");
    }
  };

  const signOutSession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/security/sessions?sessionId=${sessionId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
      }
    } catch (error) {
      console.error("Error signing out session:", error);
    }
  };

  const signOutAllSessions = async () => {
    try {
      const res = await fetch("/api/security/sessions?all=true", {
        method: "DELETE",
      });

      if (res.ok) {
        await loadSecurityData();
      }
    } catch (error) {
      console.error("Error signing out all sessions:", error);
    }
  };

  const getSessionIcon = (deviceType: string) => {
    return deviceType === "mobile" ? Smartphone : Monitor;
  };

  const formatLastActive = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="p-5 flex items-center justify-center">
          <div className="text-gray-400">Loading security settings...</div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="p-5 space-y-6">
        <div className="space-y-2">
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
                  onClick={() => updateSetting("two_factor_enabled", !settings.two_factor_enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.two_factor_enabled ? "bg-emerald-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.two_factor_enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

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
                  onClick={() => updateSetting("biometric_enabled", !settings.biometric_enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.biometric_enabled ? "bg-emerald-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.biometric_enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {settings.two_factor_enabled && (
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
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div>
                  <p className="text-white font-medium text-sm">Login Alerts</p>
                  <p className="text-xs text-gray-400">
                    Get notified of new sign-ins
                  </p>
                </div>
                <button
                  onClick={() => updateSetting("login_alerts", !settings.login_alerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.login_alerts ? "bg-emerald-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.login_alerts ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

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
                  onClick={() => updateSetting("verification_reminders", !settings.verification_reminders)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.verification_reminders ? "bg-emerald-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.verification_reminders ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

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
                  onClick={() => updateSetting("security_alerts", !settings.security_alerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.security_alerts ? "bg-emerald-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.security_alerts ? "translate-x-6" : "translate-x-1"
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

              {passwordError && (
                <p className="text-xs text-red-400">{passwordError}</p>
              )}

              {passwordSuccess && (
                <p className="text-xs text-emerald-400">Password updated successfully!</p>
              )}

              <Button 
                variant="primary" 
                className="w-full"
                onClick={handlePasswordChange}
              >
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
              <button 
                onClick={signOutAllSessions}
                className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out all
              </button>
            </div>

            <div className="space-y-3">
              {sessions.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No active sessions</p>
              ) : (
                sessions.map((session) => {
                  const Icon = getSessionIcon(session.device_type);
                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium text-sm">
                              {session.device_name}
                            </p>
                            {session.is_current && (
                              <Badge
                                variant="success"
                                className="text-[10px] px-2 py-0.5"
                              >
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">
                            {session.location} · {formatLastActive(session.last_active)}
                          </p>
                        </div>
                      </div>
                      {!session.is_current && (
                        <button 
                          onClick={() => signOutSession(session.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}