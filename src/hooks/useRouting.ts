import { useState, useEffect, useCallback, useMemo } from "react";

export interface RouteState {
  pathname: string;
  isCryptoRoute: boolean;
  isCryptoDetail: boolean;
  isUsdtRoute: boolean;
  cryptoDetailId: string | null;
  assetKey: "gold" | "crypto" | "usdt";
}

/**
 * Custom hook for managing routing logic
 */
export function useRouting(): RouteState & {
  navigateTo: (path: string) => void;
} {
  const [pathname, setPathname] = useState<string>(
    typeof window !== "undefined"
      ? window.location.pathname.toLowerCase()
      : "/",
  );

  useEffect(() => {
    const handler = () => setPathname(window.location.pathname.toLowerCase());
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const routeState = useMemo(() => {
    const cryptoDetailMatch = pathname.match(/^\/crypto\/(.+)$/);
    const isCryptoDetail = !!cryptoDetailMatch;
    const cryptoDetailId = cryptoDetailMatch?.[1] || null;
    const isCryptoRoute = pathname.startsWith("/crypto") && !isCryptoDetail;
    const isUsdtRoute =
      !isCryptoRoute && !isCryptoDetail && pathname.startsWith("/usdt");
    const assetKey: "gold" | "crypto" | "usdt" =
      isCryptoRoute || isCryptoDetail
        ? "crypto"
        : isUsdtRoute
          ? "usdt"
          : "gold";

    return {
      pathname,
      isCryptoRoute,
      isCryptoDetail,
      isUsdtRoute,
      cryptoDetailId,
      assetKey,
    };
  }, [pathname]);

  const navigateTo = useCallback((path: string) => {
    window.history.pushState(null, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  return {
    ...routeState,
    navigateTo,
  };
}
