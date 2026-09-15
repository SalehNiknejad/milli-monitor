import { Bell, ArrowUp, ArrowDown } from "lucide-react";
import { AlertStatusSkeleton } from "./Skeleton/SkeletonLoader";

type Props = {
  isUsdtRoute?: boolean;
  alertPrice: number | null;
  alertDirection?: "above" | "below";
  loading?: boolean;
};

export const AlertStatus: React.FC<Props> = ({
  isUsdtRoute,
  alertPrice,
  alertDirection = "above",
  loading = false,
}) => {
  if (loading) {
    return <AlertStatusSkeleton isUsdtRoute={isUsdtRoute} />;
  }

  const accentColor = isUsdtRoute ? "emerald" : "amber";
  const accentClass = isUsdtRoute ? "text-emerald-500" : "text-amber-500";
  const accentBg = isUsdtRoute
    ? "bg-emerald-500/10"
    : "bg-amber-500/10";
  const accentBorder = isUsdtRoute
    ? "border-emerald-200 dark:border-emerald-800"
    : "border-amber-200 dark:border-amber-800";

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 shine-effect`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className={`rounded-lg p-2 ${accentBg}`}>
          <Bell size={20} className={accentClass} />
        </div>
        <h3 className="text-lg font-semibold dark:text-white">
          وضعیت هشدار
        </h3>
      </div>

      {alertPrice ? (
        <div className="space-y-4">
          {/* Direction Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
              alertDirection === "above"
                ? `bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300`
                : `bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300`
            } text-xs font-medium`}
          >
            {alertDirection === "above" ? (
              <>
                <ArrowUp size={14} />
                بالاتر از
              </>
            ) : (
              <>
                <ArrowDown size={14} />
                پایین‌تر از
              </>
            )}
          </div>

          {/* Price Display */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              قیمت هشدار:
            </p>
            <p
              className={`text-3xl font-bold ${
                isUsdtRoute
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {alertPrice.toLocaleString("fa-IR")}
            </p>
          </div>

          {/* Status */}
          <div
            className={`rounded-lg border p-3 text-center ${
              isUsdtRoute
                ? `${accentBg} ${accentBorder}`
                : `${accentBg} ${accentBorder}`
            }`}
          >
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              ✓ هشدار فعال است
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <Bell
            size={32}
            className="text-gray-300 dark:text-gray-600 mx-auto mb-2 opacity-50"
          />
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            هیچ هشداری تعیین نشده
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            از بخش تنظیم هشدار یک هشدار اضافه کنید
          </p>
        </div>
      )}
    </div>
  );
};
