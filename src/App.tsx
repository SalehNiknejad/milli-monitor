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
import { useAppSettings } from "./hooks/useAppSettings";
import { useAssetState } from "./hooks/useAssetState";
import { useRouting } from "./hooks/useRouting";
import { useToast } from "./hooks/useToast";
import { ToastContainer } from "./components/Toast/ToastContainer";

function App() {
  // Use custom hooks for state management
  const {
    pathname,
    isCryptoRoute,
    isCryptoDetail,
    isUsdtRoute,
    cryptoDetailId,
    assetKey,
    navigateTo,
  } = useRouting();
  const {
    darkMode,
    setDarkMode,
    alertPrice,
    setAlertPrice,
    alertDirection,
    setAlertDirection,
    installStatus,
    setInstallStatus,
  } = useAppSettings();
  const { walletBalance, setWalletBalance, assetHolding, setAssetHolding } =
    useAssetState(assetKey);
  const { toasts, showToast, removeToast } = useToast();

  const assetConfig = assetConfigs[assetKey];

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

    // Show toast instead of alert
    showToast(title, body, "info", emoji);
  };

  const { price, previousPrice, loading, error, priceHistory } = useAssetPrice({
    assetKey,
    alertPrice,
    alertDirection,
    showNotification,
  });

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
      <ToastContainer toasts={toasts} onRemove={removeToast} />

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
              onBack={() => navigateTo("/crypto")}
            />
          )}
          {isCryptoRoute && <CryptoDashboard />}
          {!isCryptoRoute && !isCryptoDetail && (
            <PortfolioSummary
              currentPriceRial={price?.price18 || 0}
              walletBalance={walletBalance}
              totalGold={assetHolding}
              onWalletChange={setWalletBalance}
              onGoldChange={setAssetHolding}
              assetLabel={assetConfig.label}
              assetKey={assetKey}
              loading={loading}
            />
          )}

          {/* Price Display */}
          {!isCryptoRoute &&
            !isCryptoDetail &&
            (loading ? (
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
                <AlertStatus
                  alertPrice={alertPrice}
                  isUsdtRoute={isUsdtRoute}
                />
              </div>
            ) : null)}
          {!isCryptoRoute && !isCryptoDetail && (
            <>
              <HeartHint />
              {assetKey === "gold" && (
                <ProfitCalculator
                  currentPrice={displayPrice}
                  loading={loading}
                />
              )}
              {price && (
                <GoldProfitCalculator
                  price={displayPrice}
                  assetKey={assetKey}
                  assetLabel={assetConfig.label}
                  commissionPercent={assetConfig.commission}
                  loading={loading}
                />
              )}
              <div className="grid grid-cols-1 gap-6">
                {price && (
                  <WalletCalculator
                    price={displayPrice}
                    assetKey={assetKey}
                    assetLabel={assetConfig.label}
                    commissionPercent={assetConfig.commission}
                    loading={loading}
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
                    loading={loading}
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
