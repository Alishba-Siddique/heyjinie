// src/components/page-ui/events_page/calendar-views/CalendarSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export const CalendarSkeleton = () => (
  <div className="grid grid-cols-7 gap-4">
    {Array.from({ length: 7 }).map((_, index) => (
      <div key={index} className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    ))}
  </div>
);