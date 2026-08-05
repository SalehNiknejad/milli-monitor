import { useLocalStorage } from "./useLocalStorage";

/**
 * Custom hook for managing app-wide settings
 */
export function useAppSettings() {
  const [darkMode, setDarkMode] = useLocalStorage("milli:darkMode", true);
  const [alertPrice, setAlertPrice] = useLocalStorage<number | null>(
    "milli:alertPrice",
    null,
  );
  const [alertDirection, setAlertDirection] = useLocalStorage<
    "above" | "below"
  >("milli:alertDirection", "above");
  const [installStatus, setInstallStatus] = useLocalStorage(
    "milli:installStatus",
    "",
  );

  return {
    darkMode,
    setDarkMode,
    alertPrice,
    setAlertPrice,
    alertDirection,
    setAlertDirection,
    installStatus,
    setInstallStatus,
  };
}
