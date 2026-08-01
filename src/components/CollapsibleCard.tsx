import { ChevronDown } from "lucide-react";
import { ReactNode, useEffect, useId, useRef } from "react";

interface CollapsibleCardProps {
  title: string;
  icon: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  badge?: ReactNode;
  preview?: ReactNode;
  assetKey?: "gold" | "usdt";
}

export default function CollapsibleCard({
  title,
  icon,
  isOpen,
  onToggle,
  children,
  badge,
  preview,
  assetKey = "gold",
}: CollapsibleCardProps) {
  const contentId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isUsdt = assetKey === "usdt";
  const accentClass = isUsdt ? "text-emerald-500" : "text-amber-500";

  useEffect(() => {
    if (contentRef.current) contentRef.current.inert = !isOpen;
    if (previewRef.current) previewRef.current.inert = isOpen;
  }, [isOpen]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shine-effect overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full px-6 py-4 flex flex-row-reverse items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex shrink-0 items-center gap-2">
          <ChevronDown
            size={24}
            className={`text-gray-600 dark:text-gray-400 transition-transform duration-300 motion-reduce:transition-none ${
              isOpen ? "rotate-180" : ""
            }`}
          />
          {badge && (
            <div className="flex items-center gap-1 animate-pulse">
              {badge}
            </div>
          )}
        </div>
        <div className="flex-1 text-right">
          <h3 className="text-lg font-bold dark:text-white">{title}</h3>
        </div>
        <div className={`${accentClass} shrink-0 transition-colors duration-300`}>
          {icon}
        </div>
      </button>

      {/* Preview (when closed) */}
      {preview && (
        <div
          ref={previewRef}
          aria-hidden={isOpen}
          className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
            isOpen ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="px-6 pb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {preview}
            </div>
          </div>
        </div>
      )}

      {/* Content (when open) */}
      <div
        ref={contentRef}
        id={contentId}
        aria-hidden={!isOpen}
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 space-y-4 text-right">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
