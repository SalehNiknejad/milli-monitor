import { useEffect, useRef, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import {
  searchCoins,
  type CoinSearchResult,
} from "../services/cryptoApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (coinId: string) => void;
}

export default function CryptoSearchModal({ open, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CoinSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchCoins(query);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelect = (coin: CoinSearchResult) => {
    onSelect(coin.id);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg max-h-[80vh] flex flex-col rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <Search size={20} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی ارز دیجیتال..."
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {searching && (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-indigo-500" />
            </div>
          )}

          {!searching && results.length === 0 && query.trim() && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              نتیجه‌ای یافت نشد
            </p>
          )}

          {!searching &&
            results.map((coin) => (
              <button
                key={coin.id}
                onClick={() => handleSelect(coin)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-right"
              >
                <img
                  src={coin.thumb}
                  alt={coin.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {coin.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                    {coin.symbol}
                    {coin.market_cap_rank != null &&
                      ` • #${coin.market_cap_rank}`}
                  </p>
                </div>
              </button>
            ))}

          {!searching && results.length === 0 && !query.trim() && (
            <p className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">
              نام ارز مورد نظر خود را وارد کنید
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
