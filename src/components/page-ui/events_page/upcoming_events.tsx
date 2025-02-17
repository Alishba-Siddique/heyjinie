// // // src/components/page-ui/events_page/upcoming_events.tsx

// // 'use client';
// // import React, { useState, useEffect } from 'react';
// // import { useRouter } from 'next/navigation';
// // import {
// //   fetchEvents,
// //   createEvents,
// //   fetchPersonalizedGifts,
// // } from '@/services/api.service';
// // import { PlusCircle } from 'lucide-react';
// // import AddEventModal from '@/components/page-ui/events_page/add-event-model';
// // import EventCard from '@/components/page-ui/events_page/events_card';
// // interface Event {
// //   _id: string;
// //   event_name: string;
// //   start_datetime: string;
// // }

// // const UpcomingEvents = () => {
// //   const [events, setEvents] = useState<Event[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [personalizedGifts, setPersonalizedGifts] = useState<
// //     { _id: string; name: string; icon_path?: string }[]
// //   >([]);

// //   useEffect(() => {
// //     loadEvents();
// //     loadPersonalizedGifts();
// //   }, []);

// //   const loadEvents = async () => {
// //     setIsLoading(true);
// //     try {
// //       const response = await fetchEvents();
// //       const fetchedEvents = response?.data || [];
// //       setEvents(Array.isArray(fetchedEvents) ? fetchedEvents : []);
// //     } catch (error) {
// //       console.error('Failed to load events:', error);
// //       setEvents([]);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const loadPersonalizedGifts = async () => {
// //     try {
// //       const response = await fetchPersonalizedGifts();
// //       setPersonalizedGifts(response?.data || []);
// //     } catch (error) {
// //       console.error('Failed to load personalized gifts:', error);
// //     }
// //   };

// //   const handleAddEvent = async (data: any) => {
// //     try {
// //       await createEvents(data);
// //       setIsModalOpen(false);
// //       loadEvents();
// //     } catch (error) {
// //       console.error('Failed to create event:', error);
// //     }
// //   };

// //   const router = useRouter();

// //   const handleNavigateToEventPage = (eventId: string) => {
// //     // router.push(`/events/${eventId}`);
// //     router.push(`/events`);
// //   };

// //   if (isLoading) {
// //     return <div>Loading events...</div>;
// //   }

// //   return (
// //     <>
// //       <div className="flex items-center justify-between at-eventsgrid ">
// //         <div className="at-pagesectiontitle mt-9">
// //           <h2>Events</h2>
// //         </div>
// //         <button onClick={() => setIsModalOpen(true)}>
// //           <PlusCircle className="text-green-500 hover:text-green-600 w-7 h-7 mb-4 mt-9" />
// //         </button>
// //       </div>

// //       <div className="at-eventsgrid ">
// //         {/* {events.map((event) => {
// //           const eventDate = new Date(event.start_datetime);
// //           const day = eventDate.getDate();
// //           const month = eventDate
// //             .toLocaleString('default', { month: 'short' })
// //             .toUpperCase();

// //           return (
// //             <div
// //               key={event._id}
// //               className="flex items-center border bg-gray-100 rounded-lg p-3 "
// //             >
// //               <div className="relative flex flex-col items-center w-14 bg-white text-black rounded-lg shadow-lg">
// //                 <div className="absolute -top-1 left-0 right-0 h-2 bg-red-600 rounded-t-lg flex justify-between px-1">
// //                   <div className="w-1 h-1 bg-white rounded-full mt-0.5"></div>
// //                   <div className="w-1 h-1 bg-white rounded-full mt-0.5"></div>
// //                 </div>
// //                 <span className="text-2xl font-bold pt-3">{day}</span>
// //                 <span className="text-xs pb-1">{month}</span>
// //               </div>

// //               <div className="at-categorytitle font-bold text-[14px] ml-5">
// //                 {event.event_name}
// //               </div>
// //             </div>
// //           );
// //         })} */}

// //         {events.map((event) => (
// //           <EventCard
// //             key={event._id}
// //             event={event}
// //             onNavigateToEventPage={handleNavigateToEventPage}
// //           />
// //         ))}

// //         {isModalOpen && (
// //           <AddEventModal
// //             onClose={() => setIsModalOpen(false)}
// //             onAddEvent={handleAddEvent}
// //             personalizedGifts={personalizedGifts}
// //           />
// //         )}
// //       </div>
// //     </>
// //   );
// // };

// // export default UpcomingEvents;

// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   fetchEvents,
//   createEvents,
//   fetchPersonalizedGifts,
// } from '@/services/api.service';
// import { PlusCircle } from 'lucide-react';
// import AddEventModal from '@/components/page-ui/events_page/add-event-model';
// import EventCard from '@/components/page-ui/events_page/events_card';
// import { Skeleton } from '@/components/ui/skeleton';

// interface Event {
//   _id: string;
//   event_name: string;
//   start_datetime: string;
// }

// const UpcomingEvents = () => {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [personalizedGifts, setPersonalizedGifts] = useState<
//     { _id: string; name: string; icon_path?: string }[]
//   >([]);

//   useEffect(() => {
//     loadEvents();
//     loadPersonalizedGifts();
//   }, []);

//   const loadEvents = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetchEvents();
//       const fetchedEvents = response?.data || [];
//       setEvents(Array.isArray(fetchedEvents) ? fetchedEvents : []);
//     } catch (error) {
//       console.error('Failed to load events:', error);
//       setEvents([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadPersonalizedGifts = async () => {
//     try {
//       const response = await fetchPersonalizedGifts();
//       setPersonalizedGifts(response?.data || []);
//     } catch (error) {
//       console.error('Failed to load personalized gifts:', error);
//     }
//   };

//   const handleAddEvent = async (data: any) => {
//     try {
//       await createEvents(data);
//       setIsModalOpen(false);
//       loadEvents();
//     } catch (error) {
//       console.error('Failed to create event:', error);
//     }
//   };

//   const router = useRouter();

//   const handleNavigateToEventPage = (eventId: string) => {
//     router.push(`/events`);
//   };

//   return (
//     <>
//       <div className="flex items-center justify-between at-eventsgrid ">
//         <div className="at-pagesectiontitle mt-9">
//           <h2>Events</h2>
//         </div>
//         <button onClick={() => setIsModalOpen(true)}>
//           <PlusCircle className="text-green-500 hover:text-green-600 w-7 h-7 mb-4 mt-9" />
//         </button>
//       </div>

//       <div className="at-eventsgrid ">
//         {isLoading
//           ? Array.from({ length: 5 }).map((_, index) => (
//               <Skeleton
//                 key={index}
//                 className="h-24 w-full rounded-lg bg-gray-300"
//               />
//             ))
//           : events.map((event) => (
//               <EventCard
//                 key={event._id}
//                 event={event}
//                 onNavigateToEventPage={handleNavigateToEventPage}
//               />
//             ))}

//         {isModalOpen && (
//           <AddEventModal
//             onClose={() => setIsModalOpen(false)}
//             onAddEvent={handleAddEvent}
//             personalizedGifts={personalizedGifts}
//           />
//         )}
//       </div>
//     </>
//   );
// };

// export default UpcomingEvents;


// src/components/page-ui/events_page/upcoming-events.tsx
import React, { useState, useEffect } from 'react';
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

interface Event {
  _id: string;
  event_name: string;
  start_datetime: string;
}

const UpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personalizedGifts, setPersonalizedGifts] = useState<
    { _id: string; name: string; icon_path?: string }[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    loadEvents();
    loadPersonalizedGifts();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetchEvents();
      const fetchedEvents = response?.data || [];
      setEvents(Array.isArray(fetchedEvents) ? fetchedEvents : []);
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPersonalizedGifts = async () => {
    try {
      const response = await fetchPersonalizedGifts();
      setPersonalizedGifts(response?.data || []);
    } catch (error) {
      console.error('Failed to load personalized gifts:', error);
    }
  };

  const handleAddEvent = async (data: any) => {
    try {
      await createEvents(data);
      setIsModalOpen(false);
      loadEvents();
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  // When the user clicks “view” on an event card,
  // navigate to /events and pass the event’s ID as a query parameter.
  const handleNavigateToEventPage = (eventId: string) => {
    router.push(`/events?selectedEvent=${eventId}`);
  };

  return (
    <>
      <div className="flex items-center justify-between at-eventsgrid">
        <div className="at-pagesectiontitle mt-9">
          <h2>Events</h2>
        </div>
        <button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="text-green-500 hover:text-green-600 w-7 h-7 mb-4 mt-9" />
        </button>
      </div>

      <div className="at-eventsgrid">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-24 w-full rounded-lg bg-gray-300"
              />
            ))
          : events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onNavigateToEventPage={handleNavigateToEventPage}
              />
            ))}

        {isModalOpen && (
          <AddEventModal
            onClose={() => setIsModalOpen(false)}
            onAddEvent={handleAddEvent}
            personalizedGifts={personalizedGifts}
          />
        )}
      </div>
    </>
  );
};

export default UpcomingEvents;
