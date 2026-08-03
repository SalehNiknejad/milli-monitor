import { CandlestickChart } from "lucide-react";
import { useEffect, useState } from "react";
import CollapsibleCard from "./CollapsibleCard";

interface GoldProfitCalculatorProps {
  price: number;
  assetKey?: "gold" | "usdt" | "crypto";
  assetLabel?: string;
  commissionPercent?: number;
}

export default function GoldProfitCalculator({
  price,
  assetKey = "gold",
  assetLabel = "طلا",
  commissionPercent = 0.5,
}: GoldProfitCalculatorProps) {
  const [tradeMode, setTradeMode] = useState<"gold" | "toman">("gold");
  const [goldAmountToTrade, setGoldAmountToTrade] = useState<string>("10");
  const [tomanAmountToTrade, setTomanAmountToTrade] =
    useState<string>("1000000");
  const [buyPriceInput, setBuyPriceInput] = useState<string>("0");
  const [sellPriceInput, setSellPriceInput] = useState<string>("0");
  const [isOpen, setIsOpen] = useState(false);

  const COMMISSION_PERCENT = commissionPercent;
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
    <CollapsibleCard
      title={`محاسبه سود خرید و فروش ${assetLabel}`}
      icon={<CandlestickChart size={24} />}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      assetKey={assetKey}
    >
      <div className="text-right">
        <p className="text-xs text-gray-600 dark:text-gray-300">
          در حالت سرمایه، مبلغ واردشده به‌عنوان پول واقعی سرمایه‌گذاری‌شده در
          نظر گرفته می‌شود و کارمزد خرید داخل آن لحاظ می‌شود.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <div className="flex flex-wrap gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
            {[
              {
                id: "gold",
                label:
                  assetKey === "usdt"
                    ? "مقدار USDT خریداری‌شده"
                    : "مقدار طلای خرید (میلی‌گرم)",
              },
              { id: "toman", label: "مبلغ سرمایه واردشده (تومان)" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setTradeMode(option.id as "gold" | "toman")}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  tradeMode === option.id
                    ? assetKey === "usdt"
                      ? "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-600/70"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {tradeMode === "gold" ? (
          <label className="space-y-2 text-sm text-gray-700 dark:text-gray-300 text-right">
            {assetKey === "usdt"
              ? "مقدار USDT خریداری‌شده"
              : "مقدار طلای خرید (میلی‌گرم)"}
            <input
              type="number"
              min="0"
              value={goldAmountToTrade}
              onChange={(e) => setGoldAmountToTrade(e.target.value)}
              className={
                assetKey === "usdt"
                  ? "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
                  : "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-right"
              }
              dir="rtl"
            />
          </label>
        ) : (
          <label className="space-y-2 text-sm text-gray-700 dark:text-gray-300 text-right">
            مبلغ سرمایه واردشده (تومان)
            <input
              type="number"
              min="0"
              value={tomanAmountToTrade}
              onChange={(e) => setTomanAmountToTrade(e.target.value)}
              className={
                assetKey === "usdt"
                  ? "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
                  : "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-right"
              }
              dir="rtl"
            />
          </label>
        )}
        <label className="space-y-2 text-sm text-gray-700 dark:text-gray-300 text-right">
          قیمت خرید (تومان)
          <input
            type="number"
            min="0"
            value={buyPriceInput}
            onChange={(e) => setBuyPriceInput(e.target.value)}
            className={
              assetKey === "usdt"
                ? "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
                : "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-right"
            }
            dir="rtl"
          />
        </label>
        <label className="space-y-2 text-sm text-gray-700 dark:text-gray-300 text-right">
          قیمت فروش (تومان)
          <input
            type="number"
            min="0"
            value={sellPriceInput}
            onChange={(e) => setSellPriceInput(e.target.value)}
            className={
              assetKey === "usdt"
                ? "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
                : "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-right"
            }
            dir="rtl"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            هزینه خرید + کارمزد
          </p>
          <p className="mt-2 font-semibold text-gray-900 dark:text-white">
            {Math.round(netBuyCost).toLocaleString("fa-IR")} تومان
          </p>
        </div>
        <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            درآمد فروش - کارمزد
          </p>
          <p className="mt-2 font-semibold text-green-600 dark:text-green-400">
            {Math.round(netSellRevenue).toLocaleString("fa-IR")} تومان
          </p>
        </div>
        <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">سود خالص</p>
          <p
            className={`mt-2 font-semibold ${profitToman >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
          >
            {Math.round(profitToman).toLocaleString("fa-IR")} تومان
          </p>
        </div>
        <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">درصد سود</p>
          <p
            className={`mt-2 font-semibold ${profitPercent >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
          >
            {profitPercent >= 0 ? "+" : ""}
            {profitPercent.toFixed(2)}%
          </p>
        </div>
      </div>
    </CollapsibleCard>
  );
}
