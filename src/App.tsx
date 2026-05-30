import { useState, useEffect, useRef } from "react";
import { Bell, Moon, Sun, Coins, TrendingUp, AlertCircle } from "lucide-react";
import PriceCard from "./components/PriceCard";
import WalletCalculator from "./components/WalletCalculator";
import PriceAlert from "./components/PriceAlert";
import ProfitCalculator from "./components/ProfitCalculator";
import { usePortfolioStore } from "./store/portfolioStore";
import PortfolioSummary from "./components/PortfolioSummary";
import TransactionImporter from "./components/TransactionImporter";
import { rialToToman } from "./utils/currency";
import TransactionsTable from "./components/TransactionsTable";
interface PriceData {
  price18: number;
  date: string;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

// Use relative path in development so Vite dev server proxy (vite.config.ts)
// forwards requests to https://milli.gold, avoiding CORS issues during dev.
const API_URL = true
  ? "/api/v1/public/milli-price/detail"
  : "https://milli.gold/api/v1/public/milli-price/detail";

function App() {
  const fetchPortfolio = usePortfolioStore((state) => state.fetchPortfolio);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const [price, setPrice] = useState<PriceData | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [alertPrice, setAlertPrice] = useState<number | null>(null);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installStatus, setInstallStatus] = useState<string>("");
  const notificationShownRef = useRef<number | null>(null);
  const lastPriceRef = useRef<number | null>(null);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
      });
    } else if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Load persisted settings (dark mode, alert price, price history)
  useEffect(() => {
    try {
      const storedDark = localStorage.getItem("milli:darkMode");
      if (storedDark !== null) setDarkMode(storedDark === "true");

      const storedAlert = localStorage.getItem("milli:alertPrice");
      if (storedAlert !== null) setAlertPrice(Number(storedAlert));

      const storedHistory = localStorage.getItem("milli:priceHistory");
      if (storedHistory) setPriceHistory(JSON.parse(storedHistory));
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  // Persist small pieces of state
  useEffect(() => {
    try {
      localStorage.setItem("milli:darkMode", darkMode ? "true" : "false");
    } catch (e) {}
  }, [darkMode]);

  useEffect(() => {
    try {
      if (alertPrice === null) localStorage.removeItem("milli:alertPrice");
      else localStorage.setItem("milli:alertPrice", String(alertPrice));
    } catch (e) {}
  }, [alertPrice]);

  useEffect(() => {
    try {
      localStorage.setItem("milli:priceHistory", JSON.stringify(priceHistory));
    } catch (e) {}
  }, [priceHistory]);

  useEffect(() => {
    const handler = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      event.preventDefault();
      setDeferredPrompt(promptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    setInstallStatus(
      choiceResult.outcome === "accepted"
        ? "نصب برنامه انجام شد."
        : "نصب لغو شد.",
    );
    setDeferredPrompt(null);
  };

  // Fetch price every 10 seconds (robust headers, error handling, and change notifications)
  useEffect(() => {
    let controller: AbortController | null = null;

    const fetchPrice = async () => {
      controller = new AbortController();

      try {
        const response = await fetch(API_URL, {
          method: "GET",
          mode: "cors",
          cache: "no-store",
          // Keep headers minimal to avoid CORS preflight failures.
          headers: {
            Accept: "application/json, text/plain, */*",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.code === 0 && data.data) {
          const newPrice = data.data.price18;

          // Compare with last known price (use ref to avoid stale closures)
          const last = lastPriceRef.current;
          if (last !== null && last !== newPrice) {
            const diff = newPrice - last;
            const diffPct = ((diff / last) * 100).toFixed(2);
            showNotification(
              "قیمت تغییر کرد",
              `از ${last.toLocaleString("fa-IR")} → ${newPrice.toLocaleString("fa-IR")} (تغییر ${diff >= 0 ? "+" : ""}${diff.toLocaleString("fa-IR")} — ${diffPct}%)`,
              diff > 0 ? "📈" : "📉",
            );
          }

          // Update local refs & state
          setPreviousPrice(last ?? newPrice);
          setPrice(data.data);
          setPriceHistory((prev) => [...prev.slice(-59), newPrice]);
          lastPriceRef.current = newPrice;

          // Check if alert should be triggered
          if (
            alertPrice !== null &&
            newPrice >= alertPrice &&
            notificationShownRef.current !== alertPrice
          ) {
            showNotification(
              "هشدار قیمت طلا",
              `قیمت طلا به ${newPrice.toLocaleString("fa-IR")} رسید!`,
              "🔔",
            );
            notificationShownRef.current = alertPrice;
          }

          setError(null);
          setLoading(false);
        } else {
          throw new Error("پاسخ نامعتبر از سرور");
        }
      } catch (err) {
        if ((err as any).name === "AbortError") return;
        setError(
          "خطا در دریافت داده‌های قیمت. لطفا اتصال اینترنت خود را بررسی کنید.",
        );
        setLoading(false);
      }
    };

    // initial fetch + interval
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);

    return () => {
      clearInterval(interval);
      controller?.abort();
    };
  }, [alertPrice]);

  // Show Windows notification
  const showNotification = (title: string, body: string, emoji?: string) => {
    if (notificationPermission === "granted") {
      new Notification(emoji ? `${emoji} ${title}` : title, {
        body,
        icon: "💛",
        badge: "💛",
        tag: "goldprice",
      });
    }
  };

  const priceChange =
    price && previousPrice ? price.price18 - previousPrice : 0;
  const priceChangePercent =
    price && previousPrice
      ? ((priceChange / previousPrice) * 100).toFixed(2)
      : "0";
  const isIncreasing = priceChange > 0;
  const isDecreasing = priceChange < 0;
  const displayPrice = price ? rialToToman(price.price18) : 0;
  const displayChange = rialToToman(priceChange);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"}`}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md glass-effect border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-3xl">💛</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-500 to-gold-700 bg-clip-text text-transparent">
                  نظارت قیمت طلا
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  پایش قیمت طلا 24/7
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {deferredPrompt ? (
                <button
                  onClick={handleInstallApp}
                  className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors"
                >
                  نصب PWA
                </button>
              ) : null}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={darkMode ? "تغییر به حالت روز" : "تغییر به حالت شب"}
              >
                {darkMode ? (
                  <Sun size={24} className="text-yellow-400" />
                ) : (
                  <Moon size={24} className="text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {price && <PortfolioSummary currentPriceRial={price.price18} />}
          <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-4 text-sm text-blue-900 dark:text-blue-200">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>
                حتما قبل از انجام هر گونه معامله با شریک عاطفی خود و <b>آوا</b>{" "}
                درون خود مشورت کنید. ❤️ او بیشتر از هر کسی به نفع شما فکر می‌کند
              </p>
            </div>
          </div>
          {installStatus || deferredPrompt ? (
            <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-4 text-sm text-blue-900 dark:text-blue-200">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  برای نصب PWA روی ویندوز، روی دکمه «نصب PWA» کلیک کنید یا از
                  منوی مرورگر Install استفاده کنید.
                </p>
                {installStatus && (
                  <span className="font-semibold">{installStatus}</span>
                )}
              </div>
            </div>
          ) : null}
          {/* Price Display */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin">
                  <Coins size={48} className="text-gold-500 mb-4" />
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  در حال بارگذاری قیمت‌ها...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle size={24} className="text-red-500" />
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          ) : price ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Price Card */}
              <div className="md:col-span-2">
                <PriceCard
                  price={displayPrice}
                  date={price.date}
                  change={displayChange}
                  changePercent={parseFloat(priceChangePercent)}
                  isIncreasing={isIncreasing}
                  isDecreasing={isDecreasing}
                />
              </div>

              {/* Alert Status */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 shine-effect">
                <div className="flex items-center gap-2 mb-4">
                  <Bell size={20} className="text-gold-500" />
                  <h3 className="text-lg font-semibold dark:text-white">
                    وضعیت هشدار‌ها
                  </h3>
                </div>
                {alertPrice ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      قیمت هشدار تعیین شده:
                    </p>
                    <p className="text-2xl font-bold text-gold-600">
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
            </div>
          ) : null}

          {/* Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wallet Calculator */}
            {price && <WalletCalculator price={displayPrice} />}

            {/* Price Alert */}
          </div>

          {/* Profit Calculator */}
          {price && <ProfitCalculator currentPrice={displayPrice} />}
          <TransactionsTable />
          <TransactionImporter />
          {price && (
            <PriceAlert
              currentPrice={displayPrice}
              alertPrice={alertPrice}
              onSetAlert={setAlertPrice}
              onShowNotification={showNotification}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 py-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>🔄 بروزرسانی خودکار هر 30 ثانیه | منبع: Milli.Gold API</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
