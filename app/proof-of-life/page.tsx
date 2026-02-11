"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Heart,
  Loader2,
} from "lucide-react";
import { Card, Button, Badge } from "../../shared/components";
import { PageTransition } from "@/shared/components/PageTransition";
import { differenceInDays } from "date-fns";
import Toast from "@/shared/components/Toast";

export default function ProofOfLifePage() {
  const [routineCheckIn, setRoutineCheckIn] = useState(30);
  const [firstWarningOffset, setFirstWarningOffset] = useState(15);
  const [finalWarningOffset, setFinalWarningOffset] = useState(7);
  const [nextVerificationIn, setNextVerificationIn] = useState(0);
  const [hasVerified, setHasVerified] = useState(false);
  const [lastVerifiedDate, setLastVerifiedDate] = useState<Date | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Store initial values for cancel
  const [initialValues, setInitialValues] = useState({
    routineCheckIn: 30,
    firstWarningOffset: 15,
    finalWarningOffset: 7,
  });

  const firstWarningDay = routineCheckIn + firstWarningOffset;
  const finalWarningDay = firstWarningDay + finalWarningOffset;
  const legacyReleaseDay = finalWarningDay + 8;
  const totalGracePeriod = legacyReleaseDay;

  // Animate number changes
  const animateNumberChange = (targetValue: number) => {
    setIsAnimating(true);
    const startValue = nextVerificationIn;
    const difference = targetValue - startValue;
    const duration = 800; // ms
    const steps = 20;
    const stepValue = difference / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setNextVerificationIn(targetValue);
        clearInterval(interval);
        setTimeout(() => setIsAnimating(false), 100);
      } else {
        setNextVerificationIn(Math.round(startValue + stepValue * currentStep));
      }
    }, stepDuration);
  };

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("Failed to load settings");

        const { settings } = await res.json();

        const rc = settings.routine_checkin_days ?? 30;
        const fw = settings.first_warning_offset_days ?? 15;
        const fv = settings.final_warning_offset_days ?? 7;

        setRoutineCheckIn(rc);
        setFirstWarningOffset(fw);
        setFinalWarningOffset(fv);
        setInitialValues({
          routineCheckIn: rc,
          firstWarningOffset: fw,
          finalWarningOffset: fv,
        });

        // Check if user has ever verified
        if (settings.last_verified) {
          setHasVerified(true);
          setLastVerifiedDate(new Date(settings.last_verified));
          const nextIn = Math.max(
            0,
            rc - differenceInDays(new Date(), new Date(settings.last_verified))
          );
          setNextVerificationIn(nextIn);
        } else {
          setHasVerified(false);
          setLastVerifiedDate(null);
          setNextVerificationIn(rc);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          routine_checkin_days: routineCheckIn,
          first_warning_offset_days: firstWarningOffset,
          final_warning_offset_days: finalWarningOffset,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Failed to save settings");
      }

      setInitialValues({
        routineCheckIn,
        firstWarningOffset,
        finalWarningOffset,
      });

      // Recalculate countdown based on new routine_checkin_days
      if (hasVerified && lastVerifiedDate) {
        const newNextIn = Math.max(
          0,
          routineCheckIn - differenceInDays(new Date(), lastVerifiedDate)
        );
        animateNumberChange(newNextIn);
      } else {
        animateNumberChange(routineCheckIn);
      }

      setSaveSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    setError(null);

    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "manual" }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Check-in failed");
      }

      // Reset the countdown locally and mark as verified
      const now = new Date();
      setHasVerified(true);
      setLastVerifiedDate(now);
      animateNumberChange(routineCheckIn);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCancel = () => {
    setRoutineCheckIn(initialValues.routineCheckIn);
    setFirstWarningOffset(initialValues.firstWarningOffset);
    setFinalWarningOffset(initialValues.finalWarningOffset);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

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

        {/* First Check-in Notice */}
        {!hasVerified && (
          <div className="px-4 py-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm">
            <strong>Welcome!</strong> Please complete your first check-in to start your verification cycle.
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left Card - Countdown Timer */}
          <Card className="lg:col-span-2">
            <div className="flex flex-col items-center justify-between py-6 h-full">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                  <Clock className="w-10 h-10 text-emerald-400" />
                </div>

                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  {hasVerified ? "Next Verification In" : "First Check-in Required"}
                </p>
                <div className={`text-5xl font-bold text-emerald-400 mb-1 transition-all duration-200 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
                  {nextVerificationIn}
                </div>
                <p className="text-base text-gray-300 mb-4">Days</p>

                <Badge 
                  variant={hasVerified ? "success" : "default"} 
                  className={`text-xs px-3 py-1 ${!hasVerified ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : ""}`}
                >
                  {hasVerified ? "All Clear" : "Action Required"}
                </Badge>
              </div>

              <div className="w-full mt-6">
                <Button
                  variant="primary"
                  className="w-full mb-2 flex items-center justify-center gap-2"
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                >
                  {isCheckingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {isCheckingIn ? "Checking in..." : hasVerified ? "Check-in Now" : "Complete First Check-in"}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  {hasVerified ? "This resets the timer to Day 0" : "Start your verification cycle"}
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

              {/* 4. Legacy Release */}
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
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {/* Toast Notifications */}
      {error && (
        <Toast
          message={error}
          type="error"
          duration={4000}
          onClose={() => setError(null)}
        />
      )}

      {saveSuccess && (
        <Toast
          message="Settings saved successfully."
          type="success"
          duration={3000}
          onClose={() => setSaveSuccess(false)}
        />
      )}

      <style jsx>{`
        .slider-emerald::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
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