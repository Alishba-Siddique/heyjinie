// src/components/page-ui/events_page/events_card.tsx
'use client';
import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';
import { format } from 'date-fns'; // Using date-fns for reliable formatting

// Define a clearer Event type for this card
interface EventCardData {
  _id: string;
  event_name: string;
  start_datetime: string;
  sender_name?: string;
  personalize_id?: {
    // Make personalize_id optional if it can be null from API
    _id?: string; // Allow _id to be optional inside personalize_id
    name?: string; // Allow name to be optional inside personalize_id
    icon_path?: string;
  };
  color?: string;
  note?: string;
}

interface EventCardProps {
  event: EventCardData;
  onNavigateToEventPage: (eventId: string) => void;
}

const EventCard = ({ event, onNavigateToEventPage }: EventCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  let eventDate: Date | null = null;
  let day: string | null = null;
  let month: string | null = null;

  try {
    eventDate = new Date(event.start_datetime);
    // Check if the date is valid before formatting
    if (!isNaN(eventDate.getTime())) {
      day = format(eventDate, 'd'); // Format day (e.g., 1, 15)
      month = format(eventDate, 'MMM').toUpperCase(); // Format month (e.g., JAN, FEB)
    } else {
      console.error(
        'Invalid date received for event:',
        event._id,
        event.start_datetime
      );
      // Provide fallback display or handle error
      day = '?';
      month = 'ERR';
    }
  } catch (e) {
    console.error('Error parsing date:', e);
    day = '?';
    month = 'ERR';
  }

  const handleClick = () => {
    setShowDetails(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click propagation to parent elements
    setShowDetails(false);
  };

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click propagation
    onNavigateToEventPage(event._id);
    setShowDetails(false); // Close modal after navigating
  };

  // Fallback icon if personalize_id or icon_path is missing
  // const fallbackIcon = <Calendar className="w-8 h-8 text-gray-600" />;
  const eventIcon = event.personalize_id?.icon_path ? (
    <img
      src={event.personalize_id.icon_path}
      alt={`${event.event_name} icon`} // Add alt text
      className="w-8 h-8 object-contain" // Use object-contain
    />
  ) : (
    // ) : fallbackIcon;
    '📅 '
  );

  return (
    <>
      {/* Event List Item */}
      <div
        className="flex items-center border bg-gray-50 hover:bg-gray-100 rounded-lg p-3 cursor-pointer transition-colors duration-150 ease-in-out"
        onClick={handleClick}
        role="button" // Add role for accessibility
        tabIndex={0} // Make it focusable
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()} // Keyboard interaction
      >
        {/* Date Display */}
        <div className="relative flex flex-col items-center justify-center w-14 h-14 bg-white text-gray-800 rounded-lg shadow flex-shrink-0">
          {/* Decorative Top Bar */}
          <div className="absolute -top-px left-0 right-0 h-1.5 bg-red-500 rounded-t-md flex justify-between px-1 items-center">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          {/* Date */}
          <span className="text-xl font-bold pt-2">{day ?? '?'}</span>
          <span className="text-xs font-medium pb-1">{month ?? '???'}</span>
        </div>

        {/* Event Info */}
        <div className="flex-1 ml-4 min-w-0">
          {' '}
          {/* Added min-w-0 for text truncation */}
          <div className="font-semibold text-sm truncate">
            {event.sender_name === 'Google' ? '' : `${event.sender_name}'s`}
          </div>
          {event.sender_name && (
            <div className="text-base font-bold truncate">
              {event.event_name}
            </div>
          )}
        </div>
        {/* Optional: Chevron or indicator */}
        {/* <ChevronRight className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" /> */}
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleClose} // Close modal on overlay click
        >
          {/* Stop propagation on Card click to prevent closing when clicking inside */}
          <Card
            className="w-full max-w-md relative animate-in fade-in-0 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close event details"
            >
              <X className="w-5 h-5" />
            </button>

            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                {eventIcon}
                {event.event_name}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    Date
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md text-gray-800">
                    {eventDate && !isNaN(eventDate.getTime())
                      ? format(eventDate, 'PPPP')
                      : 'Invalid Date'}{' '}
                    {/* Full date format */}
                  </div>
                </div>

                {event.sender_name && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      From
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md text-gray-800">
                      {event.sender_name}
                    </div>
                  </div>
                )}

                {event.note && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Note
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md text-gray-800 whitespace-pre-wrap">
                      {event.note}
                    </div>{' '}
                    {/* Preserve whitespace */}
                  </div>
                )}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleNavigate}
                    // Use a more descriptive color or default button style
                    className="bg-[#40A574] text-white hover:bg-[#40A574] rounded-full px-4 py-2 transition-colors"
                    size="sm"
                  >
                    View in Calendar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default EventCard;
