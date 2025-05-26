// src/components/page-ui/events_page/calendar-views/YearView.tsx
import { Event } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface YearViewProps {
  events: Event[];
  selectedDate: Date;
  onEventClick: (event: Event) => void;
  onDateChange?: (newDate: Date) => void;
}

export const YearView = ({ 
  events, 
  selectedDate, 
  onEventClick,
  onDateChange 
}: YearViewProps) => {
  const year = selectedDate.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(year, i)
  );
  
  // Navigate to previous/next year
  const handlePrevYear = () => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year - 1);
    onDateChange?.(newDate);
  };

  const handleNextYear = () => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year + 1);
    onDateChange?.(newDate);
  };

  const getMonthEventsCount = (monthIndex: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_datetime);
      return eventDate.getMonth() === monthIndex && eventDate.getFullYear() === year;
    }).length;
  };

  return (
    <div className="space-y-4">
      {/* Navigation controls */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrevYear}
          className="text-gray-600"
        >
          <ChevronLeft size={16} className="mr-1" /> {year - 1}
        </Button>
        
        <h3 className="text-xl font-medium">{year}</h3>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNextYear}
          className="text-gray-600"
        >
          {year + 1} <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>

      {/* Months grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {months.map((month, monthIndex) => {
          const monthName = month.toLocaleString('default', { month: 'long' });
          const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
          const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
          // Adjust for Monday as first day (0 = Monday, 6 = Sunday)
          const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
          
          // Count events for the month
          const eventsCount = getMonthEventsCount(monthIndex);
          
          return (
            <div 
              key={monthName} 
              className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{monthName}</h3>
                {eventsCount > 0 && (
                  <span className="text-xs bg-[#52be8a6d]  px-2 py-0.5 rounded-full">
                    {eventsCount} event{eventsCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-xs">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className="text-center text-gray-500 mb-1">
                    {day}
                  </div>
                ))}
                
                {/* Empty cells for days before the 1st */}
                {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="text-center p-1"></div>
                ))}
                
                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                  const dayNumber = dayIndex + 1;
                  const date = new Date(year, monthIndex, dayNumber);
                  const eventsForDay = events.filter((event) => {
                    const eventDate = new Date(event.start_datetime);
                    return (
                      eventDate.getDate() === dayNumber &&
                      eventDate.getMonth() === monthIndex &&
                      eventDate.getFullYear() === year
                    );
                  });

                  return (
                    <TooltipProvider key={dayIndex}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={`
                              text-center p-1 w-full h-7 flex items-center justify-center
                              ${eventsForDay.length > 0 ? 'cursor-pointer' : ''}
                              ${
                                date.toDateString() === new Date().toDateString() 
                                  ? 'bg-blue-100 rounded font-bold' 
                                  : ''
                              }
                            `}
                            onClick={() => eventsForDay[0] && onEventClick(eventsForDay[0])}
                          >
                            <span 
                              className={`
                                w-6 h-6 rounded-full flex items-center justify-center
                                ${eventsForDay.length > 0 ? ' ring-offset-1 ring-[#40A574]' : ''}
                              `}
                              style={{
                                border: eventsForDay.length > 0 
                                  ? `2px solid ${eventsForDay[0]?.color || '#40A574'}` 
                                  : undefined,
                              }}
                            >
                              {dayNumber}
                            </span>
                          </div>
                        </TooltipTrigger>
                        
                        {eventsForDay.length > 0 && (
                          <TooltipContent>
                            <div className="space-y-1 p-1">
                              {eventsForDay.map((event) => (
                                <div
                                  key={event._id}
                                  className="text-xs py-1 px-2 rounded cursor-pointer"
                                  style={{ 
                                    backgroundColor: event.color || '#40A574',
                                    color: 'white' 
                                  }}
                                  onClick={() => onEventClick(event)}
                                >
                                  {event.event_name}
                                </div>
                              ))}
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};