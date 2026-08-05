/\*\*

- مثال استفاده از SkeletonLoader در PriceCard
-
- برای استفاده این فایل را در PriceCard.tsx اصلاح کنید
  \*/

import { PriceCardSkeleton, SummaryCardSkeleton } from "../Skeleton/SkeletonLoader";

// Example 1: استفاده در PriceCard Loading State
export function PriceCardExample() {
const { price, loading } = { price: null, loading: true }; // Mock

if (loading) {
return <PriceCardSkeleton />;
}

return (
<div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
{/_ Price Card Content _/}
</div>
);
}

// Example 2: استفاده در PortfolioSummary
export function PortfolioSummaryExample() {
const { data, loading } = { data: null, loading: true }; // Mock

if (loading) {
return <SummaryCardSkeleton />;
}

return (
<div className="grid grid-cols-2 gap-4">
{/_ Summary Content _/}
</div>
);
}

/\*\*

- Implementation steps:
-
- 1.  ✅ حالا می‌تونی در هر component جایی که loading state داری
- به جای صفحه خالی یا null یک Skeleton نمایش بدی
-
- 2.  ✅ Toast notifications اضافه شده - جای alert() استفاده کن:
- showToast("عنوان", "پیام", "success", "✨")
-
- 3.  ✅ Animations جدید اضافه شدند:
- - animate-slide-in: برای Toast notifs
- - animate-fade-in: برای fade effects
- - animate-scale-in: برای pop effects
- - animate-bounce-in: برای bounce effects
-
- 4.  ✅ Custom Hooks برای تمیز کردن App.tsx
- - useLocalStorage: localStorage management
- - useAppSettings: app settings
- - useAssetState: asset-specific state
- - useRouting: routing logic
- - useToast: toast notifications
    \*/
