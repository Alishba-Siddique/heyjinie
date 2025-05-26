// src/components/page-ui/events_page/calendar-views/CalendarSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export const CalendarSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Navigation skeleton */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>

      {/* Calendar skeleton */}
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="flex flex-col">
            <Skeleton className="h-14 w-full mb-2" />
            <Skeleton className="h-[500px] w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
};