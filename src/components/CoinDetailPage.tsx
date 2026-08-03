import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Hash,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Layers,
} from "lucide-react";
import {
  fetchCoinDetail,
  type CoinDetailData,
} from "../services/cryptoApi";

interface Props {
  coinId: string;
  onBack: () => void;
}

function formatCompact(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
}

function formatSupply(n: number | null): string {
  if (n === null) return "∞";
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  return n.toLocaleString();
}

function ChangeBadge({ value, label }: { value: number; label: string }) {
  const isPos = value >= 0;
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-gray-50 dark:bg-gray-700/50 p-3">
      <span className="text-[10px] text-gray-500 dark:text-gray-400">{label}</span>
      <span
        className={`text-sm font-bold ${isPos ? "text-emerald-500" : "text-red-500"}`}
      >
        {isPos ? "+" : ""}
        {value.toFixed(2)}%
      </span>
    </div>
  );
}

export default function CoinDetailPage({ coinId, onBack }: Props) {
  const [coin, setCoin] = useState<CoinDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchCoinDetail(coinId)
      .then((data) => {
        if (mounted) setCoin(data);
      })
      .catch((e) => {
        if (mounted) setError(e.message || "خطا در دریافت اطلاعات");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [coinId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-500">{error || "اطلاعاتی یافت نشد"}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm"
        >
          بازگشت
        </button>
      </div>
    );
  }

  const isPositive = coin.price_change_percentage_24h >= 0;
  const supplyPercent =
    coin.max_supply && coin.max_supply > 0
      ? ((coin.circulating_supply / coin.max_supply) * 100).toFixed(1)
      : null;

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft size={16} />
        بازگشت به بازار
      </button>

      <div className="flex flex-col items-center text-center space-y-4">
        <img
          src={coin.image}
          alt={coin.name}
          className="w-28 h-28 rounded-full shadow-2xl shadow-indigo-500/20 ring-4 ring-indigo-500/10"
        />
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            {coin.name}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="uppercase text-lg font-semibold text-gray-500 dark:text-gray-400">
              {coin.symbol}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
              #{coin.market_cap_rank}
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            ${coin.current_price.toLocaleString()}
          </span>
          <span
            className={`flex items-center gap-1 text-lg font-bold ${isPositive ? "text-emerald-500" : "text-red-500"}`}
          >
            {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <ChangeBadge value={coin.price_change_7d} label="۷ روزه" />
        <ChangeBadge value={coin.price_change_14d} label="۱۴ روزه" />
        <ChangeBadge value={coin.price_change_30d} label="۳۰ روزه" />
        <ChangeBadge value={coin.price_change_60d} label="۶۰ روزه" />
        <ChangeBadge value={coin.price_change_1y} label="۱ ساله" />
        <ChangeBadge value={coin.ath_change_percentage} label="از ATH" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
            <Activity size={16} />
            <span className="text-sm font-medium">بازه ۲۴ ساعته</span>
          </div>
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-red-400">کمترین</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">
                ${coin.low_24h.toLocaleString()}
              </span>
            </div>
            <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-red-400 to-emerald-400 mx-2 self-center" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-emerald-400">بیشترین</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">
                ${coin.high_24h.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
            <BarChart3 size={16} />
            <span className="text-sm font-medium">ارزش بازار</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCompact(coin.market_cap)}
          </p>
          {coin.fdv && (
            <p className="text-xs text-gray-400 mt-1">
              FDV: {formatCompact(coin.fdv)}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
            <Layers size={16} />
            <span className="text-sm font-medium">عرضه</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatSupply(coin.circulating_supply)}
          </p>
          {supplyPercent && (
            <div className="mt-2">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>گردش</span>
                <span>{supplyPercent}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${supplyPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
            <Calendar size={16} />
            <span className="text-sm font-medium">حجم ۲۴ ساعته</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCompact(coin.total_volume)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            ATH: ${coin.ath.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
            <ThumbsUp size={16} />
            <span className="text-sm font-medium">احساسات جامعه</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-500">مثبت {coin.sentiment_up}%</span>
                <span className="text-red-500">منفی {coin.sentiment_down}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${coin.sentiment_up}%` }}
                />
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${coin.sentiment_down}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
            <Hash size={16} />
            <span className="text-sm font-medium">مشخصات</span>
          </div>
          <div className="space-y-2 text-sm">
            {coin.hashing_algorithm && (
              <div className="flex justify-between">
                <span className="text-gray-400">الگوریتم</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {coin.hashing_algorithm}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">کمترین تاریخی</span>
              <span className="text-gray-900 dark:text-white font-mono">
                ${coin.atl.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">تاریخ ATL</span>
              <span className="text-gray-900 dark:text-white text-xs">
                {new Date(coin.atl_date).toLocaleDateString("fa-IR")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {coin.description && (
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            درباره {coin.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
            {coin.description}
          </p>
        </div>
      )}

      {coin.categories.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            دسته‌بندی‌ها
          </h3>
          <div className="flex flex-wrap gap-2">
            {coin.categories.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
          <Globe size={16} />
          <span className="text-sm font-medium">لینک‌ها</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {coin.homepage.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              وبسایت
              <ExternalLink size={10} />
            </a>
          ))}
          {coin.blockchain_site.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              اکسپلورر
              <ExternalLink size={10} />
            </a>
          ))}
          {coin.subreddit_url && (
            <a
              href={coin.subreddit_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Reddit
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
