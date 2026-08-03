import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { fetchCryptoPrices, type CoinData } from "../services/cryptoApi";
import CryptoCard from "./CryptoCard/CryptoCard";
import CryptoSearchModal from "./CryptoSearchModal";
import HeartHint from "./HeartHint";

export default function CryptoDashboard() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

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
    return () => {
      mounted = false;
    };
  }, []);

  const handleNavigate = (coinId: string) => {
    window.history.pushState(null, "", `/crypto/${coinId}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="space-y-6">
      <HeartHint />
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          بازار ارزهای دیجیتال
        </h2>
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
        >
          <Search size={16} />
          جستجوی ارز
        </button>
      </div>

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
            <div
              key={coin.id}
              onClick={() => handleNavigate(coin.id)}
              className="cursor-pointer"
            >
              <CryptoCard coin={coin} />
            </div>
          ))}
        </div>
      )}

      <CryptoSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={handleNavigate}
      />
    </div>
  );
}
