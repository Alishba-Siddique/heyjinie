// src/components/page-ui/events_page/calendar-views/WeekView.tsx
import { Event } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfWeek, addDays } from 'date-fns';

interface WeekViewProps {
  events: Event[];
  selectedDate: Date;
  onEventClick: (event: Event) => void;
  onDateChange?: (newDate: Date) => void;
}

export const WeekView = ({ 
  events, 
  selectedDate, 
  onEventClick,
  onDateChange 
}: WeekViewProps) => {
  // Get the start of the week (Monday)
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  
  // Format for displaying the week range
  const weekRangeText = `${format(weekStart, 'MMM d')} - ${format(
    addDays(weekStart, 6),
    'MMM d, yyyy'
  )}`;

  // Navigate to previous/next week
  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    onDateChange?.(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    onDateChange?.(newDate);
  };

  const getEventsForDay = (date: Date) => {
    const normalizedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    
    return events.filter((event) => {
      const start = new Date(event.start_datetime);
      const end = new Date(event.end_datetime);
      const startDate = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
      );
      const endDate = new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate()
      );
      return normalizedDate >= startDate && normalizedDate <= endDate;
    });
  };

  return (
    <div className="space-y-4">
      {/* Navigation controls */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrevWeek}
          className="text-gray-600"
        >
          <ChevronLeft size={16} className="mr-1" /> Prev
        </Button>
        
        <h3 className="text-md font-medium">{weekRangeText}</h3>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNextWeek}
          className="text-gray-600"
        >
          Next <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>

      {/* Week grid */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 md:gap-4 min-w-[650px]">
          {Array.from({ length: 7 }).map((_, dayIndex) => {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + dayIndex);
            const dayName = format(date, 'EEE');
            const dayNumber = format(date, 'd');
            const eventsForDay = getEventsForDay(date);
            
            return (
              <div key={dayIndex} className="flex flex-col">
                <div className="text-center py-2">
                  <div className="font-medium text-gray-600">{dayName}</div>
                  <div className="text-xl font-semibold">{dayNumber}</div>
                </div>
                
                <div className="border rounded-lg p-2 md:p-3 flex-1 bg-white overflow-y-auto h-[500px] md:h-[550px]">
                  {eventsForDay.length > 0 ? (
                    <div className="space-y-2">
                      {eventsForDay.map((event) => (
                        <div
                          key={event._id}
                          onClick={() => onEventClick(event)}
                          className="p-2 rounded shadow-sm cursor-pointer transition-colors hover:opacity-90 text-white"
                          style={{ backgroundColor: event.color || '#40A574' }}
                        >
                          <div className="font-medium text-sm truncate">{event.event_name}</div>
                          <div className="text-xs opacity-90">
                            {new Date(event.start_datetime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 h-full flex items-center justify-center">
                      No Events
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};