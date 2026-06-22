import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type ToastType = "success" | "info" | "warning";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: Array<(toasts: ToastItem[]) => void> = [];
let activeToasts: ToastItem[] = [];

export function showToast(message: string, type: ToastType = "success") {
  const id = Date.now().toString() + Math.random().toString();
  const newToast: ToastItem = { id, message, type };
  activeToasts = [...activeToasts, newToast];
  toastListeners.forEach((listener) => listener(activeToasts));

  // Auto remove after 4s
  setTimeout(() => {
    activeToasts = activeToasts.filter((t) => t.id !== id);
    toastListeners.forEach((listener) => listener(activeToasts));
  }, 4000);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleUpdate = (updatedToasts: ToastItem[]) => {
      setToasts(updatedToasts);
    };
    toastListeners.push(handleUpdate);
    setToasts(activeToasts);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== handleUpdate);
    };
  }, []);

  const removeToast = (id: string) => {
    activeToasts = activeToasts.filter((t) => t.id !== id);
    setToasts(activeToasts);
    toastListeners.forEach((listener) => listener(activeToasts));
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let bgColor = "bg-white text-stone-900 border-stone-200";
          let Icon = Info;
          let iconColor = "text-amber-500";

          if (toast.type === "success") {
            bgColor = "bg-[#ECFCCB] text-[#365314] border-[#D9F99D] shadow-sm";
            Icon = CheckCircle2;
            iconColor = "text-[#65A30D]";
          } else if (toast.type === "warning") {
            bgColor = "bg-red-50 text-red-900 border-red-200 shadow-sm";
            Icon = AlertTriangle;
            iconColor = "text-red-550";
          }

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`p-4 rounded-xl border shadow-lg flex items-start gap-3 pointer-events-auto ${bgColor}`}
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 text-xs font-semibold leading-relaxed">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-0.5 rounded-lg hover:bg-black/5 opacity-60 hover:opacity-100 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
