import { Bell } from "lucide-react";

type Props = {
  isUsdtRoute?: boolean;
  alertPrice: number | null;
};

export const AlertStatus: React.FC<Props> = ({ isUsdtRoute, alertPrice }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 shine-effect">
      <div className="flex items-center gap-2 mb-4">
        <Bell
          size={20}
          className={isUsdtRoute ? "text-emerald-500" : "text-amber-500"}
        />
        <h3 className="text-lg font-semibold dark:text-white">
          وضعیت هشدار‌ها
        </h3>
      </div>
      {alertPrice ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            قیمت هشدار تعیین شده:
          </p>
          <p
            className={
              isUsdtRoute
                ? "text-2xl font-bold text-emerald-600 dark:text-emerald-400"
                : "text-2xl font-bold text-amber-600 dark:text-amber-400"
            }
          >
            {alertPrice.toLocaleString("fa-IR")}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            هشدار فعال است
          </p>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          هیچ هشداری تعیین نشده
        </p>
      )}
    </div>
  );
};
