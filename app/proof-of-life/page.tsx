"use client";

import { useState } from "react";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Heart,
  ArrowLeft,
  Send,
} from "lucide-react";
import { Card, Button, Badge } from "../../shared/components";
import { PageTransition } from "@/shared/components/PageTransition";

export default function ProofOfLifePage() {
  // Verification timeline state
  const [routineCheckIn, setRoutineCheckIn] = useState(30);
  const [firstWarningOffset, setFirstWarningOffset] = useState(15);
  const [finalWarningOffset, setFinalWarningOffset] = useState(7);

  // Calculated values
  const firstWarningDay = routineCheckIn + firstWarningOffset;
  const finalWarningDay = firstWarningDay + finalWarningOffset;
  const totalGracePeriod = finalWarningDay + 8; // Legacy release is +8 days after final warning
  const legacyReleaseDay = totalGracePeriod;

  // Current status
  const nextVerificationIn = 14;

  return (
    <PageTransition>
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-emerald-400" />
              Verification Settings
            </h1>
            <p className="text-sm text-gray-400">
              Configure your Proof of Life verification timeline
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left Card - Countdown Timer */}
          <Card className="lg:col-span-2">
            <div className="flex flex-col items-center justify-between py-6 h-full">
              {/* Top content */}
              <div className="flex flex-col items-center">
                {/* Clock Icon */}
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                  <Clock className="w-10 h-10 text-emerald-400" />
                </div>

                {/* Countdown */}
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Next Verification In
                </p>
                <div className="text-5xl font-bold text-emerald-400 mb-1">
                  {nextVerificationIn}
                </div>
                <p className="text-base text-gray-300 mb-4">Days</p>

                {/* All Clear Badge */}
                <Badge variant="success" className="text-xs px-3 py-1">
                  All Clear
                </Badge>
              </div>

              {/* Bottom button */}
              <div className="w-full mt-6">
                <Button
                  variant="primary"
                  className="w-full mb-2 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Simulate Check-in
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  This resets the 30-day timer to Day 0
                </p>
              </div>
            </div>
          </Card>

          {/* Right Card - Custom Timeline */}
          <Card className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                Custom Verification Timeline
              </h3>
            </div>

            <div className="space-y-6">
              {/* 1. Routine Check-in */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                      1
                    </div>
                    <span className="text-white font-medium">
                      Routine Check-in
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={routineCheckIn}
                      onChange={(e) =>
                        setRoutineCheckIn(Number(e.target.value))
                      }
                      className="w-14 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white text-sm text-center focus:outline-none focus:border-emerald-500"
                      min="1"
                      max="90"
                    />
                    <span className="text-gray-400 text-xs">days</span>
                  </div>
                </div>
                <input
                  type="range"
                  value={routineCheckIn}
                  onChange={(e) => setRoutineCheckIn(Number(e.target.value))}
                  min="1"
                  max="90"
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-emerald"
                />
                <p className="text-xs text-gray-500">
                  First WhatsApp verification on{" "}
                  <span className="text-emerald-400 font-medium">
                    Day {routineCheckIn}
                  </span>
                </p>
              </div>

              {/* 2. First Warning */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold">
                      2
                    </div>
                    <span className="text-white font-medium">
                      First Warning
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={firstWarningOffset}
                      onChange={(e) =>
                        setFirstWarningOffset(Number(e.target.value))
                      }
                      className="w-14 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white text-sm text-center focus:outline-none focus:border-yellow-500"
                      min="1"
                      max="30"
                    />
                    <span className="text-gray-400 text-xs">days</span>
                  </div>
                </div>
                <input
                  type="range"
                  value={firstWarningOffset}
                  onChange={(e) =>
                    setFirstWarningOffset(Number(e.target.value))
                  }
                  min="1"
                  max="30"
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-yellow"
                />
                <p className="text-xs text-gray-500">
                  Warning on{" "}
                  <span className="text-yellow-400 font-medium">
                    Day {firstWarningDay}
                  </span>
                </p>
              </div>

              {/* 3. Final Warning */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                      3
                    </div>
                    <span className="text-white font-medium">
                      Final Warning
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={finalWarningOffset}
                      onChange={(e) =>
                        setFinalWarningOffset(Number(e.target.value))
                      }
                      className="w-14 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white text-sm text-center focus:outline-none focus:border-red-500"
                      min="1"
                      max="30"
                    />
                    <span className="text-gray-400 text-xs">days</span>
                  </div>
                </div>
                <input
                  type="range"
                  value={finalWarningOffset}
                  onChange={(e) =>
                    setFinalWarningOffset(Number(e.target.value))
                  }
                  min="1"
                  max="30"
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-red"
                />
                <p className="text-xs text-gray-500">
                  Critical alert on{" "}
                  <span className="text-red-400 font-medium">
                    Day {finalWarningDay}
                  </span>
                </p>
              </div>

              {/* 4. Legacy Release */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold">
                      4
                    </div>
                    <span className="text-white font-medium">
                      Legacy Release
                    </span>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-pink-500/20 text-pink-400 border-pink-500/30"
                  >
                    Day {legacyReleaseDay}
                  </Badge>
                </div>
              </div>

              {/* Total Grace Period */}
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 font-medium">
                      Total Grace Period
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-400">
                    {totalGracePeriod} days
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Verification Cycle Timeline */}
        <Card>
          <h3 className="text-lg font-bold text-white mb-6">
            Your Verification Cycle
          </h3>

          <ol className="items-start sm:flex sm:justify-between">
            <li className="relative mb-6 sm:mb-0 sm:flex-1">
              <div className="flex items-center">
                <div className="z-10 flex items-center justify-center w-6 h-6 bg-emerald-500/20 rounded-full ring-0 ring-gray-900 sm:ring-8 shrink-0">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="hidden sm:flex w-full bg-gray-700 h-0.5"></div>
              </div>
              <div className="mt-3 sm:pe-8">
                <time className="bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium px-1.5 py-0.5 rounded">
                  Day 0
                </time>
                <h3 className="text-base font-semibold text-white my-2">
                  Routine Check-in
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Initial verification to start your 30-day cycle.
                </p>
              </div>
            </li>

            <li className="relative mb-6 sm:mb-0 sm:flex-1">
              <div className="flex items-center">
                <div className="z-10 flex items-center justify-center w-6 h-6 bg-yellow-500/20 rounded-full ring-0 ring-gray-900 sm:ring-8 shrink-0">
                  <AlertTriangle className="w-3 h-3 text-yellow-400" />
                </div>
                <div className="hidden sm:flex w-full bg-gray-700 h-0.5"></div>
              </div>
              <div className="mt-3 sm:pe-8">
                <time className="bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium px-1.5 py-0.5 rounded">
                  Day {firstWarningDay}
                </time>
                <h3 className="text-base font-semibold text-white my-2">
                  First Warning
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  You&apos;ll receive a warning notification via WhatsApp.
                </p>
              </div>
            </li>

            <li className="relative mb-6 sm:mb-0 sm:flex-1">
              <div className="flex items-center">
                <div className="z-10 flex items-center justify-center w-6 h-6 bg-red-500/20 rounded-full ring-0 ring-gray-900 sm:ring-8 shrink-0">
                  <AlertCircle className="w-3 h-3 text-red-400" />
                </div>
                <div className="hidden sm:flex w-full bg-gray-700 h-0.5"></div>
              </div>
              <div className="mt-3 sm:pe-8">
                <time className="bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium px-1.5 py-0.5 rounded">
                  Day {finalWarningDay}
                </time>
                <h3 className="text-base font-semibold text-white my-2">
                  Final Warning
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Critical alert - immediate action required.
                </p>
              </div>
            </li>

            <li className="relative mb-6 sm:mb-0 sm:flex-1">
              <div className="flex items-center">
                <div className="z-10 flex items-center justify-center w-6 h-6 bg-pink-500/20 rounded-full ring-0 ring-gray-900 sm:ring-8 shrink-0">
                  <Heart className="w-3 h-3 text-pink-400" />
                </div>
              </div>
              <div className="mt-3">
                <time className="bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium px-1.5 py-0.5 rounded">
                  Day {legacyReleaseDay}
                </time>
                <h3 className="text-base font-semibold text-white my-2">
                  Legacy Release
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  Your digital legacy will be released to designated contacts.
                </p>
              </div>
            </li>
          </ol>
        </Card>

        {/* Verification Method */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Send className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">
              Verification Method
            </h3>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">WhatsApp</p>
                <p className="text-xs text-gray-500">
                  Primary verification channel
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              <Send className="w-4 h-4" />
              Test Connection
            </Button>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">
            <CheckCircle className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>

      <style jsx>{`
        .slider-emerald::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #065f46;
        }

        .slider-emerald::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #065f46;
        }

        .slider-yellow::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #eab308;
          cursor: pointer;
          border: 2px solid #854d0e;
        }

        .slider-yellow::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #eab308;
          cursor: pointer;
          border: 2px solid #854d0e;
        }

        .slider-red::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 2px solid #991b1b;
        }

        .slider-red::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 2px solid #991b1b;
        }
      `}</style>
    </PageTransition>
  );
}
