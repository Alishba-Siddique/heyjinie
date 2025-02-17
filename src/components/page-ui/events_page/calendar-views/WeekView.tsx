// src/components/page-ui/events_page/calendar-views/WeekView.tsx
import { Event } from '../types';

interface WeekViewProps {
  events: Event[];
  selectedDate: Date;
  onEventClick: (event: Event) => void;
}

export const WeekView = ({ events, selectedDate, onEventClick }: WeekViewProps) => {
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

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
    <div className="overflow-x-auto">
      <div className="grid grid-cols-7 gap-4 min-w-[700px]">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center font-medium">
            {day}
          </div>
        ))}
        
        {Array.from({ length: 7 }).map((_, dayIndex) => {
          const date = new Date(selectedDate);
          date.setDate(date.getDate() + dayIndex);
          const eventsForDay = getEventsForDay(date);
          
          return (
            <div key={dayIndex} className="border rounded-lg p-4 min-h-[600px]">
              <div className="text-right mb-2 font-semibold">
                {date.getDate()}
              </div>
              
              {eventsForDay.length > 0 ? (
                eventsForDay.map((event) => (
                  <div
                    key={event._id}
                    onClick={() => onEventClick(event)}
                    className="mb-2 p-2 rounded shadow-sm cursor-pointer transition-colors hover:opacity-90"
                    style={{ backgroundColor: event.color }}
                  >
                    <div className="font-medium">{event.event_name}</div>
                    <div className="text-xs">
                      {new Date(event.start_datetime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' - '}
                      {new Date(event.end_datetime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-400">No Events</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};