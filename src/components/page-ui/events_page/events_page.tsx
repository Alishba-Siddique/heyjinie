// src/components/page-ui/events_page/events_page.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AddEventModal from './add-event-model';
import { nanoid } from 'nanoid';
import {
  createEvents,
  fetchEvents,
  fetchPersonalizedGifts,
} from '@/services/api.service';
import { Event, ViewMode } from './types';
import { CalendarSkeleton } from './calendar-views/CalendarSkeleton';
import { WeekView } from './calendar-views/WeekView';
import { MonthView } from './calendar-views/MonthView';
import { YearView } from './calendar-views/YearView';
import { OccasionView } from './calendar-views/OccasionView';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { Calendar, Bell, BellOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Define PersonalizedGift type based on usage
interface PersonalizedGift {
  _id: string;
  name: string;
  icon_path?: string;
}

// Store calendar event IDs to allow removal later
interface ReminderData {
  active: boolean;
  calendarEventId?: string;
}

const EventsPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [personalizedGifts, setPersonalizedGifts] = useState<
    PersonalizedGift[]
  >([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingGifts, setIsLoadingGifts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Track reminders for events (mapping event ID to reminder status)
  const [reminders, setReminders] = useState<Record<string, ReminderData>>({});

  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Data Loading ---

  const loadEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    setError(null);
    try {
      const response = await fetchEvents();
      const fetchedEvents = response?.data || [];

      // Ensure fetchedEvents is an array and sort by start date
      const sortedEvents = Array.isArray(fetchedEvents)
        ? fetchedEvents.sort(
            (a, b) =>
              new Date(a.start_datetime).getTime() -
              new Date(b.start_datetime).getTime()
          )
        : [];

      setEvents(sortedEvents);

      // Initialize reminders state from localStorage if available
      try {
        const savedReminders = localStorage.getItem('eventReminders');
        if (savedReminders) {
          setReminders(JSON.parse(savedReminders));
        }
      } catch (storageErr) {
        console.error('Error loading reminders from storage:', storageErr);
      }
    } catch (err: any) {
      console.error('Failed to load events:', err);
      setError(err.message || 'Failed to load events. Please try again later.');
      setEvents([]);
      toast.error(err.message || 'Failed to load events.');
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  const loadPersonalizedGifts = useCallback(async () => {
    setIsLoadingGifts(true);
    try {
      const response = await fetchPersonalizedGifts();
      setPersonalizedGifts(response?.data || []);
    } catch (error) {
      console.error('Failed to fetch personalized gifts:', error);
      toast.error('Failed to load event types.');
    } finally {
      setIsLoadingGifts(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
    loadPersonalizedGifts();
  }, [loadEvents, loadPersonalizedGifts]);

  // --- Event Selection & Highlighting ---
  useEffect(() => {
    const eventIdFromUrl = searchParams.get('selectedEvent');
    setSelectedEventId(eventIdFromUrl);

    // Scroll attempt
    if (eventIdFromUrl && events.length > 0) {
      const element = document.getElementById(
        `event-sidebar-${eventIdFromUrl}`
      );
      console.warn(
        'Element not found for scrolling even after delay:',
        `event-sidebar-${eventIdFromUrl}`
      );
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        const elementRetry = document.getElementById(
          `event-sidebar-${eventIdFromUrl}`
        );
        console.warn(
          'Element not found for scrolling even after delay:',
          `event-sidebar-${eventIdFromUrl}`
        );
        if (elementRetry) {
          elementRetry.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        } else {
          console.warn(
            'Element not found for scrolling even after delay:',
            `event-sidebar-${eventIdFromUrl}`
          );
        }
      }
    }
  }, [searchParams, events]);

  // --- Reminder Handling ---
  // Load reminders from localStorage on initial load
  useEffect(() => {
    try {
      const savedReminders = localStorage.getItem('eventReminders');
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (storageErr) {
      console.error('Error loading reminders from storage:', storageErr);
    }
  }, []);

  // Enhanced calendar integration
  const addToCalendar = async (event: Event): Promise<string | null> => {
    // Make sure the browser supports the Calendar API
    if (!('showOpenFilePicker' in window)) {
      toast.error('Your browser does not support calendar integration');
      return null;
    }

    try {
      // Format event for calendar entry
      const startDate = new Date(event.start_datetime);
      const endDate = new Date(event.end_datetime);

      // Create a calendar file (.ics format)
      const calendarId = nanoid();
      const icsContent = generateICSFile(event, calendarId, startDate, endDate);

      // Create a file object
      const file = new File([icsContent], `${event.event_name}.ics`, {
        type: 'text/calendar',
      });

      // Create a download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = `${event.event_name}.ics`;

      // Add notification before download
      toast.info('Downloading calendar file...');

      // Trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return calendarId;
    } catch (error) {
      console.error('Error adding to calendar:', error);
      toast.error('Failed to add event to calendar');
      return null;
    }
  };


  // Generate ICS file content
  const generateICSFile = (
    event: Event,
    uid: string,
    startDate: Date,
    endDate: Date
  ): string => {
    // Format dates for ICS
    const formatDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startDateTime = formatDate(startDate);
    const endDateTime = formatDate(endDate);
    const now = formatDate(new Date());

    // Create basic ICS content - note the backticks for template string
    return `BEGIN:VCALENDAR
            VERSION:2.0
            PRODID:-//YourApp//Calendar//EN
            CALSCALE:GREGORIAN
            METHOD:PUBLISH
            BEGIN:VEVENT
            UID:${uid}
            SUMMARY:${event.event_name}
            DESCRIPTION:${event.sender_name || event.event_name}
            LOCATION:
            DTSTART:${startDateTime}
            DTEND:${endDateTime}
            DTSTAMP:${now}
            BEGIN:VALARM
            ACTION:DISPLAY
            DESCRIPTION:Reminder for ${event.event_name}
            TRIGGER:-PT1H
            END:VALARM
            END:VEVENT
            END:VCALENDAR`;
  };

  // Remove event from calendar
  const removeFromCalendar = (event: Event, calendarEventId?: string): void => {
    // In a browser environment, we can't automatically remove events from the calendar
    // We can only provide guidance to the user
    toast.info(
      'To remove this event from your calendar, please open your calendar app and delete it manually'
    );

    // For more integrated environments (like mobile apps with proper permissions),
    // you could use native calendar APIs to remove the event directly
  };


  // Enhanced toggle reminder function
  const toggleReminder = async (eventId: string) => {
    // Get current status
    const currentReminderData = reminders[eventId] || { active: false };
    const isCurrentlyActive = currentReminderData.active;

    // Find the event
    const event = events.find((e) => e._id === eventId);
    if (!event) {
      toast.error('Event not found');
      return;
    }

    if (!isCurrentlyActive) {
      // Turning reminder ON
      try {
        // Wait for the calendar operation to complete
        const calendarId = await addToCalendar(event);

        if (calendarId) {
          // Only update state once with the complete information
          const newReminders = {
            ...reminders,
            [eventId]: {
              active: true,
              calendarEventId: calendarId,
            },
          };

          // Update state
          setReminders(newReminders);

          // Save to localStorage
          try {
            localStorage.setItem(
              'eventReminders',
              JSON.stringify(newReminders)
            );
          } catch (err) {
            console.error('Error saving reminders:', err);
          }

          const eventDate = new Date(event.start_datetime);
          const formattedDate = eventDate.toLocaleDateString();
          toast.success(
            `Reminder set for "${event.event_name}" on ${formattedDate}`
          );
        }
      } catch (err) {
        console.error('Error adding event to calendar:', err);
        toast.error('Failed to add event to calendar');
      }
    } else {
      // Turning reminder OFF
      removeFromCalendar(event, currentReminderData.calendarEventId);

      // Update state
      const newReminders = {
        ...reminders,
        [eventId]: { active: false },
      };

      setReminders(newReminders);

      // Save to localStorage
      try {
        localStorage.setItem('eventReminders', JSON.stringify(newReminders));
      } catch (err) {
        console.error('Error saving reminders:', err);
      }

      toast.info('Reminder removed');
    }
  };

  // --- Event Handling ---
  const handleAddEvent = async (eventData: any) => {
    try {
      const response = await createEvents(eventData);

      setIsModalOpen(false);
      toast.success('Event added successfully!');
      await loadEvents();

      if (response?.data?._id) {
        const newEventId = response.data._id;
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('selectedEvent', newEventId);
        router.replace(`/events?${currentParams.toString()}`);
      } else {
        console.warn(
          'Could not get new event ID from creation response:',
          response
        );
      }
    } catch (err: any) {
      console.error('Failed to create event:', err);
      const apiErrorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        'Failed to create event.';
      setError(apiErrorMessage);
      toast.error(apiErrorMessage);
    }
  };

  // Handle clicking an event in the sidebar
  const handleSidebarEventClick = (eventId: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    if (selectedEventId === eventId) {
      currentParams.delete('selectedEvent');
      setSelectedEventId(null);
    } else {
      currentParams.set('selectedEvent', eventId);
      setSelectedEventId(eventId);
    }
    router.replace(`/events?${currentParams.toString()}`);
  };

  // Handle clicking an event within a calendar view
  const handleCalendarEventView = (event: Event) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('selectedEvent', event._id);
    router.push(`/events?${currentParams.toString()}`);
  };

  // Handle date changes from calendar views
  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  // --- Rendering ---
  const renderCalendarView = () => {
    if (isLoadingEvents) {
      return <CalendarSkeleton />;
    }
    const viewProps = {
      events: events,
      selectedDate: selectedDate,
      onEventClick: handleCalendarEventView,
      onDateChange: handleDateChange,
    };

    switch (viewMode) {
      case 'week':
        return <WeekView {...viewProps} />;
      case 'month':
        return <MonthView {...viewProps} />;
      case 'year':
        return <YearView {...viewProps} />;
      case 'occasion':
        return (
          <OccasionView
            events={events}
            onEventClick={handleCalendarEventView}
          />
        );
      default:
        return <WeekView {...viewProps} />;
    }
  };

  // Sidebar item component with reminder toggle
  const EventSidebarItem = ({ event }: { event: Event }) => (
    <div
      id={`event-sidebar-${event._id}`}
      key={event._id}
      className={`rounded-lg p-3 mb-3 cursor-pointer transition-all duration-200 ease-in-out relative border ${
        selectedEventId === event._id
          ? 'ring-2 ring-black ring-offset-1 shadow-md'
          : 'hover:shadow-sm hover:bg-opacity-90 border-transparent'
      }`}
      style={{ backgroundColor: event.color || '#40A574' }}
      onClick={() => handleSidebarEventClick(event._id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        (e.key === 'Enter' || e.key === ' ') &&
        handleSidebarEventClick(event._id)
      }
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
          {event.personalize_id?.icon_path ? (
            <img
              src={event.personalize_id.icon_path}
              alt=""
              className="h-12 w-12 object-contain"
            />
          ) : (
            '📅'
          )}
        </span>
        {/* Text Info */}
        <div className="flex-grow min-w-0">
          <h3 className="text-white text-sm font-medium truncate">
            {event.sender_name || 'Unnamed Event'}
          </h3>
          <p className="text-[#e6e6e6] text-xs truncate">{event.event_name}</p>
        </div>
      </div>
      {/* Optional: Show dates only when selected for less clutter */}
      {selectedEventId === event._id && (
        <div className="text-xs mt-2 pl-9 text-white opacity-90">
          <p>Start: {new Date(event.start_datetime).toLocaleDateString()}</p>
          <p>End: {new Date(event.end_datetime).toLocaleDateString()}</p>
        </div>
      )}

      {/* Add a toggle button for calendar reminder */}
      <div
        className="absolute right-3 top-3"
        onClick={(e) => e.stopPropagation()}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* <button
                className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                  reminders[event._id]
                    ? 'bg-white text-gray-800 hover:bg-gray-100'
                    : 'bg-gray-200 bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleReminder(event._id);
                }}
                aria-label={reminders[event._id] ? "Remove reminder" : "Add reminder"}
              >
                {reminders[event._id] ? (
                  <Bell size={16} />
                ) : (
                  <BellOff size={16} />
                )}
              </button> */}
              <button
                className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                  reminders[event._id]?.active
                    ? 'bg-white text-gray-800 hover:bg-gray-100'
                    : 'bg-gray-200 bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleReminder(event._id);
                }}
                aria-label={
                  reminders[event._id]?.active
                    ? 'Remove reminder'
                    : 'Add reminder'
                }
              >
                {reminders[event._id]?.active ? (
                  <Bell size={16} />
                ) : (
                  <BellOff size={16} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>
                {reminders[event._id] ? 'Remove reminder' : 'Add to calendar'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 p-4 md:p-6 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-3 items-center">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Upcoming Events
          </h1>
          <Button
            onClick={() => setIsModalOpen(true)}
            size="icon"
            className="bg-[#40A574] hover:bg-[#399368] text-white rounded-full w-8 h-8 shadow"
            aria-label="Add New Event"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </Button>
        </div>
        {/* View Mode Buttons */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          {(['Week', 'Month', 'Year', 'Occasion'] as const).map((mode) => {
            const modeLower = mode.toLowerCase() as ViewMode;
            return (
              <Button
                key={mode}
                variant={viewMode === modeLower ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode(modeLower)}
                className={`px-4 py-1.5 rounded-md text-xs sm:text-sm transition-colors ${
                  viewMode === modeLower
                    ? 'bg-gray-800 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {mode}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Error Display */}
      {error && !isLoadingEvents && (
        <div
          className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Sidebar: List of events */}
        <div className="w-full md:w-72 lg:w-80 flex-shrink-0 md:order-1 order-2">
          <h2 className="text-base font-semibold text-gray-700 mb-3 px-1">
            Events List
          </h2>
          <div className="md:max-h-[calc(100vh-180px)] md:overflow-y-auto bg-white rounded-lg shadow-sm p-2 space-y-2 border border-gray-200">
            {isLoadingEvents ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))
            ) : events.length > 0 ? (
              events.map((event) => (
                <EventSidebarItem key={event._id} event={event} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-6 text-sm">
                No events found.
              </p>
            )}
          </div>
        </div>

        {/* Main calendar view area */}
        <div className="flex-1 min-w-0 md:order-2 order-1">
          {renderCalendarView()}
        </div>
      </div>

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEvent={handleAddEvent}
        personalizedGifts={personalizedGifts}
      />
    </div>
  );
};

export default EventsPage;
