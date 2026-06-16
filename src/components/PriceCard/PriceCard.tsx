import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceCardProps {
  price: number;
  date: string;
  change: number;
  changePercent: number;
  isIncreasing: boolean;
  isDecreasing: boolean;
  assetLabel?: string;
  assetUnit?: string;
  assetAccent?: string;
  assetIcon?: any;
  assetKey?: string;
}

export default function PriceCard({
  price,
  date,
  change,
  changePercent,
  isIncreasing,
  isDecreasing,
  assetLabel = "طلا",
  assetUnit = "تومان",
  assetAccent = "from-amber-400 to-yellow-600",
  assetIcon = "💛",
  assetKey = "gold",
}: PriceCardProps) {
  const formattedDate = new Date(date).toLocaleString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const refreshSeconds = Number(import.meta.env.VITE_PRICE_INTERVAL) / 1000;
  const gradientClass =
    assetKey === "gold"
      ? "from-gold-500/10 via-transparent to-blue-500/10"
      : "from-teal-500/10 via-transparent to-emerald-500/10";

  const refreshBadgeClass =
    assetKey === "gold"
      ? {
          wrapper:
            "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20",
          ping: "bg-amber-400",
          dot: "bg-amber-500",
          text: "text-amber-700 dark:text-amber-300",
        }
      : {
          wrapper:
            "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20",
          ping: "bg-emerald-400",
          dot: "bg-emerald-500",
          text: "text-emerald-700 dark:text-emerald-300",
        };
  return (
    <div className="md:col-span-2">
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 shine-effect">
        {/* Background gradient decoration */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientClass} pointer-events-none`}
        ></div>

        <div className="relative p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                قیمت {assetLabel}
              </h2>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-5xl font-bold bg-gradient-to-r ${assetAccent} bg-clip-text text-transparent`}
                >
                  {price.toLocaleString("fa-IR")}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {assetUnit}
                </span>
              </div>
            </div>
            <div className="text-5xl">{assetIcon}</div>
          </div>

          {/* Change indicator */}
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                isIncreasing
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : isDecreasing
                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {isIncreasing ? (
                <TrendingUp size={20} />
              ) : isDecreasing ? (
                <TrendingDown size={20} />
              ) : null}
              <span>
                {isIncreasing ? "+" : ""}
                {change.toLocaleString("fa-IR")} تومان (
                {isIncreasing ? "+" : ""}
                {changePercent}%)
              </span>
            </div>
          </div>

          {/* Date and time */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              📅 آخرین بروزرسانی: {formattedDate}
            </p>

            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${refreshBadgeClass.wrapper}`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${refreshBadgeClass.ping}`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${refreshBadgeClass.dot}`}
                />
              </span>

              <span className={`text-xs font-medium ${refreshBadgeClass.text}`}>
                بروزرسانی خودکار هر {refreshSeconds.toLocaleString("fa-IR")}{" "}
                ثانیه
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
