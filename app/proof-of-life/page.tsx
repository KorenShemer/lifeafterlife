"use client";

import { useState } from "react";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Heart,
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
      <div className="p-5 space-y-5">
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
                  Check-in Now
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  This resets the timer to Day 0
                </p>
              </div>
            </div>
          </Card>

          {/* Right Card - Custom Timeline */}
          <Card className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                Custom Verification Timeline
              </h3>
            </div>

            <div className="space-y-5">
              {/* 1. Routine Check-in */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                      1
                    </div>
                    <span className="text-white font-medium text-sm">
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
                      className="w-16 px-2 py-1.5 bg-gray-900 border border-gray-700 rounded text-white text-sm text-center focus:outline-none focus:border-emerald-500"
                      min="1"
                      max="90"
                    />
                    <span className="text-gray-400 text-sm">days</span>
                  </div>
                </div>

                {/* Range slider with fill */}
                <div className="relative">
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${(routineCheckIn / 90) * 100}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    value={routineCheckIn}
                    onChange={(e) => setRoutineCheckIn(Number(e.target.value))}
                    min="1"
                    max="90"
                    className="absolute top-0 w-full h-1.5 appearance-none bg-transparent cursor-pointer slider-emerald"
                  />
                </div>

                <p className="text-xs text-gray-500">
                  First verification on{" "}
                  <span className="text-emerald-400 font-medium">
                    Day {routineCheckIn}
                  </span>
                </p>
              </div>

              {/* 2. First Warning */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold">
                      2
                    </div>
                    <span className="text-white font-medium text-sm">
                      First Warning
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">+</span>
                    <input
                      type="number"
                      value={firstWarningOffset}
                      onChange={(e) =>
                        setFirstWarningOffset(Number(e.target.value))
                      }
                      className="w-16 px-2 py-1.5 bg-gray-900 border border-gray-700 rounded text-white text-sm text-center focus:outline-none focus:border-yellow-500"
                      min="1"
                      max="30"
                    />
                    <span className="text-gray-400 text-sm">days after</span>
                  </div>
                </div>

                {/* Range slider with fill */}
                <div className="relative">
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{
                        width: `${((firstWarningOffset - 1) / 29) * 100}%`,
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    value={firstWarningOffset}
                    onChange={(e) =>
                      setFirstWarningOffset(Number(e.target.value))
                    }
                    min="1"
                    max="30"
                    className="absolute top-0 w-full h-1.5 appearance-none bg-transparent cursor-pointer slider-yellow"
                  />
                </div>

                <p className="text-xs text-gray-500">
                  Warning on{" "}
                  <span className="text-yellow-400 font-medium">
                    Day {firstWarningDay}
                  </span>
                </p>
              </div>

              {/* 3. Final Warning */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                      3
                    </div>
                    <span className="text-white font-medium text-sm">
                      Final Warning
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">+</span>
                    <input
                      type="number"
                      value={finalWarningOffset}
                      onChange={(e) =>
                        setFinalWarningOffset(Number(e.target.value))
                      }
                      className="w-16 px-2 py-1.5 bg-gray-900 border border-gray-700 rounded text-white text-sm text-center focus:outline-none focus:border-red-500"
                      min="1"
                      max="30"
                    />
                    <span className="text-gray-400 text-sm">days after</span>
                  </div>
                </div>

                {/* Range slider with fill */}
                <div className="relative">
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{
                        width: `${((finalWarningOffset - 1) / 29) * 100}%`,
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    value={finalWarningOffset}
                    onChange={(e) =>
                      setFinalWarningOffset(Number(e.target.value))
                    }
                    min="1"
                    max="30"
                    className="absolute top-0 w-full h-1.5 appearance-none bg-transparent cursor-pointer slider-red"
                  />
                </div>

                <p className="text-xs text-gray-500">
                  Critical alert on{" "}
                  <span className="text-red-400 font-medium">
                    Day {finalWarningDay}
                  </span>
                </p>
              </div>

              {/* 4. Legacy Release & Total Grace Period Combined */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    4
                  </div>
                  <span className="text-white font-medium text-sm">
                    Legacy Release
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total Grace Period</p>
                    <p className="text-xl font-bold text-emerald-400">
                      {totalGracePeriod} days
                    </p>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-pink-500/20 text-pink-400 border-pink-500/30 text-xs px-2.5 py-1"
                  >
                    Day {legacyReleaseDay}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Verification Cycle Timeline */}
        <Card>
          <h3 className="text-lg font-bold text-white mb-5">
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
                <h3 className="text-sm font-semibold text-white my-2">
                  Routine Check-in
                </h3>
                <p className="text-sm text-gray-400">
                  Initial verification to start your cycle.
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
                <h3 className="text-sm font-semibold text-white my-2">
                  First Warning
                </h3>
                <p className="text-sm text-gray-400">
                  Warning notification sent.
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
                <h3 className="text-sm font-semibold text-white my-2">
                  Final Warning
                </h3>
                <p className="text-sm text-gray-400">
                  Critical alert - action required.
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
                <h3 className="text-sm font-semibold text-white my-2">
                  Legacy Release
                </h3>
                <p className="text-sm text-gray-400">
                  Memories released to contacts.
                </p>
              </div>
            </li>
          </ol>
        </Card>

        {/* Save Buttons */}
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
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          position: relative;
        }

        .slider-emerald::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }

        .slider-yellow::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }

        .slider-yellow::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }

        .slider-red::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }

        .slider-red::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </PageTransition>
  );
}