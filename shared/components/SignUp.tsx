"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  ArrowRight,
  User,
  Calendar,
  Phone,
  FileText,
  Mail,
  Lock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameChecking, setUsernameChecking] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    // Step 1: Account
    email: "",
    password: "",
    confirmPassword: "",

    // Step 2: Profile
    username: "",
    full_name: "",

    // Step 3: Optional
    phone: "",
    date_of_birth: "",
    bio: "",
  });

  const checkUsername = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return false;
    }

    if (!/^[a-z0-9_-]+$/.test(username)) {
      setUsernameError(
        "Username can only contain lowercase letters, numbers, underscores, and dashes",
      );
      return false;
    }

    setUsernameChecking(true);
    try {
      const response = await fetch("/api/profile/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) return true;

      const data = await response.json();

      if (!data.available) {
        setUsernameError(data.error || "Username already taken");
        return false;
      }

      setUsernameError("");
      return true;
    } catch (err) {
      return true;
    } finally {
      setUsernameChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Step 1: Create account
      if (step === 1) {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        setStep(2);
        setLoading(false);
        return;
      }

      // Step 2: Validate profile
      if (step === 2) {
        const isValid = await checkUsername(formData.username);
        if (!isValid) {
          setLoading(false);
          return;
        }
        setStep(3);
        setLoading(false);
        return;
      }

      // Step 3: Create account + complete profile
      console.log("🔵 Creating account...");

      const supabase = await createClient();

      // 1. Sign up
      const { data: signupData, error: signupError } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

      if (signupError) {
        throw new Error(signupError.message);
      }

      if (!signupData.user) {
        throw new Error("Signup failed - no user returned");
      }

      console.log("✅ Account created! User ID:", signupData.user.id);
      console.log("🔵 Updating profile...");

      // 2. Update profile directly with Supabase client
      const { error: profileError } = await supabase
        .from("users")
        .update({
          username: formData.username,
          full_name: formData.full_name,
          phone: formData.phone || null,
          date_of_birth: formData.date_of_birth || null,
          bio: formData.bio || null,
          profile_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", signupData.user.id);

      if (profileError) {
        console.error("❌ Profile update error:", profileError);
        throw new Error(profileError.message);
      }

      console.log("✅ Profile completed! Redirecting...");

      // Success! Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
      <div className="bg-[#111827] rounded-xl border border-gray-800 shadow-2xl max-w-2xl w-full p-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-400">
              Step {step} of 3
            </span>
            <span className="text-sm font-medium text-emerald-400">
              {step === 1
                ? "Create Account"
                : step === 2
                  ? "Profile Info"
                  : "About You"}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 1
              ? "Welcome to Life After Life!"
              : step === 2
                ? "Create Your Profile"
                : "Tell us about yourself"}
          </h1>
          <p className="text-gray-400">
            {step === 1
              ? "Let's create your account"
              : step === 2
                ? "Choose your username and name"
                : "Add some details (optional)"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... rest of your form JSX stays the same ... */}
          {step === 1 && (
            <>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        username: e.target.value.toLowerCase(),
                      })
                    }
                    onBlur={() =>
                      formData.username && checkUsername(formData.username)
                    }
                    className="w-full pl-11 pr-4 py-3 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="johndoe"
                    pattern="[a-z0-9_-]{3,30}"
                    minLength={3}
                    maxLength={30}
                  />
                </div>
                {usernameChecking && (
                  <p className="mt-2 text-sm text-gray-400">
                    Checking availability...
                  </p>
                )}
                {usernameError && (
                  <p className="mt-2 text-sm text-red-400">{usernameError}</p>
                )}
                {!usernameError &&
                  formData.username.length >= 3 &&
                  !usernameChecking && (
                    <p className="mt-2 text-sm text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Username available
                    </p>
                  )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_of_birth: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-4 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-500" />
                  </div>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={4}
                    className="w-full pl-11 pr-4 py-3 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us a bit about yourself..."
                    maxLength={500}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 text-right">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={
                loading || usernameChecking || (step === 2 && !!usernameError)
              }
              className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                "Processing..."
              ) : step < 3 ? (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="px-6 py-3 text-emerald-400 hover:text-white rounded-lg font-medium disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mx-auto"
            onClick={() => router.push("/login")}
          >
            already have an account?
          </button>

          {step === 3 && (
            <button
              type="submit"
              disabled={loading}
              className="w-full text-sm text-gray-400 hover:text-gray-300 transition-colors pt-2"
            >
              Skip optional fields and create account
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
