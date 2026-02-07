"use client";

import { useToastUI } from "@/hooks/useToast";
import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToastUI();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      case "info":
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-900 border-green-200";
      case "error":
        return "bg-red-50 text-red-900 border-red-200";
      case "warning":
        return "bg-yellow-50 text-yellow-900 border-yellow-200";
      case "info":
      default:
        return "bg-blue-50 text-blue-900 border-blue-200";
    }
  };

  const getIconStyles = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      case "info":
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            border rounded-lg p-4 flex items-start gap-3 shadow-lg
            animate-in fade-in slide-in-from-right-4 duration-300
            pointer-events-auto
            ${getStyles(toast.type)}
          `}
        >
          <div className={`flex-shrink-0 mt-0.5 ${getIconStyles(toast.type)}`}>
            {getIcon(toast.type)}
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}

      <style>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-in {
          animation: slideInFromRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
