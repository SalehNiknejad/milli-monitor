import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceCardProps {
  price: number;
  date: string;
  change: number;
  changePercent: number;
  isIncreasing: boolean;
  isDecreasing: boolean;
}

export default function PriceCard({
  price,
  date,
  change,
  changePercent,
  isIncreasing,
  isDecreasing,
}: PriceCardProps) {
  const formattedDate = new Date(date).toLocaleString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 shine-effect">
      {/* Background gradient decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>

      <div className="relative p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              قیمت طلا 18 عیار
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold bg-gradient-to-r from-gold-600 to-gold-500 bg-clip-text text-transparent">
                {price.toLocaleString("fa-IR")}
              </span>
              <span className="text-gray-500 dark:text-gray-400">تومان</span>
            </div>
          </div>
          <div className="text-5xl">💰</div>
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
              {change.toLocaleString("fa-IR")} تومان ({isIncreasing ? "+" : ""}
              {changePercent}%)
            </span>
          </div>
        </div>

        {/* Date and time */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            📅 آخرین بروزرسانی: {formattedDate}
          </p>
        </div>
      </div>
    </div>
  );
}
