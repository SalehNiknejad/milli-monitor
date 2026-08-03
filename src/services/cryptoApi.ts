export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  market_cap_rank: number;
}

const COINS = [
  "bitcoin",
  "ethereum",
  "solana",
  "ripple",
  "cardano",
  "dogecoin",
];

export async function fetchCryptoPrices(): Promise<CoinData[]> {
  const ids = COINS.join(",");
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch crypto prices");

  return res.json();
}

export interface CoinSearchResult {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large: string;
}

export async function searchCoins(query: string): Promise<CoinSearchResult[]> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`,
  );
  if (!res.ok) throw new Error("Failed to search coins");
  const data = await res.json();
  return (data.coins || []).slice(0, 10);
}

export interface CoinDetailData extends CoinData {
  description: string;
  homepage: string[];
  blockchain_site: string[];
  subreddit_url: string;
  hashing_algorithm: string | null;
  categories: string[];
  sentiment_up: number;
  sentiment_down: number;
  total_supply: number | null;
  price_change_7d: number;
  price_change_14d: number;
  price_change_30d: number;
  price_change_60d: number;
  price_change_1y: number;
  atl: number;
  atl_date: string;
  fdv: number | null;
}

const detailCache = new Map<string, { data: CoinDetailData; ts: number }>();
const DETAIL_CACHE_TTL = 5 * 60 * 1000;

export async function fetchCoinDetail(id: string): Promise<CoinDetailData> {
  const cached = detailCache.get(id);
  if (cached && Date.now() - cached.ts < DETAIL_CACHE_TTL) return cached.data;

  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`,
  );
  if (!res.ok) throw new Error("Failed to fetch coin detail");
  const d = await res.json();
  const md = d.market_data;
  const result: CoinDetailData = {
    id: d.id,
    symbol: d.symbol,
    name: d.name,
    current_price: md.current_price.usd,
    price_change_percentage_24h: md.price_change_percentage_24h,
    image: d.image.large,
    market_cap: md.market_cap.usd,
    total_volume: md.total_volume.usd,
    high_24h: md.high_24h.usd,
    low_24h: md.low_24h.usd,
    circulating_supply: md.circulating_supply,
    max_supply: md.max_supply,
    ath: md.ath.usd,
    ath_change_percentage: md.ath_change_percentage.usd,
    market_cap_rank: d.market_cap_rank,
    description: (d.description?.en || "").replace(/<[^>]*>/g, ""),
    homepage: d.links?.homepage?.filter(Boolean) || [],
    blockchain_site: d.links?.blockchain_site?.filter(Boolean) || [],
    subreddit_url: d.links?.subreddit_url || "",
    hashing_algorithm: d.hashing_algorithm || null,
    categories: d.categories || [],
    sentiment_up: d.sentiment_votes_up_percentage ?? 0,
    sentiment_down: d.sentiment_votes_down_percentage ?? 0,
    total_supply: md.total_supply,
    price_change_7d: md.price_change_percentage_7d_in_currency?.usd ?? 0,
    price_change_14d: md.price_change_percentage_14d_in_currency?.usd ?? 0,
    price_change_30d: md.price_change_percentage_30d_in_currency?.usd ?? 0,
    price_change_60d: md.price_change_percentage_60d_in_currency?.usd ?? 0,
    price_change_1y: md.price_change_percentage_1y_in_currency?.usd ?? 0,
    atl: md.atl.usd,
    atl_date: md.atl_date.usd,
    fdv: md.fully_diluted_valuation?.usd ?? null,
  };
  detailCache.set(id, { data: result, ts: Date.now() });
  return result;
}
