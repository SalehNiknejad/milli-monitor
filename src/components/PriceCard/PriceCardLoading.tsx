import { Coins } from "lucide-react";

const PriceCardLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="inline-block animate-spin">
          <Coins size={48} className="text-gold-500 mb-4" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          در حال بارگذاری قیمت‌ها...
        </p>
      </div>
    </div>
  );
};
export default PriceCardLoading;
