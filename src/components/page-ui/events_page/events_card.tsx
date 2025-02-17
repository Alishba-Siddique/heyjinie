import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ChevronRight, Calendar, X } from 'lucide-react';

interface Event {
  _id: string;
  event_name: string;
  start_datetime: string;
  sender_name?: string;
  personalize_id?: {
    icon_path?: string;
  };
  color?: string;
  note?: string;
}

interface EventCardProps {
  event: Event;
  onNavigateToEventPage: (eventId: string) => void;
}

const EventCard = ({ event, onNavigateToEventPage }: EventCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const eventDate = new Date(event.start_datetime);
  const day = eventDate.getDate();
  const month = eventDate
    .toLocaleString('default', { month: 'short' })
    .toUpperCase();

  const handleClick = () => {
    setShowDetails(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(false);
  };

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigateToEventPage(event._id);
  };

  return (
    <>
      <div
        className="flex items-center border bg-gray-100 rounded-lg p-3 cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={handleClick}
      >
        <div className="relative flex flex-col items-center w-14 bg-white text-black rounded-lg shadow-lg">
          <div className="absolute -top-1 left-0 right-0 h-2 bg-red-600 rounded-t-lg flex justify-between px-1">
            <div className="w-1 h-1 bg-white rounded-full mt-0.5"></div>
            <div className="w-1 h-1 bg-white rounded-full mt-0.5"></div>
          </div>
          <span className="text-2xl font-bold pt-3">{day}</span>
          <span className="text-xs pb-1">{month}</span>
        </div>

        <div className="flex-1 ml-5">
          <div className="font-bold text-[14px]">{event.event_name}</div>
          {event.sender_name && (
            <div className="text-sm text-gray-600">{event.sender_name}</div>
          )}
        </div>
        {/* <ChevronRight className="w-5 h-5 text-gray-400" /> */}
      </div>

      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md relative">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {event.personalize_id?.icon_path ? (
                  <img
                    src={event.personalize_id.icon_path}
                    alt=""
                    className="w-8 h-8"
                  />
                ) : (
                  <Calendar className="w-8 h-8" />
                )}
                {event.event_name}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-base font-bold">Date</div>
                  <div className='p-5 bg-gray-100 rounted-lg'>
                    {eventDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>

                {event.sender_name && (
                  <div>
                    <div className="text-base font-bold ">From</div>
                    <div className='p-5 bg-gray-100 rounted-lg'>{event.sender_name}</div>
                  </div>
                )}

                {event.note && (
                  <div>
                    <div className="text-base font-bold  ">Note</div>
                    <div className='p-5 bg-gray-100 rounted-lg'>{event.note}</div>
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={handleNavigate}
                    className=" bg-[#fd9298] text-white py-2 px-4 rounded-lg hover:bg-black transition-colors mt-4"
                  >
                    View in Calendar
                  </button>
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
