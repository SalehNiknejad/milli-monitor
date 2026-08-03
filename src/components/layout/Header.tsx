import { Moon, Sun, Menu, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";

type Props = {
  onInstallStatusChange?: (status: string) => void;
  onDarkModeChange?: (value: boolean) => void;
  onInstallAvailableChange?: (available: boolean) => void;
  assetConfig?: any;
  isUsdtRoute?: boolean;
  isCryptoRoute?: boolean;
  currentRoute?: "gold" | "usdt" | "crypto";
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
  isCryptoRoute,
  currentRoute,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
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
            {/* Desktop navigation: two buttons for the other pages */}
            <nav className="hidden md:flex items-center gap-2">
              {(["gold", "usdt", "crypto"] as const)
                .filter((r) => r !== currentRoute)
                .map((route) => (
                  <a
                    key={route}
                    href={`/${route === "usdt" ? "USDT" : route}`}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      route === "gold"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200"
                        : route === "usdt"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 hover:bg-emerald-200"
                          : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-200"
                    }`}
                  >
                    {route === "gold"
                      ? "طلا"
                      : route === "usdt"
                        ? "تتر"
                        : "کریپتو"}
                  </a>
                ))}
            </nav>

            {/* Mobile menu button */}
            <div className="relative md:hidden" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {menuOpen ? (
                  <X size={24} className="text-gray-700 dark:text-gray-200" />
                ) : (
                  <Menu
                    size={24}
                    className="text-gray-700 dark:text-gray-200"
                  />
                )}
              </button>
              {menuOpen && (
                <div className="absolute left-0 top-full mt-2 w-44 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  {(["gold", "usdt", "crypto"] as const).map((route) => (
                    <a
                      key={route}
                      href={`/${route === "usdt" ? "USDT" : route}`}
                      className={`block px-4 py-3 text-sm font-medium transition-colors ${
                        route === currentRoute
                          ? route === "gold"
                            ? "bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 font-bold underline"
                            : route === "usdt"
                              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 font-bold underline"
                              : "bg-indigo-50 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 font-bold underline"
                          : route === "gold"
                            ? "bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                            : route === "usdt"
                              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                              : "bg-indigo-50 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                      }`}
                    >
                      {route === "gold"
                        ? "طلا"
                        : route === "usdt"
                          ? "تتر"
                          : "کریپتو"}
                    </a>
                  ))}
                </div>
              )}
            </div>
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
