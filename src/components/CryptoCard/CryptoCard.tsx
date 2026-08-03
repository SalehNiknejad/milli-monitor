import { TrendingUp, TrendingDown, Activity, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { CoinData } from "../../services/cryptoApi";

interface CryptoCardProps {
  coin: CoinData;
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

export default function CryptoCard({ coin }: CryptoCardProps) {
  const isPositive = coin.price_change_percentage_24h >= 0;
  const supplyPercent =
    coin.max_supply && coin.max_supply > 0
      ? ((coin.circulating_supply / coin.max_supply) * 100).toFixed(1)
      : null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 p-4 transition-transform hover:scale-[1.02] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
              {coin.name}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
              {coin.symbol} • #{coin.market_cap_rank}
            </span>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${
            isPositive
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </div>
      </div>

      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        ${coin.current_price.toLocaleString()}
      </p>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-2 min-w-0">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-0.5">
            <Activity size={10} className="flex-shrink-0" />
            <span className="truncate">24h Range</span>
          </div>
          <div className="flex flex-col gap-0.5 text-gray-700 dark:text-gray-300 min-w-0">
            <div className="flex items-center gap-1 flex-wrap min-w-0">
              <ArrowDownRight size={10} className="text-red-400 flex-shrink-0" />
              <span className="truncate font-mono">${coin.low_24h.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap min-w-0">
              <ArrowUpRight size={10} className="text-emerald-400 flex-shrink-0" />
              <span className="truncate font-mono">${coin.high_24h.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-2">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-0.5">
            <BarChart3 size={10} />
            <span>Market Cap</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            {formatCompact(coin.market_cap)}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-2">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-0.5">
            <span>Volume 24h</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            {formatCompact(coin.total_volume)}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-2">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-0.5">
            <span>Supply</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            {formatSupply(coin.circulating_supply)}
            {supplyPercent && (
              <span className="text-gray-400 text-[10px] ml-1">
                ({supplyPercent}%)
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-[10px] text-gray-400">
        <span>ATH: ${coin.ath.toLocaleString()}</span>
        <span
          className={
            coin.ath_change_percentage >= 0
              ? "text-emerald-500"
              : "text-red-500"
          }
        >
          {coin.ath_change_percentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
