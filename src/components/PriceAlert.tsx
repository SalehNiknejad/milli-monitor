import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";

interface PriceAlertProps {
  currentPrice: number;
  alertPrice: number | null;
  alertDirection: "above" | "below";
  onSetAlert: (price: number | null, direction?: "above" | "below") => void;
  onShowNotification: (title: string, body: string, emoji?: string) => void;
}

export default function PriceAlert({
  currentPrice,
  alertPrice,
  alertDirection,
  onSetAlert,
  onShowNotification,
}: PriceAlertProps) {
  const [inputPrice, setInputPrice] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [selectedDirection, setSelectedDirection] = useState<"above" | "below">(
    alertDirection,
  );

  useEffect(() => {
    setSelectedDirection(alertDirection);
  }, [alertDirection]);

  const handleSetAlert = () => {
    const price = parseFloat(inputPrice);
    if (price > 0) {
      onSetAlert(price, selectedDirection);
      setInputPrice("");
      setShowForm(false);
      onShowNotification(
        "هشدار قیمت",
        `هشدار برای ${selectedDirection === "above" ? "بالا رفتن" : "پایین آمدن"} از ${price.toLocaleString("fa-IR")} تومان تنظیم شد`,
        "🔔",
      );
    }
  };

  const handleClearAlert = () => {
    onSetAlert(null, alertDirection);
    setInputPrice("");
    setShowForm(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 shine-effect">
      <div className="flex items-center gap-2 mb-6">
        <Bell size={24} className="text-gold-500" />
        <h3 className="text-xl font-bold dark:text-white"> هشدار قیمت</h3>
      </div>

      <div className="space-y-4">
        {/* Current Price */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            قیمت فعلی:
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {currentPrice.toLocaleString("fa-IR")} تومان
          </p>
        </div>

        {/* Alert Status */}
        {alertPrice ? (
          <div className="space-y-3 p-4 bg-gold-50 dark:bg-gold-900/20 rounded-lg border border-gold-200 dark:border-gold-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              هشدار فعال:
            </p>
            <p className="text-2xl font-bold text-gold-600 dark:text-gold-400">
              {alertPrice.toLocaleString("fa-IR")} تومان
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {alertDirection === "above"
                ? "وقتی قیمت از این مقدار بالاتر برود"
                : "وقتی قیمت از این مقدار پایین‌تر بیاید"}
            </p>
            <button
              onClick={handleClearAlert}
              className="w-full mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <X size={18} />
              حذف هشدار
            </button>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              هیچ هشداری فعال نیست
            </p>
          </div>
        )}

        {/* Form Toggle */}
        {!showForm && !alertPrice && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors"
          >
            ➕ تعیین هشدار جدید
          </button>
        )}

        {/* Alert Form */}
        {showForm && (
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              قیمت هشدار (تومان):
            </label>
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-white dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700">
              {[
                { id: "above", label: "بالا رفتن" },
                { id: "below", label: "پایین آمدن" },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setSelectedDirection(option.id as "above" | "below")
                  }
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    selectedDirection === option.id
                      ? "bg-gold-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={inputPrice}
              onChange={(e) => setInputPrice(e.target.value)}
              placeholder={`مثال: ${currentPrice.toLocaleString("fa-IR")}`}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
              autoFocus
            />

            {/* Quick Select */}
            <div className="space-y-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                انتخابات سریع:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "+1%", value: currentPrice * 1.01 },
                  { label: "+2%", value: currentPrice * 1.02 },
                  { label: "-1%", value: currentPrice * 0.99 },
                  { label: "-2%", value: currentPrice * 0.98 },
                ].map((option) => (
                  <button
                    key={option.label}
                    onClick={() =>
                      setInputPrice(Math.round(option.value).toString())
                    }
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gold-300 dark:hover:bg-gold-600 rounded font-medium transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSetAlert}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                ✓ تأیید
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setInputPrice("");
                }}
                className="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
              >
                ✕ لغو
              </button>
            </div>
          </div>
        )}

        {/* Info */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          💡 وقتی قیمت به مقدار هشدار برسد، یک اطلاع‌رسانی دریافت خواهید کرد
        </p>
      </div>
    </div>
  );
}
