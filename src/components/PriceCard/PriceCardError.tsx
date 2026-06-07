import { AlertCircle } from "lucide-react";

const PriceCardError: React.FC<{ error: string }> = ({ error }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
      <AlertCircle size={24} className="text-red-500" />
      <p className="text-red-800 dark:text-red-200">{error}</p>
    </div>
  );
};
export default PriceCardError;
