// src/components/page-ui/events_page/calendar-views/OccasionView.tsx
import { Event } from '../types';

interface OccasionViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export const OccasionView = ({ events, onEventClick }: OccasionViewProps) => {
  const groupedEvents = events.reduce<Record<string, Event[]>>(
    (acc, event) => {
      const type = event.event_name || 'Other';
      if (!acc[type]) acc[type] = [];
      acc[type].push(event);
      return acc;
    },
    {}
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(groupedEvents).map(([type, events]) => (
        <div key={type} className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4 flex items-center">
            <span className="text-xl mr-2">
              {events[0]?.personalize_id?.icon_path ? (
                <img
                  src={events[0].personalize_id.icon_path}
                  alt="icon"
                  className="w-6 h-6"
                />
              ) : (
                '📅'
              )}
            </span>
            {type}
          </h3>
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event._id}
                onClick={() => onEventClick(event)}
                className="p-2 rounded-lg text-sm cursor-pointer transition-colors hover:opacity-90"
                style={{ backgroundColor: event.color }}
              >
                <div className="font-medium">{event.sender_name}</div>
                <div className="text-gray-600">
                  {new Date(event.start_datetime).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};