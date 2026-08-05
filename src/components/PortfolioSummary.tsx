import {
  Wallet,
  Coins,
  TrendingUp,
  BarChart3,
  Edit2,
  Check,
  X,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { formatToman } from "../utils/currency";
import { PortfolioSummarySkeleton } from "./Skeleton/SkeletonLoader";

interface Props {
  currentPriceRial: number;
  walletBalance: number;
  totalGold: number;
  onWalletChange: (value: number) => void;
  onGoldChange: (value: number) => void;
  assetLabel?: string;
  assetKey?: string;
  loading?: boolean;
}

export default function PortfolioSummary({
  currentPriceRial,
  walletBalance,
  totalGold,
  onWalletChange,
  onGoldChange,
  assetLabel,
  loading = false,
}: Props) {
  if (loading) {
    return <PortfolioSummarySkeleton />;
  }
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [walletInput, setWalletInput] = useState(walletBalance.toString());
  const [goldInput, setGoldInput] = useState(totalGold.toString());

  const handleWalletSave = () => {
    const value = parseFloat(walletInput) || 0;
    onWalletChange(value);
    setEditingCard(null);
  };

  const handleGoldSave = () => {
    const value = parseFloat(goldInput) || 0;
    onGoldChange(value);
    setEditingCard(null);
  };

  const handleCancel = () => {
    setWalletInput(walletBalance.toString());
    setGoldInput(totalGold.toString());
    setEditingCard(null);
  };

  // محاسبه ارزش دارایی در واحدهای درست
  const goldAssetValueRial = totalGold * currentPriceRial;
  const goldAssetValueToman = goldAssetValueRial / 10;
  const totalAssetValueToman = goldAssetValueToman + walletBalance;

  const cards = [
    {
      title: "موجودی کیف پول",
      value: walletBalance,
      icon: Wallet,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      editable: true,
      key: "wallet",
      onSave: handleWalletSave,
      inputValue: walletInput,
      onInputChange: setWalletInput,
      unit: "toman",
    },
    {
      title: `موجودی ${assetLabel}`,
      value: totalGold,
      icon: assetLabel === "تتر" ? DollarSign : Coins,
      color: assetLabel === "تتر" ? "text-emerald-500" : "text-gold-500",
      bg: assetLabel === "تتر" ? "bg-emerald-500/10" : "bg-yellow-500/10",
      editable: true,
      key: "gold",
      onSave: handleGoldSave,
      inputValue: goldInput,
      onInputChange: setGoldInput,
      unit: "unit",
    },
    {
      title: `ارزش ${assetLabel}`,
      value: goldAssetValueRial,
      icon: BarChart3,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      editable: false,
      key: "goldAsset",
      unit: "rial",
    },
    {
      title: "ارزش کل دارایی",
      value: totalAssetValueToman,
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
      editable: false,
      key: "totalAsset",
      unit: "toman",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isEditing = editingCard === (card as any).key;

        return (
          <div
            key={(card as any).key}
            className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-lg"
          >
            <div
              className={`absolute top-0 right-0 h-24 w-24 rounded-full blur-3xl ${card.bg}`}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {card.title}
                </p>
                {card.editable && !isEditing && (
                  <button
                    onClick={() => setEditingCard((card as any).key)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <Edit2 size={14} className="text-gray-400" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={(card as any).inputValue}
                      onChange={(e) =>
                        (card as any).onInputChange(e.target.value)
                      }
                      className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(card as any).onSave}
                      className="flex-1 px-2 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <Check size={14} /> ذخیره
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-2 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded transition-colors flex items-center justify-center"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold dark:text-white">
                    {card.unit === "rial"
                      ? formatToman(card.value)
                      : card.value.toLocaleString("fa-IR")}
                    {card.unit === "unit" ? ` ${assetLabel}` : " تومان"}
                  </h3>

                  <div className={`rounded-xl p-3 ${card.bg}`}>
                    <Icon className={card.color} size={20} />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
