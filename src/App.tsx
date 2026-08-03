import { useEffect, useState } from "react";

import GoldProfitCalculator from "./components/GoldProfitCalculator";
import Header from "./components/layout/Header";
import PortfolioSummary from "./components/PortfolioSummary";
import PriceAlert from "./components/PriceAlert";
import PriceCard from "./components/PriceCard/PriceCard";
import PriceCardError from "./components/PriceCard/PriceCardError";
import PriceCardLoading from "./components/PriceCard/PriceCardLoading";
import ProfitCalculator from "./components/ProfitCalculator";
import WalletCalculator from "./components/WalletCalculator";
import assetConfigs from "./configs/assetConfig";
import HeartHint from "./components/HeartHint";
import CryptoDashboard from "./components/CryptoDashboard";
import CoinDetailPage from "./components/CoinDetailPage";
// import TransactionImporter from "./components/TransactionImporter";
// import TransactionsTable from "./components/TransactionsTable";

import { AlertStatus } from "./components/AlertStatus";
import { useAssetPrice } from "./hooks/useAssetPrice";
import { rialToToman } from "./utils/currency";

function App() {
  const [pathname, setPathname] = useState(
    typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "/",
  );

  useEffect(() => {
    const handler = () => setPathname(window.location.pathname.toLowerCase());
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const cryptoDetailMatch = pathname.match(/^\/crypto\/(.+)$/);
  const isCryptoDetail = !!cryptoDetailMatch;
  const cryptoDetailId = cryptoDetailMatch?.[1] || null;
  const isCryptoRoute = pathname.startsWith("/crypto") && !isCryptoDetail;
  const isUsdtRoute = !isCryptoRoute && !isCryptoDetail && pathname.startsWith("/usdt");
  const assetKey = isCryptoRoute || isCryptoDetail ? "crypto" : isUsdtRoute ? "usdt" : "gold";
  const assetConfig = assetConfigs[assetKey];
  const [darkMode, setDarkMode] = useState(true);
  const [installStatus, setInstallStatus] = useState("");

  const [alertPrice, setAlertPrice] = useState<number | null>(null);
  const [alertDirection, setAlertDirection] = useState<"above" | "below">(
    "above",
  );
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [assetHolding, setAssetHolding] = useState<number>(0);
  // const [notificationPermission, setNotificationPermission] =
  //   useState<NotificationPermission>("default");

  const showNotification = (title: string, body: string, emoji?: string) => {
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    ) {
      new Notification(emoji ? `${emoji} ${title}` : title, {
        body,
        tag: Date.now().toString(),
      });

      return;
    }

    window.alert(`${emoji ? `${emoji} ` : ""}${title}\n${body}`);
  };

  const { price, previousPrice, loading, error, priceHistory } = useAssetPrice({
    assetKey,
    alertPrice,
    alertDirection,
    showNotification,
  });

  // Request notification permission on mount
  // useEffect(() => {
  //   if ("Notification" in window && Notification.permission === "default") {
  //     Notification.requestPermission().then((permission) => {
  //       setNotificationPermission(permission);
  //     });
  //   } else if ("Notification" in window) {
  //     setNotificationPermission(Notification.permission);
  //   }
  // }, []);

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
      if (alertPrice === null) localStorage.removeItem("milli:alertPrice");
      else localStorage.setItem("milli:alertPrice", String(alertPrice));
    } catch (e) {}
  }, [alertPrice, alertPrice, alertDirection]);

  useEffect(() => {
    try {
      localStorage.setItem("milli:alertDirection", alertDirection);
    } catch (e) {}
  }, [alertDirection]);

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
      <Header
        onInstallStatusChange={(status) => setInstallStatus(status)}
        onDarkModeChange={(value) => setDarkMode(value)}
        assetConfig={assetConfig}
        isUsdtRoute={isUsdtRoute}
        isCryptoRoute={isCryptoRoute}
        currentRoute={isCryptoRoute ? "crypto" : isUsdtRoute ? "usdt" : "gold"}
      />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {isCryptoDetail && cryptoDetailId && (
            <CoinDetailPage
              coinId={cryptoDetailId}
              onBack={() => {
                window.history.pushState(null, "", "/crypto");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
            />
          )}
          {isCryptoRoute && <CryptoDashboard />}
          {!isCryptoRoute && !isCryptoDetail && price && (
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

          {/* Price Display */}
          {!isCryptoRoute && !isCryptoDetail && (loading ? (
            <PriceCardLoading />
          ) : error ? (
            <PriceCardError error={error} />
          ) : price ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <AlertStatus alertPrice={alertPrice} isUsdtRoute={isUsdtRoute} />
            </div>
          ) : null)}
          {!isCryptoRoute && !isCryptoDetail && (
            <>
              <HeartHint />
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
              <div className="grid grid-cols-1 gap-6">
                {price && (
                  <WalletCalculator
                    price={displayPrice}
                    assetKey={assetKey}
                    assetLabel={assetConfig.label}
                    commissionPercent={assetConfig.commission}
                  />
                )}

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
            </>
          )}

          {/* <TransactionsTable />
          <TransactionImporter /> */}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 py-2 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p> GENERAL • {assetConfig.shortLabel} API</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
