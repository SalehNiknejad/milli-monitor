import { Wallet, Coins, TrendingUp, BarChart3 } from "lucide-react";
import { useMemo } from "react";
import { formatToman } from "../utils/currency";
import { usePortfolioStore } from "../store/portfolioStore";
interface Props {
  currentPriceRial: number;
}

export default function PortfolioSummary({ currentPriceRial }: Props) {
  const { walletBalance, transactions } = usePortfolioStore();

  const stats = useMemo(() => {
    let totalGold = 0;
    let totalBuyCost = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "buy") {
        totalGold += transaction.amount;
        totalBuyCost += transaction.total || 0;
      }

      if (transaction.type === "sell") {
        totalGold -= transaction.amount;
      }
      if (transaction.type === "gift") {
        totalGold += transaction.amount;
      }
    });

    const portfolioValue = totalGold * currentPriceRial;
    const avgBuyPrice = totalGold > 0 ? totalBuyCost / totalGold : 0;

    const totalProfit = portfolioValue - totalBuyCost;

    const roi =
      totalBuyCost > 0 ? ((totalProfit / totalBuyCost) * 100).toFixed(2) : "0";

    return {
      totalGold,
      portfolioValue,
      avgBuyPrice,
      totalProfit,
      roi,
    };
  }, [transactions, currentPriceRial]);

  const cards = [
    {
      title: "موجودی کیف پول",
      value: `${formatToman(walletBalance)} تومان`,
      icon: Wallet,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "موجودی میلی",
      value: `${stats.totalGold.toLocaleString("fa-IR")} میلی`,
      icon: Coins,
      color: "text-gold-500",
      bg: "bg-yellow-500/10",
    },
    {
      title: "ارزش دارایی",
      value: `${formatToman(stats.portfolioValue)} تومان`,
      icon: BarChart3,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "سود / ضرر",
      value: `${formatToman(stats.totalProfit)} تومان`,
      icon: TrendingUp,
      color: stats.totalProfit >= 0 ? "text-green-500" : "text-red-500",
      bg: stats.totalProfit >= 0 ? "bg-green-500/10" : "bg-red-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-lg"
          >
            <div
              className={`absolute top-0 right-0 h-24 w-24 rounded-full blur-3xl ${card.bg}`}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {card.title}
                  </p>

                  <h3 className="mt-3 text-xl font-bold dark:text-white">
                    {card.value}
                  </h3>
                </div>

                <div className={`rounded-xl p-3 ${card.bg}`}>
                  <Icon className={card.color} size={26} />
                </div>
              </div>

              {card.title === "سود / ضرر" && (
                <p
                  className={`mt-3 text-sm font-medium ${
                    stats.totalProfit >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  ROI: {stats.roi}%
                </p>
              )}

              {card.title === "موجودی میلی" && (
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  میانگین خرید: {formatToman(stats.avgBuyPrice)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
