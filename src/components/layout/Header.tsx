import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  onInstallStatusChange?: (status: string) => void;
  onDarkModeChange?: (value: boolean) => void;
  onInstallAvailableChange?: (available: boolean) => void;
  assetConfig?: any;
  isUsdtRoute?: boolean;
};

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  }
}

const Header: React.FC<Props> = ({
  onInstallStatusChange,
  onDarkModeChange,
  assetConfig,
  isUsdtRoute,
}) => {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("milli:darkMode") === "true";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    try {
      localStorage.setItem("milli:darkMode", String(darkMode));
    } catch {}

    onDarkModeChange?.(darkMode);
  }, [darkMode]);

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      event.preventDefault();
      setDeferredPrompt(promptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      onDarkModeChange?.(next);
      return next;
    });
  };

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    const status =
      choiceResult.outcome === "accepted"
        ? "نصب برنامه انجام شد."
        : "نصب لغو شد.";

    onInstallStatusChange?.(status);

    setDeferredPrompt(null);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md glass-effect border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{assetConfig.icon}</div>
            <div>
              <h1
                className={`text-2xl font-bold bg-gradient-to-r ${assetConfig.accent} bg-clip-text text-transparent`}
              >
                {assetConfig.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {assetConfig.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={isUsdtRoute ? "/gold" : "/USDT"}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${assetConfig.pill}`}
            >
              {isUsdtRoute ? "ارزش طلا" : "ارزش تتر"}
            </a>
            {deferredPrompt ? (
              <button
                onClick={handleInstallApp}
                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors"
              >
                نصب PWA
              </button>
            ) : null}
            <button
              onClick={handleToggleDarkMode}
              className="p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={darkMode ? "تغییر به حالت روز" : "تغییر به حالت شب"}
            >
              {darkMode ? (
                <Sun size={24} className="text-yellow-400" />
              ) : (
                <Moon size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
