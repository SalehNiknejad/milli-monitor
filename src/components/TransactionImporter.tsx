import { useState } from "react";
import { Upload } from "lucide-react";
import { usePortfolioStore } from "../store/portfolioStore";
import { parseApiTransaction } from "../../src/utils/transactionParser";

export default function TransactionImporter() {
  const [text, setText] = useState("");

  const addTransaction = usePortfolioStore((state) => state.addTransaction);

  const handleImport = async () => {
    try {
      const matches = text.match(/\{[\s\S]*?\}(?=\s*\{|$)/g);

      if (!matches) {
        throw new Error("No JSON found");
      }

      const transactions = matches.map((m) =>
        parseApiTransaction(JSON.parse(m)),
      );

      for (const t of transactions) {
        await addTransaction(t);
      }

      setText("");
      alert(`${transactions.length} تراکنش وارد شد 🚀`);
    } catch (e) {
      alert("فرمت ورودی خراب است ❌");
    }
  };
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-lg">
      <div className="mb-5 flex items-center gap-2">
        <Upload className="text-gold-500" size={24} />
        <h3 className="text-xl font-bold dark:text-white">ایمپورت تراکنش‌ها</h3>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        placeholder="JSON را اینجا paste کنید..."
        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
      />

      <button
        onClick={handleImport}
        disabled={!text.trim()}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-4 py-3 font-semibold text-white transition hover:bg-gold-600 disabled:opacity-50"
      >
        <Upload size={20} />
        ایمپورت تراکنش‌ها
      </button>
    </div>
  );
}
