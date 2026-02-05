"use client";

import React, { useState } from 'react';
import { CheckCircle, ArrowRight, User, Calendar, Phone, FileText } from 'lucide-react';

export default function OnboardingFormSimple() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    phone: '',
    date_of_birth: '',
    bio: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Just validate on step 1
      if (step === 1) {
        // Basic client-side validation
        if (formData.username.length < 3) {
          setError('Username must be at least 3 characters');
          setLoading(false);
          return;
        }
        
        if (!/^[a-z0-9_-]+$/.test(formData.username)) {
          setError('Username can only contain lowercase letters, numbers, underscores, and dashes');
          setLoading(false);
          return;
        }

        // Move to step 2
        setStep(2);
        setLoading(false);
        return;
      }

      // Submit the complete profile - server will check if username is taken
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          profile_completed: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If username is taken, server will tell us here
        throw new Error(data.error || 'Failed to update profile');
      }

      // Success! Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
      // If username error, go back to step 1
      if (err.message.includes('username')) {
        setStep(1);
      }
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
              Step {step} of 2
            </span>
            <span className="text-sm font-medium text-emerald-400">
              {step === 1 ? 'Basic Info' : 'About You'}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 1 ? 'Welcome to Life After Life!' : 'Tell us about yourself'}
          </h1>
          <p className="text-gray-400">
            {step === 1
              ? "Let's set up your profile to get started"
              : 'Add some details to personalize your experience (optional)'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
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
                      setFormData({ ...formData, username: e.target.value.toLowerCase() })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="johndoe"
                    pattern="[a-z0-9_-]{3,30}"
                    minLength={3}
                    maxLength={30}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  3-30 characters, lowercase letters, numbers, underscores, and dashes only
                </p>
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

          {step === 2 && (
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
                      setFormData({ ...formData, date_of_birth: e.target.value })
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
              disabled={loading}
              className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                'Saving...'
              ) : step === 1 ? (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Complete Setup
                </>
              )}
            </button>
          </div>

          {step === 2 && (
            <button
              type="button"
              onClick={() => {
                window.location.href = '/dashboard';
              }}
              className="w-full text-sm text-gray-400 hover:text-gray-300 transition-colors pt-2"
            >
              Skip for now
            </button>
          )}
        </form>
      </div>
    </div>
  );
}