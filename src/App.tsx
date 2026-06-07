import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Moon,
  Sun,
  Coins,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Heart,
} from "lucide-react";
import PriceCard from "./components/PriceCard";
import WalletCalculator from "./components/WalletCalculator";
import PriceAlert from "./components/PriceAlert";
import ProfitCalculator from "./components/ProfitCalculator";
import GoldProfitCalculator from "./components/GoldProfitCalculator";
import PortfolioSummary from "./components/PortfolioSummary";
import { rialToToman } from "./utils/currency";
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
  const assetConfig = isUsdtRoute
    ? {
        label: "تتر",
        shortLabel: "USDT",
        title: "نظارت قیمت تتر",
        subtitle: "پایش لحظه‌ای USDT / Tether",
        accent: "from-emerald-500 to-green-600",
        pill: "border-yellow-300 bg-yellow-100 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-100",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 16"
            id="Usdt--Streamline-Cryptocurrency"
            height="56"
            width="56"
          >
            <path
              fill="#26a17b"
              d="M8 16c4.4183 0 8 -3.5817 8 -8 0 -4.41828 -3.5817 -8 -8 -8C3.58172 0 0 3.58172 0 8c0 4.4183 3.58172 8 8 8Z"
              stroke-width="0.5"
            ></path>
            <path
              fill="#ffffff"
              fill-rule="evenodd"
              d="M8.961 8.6915v-0.001c-0.055 0.004 -0.3385 0.021 -0.971 0.021 -0.505 0 -0.8605 -0.015 -0.9855 -0.021v0.0015c-1.944 -0.0855 -3.394975 -0.424 -3.394975 -0.829 0 -0.4045 1.450975 -0.743 3.394975 -0.83v1.322c0.127 0.009 0.491 0.0305 0.994 0.0305 0.6035 0 0.906 -0.025 0.9625 -0.03v-1.3215c1.94 0.0865 3.3875 0.425 3.3875 0.829 0 0.405 -1.4475 0.7425 -3.3875 0.8285Zm0 -1.795v-1.183h2.707V3.909485H4.297525V5.7135H7.0045v1.1825c-2.199975 0.101 -3.854475 0.537 -3.854475 1.059 0 0.522 1.6545 0.9575 3.854475 1.059v3.791h1.9565v-3.792c2.1965 -0.101 3.847 -0.5365 3.847 -1.058 0 -0.5215 -1.6505 -0.957 -3.847 -1.0585Z"
              clip-rule="evenodd"
              stroke-width="0.5"
            ></path>
          </svg>
        ),
        iconBg: "from-emerald-500 to-green-600",
        coinLabel: "USDT",
        commission: 0.25,
        holdingLabel: "USDT",
      }
    : {
        label: "طلا",
        shortLabel: "Gold",
        title: "نظارت قیمت طلا",
        subtitle: "پایش قیمت طلا 24/7",
        accent: "from-gold-500 to-gold-700",
        badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
        pill: "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            id="Gold-Bars--Streamline-Ultimate"
            height="56"
            width="56"
          >
            <path
              fill="#ffef5e"
              d="M9.72981 12.7652c-0.04827 -0.2171 -0.16921 -0.4114 -0.34282 -0.5505 -0.17361 -0.1392 -0.3895 -0.2149 -0.61197 -0.2147H3.49775c-0.22231 0 -0.43798 0.0758 -0.61139 0.215 -0.17339 0.1391 -0.29419 0.3332 -0.34243 0.5502l-1.52064 6.8409c-0.031865 0.1434 -0.031022 0.292 0.00246 0.435 0.03349 0.143 0.09876 0.2766 0.19097 0.3908 0.09221 0.1143 0.20897 0.2063 0.34163 0.2692 0.13266 0.063 0.2778 0.0952 0.42462 0.0944h8.31273c0.1463 0 0.2908 -0.033 0.4227 -0.0963 0.1319 -0.0633 0.248 -0.1555 0.3394 -0.2696 0.0916 -0.1142 0.1564 -0.2474 0.1895 -0.39 0.0332 -0.1425 0.0339 -0.2906 0.0022 -0.4335l-1.51969 -6.8409Z"
              stroke-width="1"
            ></path>
            <path
              fill="#ffef5e"
              d="M21.4573 12.7652c-0.0482 -0.2171 -0.1692 -0.4114 -0.3428 -0.5505 -0.1736 -0.1392 -0.3894 -0.2149 -0.612 -0.2147h-5.2772c-0.2224 0 -0.438 0.0758 -0.6114 0.215 -0.1734 0.1391 -0.2942 0.3332 -0.3424 0.5502l-1.5207 6.8409c-0.0318 0.1434 -0.031 0.292 0.0025 0.435 0.0335 0.143 0.0988 0.2766 0.1909 0.3908 0.0923 0.1143 0.2091 0.2063 0.3417 0.2692 0.1326 0.063 0.2778 0.0952 0.4246 0.0944h8.3127c0.1463 0 0.2908 -0.033 0.4227 -0.0963 0.1319 -0.0633 0.248 -0.1555 0.3395 -0.2696 0.0915 -0.1142 0.1563 -0.2474 0.1894 -0.39 0.0332 -0.1425 0.034 -0.2906 0.0022 -0.4335l-1.5197 -6.8409Z"
              stroke-width="1"
            ></path>
            <path
              fill="#ffef5e"
              d="M15.5931 3.96973c-0.0483 -0.21718 -0.1693 -0.41138 -0.3428 -0.55051 -0.1736 -0.13914 -0.3895 -0.21488 -0.612 -0.21469H9.36103c-0.22231 0.00004 -0.43798 0.07587 -0.61139 0.21499 -0.17339 0.13911 -0.29419 0.3332 -0.34243 0.55021L6.88657 10.8106c-0.03187 0.1434 -0.03102 0.2921 0.00246 0.435 0.0335 0.143 0.09877 0.2766 0.19097 0.3908 0.09221 0.1143 0.20897 0.2063 0.34163 0.2693 0.13265 0.0629 0.2778 0.0952 0.42462 0.0943h8.31265c0.1463 0 0.2909 -0.033 0.4228 -0.0963 0.1318 -0.0633 0.2479 -0.1555 0.3394 -0.2696 0.0916 -0.1142 0.1564 -0.2474 0.1895 -0.3899 0.0331 -0.1425 0.0339 -0.2907 0.0022 -0.4336l-1.5197 -6.84087Z"
              stroke-width="1"
            ></path>
            <path
              fill="#fff9bf"
              d="M10.3745 5.92428c0.0482 -0.21701 0.169 -0.4111 0.3424 -0.55022 0.1734 -0.13911 0.389 -0.21495 0.6114 -0.21499h4.5287l-0.2649 -1.18934c-0.0483 -0.21718 -0.1692 -0.41138 -0.3428 -0.55051 -0.1736 -0.13914 -0.3895 -0.21488 -0.612 -0.21469H9.36005c-0.22231 0.00004 -0.43798 0.07587 -0.61138 0.21499 -0.1734 0.13911 -0.2942 0.3332 -0.34244 0.55021L6.88657 10.8106c-0.03185 0.1433 -0.03102 0.2919 0.00241 0.4347 0.03344 0.1429 0.09862 0.2765 0.19071 0.3907 0.0921 0.1143 0.20874 0.2063 0.34128 0.2694 0.13253 0.0629 0.27756 0.0953 0.4243 0.0946h1.1786l1.35063 -6.07572Z"
              stroke-width="1"
            ></path>
            <path
              fill="#fff9bf"
              d="M4.51118 14.7198c0.04827 -0.2172 0.16921 -0.4115 0.34281 -0.5505 0.17362 -0.1392 0.3895 -0.2149 0.61198 -0.2148h4.52868l-0.26484 -1.1893c-0.04827 -0.2171 -0.16921 -0.4114 -0.34282 -0.5505 -0.17361 -0.1392 -0.3895 -0.2149 -0.61197 -0.2147H3.49775c-0.22231 0 -0.43798 0.0758 -0.61139 0.215 -0.17339 0.1391 -0.29419 0.3332 -0.34243 0.5502l-1.52064 6.8409c-0.031865 0.1434 -0.031022 0.292 0.00246 0.435 0.03349 0.143 0.09876 0.2766 0.19097 0.3908 0.09221 0.1143 0.20897 0.2063 0.34163 0.2692 0.13266 0.063 0.2778 0.0952 0.42462 0.0944h1.17859l1.34962 -6.0757Z"
              stroke-width="1"
            ></path>
            <path
              fill="#fff9bf"
              d="M16.2387 14.7198c0.0483 -0.2172 0.1693 -0.4115 0.3428 -0.5505 0.1736 -0.1392 0.3895 -0.2149 0.612 -0.2148h4.5287l-0.2649 -1.1893c-0.0482 -0.2171 -0.1692 -0.4114 -0.3428 -0.5505 -0.1736 -0.1392 -0.3894 -0.2149 -0.612 -0.2147h-5.2772c-0.2224 0 -0.438 0.0758 -0.6114 0.215 -0.1734 0.1391 -0.2942 0.3332 -0.3424 0.5502l-1.5207 6.8409c-0.0318 0.1434 -0.031 0.292 0.0025 0.435 0.0335 0.143 0.0988 0.2766 0.1909 0.3908 0.0923 0.1143 0.2091 0.2063 0.3417 0.2692 0.1326 0.063 0.2778 0.0952 0.4246 0.0944h1.1786l1.3496 -6.0757Z"
              stroke-width="1"
            ></path>
            <path
              stroke="#191919"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.72981 12.7652c-0.04827 -0.2171 -0.16921 -0.4114 -0.34282 -0.5505 -0.17361 -0.1392 -0.3895 -0.2149 -0.61197 -0.2147H3.49775c-0.22231 0 -0.43798 0.0758 -0.61139 0.215 -0.17339 0.1391 -0.29419 0.3332 -0.34243 0.5502l-1.52064 6.8409c-0.031865 0.1434 -0.031022 0.292 0.00246 0.435 0.03349 0.143 0.09876 0.2766 0.19097 0.3908 0.09221 0.1143 0.20897 0.2063 0.34163 0.2692 0.13266 0.063 0.2778 0.0952 0.42462 0.0944h8.31273c0.1463 0 0.2908 -0.033 0.4227 -0.0963 0.1319 -0.0633 0.248 -0.1555 0.3394 -0.2696 0.0916 -0.1142 0.1564 -0.2474 0.1895 -0.39 0.0332 -0.1425 0.0339 -0.2906 0.0022 -0.4335l-1.51969 -6.8409Z"
              stroke-width="1"
            ></path>
            <path
              stroke="#191919"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21.4573 12.7652c-0.0482 -0.2171 -0.1692 -0.4114 -0.3428 -0.5505 -0.1736 -0.1392 -0.3894 -0.2149 -0.612 -0.2147h-5.2772c-0.2224 0 -0.438 0.0758 -0.6114 0.215 -0.1734 0.1391 -0.2942 0.3332 -0.3424 0.5502l-1.5207 6.8409c-0.0318 0.1434 -0.031 0.292 0.0025 0.435 0.0335 0.143 0.0988 0.2766 0.1909 0.3908 0.0923 0.1143 0.2091 0.2063 0.3417 0.2692 0.1326 0.063 0.2778 0.0952 0.4246 0.0944h8.3127c0.1463 0 0.2908 -0.033 0.4227 -0.0963 0.1319 -0.0633 0.248 -0.1555 0.3395 -0.2696 0.0915 -0.1142 0.1563 -0.2474 0.1894 -0.39 0.0332 -0.1425 0.034 -0.2906 0.0022 -0.4335l-1.5197 -6.8409Z"
              stroke-width="1"
            ></path>
            <path
              stroke="#191919"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.5931 3.96973c-0.0483 -0.21718 -0.1693 -0.41138 -0.3428 -0.55051 -0.1736 -0.13914 -0.3895 -0.21488 -0.612 -0.21469H9.36103c-0.22231 0.00004 -0.43798 0.07587 -0.61139 0.21499 -0.17339 0.13911 -0.29419 0.3332 -0.34243 0.55021L6.88657 10.8106c-0.03187 0.1434 -0.03102 0.2921 0.00246 0.435 0.0335 0.143 0.09877 0.2766 0.19097 0.3908 0.09221 0.1143 0.20897 0.2063 0.34163 0.2693 0.13265 0.0629 0.2778 0.0952 0.42462 0.0943h8.31265c0.1463 0 0.2909 -0.033 0.4228 -0.0963 0.1318 -0.0633 0.2479 -0.1555 0.3394 -0.2696 0.0916 -0.1142 0.1564 -0.2474 0.1895 -0.3899 0.0331 -0.1425 0.0339 -0.2907 0.0022 -0.4336l-1.5197 -6.84087Z"
              stroke-width="1"
            ></path>
            <path
              stroke="#191919"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11.9995 5.15906h-1.075c-0.1112 0.00004 -0.2191 0.03803 -0.3058 0.10768 -0.0868 0.06965 -0.1471 0.16681 -0.1711 0.27541l-0.4603 2.09234"
              stroke-width="1"
            ></path>
            <path
              stroke="#191919"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.13525 13.9545h-1.075c-0.11122 0 -0.2191 0.038 -0.30581 0.1077 -0.08672 0.0696 -0.14707 0.1668 -0.17109 0.2754l-0.46519 2.0923"
              stroke-width="1"
            ></path>
            <path
              stroke="#191919"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.8628 13.9545h-1.075c-0.1112 0 -0.2191 0.038 -0.3058 0.1077 -0.0868 0.0696 -0.1471 0.1668 -0.1711 0.2754l-0.4652 2.0923"
              stroke-width="1"
            ></path>
          </svg>
        ),
        iconBg: "from-amber-400 to-yellow-600",
        coinLabel: "میلی‌گرم طلا",
        commission: 0.5,
        holdingLabel: "میلی‌گرم",
      };
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
                {isUsdtRoute ? "بازگشت به طلا" : "مشاهده USDT"}
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
              assetLabel={assetConfig.shortLabel}
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
