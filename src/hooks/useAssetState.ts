import { useLocalStorage } from "./useLocalStorage";

/**
 * Custom hook for managing asset-specific state
 */
export function useAssetState(assetKey: string) {
  // Try new asset-specific key first, fall back to old generic key for migration
  const storedWallet =
    typeof window !== "undefined"
      ? window.localStorage.getItem(`milli:walletBalance:${assetKey}`) ||
        window.localStorage.getItem("milli:walletBalance")
      : null;

  const storedAsset =
    typeof window !== "undefined"
      ? window.localStorage.getItem(`milli:assetHolding:${assetKey}`) ||
        window.localStorage.getItem("milli:totalGold")
      : null;

  const [walletBalance, setWalletBalance] = useLocalStorage(
    `milli:walletBalance:${assetKey}`,
    storedWallet ? Number(storedWallet) : 0,
  );

  const [assetHolding, setAssetHolding] = useLocalStorage(
    `milli:assetHolding:${assetKey}`,
    storedAsset ? Number(storedAsset) : 0,
  );

  return {
    walletBalance,
    setWalletBalance,
    assetHolding,
    setAssetHolding,
  };
}
