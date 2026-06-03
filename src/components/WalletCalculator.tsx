// Wallet calculator component (edited to force HMR rebuild)
import { useEffect, useState } from "react";
import { Wallet, Calculator } from "lucide-react";

interface WalletCalculatorProps {
  price: number;
}

export default function WalletCalculator({ price }: WalletCalculatorProps) {
  const [balance, setBalance] = useState<string>(() => {
    try {
      const raw = localStorage.getItem("milli:wallet_balance");
      return raw ?? "";
    } catch (e) {
      return "";
    }
  });
  const [includeCommission, setIncludeCommission] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem("milli:wallet_includeCommission");
      return raw ? raw === "true" : true;
    } catch (e) {
      return true;
    }
  });
  const [targetPrice, setTargetPrice] = useState<string>("0");

  const COMMISSION_PERCENT = 0.5;

  const calculateGold = () => {
    const balanceNum = parseFloat(balance);
    if (!balanceNum || balanceNum < 0) return null;

    let goldAmount = balanceNum / price;
    if (includeCommission) {
      goldAmount = goldAmount * (1 - COMMISSION_PERCENT / 100);
    }
    return goldAmount;
  };

  const goldAmount = calculateGold();
  const totalCost = goldAmount ? goldAmount * price : 0;
  const commissionCost = includeCommission
    ? totalCost * (COMMISSION_PERCENT / 100)
    : 0;
  const targetPriceNum = parseFloat(targetPrice) || price || 0;
  const targetGoldGrams =
    targetPriceNum > 0 ? (parseFloat(balance) || 0) / targetPriceNum : 0;
  const targetGoldGramsWithCommission = includeCommission
    ? targetGoldGrams * (1 - COMMISSION_PERCENT / 100)
    : targetGoldGrams;
  const targetPriceDiff = price > 0 ? targetPriceNum - price : 0;
  const targetPricePercent = price > 0 ? (targetPriceDiff / price) * 100 : 0;

  // Persist wallet inputs
  useEffect(() => {
    try {
      localStorage.setItem("milli:wallet_balance", balance);
    } catch (e) {}
  }, [balance]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "milli:wallet_includeCommission",
        includeCommission ? "true" : "false",
      );
    } catch (e) {}
  }, [includeCommission]);

  useEffect(() => {
    if (price > 0 && (!targetPrice || Number(targetPrice) === 0)) {
      setTargetPrice(String(price));
    }
  }, [price, targetPrice]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 shine-effect">
      <div className="flex items-center gap-2 mb-6">
        <Wallet size={24} className="text-gold-500" />
        <h3 className="text-xl font-bold dark:text-white">
          ماشین حساب کیف پول
        </h3>
      </div>

      <div className="space-y-4">
        {/* Balance Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            موجودی کیف پول (تومان)
          </label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="مثال: 500000"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        {/* Commission Toggle */}
        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <input
            type="checkbox"
            id="commission"
            checked={includeCommission}
            onChange={(e) => setIncludeCommission(e.target.checked)}
            className="w-4 h-4 cursor-pointer accent-gold-500"
          />
          <label
            htmlFor="commission"
            className="text-sm cursor-pointer flex-1 text-gray-700 dark:text-gray-300"
          >
            شامل کارمزد خرید ({COMMISSION_PERCENT}%)
          </label>
        </div>

        {/* Results */}
        {balance && parseFloat(balance) > 0 && (
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Gold Amount */}
            <div className="flex justify-between items-center p-3 bg-gold-50 dark:bg-gold-900/20 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                مقدار طلا قابل خریدن:
              </span>
              <span className="text-lg font-bold text-gold-600 dark:text-gold-400">
                {goldAmount?.toFixed(1) || "0"} میلی‌گرم
              </span>
            </div>

            {/* Total Cost */}
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                هزینه کل:
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {Math.round(totalCost).toLocaleString("fa-IR")} تومان{" "}
              </span>
            </div>

            {/* Commission */}
            {includeCommission && (
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  کارمزد:
                </span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  {Math.round(commissionCost).toLocaleString("fa-IR")} تومان
                </span>
              </div>
            )}

            {/* Net Amount */}
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                مبلغ خالص:
              </span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {Math.round(totalCost - commissionCost).toLocaleString("fa-IR")}{" "}
                تومان
              </span>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 mt-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                    🎯 قیمت هدف طلا
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setTargetPrice(String(price || ""))}
                  className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
                >
                  قیمت فعلی
                </button>
              </div>

              <label className="block text-sm text-gray-700 dark:text-gray-300 space-y-2">
                قیمت هدف طلا (تومان)
                <input
                  type="number"
                  min="0"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    قیمت فعلی API
                  </p>
                  <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                    {price.toLocaleString("fa-IR")} تومان
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    تفاوت نسبت به قیمت فعلی
                  </p>
                  <p
                    className={`mt-2 font-semibold ${targetPricePercent >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {targetPricePercent >= 0 ? "+" : ""}
                    {targetPricePercent.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    میلی‌گرم قابل خرید با قیمت هدف
                  </p>
                  <p className="mt-2 font-semibold text-gold-600 dark:text-gold-400">
                    {targetGoldGramsWithCommission.toFixed(1)} میلی‌گرم
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    مقدار خرید در قیمت هدف
                  </p>
                  <p className="mt-2 font-semibold text-purple-600 dark:text-purple-400">
                    {targetGoldGrams.toFixed(1)} میلی‌گرم
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                اگر قیمت طلا به {targetPriceNum.toLocaleString("fa-IR")} تومان
                برسد، با موجودی فعلی می‌توانید حدود{" "}
                {targetGoldGramsWithCommission.toFixed(1)} میلی‌گرم طلا بخرید.
              </p>
            </div>
          </div>
        )}

        {balance && parseFloat(balance) <= 0 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ لطفا یک مبلغ معتبر وارد کنید
          </div>
        )}
      </div>
    </div>
  );
}
