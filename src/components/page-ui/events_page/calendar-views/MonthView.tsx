import { Event } from '../types';

interface MonthViewProps {
  events: Event[];
  selectedDate: Date;
  onEventClick: (event: Event) => void;
}

export const MonthView = ({ events, selectedDate, onEventClick }: MonthViewProps) => {
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - startingDay + 1;
    const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
    const date = new Date(currentYear, currentMonth, dayNumber);
    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.start_datetime);
      return (
        eventDate.getDate() === dayNumber &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });

    return { dayNumber, isCurrentMonth, events: dayEvents, date };
  });

  return (
    <div className="overflow-x-auto">
      <div className="w-full min-w-[500px]">
        <div className="grid grid-cols-7 gap-4 mb-4">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="text-center font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              className={`h-24 p-2 ${
                day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } relative ${
                day.events.length > 0
                  ? 'border-2 border-blue-200'
                  : 'border border-gray-100'
              } rounded-lg`}
            >
              <span
                className={`${
                  day.events.length > 0
                    ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center'
                    : !day.isCurrentMonth
                    ? 'text-gray-400'
                    : ''
                }`}
              >
                {day.isCurrentMonth ? day.dayNumber : ''}
              </span>
              {day.events.map((event, i) => (
                <div
                  key={i}
                  onClick={() => onEventClick(event)}
                  className="text-xs mt-1 truncate cursor-pointer rounded px-1"
                  style={{ backgroundColor: event.color }}
                >
                  {event.event_name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};