// src/components/page-ui/events_page/calendar-views/YearView.tsx
import { Event } from '../types';
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
}

export const YearView = ({ events, selectedDate, onEventClick }: YearViewProps) => {
  const months = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
      new Date(2022, i)
    )
  );
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const year = selectedDate.getFullYear();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {months.map((month, monthIndex) => {
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        
        return (
          <div key={month} className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">{month}</h3>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {daysOfWeek.map((day, i) => (
                <div key={i} className="text-center text-gray-500">
                  {day}
                </div>
              ))}
              
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

                const latestEvent = eventsForDay[0];

                return (
                  <div key={dayIndex} className="text-center p-1 relative">
                    <TooltipProvider>
                      {eventsForDay.length > 0 ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              onClick={() => latestEvent && onEventClick(latestEvent)}
                              className="w-6 h-6 rounded-full flex items-center justify-center mx-auto cursor-pointer"
                              style={{
                                border: `2px solid ${latestEvent?.color || 'transparent'}`,
                              }}
                            >
                              {dayNumber}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              {eventsForDay.map((event) => (
                                <div
                                  key={event._id}
                                  className="text-xs cursor-pointer"
                                  style={{ color: event.color }}
                                  onClick={() => onEventClick(event)}
                                >
                                  {event.event_name}
                                  <br />
                                  {new Date(event.start_datetime).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </div>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center mx-auto">
                          {dayNumber}
                        </div>
                      )}
                    </TooltipProvider>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
