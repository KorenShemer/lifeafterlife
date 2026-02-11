"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type,
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fade-out before duration ends
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, duration - 300);

    // Remove toast after fade-out completes
    const removeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-500/80",
          border: "border-emerald-400/50",
          icon: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
        };
      case "error":
        return {
          bg: "bg-red-500/80",
          border: "border-red-400/50",
          icon: <XCircle className="w-5 h-5 flex-shrink-0" />,
        };
      case "info":
        return {
          bg: "bg-blue-500/80",
          border: "border-blue-400/50",
          icon: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
        };
    }
  };

  const styles = getToastStyles();

  return (
    <>
      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-out {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }

        .animate-fade-out {
          animation: fade-out 0.3s ease-out forwards;
        }
      `}</style>

      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div
          className={`px-6 py-4 rounded-lg ${styles.bg} backdrop-blur-md border ${styles.border} text-white text-sm shadow-2xl flex items-center gap-3 min-w-[300px] max-w-[500px] pointer-events-auto ${
            isFadingOut ? "animate-fade-out" : "animate-slide-up"
          }`}
        >
          {styles.icon}
          <span>{message}</span>
        </div>
      </div>
    </>
  );
}