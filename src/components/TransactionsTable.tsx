import { useMemo } from "react";
import { ArrowDownLeft, ArrowUpRight, Gift, Wallet } from "lucide-react";
import { usePortfolioStore } from "../store/portfolioStore";

const typeConfig = {
  buy: {
    label: "خرید",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    icon: ArrowDownLeft,
  },

  sell: {
    label: "فروش",
    className:
      "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
    icon: ArrowUpRight,
  },

  gift: {
    label: "هدیه",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    icon: Gift,
  },

  deposit: {
    label: "واریز",
    className: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
    icon: Wallet,
  },

  withdraw: {
    label: "برداشت",
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
    icon: Wallet,
  },
};

export default function TransactionsTable() {
  const transactions = usePortfolioStore((s) => s.transactions);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [transactions]);

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
        <h2 className="text-xl font-black text-gray-900 dark:text-white">
          تراکنش‌ها
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          لیست کامل خرید، فروش، هدیه و تراکنش‌های کیف پول
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-50 dark:bg-gray-900/40">
            <tr className="text-right">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                نوع تراکنش
              </th>

              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                مقدار میلی
              </th>

              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                قیمت هر میلی
              </th>

              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                مبلغ کل
              </th>

              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                کارمزد
              </th>

              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                تاریخ و زمان
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedTransactions.map((transaction) => {
              const config =
                typeConfig[transaction.type as keyof typeof typeConfig];

              const Icon = config?.icon;

              return (
                <tr
                  key={transaction.id}
                  className="border-t border-gray-100 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/40"
                >
                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${config.className}`}
                    >
                      <Icon size={16} />

                      <span>{config.label}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                    {transaction.amount.toLocaleString("fa-IR")}
                  </td>

                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {(transaction.price || 0).toLocaleString("fa-IR")}

                    <span className="mr-1 text-xs text-gray-400">ریال</span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-black text-gray-900 dark:text-white">
                      {(transaction.total || 0).toLocaleString("fa-IR")}
                    </div>

                    <div className="mt-1 text-xs text-gray-400">ریال</div>
                  </td>

                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    <div>
                      {transaction.fee.rial.toLocaleString("fa-IR")} ریال
                    </div>
                    <div className="text-xs text-gray-400">
                      {transaction.fee.milli.toLocaleString("fa-IR")} میلی
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {new Intl.DateTimeFormat("fa-IR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(new Date(transaction.createdAt))}
                      </span>

                      <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {new Intl.DateTimeFormat("fa-IR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(transaction.createdAt))}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!sortedTransactions.length && (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="mb-3 text-5xl">🪙</div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              هنوز تراکنشی ثبت نشده
            </h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              تراکنش‌ها بعد از ایمپورت اینجا نمایش داده می‌شوند
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
