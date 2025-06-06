// src/components/page-ui/events_page/calendar-views/MonthView.tsx
import { Event } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';

interface MonthViewProps {
  events: Event[];
  selectedDate: Date;
  onEventClick: (event: Event) => void;
  onDateChange?: (newDate: Date) => void;
}

export const MonthView = ({ 
  events, 
  selectedDate, 
  onEventClick,
  onDateChange 
}: MonthViewProps) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const daysToDisplay = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get starting day of week for the month (0-6, where 0 is Sunday)
  const startDay = monthStart.getDay();
  
  // Adjust for Monday start (transform Sunday from 0 to 6)
  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;
  
  // Navigate to previous/next month
  const handlePrevMonth = () => {
    onDateChange?.(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange?.(addMonths(selectedDate, 1));
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_datetime);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Navigation controls */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrevMonth}
          className="text-gray-600"
        >
          <ChevronLeft size={16} className="mr-1" /> Prev
        </Button>
        
        <h3 className="text-lg font-medium">
          {format(selectedDate, 'MMMM yyyy')}
        </h3>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNextMonth}
          className="text-gray-600"
        >
          Next <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before first day of month */}
          {Array.from({ length: adjustedStartDay }).map((_, index) => (
            <div key={`empty-start-${index}`} className="h-24 p-1 bg-gray-50 rounded-md"></div>
          ))}

          {/* Days of the month */}
          {daysToDisplay.map((date) => {
            const dayEvents = getEventsForDate(date);
            const isToday = new Date().toDateString() === date.toDateString();
            
            return (
              <div 
                key={date.toString()}
                className={`h-24 p-1 ${
                  isToday ? 'bg-blue-50 border border-blue-200' : 'bg-white border border-gray-100'
                } rounded-md overflow-hidden`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${isToday ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                    {format(date, 'd')}
                  </span>
                  {dayEvents.length > 3 && (
                    <span className="text-xs bg-gray-200 px-1 rounded-full">
                      {dayEvents.length}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1 overflow-y-auto max-h-[calc(100%-20px)]">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event._id}
                      onClick={() => onEventClick(event)}
                      className="text-xs py-1 px-1 truncate cursor-pointer rounded-sm text-white"
                      style={{ backgroundColor: event.color || '#40A574' }}
                    >
                      {event.event_name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {/* Empty cells after last day of month */}
          {Array.from({ length: 42 - daysToDisplay.length - adjustedStartDay }).map((_, index) => (
            <div key={`empty-end-${index}`} className="h-24 p-1 bg-gray-50 rounded-md"></div>
          ))}
        </div>
      </div>
    </div>
  );
};