// src/components/page-ui/events_page/upcoming-events.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchEvents,
  createEvents,
  fetchPersonalizedGifts,
} from '@/services/api.service';
import { PlusCircle } from 'lucide-react';
import AddEventModal from '@/components/page-ui/events_page/add-event-model';
import EventCard from '@/components/page-ui/events_page/events_card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

// Define types locally or import if shared
interface EventSummary {
  _id: string;
  event_name: string;
  start_datetime: string;
  sender_name?: string;
  personalize_id?: {
    _id?: string;
    name?: string;
    icon_path?: string;
  };
  color?: string;
  note?: string;
}

interface PersonalizedGift {
  _id: string;
  name: string;
  icon_path?: string;
}


const UpcomingEvents = () => {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personalizedGifts, setPersonalizedGifts] = useState<
    PersonalizedGift[]
  >([]);
  const router = useRouter();

  // Use useCallback for stable function references
  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchEvents();
      const fetchedEvents = response?.data || [];
      // Sort events by date, latest first
      const sortedEvents = Array.isArray(fetchedEvents)
        ? fetchedEvents.sort(
            (a, b) =>
              new Date(a.start_datetime).getTime() -
              new Date(b.start_datetime).getTime()  // Changed to 'b' first for latest first
              
          )
        : [];
      setEvents(sortedEvents);
    } catch (error: any) {
      console.error('Failed to load events:', error);
      toast.error(error.message || 'Failed to load upcoming events.');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPersonalizedGifts = useCallback(async () => {
    try {
      const response = await fetchPersonalizedGifts();
      setPersonalizedGifts(response?.data || []);
    } catch (error: any) {
      console.error('Failed to load personalized gifts:', error);
      // toast.error('Failed to load event types for adding events.'); // Optional
    }
  }, []);

  useEffect(() => {
    loadEvents();
    loadPersonalizedGifts();
  }, [loadEvents, loadPersonalizedGifts]);

  // Handler for adding events *from this component's modal*
  const handleAddEvent = async (eventData: any) => { // eventData comes pre-formatted
    try {
      // Use the pre-formatted eventData directly
      const response = await createEvents(eventData); // Send the data as received from modal
      const newEvent = response?.data;

      setIsModalOpen(false);
      toast.success('Event added successfully!');
      // await loadEvents(); // Reload events to include the new one - replaced with state update below

      if (newEvent && newEvent._id) {
        // Optimistically update the state to show the new event immediately
        setEvents((prevEvents) => {
          const updatedEvents = [...prevEvents, newEvent];
          // Sort events to keep latest first after adding the new one
          return updatedEvents.sort(
            (a, b) =>
              new Date(b.start_datetime).getTime() -
              new Date(a.start_datetime).getTime()
          );
        });

        const newEventId = newEvent._id;
        // Decide if you want to navigate away from the current page after adding
        // handleNavigateToEventPage(newEventId); // Uncomment if navigation is desired
      } else {
        console.warn(
          'Could not get new event ID from creation response:',
          response
        );
        // If no new event data, just reload events to refresh the list (fallback)
        await loadEvents();
      }

    } catch (err: any) {
      console.error('Failed to create event:', err);
      const apiErrorMessage = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Failed to create event.';
      toast.error(apiErrorMessage);
      // Fallback to reload events in case of error to ensure data consistency
      await loadEvents();
    }
  };

  const handleNavigateToEventPage = (eventId: string) => {
    // Navigates to the main events page and selects the event
    router.push(`/events?selectedEvent=${eventId}`);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4 at-eventsgrid">
        <h2 className="text-lg md:text-xl font-semibold mt-0 text-gray-800">
          Upcoming Events
        </h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-sm bg-[#40A574] hover:bg-[#399368]  text-white hover:text-white rounded-full px-3 py-1.5" // Adjusted hover and padding
        >
          Add Event
          <PlusCircle className="w-4 h-4" />
        </Button>
      </div>

      <div className="my-6 md:my-8 overflow-x-auto horizontal-scroll snap-x snap-mandatory flex gap-4 pb-4"> {/* Horizontal scroll container */}
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex snap-start w-[calc(100%-16px)] sm:w-[calc(50%-16px)] lg:w-[calc(33%-16px)] xl:w-[calc(25%-16px)] 2xl:w-[calc(20%-16px)]  items-center border border-gray-200 bg-white rounded-lg p-3 h-[88px] shadow-sm animate-pulse" // Use standard bg, added shadow and pulse
            >
               <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0 bg-gray-200 " /> {/* Adjusted size slightly */}
               <div className="ml-3  flex-1 flex-column space-y-2"> {/* Adjusted margin */}
                 <Skeleton className="h-4 w-3/4 bg-gray-200" />
                 <Skeleton className="h-3 w-1/2 bg-gray-200" />
               </div>
            </div>
          ))
        ) : events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="flex-none snap-start w-[calc(100%-16px)] sm:w-[calc(50%-16px)] lg:w-[calc(33%-16px)] xl:w-[calc(25%-16px)] 2xl:w-[calc(20%-16px)]">
              <EventCard
                event={event}
                onNavigateToEventPage={handleNavigateToEventPage} // Pass handler
              />
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-6 text-sm">
            No upcoming events found.
          </p>
        )}
      </div>

      {/* Modal for Adding Events */}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEvent={handleAddEvent}
        personalizedGifts={personalizedGifts}
      />
    </>
  );
};

export default UpcomingEvents;