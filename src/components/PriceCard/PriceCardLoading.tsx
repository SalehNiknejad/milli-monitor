import { PriceCardSkeleton } from "../Skeleton/SkeletonLoader";

const PriceCardLoading: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <PriceCardSkeleton />
      <PriceCardSkeleton />
      <PriceCardSkeleton />
    </div>
  );
};
export default PriceCardLoading;
