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
