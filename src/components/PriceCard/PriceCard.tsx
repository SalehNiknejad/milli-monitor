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
            "backdrop-blur-md bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-400/20 shadow-lg shadow-amber-500/10",
          glow: "bg-amber-500/15",
          ping: "bg-amber-400",
          dot: "bg-amber-500",
          text: "text-amber-700 dark:text-amber-300",
        }
      : {
          wrapper:
            "backdrop-blur-md bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-400/20 shadow-lg shadow-emerald-500/10",
          glow: "bg-emerald-500/15",
          ping: "bg-emerald-400",
          dot: "bg-emerald-500",
          text: "text-emerald-700 dark:text-emerald-300",
        };
  const changeBadgeClass = isIncreasing
    ? {
        wrapper:
          "backdrop-blur-md bg-gradient-to-r from-green-500/10 to-green-500/10 border border-green-400/20 shadow-lg shadow-green-500/10",
        glow: "bg-emerald-500/15",
        text: "text-emerald-700 dark:text-emerald-300",
      }
    : isDecreasing
      ? {
          wrapper:
            "backdrop-blur-md bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-400/20 shadow-lg shadow-red-500/10",
          glow: "bg-red-500/15",
          text: "text-red-700 dark:text-red-300",
        }
      : {
          wrapper:
            "backdrop-blur-md bg-gradient-to-r from-gray-500/10 to-slate-500/10 border border-gray-400/20 shadow-lg shadow-gray-500/10",
          glow: "bg-gray-500/10",
          text: "text-gray-700 dark:text-gray-300",
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
            <div className="relative inline-block">
              <div
                className={`absolute inset-0 rounded-xl blur-xl ${changeBadgeClass.glow}`}
              />

              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold ${changeBadgeClass.wrapper}`}
              >
                {isIncreasing ? (
                  <TrendingUp size={20} className={changeBadgeClass.text} />
                ) : isDecreasing ? (
                  <TrendingDown size={20} className={changeBadgeClass.text} />
                ) : null}

                <span className={changeBadgeClass.text}>
                  {isIncreasing ? "+" : ""}
                  {change.toLocaleString("fa-IR")} تومان
                </span>

                <span className={`text-xs opacity-80 ${changeBadgeClass.text}`}>
                  ({isIncreasing ? "+" : ""}
                  {changePercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Date and time */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              آخرین بروزرسانی: {formattedDate}
            </p>
            <div className="relative inline-block">
              <div
                className={`absolute inset-0 rounded-full blur-xl ${refreshBadgeClass.glow}`}
              />

              <div
                className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${refreshBadgeClass.wrapper}`}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${refreshBadgeClass.ping}`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${refreshBadgeClass.dot}`}
                  />
                </span>

                <span
                  className={`text-xs font-medium tracking-wide ${refreshBadgeClass.text}`}
                >
                  بروزرسانی خودکار هر {refreshSeconds.toLocaleString("fa-IR")}{" "}
                  ثانیه
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
