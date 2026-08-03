import { useEffect, useState } from "react";
import { fetchCryptoPrices, type CoinData } from "../services/cryptoApi";
import CryptoCard from "./CryptoCard/CryptoCard";
import HeartHint from "./HeartHint";

export default function CryptoDashboard() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await fetchCryptoPrices();
        if (mounted) setCoins(data);
      } catch (e: any) {
        if (mounted) setError(e.message || "خطا در دریافت اطلاعات");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 60000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-6">
      <HeartHint />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        بازار ارزهای دیجیتال
      </h2>

      {loading && (
        <p className="text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
      )}

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-600 dark:text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {coins.map((coin) => (
            <CryptoCard key={coin.id} coin={coin} />
          ))}
        </div>
      )}
    </div>
  );
}
