import { CandlestickChart } from "lucide-react";
import { useEffect, useState } from "react";

interface GoldProfitCalculatorProps {
  price: number;
}

export default function GoldProfitCalculator({
  price,
}: GoldProfitCalculatorProps) {
  const [tradeMode, setTradeMode] = useState<"gold" | "toman">("gold");
  const [goldAmountToTrade, setGoldAmountToTrade] = useState<string>("10");
  const [tomanAmountToTrade, setTomanAmountToTrade] =
    useState<string>("1000000");
  const [buyPriceInput, setBuyPriceInput] = useState<string>("0");
  const [sellPriceInput, setSellPriceInput] = useState<string>("0");

  const COMMISSION_PERCENT = 0.5;
  const COMMISSION_RATE = COMMISSION_PERCENT / 100;

  const buyPrice = parseFloat(buyPriceInput) || price || 0;
  const sellPrice = parseFloat(sellPriceInput) || price || 0;
  const tradeGold =
    tradeMode === "gold"
      ? parseFloat(goldAmountToTrade) || 0
      : (parseFloat(tomanAmountToTrade) || 0) /
        (buyPrice * (1 + COMMISSION_RATE) || 1);

  const buyCost = tradeGold * buyPrice;
  const sellRevenue = tradeGold * sellPrice;
  const buyFee = buyCost * (COMMISSION_PERCENT / 100);
  const sellFee = sellRevenue * (COMMISSION_PERCENT / 100);
  const netBuyCost = buyCost + buyFee;
  const netSellRevenue = sellRevenue - sellFee;
  const profitToman = netSellRevenue - netBuyCost;
  const profitPercent = netBuyCost > 0 ? (profitToman / netBuyCost) * 100 : 0;

  useEffect(() => {
    if (price > 0 && (!buyPriceInput || Number(buyPriceInput) === 0)) {
      setBuyPriceInput(String(price));
    }
    if (price > 0 && (!sellPriceInput || Number(sellPriceInput) === 0)) {
      setSellPriceInput(String(price));
    }
  }, [price, buyPriceInput, sellPriceInput]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 shine-effect mt-4 space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <CandlestickChart size={24} className="text-gold-500" />
          <h4 className="text-xl font-bold dark:text-white">
            محاسبه سود خرید و فروش طلا
          </h4>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
          در حالت سرمایه، مبلغ واردشده به‌عنوان پول واقعی سرمایه‌گذاری‌شده در
          نظر گرفته می‌شود و کارمزد خرید داخل آن لحاظ می‌شود.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <div className="flex flex-wrap gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
            {[
              { id: "gold", label: "مقدار طلای خرید (میلی‌گرم)" },
              { id: "toman", label: "مبلغ سرمایه واردشده (تومان)" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setTradeMode(option.id as "gold" | "toman")}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  tradeMode === option.id
                    ? "bg-white dark:bg-gray-800 text-gold-600 dark:text-gold-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-600/70"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {tradeMode === "gold" ? (
          <label className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            مقدار طلای خرید (میلی‌گرم)
            <input
              type="number"
              min="0"
              value={goldAmountToTrade}
              onChange={(e) => setGoldAmountToTrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </label>
        ) : (
          <label className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            مبلغ سرمایه واردشده (تومان)
            <input
              type="number"
              min="0"
              value={tomanAmountToTrade}
              onChange={(e) => setTomanAmountToTrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </label>
        )}
        <label className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          قیمت خرید (تومان)
          <input
            type="number"
            min="0"
            value={buyPriceInput}
            onChange={(e) => setBuyPriceInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </label>
        <label className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          قیمت فروش (تومان)
          <input
            type="number"
            min="0"
            value={sellPriceInput}
            onChange={(e) => setSellPriceInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            هزینه خرید + کارمزد
          </p>
          <p className="mt-2 font-semibold text-gray-900 dark:text-white">
            {Math.round(netBuyCost).toLocaleString("fa-IR")} تومان
          </p>
        </div>
        <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            درآمد فروش - کارمزد
          </p>
          <p className="mt-2 font-semibold text-green-600 dark:text-green-400">
            {Math.round(netSellRevenue).toLocaleString("fa-IR")} تومان
          </p>
        </div>
        <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">سود خالص</p>
          <p
            className={`mt-2 font-semibold ${profitToman >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
          >
            {Math.round(profitToman).toLocaleString("fa-IR")} تومان
          </p>
        </div>
        <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">درصد سود</p>
          <p
            className={`mt-2 font-semibold ${profitPercent >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
          >
            {profitPercent >= 0 ? "+" : ""}
            {profitPercent.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}
