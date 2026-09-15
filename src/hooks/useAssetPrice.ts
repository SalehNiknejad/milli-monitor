import { useEffect, useRef, useState } from "react";
import { rialToToman } from "../utils/currency";
interface PriceData {
  price18: number;
  date: string;
}

interface GlobalGoldPrice {
  price: number;
  date: string;
}

interface Params {
  assetKey: "gold" | "usdt" | "crypto";
  alertPrice: number | null;
  alertDirection: "above" | "below";
  showNotification: (title: string, body: string, emoji?: string) => void;
}

const GOLD_API_URL = "/api/v1/public/milli-price/detail";
const USDT_API_URL = "/api/usdt";
const GLOBAL_GOLD_API_URL = "/api/global-gold";

export function useAssetPrice({
  assetKey,
  alertPrice,
  alertDirection,
  showNotification,
}: Params) {
  const isUsdt = assetKey === "usdt";
  const [price, setPrice] = useState<PriceData | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalGoldPrice, setGlobalGoldPrice] =
    useState<GlobalGoldPrice | null>(null);
  const [globalGoldLoading, setGlobalGoldLoading] = useState(
    assetKey === "gold",
  );
  const [globalGoldError, setGlobalGoldError] = useState<string | null>(null);
  const intervalT = Number(import.meta.env.VITE_PRICE_INTERVAL) || 30000;
  const lastPriceRef = useRef<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem("milli:priceHistory");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("milli:priceHistory", JSON.stringify(priceHistory));
    } catch {}
  }, [priceHistory]);

  useEffect(() => {
    if (assetKey !== "gold") {
      setGlobalGoldPrice(null);
      setGlobalGoldLoading(false);
      setGlobalGoldError(null);
      return;
    }

    const controller = new AbortController();

    const fetchGlobalGoldPrice = async () => {
      setGlobalGoldLoading(true);

      try {
        const response = await fetch(GLOBAL_GOLD_API_URL, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const symbol = data?.symbols?.[0];
        const newPrice = Number(symbol?.price);

        if (!symbol || !Number.isFinite(newPrice)) {
          throw new Error("invalid global gold response");
        }

        setGlobalGoldPrice({
          price: newPrice,
          date: symbol.computed_at || new Date().toISOString(),
        });
        setGlobalGoldError(null);
      } catch (e: any) {
        if (e.name === "AbortError") return;
        setGlobalGoldError("خطا در دریافت انس جهانی");
      } finally {
        if (!controller.signal.aborted) setGlobalGoldLoading(false);
      }
    };

    fetchGlobalGoldPrice();
    const interval = setInterval(fetchGlobalGoldPrice, intervalT);

    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, [assetKey, intervalT]);

  useEffect(() => {
    if (assetKey === "crypto") {
      setPrice(null);
      setPreviousPrice(null);
      setLoading(false);
      setError(null);
      return;
    }

    let controller: AbortController | null = null;

    const fetchPrice = async () => {
      controller = new AbortController();

      try {
        const response = await fetch(isUsdt ? USDT_API_URL : GOLD_API_URL, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        let newPrice: number;

        if (isUsdt) {
          const usdtStats = data?.stats?.["usdt-rls"];
          if (!usdtStats?.latest) throw new Error("invalid usdt response");
          newPrice = Number(usdtStats.latest);
        } else {
          if (data?.code !== 0 || !data?.data)
            throw new Error("invalid gold response");
          newPrice = data.data.price18;
        }

        const last = lastPriceRef.current;

        if (last !== null && last !== newPrice) {
          const lastToman = rialToToman(last);
          const currentToman = rialToToman(newPrice);

          const diff = currentToman - lastToman;
          const pct = ((newPrice - last) / last) * 100;

          showNotification(
            diff > 0 ? "📈 افزایش قیمت" : "📉 کاهش قیمت",
            `قبلی: ${lastToman.toLocaleString("fa-IR")}
جدید: ${currentToman.toLocaleString("fa-IR")}
تغییر: ${diff.toLocaleString("fa-IR")} تومان
درصد: ${pct.toFixed(2)}%`,
            diff > 0 ? "📈" : "📉",
          );
        }

        setPreviousPrice(last ?? newPrice);
        setPrice({ price18: newPrice, date: new Date().toISOString() });
        setPriceHistory((p) => [...p.slice(-59), newPrice]);

        lastPriceRef.current = newPrice;

        if (alertPrice !== null) {
          const currentToman = rialToToman(newPrice);

          const hitAbove =
            alertDirection === "above" && currentToman >= alertPrice;
          const hitBelow =
            alertDirection === "below" && currentToman <= alertPrice;

          if (hitAbove || hitBelow) {
            showNotification(
              "🔔 هشدار قیمت",
              `قیمت: ${currentToman.toLocaleString("fa-IR")}
سطح: ${alertPrice.toLocaleString("fa-IR")}`,
              "🔔",
            );
          }
        }

        setError(null);
        setLoading(false);
      } catch (e: any) {
        if (e.name === "AbortError") return;
        setError("خطا در دریافت قیمت");
        setLoading(false);
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, intervalT);
    return () => {
      clearInterval(interval);
      controller?.abort();
    };
  }, [assetKey, alertPrice, alertDirection]);

  return {
    price,
    previousPrice,
    loading,
    error,
    priceHistory,
    globalGoldPrice,
    globalGoldLoading,
    globalGoldError,
  };
}
