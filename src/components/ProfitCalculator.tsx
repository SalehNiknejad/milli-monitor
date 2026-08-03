import { useEffect, useState } from "react";
import { TrendingUp, Plus, Trash2 } from "lucide-react";
import CollapsibleCard from "./CollapsibleCard";

interface Purchase {
  id: string;
  amount: number;
  price: number;
}

interface ProfitCalculatorProps {
  currentPrice: number;
}

export default function ProfitCalculator({
  currentPrice,
}: ProfitCalculatorProps) {
  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    try {
      const raw = localStorage.getItem("milli:purchases");
      return raw ? (JSON.parse(raw) as Purchase[]) : [];
    } catch (e) {
      return [];
    }
  });
  const [formAmount, setFormAmount] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const addPurchase = () => {
    const amount = parseFloat(formAmount);
    const price = parseFloat(formPrice);

    if (amount > 0 && price > 0) {
      setPurchases([
        ...purchases,
        {
          id: Date.now().toString(),
          amount,
          price,
        },
      ]);
      setFormAmount("");
      setFormPrice("");
      setShowForm(false);
    }
  };

  const removePurchase = (id: string) => {
    setPurchases(purchases.filter((p) => p.id !== id));
  };

  // Persist purchases
  useEffect(() => {
    try {
      localStorage.setItem("milli:purchases", JSON.stringify(purchases));
    } catch (e) {}
  }, [purchases]);

  const calculateStats = () => {
    if (purchases.length === 0) return null;

    let totalCost = 0;
    let totalAmount = 0;
    let totalProfit = 0;

    purchases.forEach((p) => {
      const cost = p.amount * p.price;
      const currentValue = p.amount * currentPrice;
      const profit = currentValue - cost;

      totalCost += cost;
      totalAmount += p.amount;
      totalProfit += profit;
    });

    const avgPrice = totalCost / totalAmount;
    const profitPercent = ((totalProfit / totalCost) * 100).toFixed(2);

    return {
      totalAmount,
      totalCost,
      currentValue: totalAmount * currentPrice,
      totalProfit,
      profitPercent,
      avgPrice,
    };
  };

  const stats = calculateStats();

  const previewContent = stats ? (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-right">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          سود کل:
        </span>
        <span
          className={`text-lg font-bold ${stats.totalProfit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
        >
          {stats.totalProfit >= 0 ? "+" : ""}
          {stats.totalProfit.toLocaleString("fa-IR")} تومان
        </span>
      </div>
      <div className="flex justify-between items-center text-right">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          ارزش فعلی:
        </span>
        <span className="text-lg font-bold text-gold-600 dark:text-gold-400">
          {stats.currentValue.toLocaleString("fa-IR")} تومان
        </span>
      </div>
    </div>
  ) : (
    <div className="text-center text-gray-600 dark:text-gray-400 text-sm py-1">
      برای مشاهده سود، خریدهای خود را وارد کنید
    </div>
  );

  return (
    <CollapsibleCard
      title="محاسبه‌گر سود خریدهای قبلی"
      icon={<TrendingUp size={24} />}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      preview={previewContent}
      assetKey="gold"
    >
      {/* Add Purchase Form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          افزودن خرید
        </button>
      ) : (
        <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                مقدار (میلی‌گرم)
              </label>
              <input
                type="number"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                placeholder="مثال: 5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                قیمت خرید (تومان/میلی‌گرم)
              </label>
              <input
                type="number"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                placeholder={`مثال: ${(currentPrice * 0.95).toLocaleString("fa-IR")}`}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={addPurchase}
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors text-sm"
            >
              ✓ افزودن
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setFormAmount("");
                setFormPrice("");
              }}
              className="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors text-sm"
            >
              ✕ لغو
            </button>
          </div>
        </div>
      )}

      {/* Purchases List */}
      {purchases.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {purchases.map((purchase) => {
            const cost = purchase.amount * purchase.price;
            const currentValue = purchase.amount * currentPrice;
            const profit = currentValue - cost;
            const profitPercent = ((profit / cost) * 100).toFixed(2);
            const isProfitable = profit > 0;

            return (
              <div
                key={purchase.id}
                className={`p-3 rounded-lg border ${
                  isProfitable
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {purchase.amount} میلی‌گرم @{" "}
                    {purchase.price.toLocaleString("fa-IR")} تومان
                  </div>
                  <button
                    onClick={() => removePurchase(purchase.id)}
                    className="p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded transition-colors"
                    title="حذف"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">هزینه:</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {cost.toLocaleString("fa-IR")} تومان
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      ارزش فعلی:
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {currentValue.toLocaleString("fa-IR")} تومان
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 dark:text-gray-400">سود:</p>
                    <p
                      className={`font-semibold ${isProfitable ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {isProfitable ? "+" : ""}
                      {profit.toLocaleString("fa-IR")} تومان (
                      {isProfitable ? "+" : ""}
                      {profitPercent}%)
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center text-gray-600 dark:text-gray-400 text-sm">
          هیچ خریدی ثبت نشده
        </div>
      )}

      {/* Summary */}
      {stats && (
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
            خلاصه:
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                کل مقدار:
              </p>
              <p className="font-bold text-blue-600 dark:text-blue-400">
                {stats.totalAmount.toFixed(2)} میلی‌گرم
              </p>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                قیمت متوسط:
              </p>
              <p className="font-bold text-purple-600 dark:text-purple-400">
                {stats.avgPrice.toLocaleString("fa-IR")}
              </p>
            </div>

            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                هزینه کل:
              </p>
              <p className="font-bold text-orange-600 dark:text-orange-400">
                {stats.totalCost.toLocaleString("fa-IR")} تومان
              </p>
            </div>

            <div className="p-3 bg-gold-50 dark:bg-gold-900/20 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                ارزش فعلی:
              </p>
              <p className="font-bold text-gold-600 dark:text-gold-400">
                {stats.currentValue.toLocaleString("fa-IR")} تومان
              </p>
            </div>
          </div>

          {/* Total Profit */}
          <div
            className={`p-4 rounded-lg border-2 ${stats.totalProfit >= 0 ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700" : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"}`}
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              سود کل:
            </p>
            <p
              className={`text-2xl font-bold ${stats.totalProfit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {stats.totalProfit >= 0 ? "+" : ""}
              {stats.totalProfit.toLocaleString("fa-IR")} تومان
            </p>
            <p
              className={`text-sm font-semibold mt-1 ${stats.totalProfit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              ({stats.totalProfit >= 0 ? "+" : ""}
              {stats.profitPercent}%)
            </p>
          </div>
        </div>
      )}
    </CollapsibleCard>
  );
}
