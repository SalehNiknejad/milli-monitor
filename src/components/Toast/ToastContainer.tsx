import {
  X,
  CheckCircle,
  AlertCircle,
  InfoIcon,
  AlertTriangle,
} from "lucide-react";
import { Toast } from "../../hooks/useToast";

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto animate-slide-in"
          role="alert"
        >
          <div
            className={`rounded-lg shadow-lg border p-4 flex items-start gap-3 max-w-sm ${getToastStyles(
              toast.type,
            )}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === "success" && (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              )}
              {toast.type === "error" && (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
              {toast.type === "warning" && (
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              )}
              {toast.type === "info" && (
                <InfoIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {toast.emoji && `${toast.emoji} `}
                {toast.title}
              </h3>
              {toast.body && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {toast.body}
                </p>
              )}
            </div>

            <button
              onClick={() => onRemove(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function getToastStyles(type: Toast["type"]): string {
  const baseStyles =
    "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700";

  switch (type) {
    case "success":
      return `${baseStyles} bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800`;
    case "error":
      return `${baseStyles} bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800`;
    case "warning":
      return `${baseStyles} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800`;
    case "info":
      return `${baseStyles} bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800`;
    default:
      return baseStyles;
  }
}
