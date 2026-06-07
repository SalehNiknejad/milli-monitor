import {
  AlertCircle,
  Bell,
  Coins,
  Heart,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import GoldProfitCalculator from "./components/GoldProfitCalculator";
import PortfolioSummary from "./components/PortfolioSummary";
import PriceAlert from "./components/PriceAlert";
import PriceCard from "./components/PriceCard";
import ProfitCalculator from "./components/ProfitCalculator";
import WalletCalculator from "./components/WalletCalculator";
import { rialToToman } from "./utils/currency";
import assetConfigs from "./configs/assetConfig";
// import TransactionImporter from "./components/TransactionImporter";
// import TransactionsTable from "./components/TransactionsTable";
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
const GOLD_API_URL = "/api/v1/public/milli-price/detail";
const USDT_API_URL = "/api/usdt";

function App() {
  const isUsdtRoute =
    typeof window !== "undefined" &&
    window.location.pathname.toLowerCase().startsWith("/usdt");
  const assetKey = isUsdtRoute ? "usdt" : "gold";
  const assetConfig = assetConfigs[assetKey];
  const [price, setPrice] = useState<PriceData | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [alertPrice, setAlertPrice] = useState<number | null>(null);
  const [alertDirection, setAlertDirection] = useState<"above" | "below">(
    "above",
  );
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [assetHolding, setAssetHolding] = useState<number>(0);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installStatus, setInstallStatus] = useState<string>("");
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

  // Load persisted settings (dark mode, alert price, price history, wallet and gold)
  useEffect(() => {
    try {
      const storedDark = localStorage.getItem("milli:darkMode");
      if (storedDark !== null) setDarkMode(storedDark === "true");

      const storedAlert = localStorage.getItem("milli:alertPrice");
      if (storedAlert !== null) setAlertPrice(Number(storedAlert));

      const storedDirection = localStorage.getItem("milli:alertDirection");
      if (storedDirection === "above" || storedDirection === "below") {
        setAlertDirection(storedDirection);
      }

      const storedHistory = localStorage.getItem("milli:priceHistory");
      if (storedHistory) setPriceHistory(JSON.parse(storedHistory));

      const walletKey = `milli:walletBalance:${assetKey}`;
      const storedWallet =
        localStorage.getItem(walletKey) ??
        localStorage.getItem("milli:walletBalance");
      if (storedWallet !== null) setWalletBalance(Number(storedWallet));

      const assetKeyName = `milli:assetHolding:${assetKey}`;
      const storedAsset =
        localStorage.getItem(assetKeyName) ??
        localStorage.getItem("milli:totalGold");
      if (storedAsset !== null) setAssetHolding(Number(storedAsset));
    } catch (e) {
      // ignore parse errors
    }
  }, [assetKey]);

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
  }, [alertPrice, alertPrice, alertDirection, notificationPermission]);

  useEffect(() => {
    try {
      localStorage.setItem("milli:alertDirection", alertDirection);
    } catch (e) {}
  }, [alertDirection]);

  useEffect(() => {
    try {
      localStorage.setItem("milli:priceHistory", JSON.stringify(priceHistory));
    } catch (e) {}
  }, [priceHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(
        `milli:walletBalance:${assetKey}`,
        String(walletBalance),
      );
    } catch (e) {}
  }, [walletBalance, assetKey]);

  useEffect(() => {
    try {
      localStorage.setItem(
        `milli:assetHolding:${assetKey}`,
        String(assetHolding),
      );
    } catch (e) {}
  }, [assetHolding, assetKey]);

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
        const response = isUsdtRoute
          ? await fetch(USDT_API_URL, {
              method: "GET",
              mode: "cors",
              cache: "no-store",
              headers: {
                accept: "application/json",
                "accept-language":
                  "en-GB,en;q=0.9,fa-IR;q=0.8,fa;q=0.7,en-US;q=0.6",
                origin: "https://nobitex.ir",
                referer: "https://nobitex.ir/",
                "content-type": "text/plain",
              },
              signal: controller.signal,
            })
          : await fetch(GOLD_API_URL, {
              method: "GET",
              mode: "cors",
              cache: "no-store",
              headers: {
                Accept: "application/json, text/plain, */*",
              },
              signal: controller.signal,
            });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (isUsdtRoute) {
          const usdtStats = data?.stats?.["usdt-rls"];
          if (!usdtStats || typeof usdtStats.latest === "undefined") {
            throw new Error("پاسخ نامعتبر از سرور تتر");
          }

          const newPrice = Number(usdtStats.latest);

          // Compare with last known price (use ref to avoid stale closures)
          const last = lastPriceRef.current;
          if (last !== null && last !== newPrice) {
            const lastToman = rialToToman(last);
            const currentToman = rialToToman(newPrice);
            const diffToman = currentToman - lastToman;
            const diff = newPrice - last;
            const diffPct = ((diff / last) * 100).toFixed(2);
            showNotification(
              `${diff > 0 ? "📈" : "📉"} Price changed`,
              `Previous: ${lastToman.toLocaleString("fa-IR")} toman\nCurrent: ${currentToman.toLocaleString("fa-IR")} toman\nChange: ${diffToman >= 0 ? "+" : ""}${diffToman.toLocaleString("fa-IR")} toman\nRate: ${diffPct}%`,
              diff > 0 ? "📈" : "📉",
            );
          }

          // Update local refs & state
          setPreviousPrice(last ?? newPrice);
          setPrice({ price18: newPrice, date: new Date().toISOString() });
          setPriceHistory((prev) => [...prev.slice(-59), newPrice]);
          lastPriceRef.current = newPrice;

          // Simple threshold check on each fetched price.
          if (alertPrice !== null) {
            const currentToman = rialToToman(newPrice);

            const isAboveThreshold =
              alertDirection === "above" && currentToman >= alertPrice;
            const isBelowThreshold =
              alertDirection === "below" && currentToman <= alertPrice;

            if (isAboveThreshold || isBelowThreshold) {
              showNotification(
                `🔔 ${assetConfig.shortLabel} price alert`,
                `Current price: ${currentToman.toLocaleString("fa-IR")} toman\nAlert level: ${alertPrice.toLocaleString("fa-IR")} toman\nStatus: ${alertDirection === "above" ? "Above threshold" : "Below threshold"}`,
                "🔔",
              );
            }
          }

          setError(null);
          setLoading(false);
        } else {
          const goldData = data?.data;
          if (data.code !== 0 || !goldData) {
            throw new Error("پاسخ نامعتبر از سرور");
          }

          const newPrice = goldData.price18;

          const last = lastPriceRef.current;
          if (last !== null && last !== newPrice) {
            const lastToman = rialToToman(last);
            const currentToman = rialToToman(newPrice);
            const diffToman = currentToman - lastToman;
            const diff = newPrice - last;
            const diffPct = ((diff / last) * 100).toFixed(2);
            showNotification(
              `${diff > 0 ? "📈" : "📉"} Price changed`,
              `Previous: ${lastToman.toLocaleString("fa-IR")} toman\nCurrent: ${currentToman.toLocaleString("fa-IR")} toman\nChange: ${diffToman >= 0 ? "+" : ""}${diffToman.toLocaleString("fa-IR")} toman\nRate: ${diffPct}%`,
              diff > 0 ? "📈" : "📉",
            );
          }

          setPreviousPrice(last ?? newPrice);
          setPrice(goldData);
          setPriceHistory((prev) => [...prev.slice(-59), newPrice]);
          lastPriceRef.current = newPrice;

          if (alertPrice !== null) {
            const currentToman = rialToToman(newPrice);

            const isAboveThreshold =
              alertDirection === "above" && currentToman >= alertPrice;
            const isBelowThreshold =
              alertDirection === "below" && currentToman <= alertPrice;

            if (isAboveThreshold || isBelowThreshold) {
              showNotification(
                `🔔 ${assetConfig.shortLabel} price alert`,
                `Current price: ${currentToman.toLocaleString("fa-IR")} toman\nAlert level: ${alertPrice.toLocaleString("fa-IR")} toman\nStatus: ${alertDirection === "above" ? "Above threshold" : "Below threshold"}`,
                "🔔",
              );
            }
          }

          setError(null);
          setLoading(false);
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
  }, [alertPrice, alertDirection, notificationPermission]);

  // Show Windows notification
  const showNotification = (title: string, body: string, emoji?: string) => {
    if (
      typeof Notification !== "undefined" &&
      notificationPermission === "granted"
    ) {
      new Notification(emoji ? `${emoji} ${title}` : title, {
        body,
        icon: "💛",
        badge: "💛",
        tag: Date.now().toString(),
      });
      return;
    }

    if (typeof window !== "undefined") {
      window.alert(`${emoji ? `${emoji} ` : ""}${title}\n${body}`);
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
              <div className="text-3xl">{assetConfig.icon}</div>
              <div>
                <h1
                  className={`text-2xl font-bold bg-gradient-to-r ${assetConfig.accent} bg-clip-text text-transparent`}
                >
                  {assetConfig.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {assetConfig.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={isUsdtRoute ? "/gold" : "/USDT"}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${assetConfig.pill}`}
              >
                {isUsdtRoute ? "ارزش طلا" : "ارزش تتر"}
              </a>
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
          {price && (
            <PortfolioSummary
              currentPriceRial={price.price18}
              walletBalance={walletBalance}
              totalGold={assetHolding}
              onWalletChange={setWalletBalance}
              onGoldChange={setAssetHolding}
              assetLabel={assetConfig.label}
              assetKey={assetKey}
            />
          )}
          <div className="relative overflow-hidden rounded-3xl border border-pink-200 bg-gradient-to-br from-pink-50 via-white to-rose-50 p-5 text-sm text-pink-900 shadow-lg dark:border-pink-800/50 dark:from-pink-950/50 dark:via-slate-900 dark:to-rose-950/50 dark:text-pink-100">
            <div className="absolute inset-0 overflow-hidden">
              <Heart
                className="absolute -top-6 -right-6 h-32 w-32 text-pink-200/40 dark:text-pink-500/15 animate-pulse"
                fill="currentColor"
              />

              <Heart
                className="absolute -bottom-10 -left-8 h-40 w-40 text-rose-200/40 dark:text-rose-500/15 animate-pulse"
                fill="currentColor"
                style={{ animationDelay: "1s" }}
              />

              <Heart
                className="absolute top-1/2 right-1/4 h-20 w-20 text-pink-300/30 dark:text-pink-400/10 animate-pulse"
                fill="currentColor"
                style={{ animationDelay: "2s" }}
              />

              <div className="absolute top-0 left-0 h-40 w-40 rounded-full bg-pink-300/20 blur-3xl dark:bg-pink-600/10" />
              <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-rose-300/20 blur-3xl dark:bg-rose-600/10" />
            </div>

            <div className="relative flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 animate-pulse">
                <Heart className="h-6 w-6" fill="currentColor" />
              </div>

              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-pink-500 dark:text-pink-400" />
                  <span className="font-semibold text-pink-600 dark:text-pink-300">
                    یادآوری دوستانه
                  </span>
                </div>

                <p className="leading-7">
                  حتما قبل از انجام هر گونه معامله با شریک عاطفی خود و{" "}
                  <span className="font-bold text-pink-600 dark:text-pink-300">
                    آوا
                  </span>{" "}
                  درون خود مشورت کنید. ❤️ او بیشتر از هر کسی به نفع شما فکر
                  می‌کند.
                </p>
              </div>
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
                  assetLabel={assetConfig.shortLabel}
                  assetUnit="تومان"
                  assetAccent={assetConfig.accent}
                  assetIcon={assetConfig.icon}
                  assetKey={assetKey}
                />
              </div>

              {/* Alert Status */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 shine-effect">
                <div className="flex items-center gap-2 mb-4">
                  <Bell
                    size={20}
                    className={
                      isUsdtRoute ? "text-emerald-500" : "text-amber-500"
                    }
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
            </div>
          ) : null}
          {/* Profit Calculator */}
          {assetKey === "gold" && (
            <ProfitCalculator currentPrice={displayPrice} />
          )}
          {price && (
            <GoldProfitCalculator
              price={displayPrice}
              assetKey={assetKey}
              assetLabel={assetConfig.label}
              commissionPercent={assetConfig.commission}
            />
          )}
          {/* Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wallet Calculator */}
            {price && (
              <WalletCalculator
                price={displayPrice}
                assetKey={assetKey}
                assetLabel={assetConfig.label}
                commissionPercent={assetConfig.commission}
              />
            )}

            {/* Price Alert */}
            {price && (
              <PriceAlert
                currentPrice={displayPrice}
                alertPrice={alertPrice}
                alertDirection={alertDirection}
                assetKey={assetKey}
                onSetAlert={(price, direction = "above") => {
                  setAlertPrice(price);
                  setAlertDirection(direction);
                }}
                onShowNotification={showNotification}
              />
            )}
          </div>

          {/* <TransactionsTable />
          <TransactionImporter /> */}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 py-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p> GENERAL • {assetConfig.shortLabel} API | </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
