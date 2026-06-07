import { Heart, Sparkles } from "lucide-react";

export default function HeartHint() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-pink-200 bg-gradient-to-br from-pink-50 via-white to-rose-50 p-5 text-sm text-pink-900 shadow-lg dark:border-pink-800/50 dark:from-pink-950/50 dark:via-slate-900 dark:to-rose-950/50 dark:text-pink-100">
      <div className="absolute inset-0 overflow-hidden">
        <Heart
          className="absolute -top-6 -right-6 h-32 w-32 text-pink-200/40 dark:text-pink-500/15 animate-pulse"
          fill="currentColor"
        />

        <Heart
          className="absolute -bottom-10 -left-8 h-40 w-40 text-rose-200/40 dark:text-rose-500/15 animate-pulse"
          fill="currentColor"
          style={{ animationDelay: "1s" }}
        />

        <Heart
          className="absolute top-1/2 right-1/4 h-20 w-20 text-pink-300/30 dark:text-pink-400/10 animate-pulse"
          fill="currentColor"
          style={{ animationDelay: "2s" }}
        />

        <div className="absolute top-0 left-0 h-40 w-40 rounded-full bg-pink-300/20 blur-3xl dark:bg-pink-600/10" />
        <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-rose-300/20 blur-3xl dark:bg-rose-600/10" />
      </div>

      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 animate-pulse">
          <Heart className="h-6 w-6" fill="currentColor" />
        </div>

        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-500 dark:text-pink-400" />
            <span className="font-semibold text-pink-600 dark:text-pink-300">
              یادآوری دوستانه
            </span>
          </div>

          <p className="leading-7">
            حتما قبل از انجام هر گونه معامله با شریک عاطفی خود و{" "}
            <span className="font-bold text-pink-600 dark:text-pink-300">
              آوا
            </span>{" "}
            درون خود مشورت کنید. ❤️ او بیشتر از هر کسی به نفع شما فکر می‌کند.
          </p>
        </div>
      </div>
    </div>
  );
}
