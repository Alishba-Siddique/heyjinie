// // // // src/components/page-ui/events_page/events_page.tsx

// // // 'use client';
// // // import React, { useState, useEffect } from 'react';
// // // import AddEventModal from './add-event-model';
// // // import {
// // //   createEvents,
// // //   fetchEvents,
// // //   fetchPersonalizedGifts,
// // // } from '@/services/api.service';
// // // import {
// // //   Tooltip,
// // //   TooltipTrigger,
// // //   TooltipContent,
// // //   TooltipProvider,
// // // } from '@/components/ui/tooltip';

// // // interface Event {
// // //   _id: string;
// // //   customer_id: string;
// // //   sender_name: string;
// // //   event_name: string;
// // //   start_datetime: string;
// // //   end_datetime: string;
// // //   personalize_id: {
// // //     _id: string;
// // //     name: string;
// // //     icon_path: string;
// // //     images: Array<{
// // //       image_id: string;
// // //       image_path: string;
// // //     }>;
// // //   };
// // //   note: string;
// // //   color: string;
// // //   created_at: string;
// // // }

// // // const EventsPage = () => {
// // //   const [viewMode, setViewMode] = useState<
// // //     'week' | 'month' | 'year' | 'occasion'
// // //   >('week');
// // //   const [selectedDate, setSelectedDate] = useState<Date>(new Date());
// // //   const [events, setEvents] = useState<Event[]>([]);
// // //   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
// // //   const [personalizedGifts, setPersonalizedGifts] = useState<any[]>([]);
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // //   const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});

// // //   // For month and year view
// // //   const months = Array.from({ length: 12 }, (_, i) =>
// // //     new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
// // //       new Date(2022, i)
// // //     )
// // //   );
// // //   const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// // //   useEffect(() => {
// // //     loadEvents();
// // //     loadPersonalizedGifts();
// // //   }, []);

// // //   const loadEvents = async () => {
// // //     setIsLoading(true);
// // //     setError(null);
// // //     try {
// // //       const response = await fetchEvents();
// // //       const fetchedEvents = response?.data || [];
// // //       setEvents(Array.isArray(fetchedEvents) ? fetchedEvents : []);
// // //     } catch (error) {
// // //       setError('Failed to load events. Please try again later.');
// // //       setEvents([]);
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   const loadPersonalizedGifts = async () => {
// // //     try {
// // //       const response = await fetchPersonalizedGifts();
// // //       setPersonalizedGifts(response?.data || []);
// // //     } catch (error) {
// // //       console.error('Failed to fetch personalized gifts:', error);
// // //     }
// // //   };

// // //   const handleAddEvent = async (eventData: any) => {
// // //     try {
// // //       await createEvents(eventData);
// // //       setIsModalOpen(false);
// // //       loadEvents();
// // //     } catch (error) {
// // //       console.error('Failed to create event:', error);
// // //       setError('Failed to create event. Please try again.');
// // //     }
// // //   };

// // //   const handleToggle = (eventId: string) => {
// // //     setToggleStates((prevStates) => ({
// // //       ...prevStates,
// // //       [eventId]: !prevStates[eventId],
// // //     }));
// // //   };

// // //   const handleEventClick = (event: Event) => {
// // //     setSelectedEvent(selectedEvent?._id === event._id ? null : event);
// // //   };

// // //   // ─── WEEK VIEW ──────────────────────────────────────────────────────────────
// // //   // Displays each day of the week with events that span that day
// // //   const renderWeekView = () => {
// // //     return (
// // //       <div className="overflow-x-auto">
// // //         <div className="grid grid-cols-7 gap-4 min-w-[700px]">
// // //           {daysOfWeek.map((day, index) => (
// // //             <div key={index} className="text-center font-medium">
// // //               {day}
// // //             </div>
// // //           ))}
// // //           {Array.from({ length: 7 }).map((_, dayIndex) => {
// // //             const date = new Date(selectedDate);
// // //             date.setDate(date.getDate() + dayIndex);
// // //             const normalizedDate = new Date(
// // //               date.getFullYear(),
// // //               date.getMonth(),
// // //               date.getDate()
// // //             );
// // //             const eventsForDay = events.filter((event) => {
// // //               const start = new Date(event.start_datetime);
// // //               const end = new Date(event.end_datetime);
// // //               const startDate = new Date(
// // //                 start.getFullYear(),
// // //                 start.getMonth(),
// // //                 start.getDate()
// // //               );
// // //               const endDate = new Date(
// // //                 end.getFullYear(),
// // //                 end.getMonth(),
// // //                 end.getDate()
// // //               );
// // //               return normalizedDate >= startDate && normalizedDate <= endDate;
// // //             });
// // //             return (
// // //               <div
// // //                 key={dayIndex}
// // //                 className="border rounded-lg p-4 min-h-[600px]"
// // //               >
// // //                 <div className="text-right mb-2 font-semibold">
// // //                   {date.getDate()}
// // //                 </div>
// // //                 {eventsForDay.length > 0 ? (
// // //                   eventsForDay.map((event) => (
// // //                     <div
// // //                       key={event._id}
// // //                       className="mb-2 p-2 rounded shadow-sm"
// // //                       style={{ backgroundColor: event.color }}
// // //                     >
// // //                       <div className="font-medium">{event.event_name}</div>
// // //                       <div className="text-xs">
// // //                         Start:{' '}
// // //                         {new Date(event.start_datetime).toLocaleTimeString([], {
// // //                           hour: '2-digit',
// // //                           minute: '2-digit',
// // //                         })}{' '}
// // //                         - End:{' '}
// // //                         {new Date(event.end_datetime).toLocaleTimeString([], {
// // //                           hour: '2-digit',
// // //                           minute: '2-digit',
// // //                         })}
// // //                       </div>
// // //                     </div>
// // //                   ))
// // //                 ) : (
// // //                   <div className="text-sm text-gray-400">No Events</div>
// // //                 )}
// // //               </div>
// // //             );
// // //           })}
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   // ─── YEAR VIEW ───────────────────────────────────────────────────────────────
// // //   const renderYearView = () => {
// // //     return (
// // //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// // //         {months.map((month, monthIndex) => {
// // //           const year = selectedDate.getFullYear();
// // //           const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
// // //           return (
// // //             <div key={month} className="border rounded-lg p-4">
// // //               <h3 className="font-semibold mb-2">{month}</h3>
// // //               <div className="grid grid-cols-7 gap-1 text-xs">
// // //                 {daysOfWeek.map((day, i) => (
// // //                   <div key={i} className="text-center text-gray-500">
// // //                     {day}
// // //                   </div>
// // //                 ))}
// // //                 {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
// // //                   const dayNumber = dayIndex + 1;
// // //                   const date = new Date(year, monthIndex, dayNumber);
// // //                   // Get events whose start OR end date matches this day
// // //                   const eventsForDay = events.filter((event) => {
// // //                     const start = new Date(event.start_datetime);
// // //                     const end = new Date(event.end_datetime);
// // //                     return (
// // //                       (start.getDate() === dayNumber &&
// // //                         start.getMonth() === monthIndex &&
// // //                         start.getFullYear() === year) ||
// // //                       (end.getDate() === dayNumber &&
// // //                         end.getMonth() === monthIndex &&
// // //                         end.getFullYear() === year)
// // //                     );
// // //                   });
// // //                   let latestEvent;
// // //                   if (eventsForDay.length > 0) {
// // //                     latestEvent = eventsForDay.reduce((prev, curr) =>
// // //                       new Date(curr.start_datetime) >
// // //                       new Date(prev.start_datetime)
// // //                         ? curr
// // //                         : prev
// // //                     );
// // //                   }
// // //                   return (
// // //                     <div key={dayIndex} className="text-center p-1 relative">
// // //                       <TooltipProvider>
// // //                         {eventsForDay.length > 0 ? (
// // //                           <Tooltip>
// // //                             <TooltipTrigger asChild>
// // //                               <div
// // //                                 className="w-8 h-8 rounded-full flex items-center justify-center mx-auto cursor-pointer"
// // //                                 style={{
// // //                                   border: `2px solid ${
// // //                                     latestEvent?.color || 'transparent'
// // //                                   }`,
// // //                                 }}
// // //                               >
// // //                                 {dayNumber}
// // //                               </div>
// // //                             </TooltipTrigger>
// // //                             <TooltipContent>
// // //                               <div className="space-y-1">
// // //                                 {eventsForDay.map((event) => (
// // //                                   <div
// // //                                     key={event._id}
// // //                                     className="text-xs"
// // //                                     style={{ color: event.color }}
// // //                                   >
// // //                                     {event.event_name}
// // //                                     <br />
// // //                                     {new Date(
// // //                                       event.start_datetime
// // //                                     ).toLocaleTimeString([], {
// // //                                       hour: '2-digit',
// // //                                       minute: '2-digit',
// // //                                     })}{' '}
// // //                                     -{' '}
// // //                                     {new Date(
// // //                                       event.end_datetime
// // //                                     ).toLocaleTimeString([], {
// // //                                       hour: '2-digit',
// // //                                       minute: '2-digit',
// // //                                     })}
// // //                                   </div>
// // //                                 ))}
// // //                               </div>
// // //                             </TooltipContent>
// // //                           </Tooltip>
// // //                         ) : (
// // //                           <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto">
// // //                             {dayNumber}
// // //                           </div>
// // //                         )}
// // //                       </TooltipProvider>
// // //                     </div>
// // //                   );
// // //                 })}
// // //                 {/* Fill remaining cells to complete a 42-cell grid if needed */}
// // //                 {Array.from({ length: 42 - daysInMonth }).map((_, idx) => (
// // //                   <div key={`empty-${idx}`} className="p-1" />
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           );
// // //         })}
// // //       </div>
// // //     );
// // //   };

// // //   // ─── MONTH VIEW ─────────────────────────────────────────────────────────────
// // //   const renderMonthView = () => {
// // //     const currentMonth = selectedDate.getMonth();
// // //     const currentYear = selectedDate.getFullYear();
// // //     const firstDay = new Date(currentYear, currentMonth, 1);
// // //     const lastDay = new Date(currentYear, currentMonth + 1, 0);
// // //     const daysInMonth = lastDay.getDate();
// // //     const startingDay = firstDay.getDay();

// // //     const days = Array.from({ length: 42 }, (_, i) => {
// // //       const dayNumber = i - startingDay + 1;
// // //       const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
// // //       const date = new Date(currentYear, currentMonth, dayNumber);
// // //       const dayEvents = events.filter((event) => {
// // //         const eventDate = new Date(event.start_datetime);
// // //         return (
// // //           eventDate.getDate() === dayNumber &&
// // //           eventDate.getMonth() === currentMonth &&
// // //           eventDate.getFullYear() === currentYear
// // //         );
// // //       });

// // //       return {
// // //         dayNumber,
// // //         isCurrentMonth,
// // //         events: dayEvents,
// // //         date,
// // //       };
// // //     });

// // //     return (
// // //       <div className="overflow-x-auto">
// // //         <div className="w-full min-w-[500px]">
// // //           <div className="grid grid-cols-7 gap-4 mb-4">
// // //             {daysOfWeek.map((day, index) => (
// // //               <div
// // //                 key={index}
// // //                 className="text-center font-medium text-gray-600"
// // //               >
// // //                 {day}
// // //               </div>
// // //             ))}
// // //           </div>
// // //           <div className="grid grid-cols-7 gap-1">
// // //             {days.map((day, index) => (
// // //               <div
// // //                 key={index}
// // //                 className={`h-24 p-2 ${
// // //                   day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
// // //                 } relative ${
// // //                   day.events.length > 0
// // //                     ? 'border-2 border-blue-200'
// // //                     : 'border border-gray-100'
// // //                 } rounded-lg`}
// // //               >
// // //                 <span
// // //                   className={`${
// // //                     day.events.length > 0
// // //                       ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center'
// // //                       : !day.isCurrentMonth
// // //                       ? 'text-gray-400'
// // //                       : ''
// // //                   }`}
// // //                 >
// // //                   {day.isCurrentMonth ? day.dayNumber : ''}
// // //                 </span>
// // //                 {day.events.map((event, i) => (
// // //                   <div
// // //                     key={i}
// // //                     className="text-xs mt-1 truncate"
// // //                     style={{ backgroundColor: event.color }}
// // //                   >
// // //                     {event.event_name}
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   // ─── OCCASION VIEW ───────────────────────────────────────────────────────────
// // //   const renderOccasionView = () => {
// // //     const groupedEvents = events.reduce<Record<string, Event[]>>(
// // //       (acc, event) => {
// // //         const type = event.event_name || 'Other';
// // //         if (!acc[type]) acc[type] = [];
// // //         acc[type].push(event);
// // //         return acc;
// // //       },
// // //       {}
// // //     );

// // //     return (
// // //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// // //         {Object.entries(groupedEvents).map(([type, events]) => (
// // //           <div key={type} className="border rounded-lg p-4">
// // //             <h3 className="font-semibold mb-4 flex items-center">
// // //               <span className="text-xl mr-2">
// // //                 {events[0]?.personalize_id?.icon_path ? (
// // //                   <img
// // //                     src={events[0].personalize_id.icon_path}
// // //                     alt="icon"
// // //                     className="w-6 h-6"
// // //                   />
// // //                 ) : (
// // //                   '📅'
// // //                 )}
// // //               </span>
// // //               {type}
// // //             </h3>
// // //             <div className="space-y-3">
// // //               {events.map((event) => (
// // //                 <div
// // //                   key={event._id}
// // //                   className="p-2 rounded-lg text-sm"
// // //                   style={{ backgroundColor: event.color }}
// // //                 >
// // //                   <div className="font-medium">{event.sender_name}</div>
// // //                   <div className="text-gray-600">
// // //                     {new Date(event.start_datetime).toLocaleDateString()}
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>
// // //     );
// // //   };

// // //   return (
// // //     <div className="p-6 bg-white min-h-screen">
// // //       <div className="flex flex-col md:flex-row justify-between items-center mb-8">
// // //         <div className="flex items-center gap-4 mb-4 md:mb-0">
// // //           <h1 className="text-2xl font-semibold">Upcoming Dates</h1>
// // //           <button
// // //             onClick={() => setIsModalOpen(true)}
// // //             className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xl hover:bg-green-600 transition-colors"
// // //           >
// // //             +
// // //           </button>
// // //         </div>
// // //         <div className="flex flex-wrap gap-3">
// // //           {['Week', 'Month', 'Year', 'Occasion'].map((mode) => (
// // //             <button
// // //               key={mode}
// // //               onClick={() =>
// // //                 setViewMode(
// // //                   mode.toLowerCase() as 'week' | 'month' | 'year' | 'occasion'
// // //                 )
// // //               }
// // //               className={`px-8 py-2 rounded-lg ${
// // //                 viewMode === mode.toLowerCase()
// // //                   ? 'bg-gray-800 text-white'
// // //                   : 'bg-gray-100 text-gray-600'
// // //               }`}
// // //             >
// // //               {mode}
// // //             </button>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {error && (
// // //         <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg">
// // //           {error}
// // //         </div>
// // //       )}

// // //       {isLoading ? (
// // //         <div className="flex justify-center items-center h-64">
// // //           <div className="text-gray-500">Loading events...</div>
// // //         </div>
// // //       ) : (
// // //         <div className="flex flex-col md:flex-row gap-6">
// // //           {/* Sidebar: List of events */}
// // //           <div className="w-full md:w-80">
// // //             {events.map((event) => (
// // //               <div
// // //                 key={event._id}
// // //                 className={`rounded-xl p-4 mb-3 relative cursor-pointer ${
// // //                   selectedEvent?._id === event._id ? 'ring-2 ring-blue-500' : ''
// // //                 }`}
// // //                 style={{ backgroundColor: event.color }}
// // //                 onClick={() => handleEventClick(event)}
// // //               >
// // //                 <div className="flex items-center">
// // //                   <span className="text-2xl mr-3">
// // //                     {event.personalize_id?.icon_path ? (
// // //                       <img
// // //                         src={event.personalize_id.icon_path}
// // //                         alt=""
// // //                         className="w-8 h-8"
// // //                       />
// // //                     ) : (
// // //                       '📅'
// // //                     )}
// // //                   </span>
// // //                   <div>
// // //                     <h3 className="text-lg font-medium text-gray-800">
// // //                       {event.sender_name}
// // //                     </h3>
// // //                     <p className="text-gray-600">{event.event_name}</p>
// // //                     {selectedEvent?._id === event._id && (
// // //                       <div className="text-sm mt-2">
// // //                         <p>
// // //                           Start:{' '}
// // //                           {new Date(event.start_datetime).toLocaleString()}
// // //                         </p>
// // //                         <p>
// // //                           End: {new Date(event.end_datetime).toLocaleString()}
// // //                         </p>
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //                 <div className="absolute top-4 right-4">
// // //                   <div
// // //                     className={`w-12 h-6 rounded-full p-1 cursor-pointer ${
// // //                       toggleStates[event._id] ? 'bg-green-500' : 'bg-gray-200'
// // //                     }`}
// // //                     onClick={() => handleToggle(event._id)}
// // //                   >
// // //                     <div
// // //                       className={`w-4 h-4 rounded-full transition-transform duration-300 ${
// // //                         toggleStates[event._id]
// // //                           ? 'bg-green-700 translate-x-6'
// // //                           : 'bg-yellow-400'
// // //                       }`}
// // //                     ></div>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>

// // //           {/* Main calendar view */}
// // //           <div className="flex-1">
// // //             {viewMode === 'week' && renderWeekView()}
// // //             {viewMode === 'month' && renderMonthView()}
// // //             {viewMode === 'year' && renderYearView()}
// // //             {viewMode === 'occasion' && renderOccasionView()}
// // //           </div>
// // //         </div>
// // //       )}

// // //       {isModalOpen && (
// // //         <AddEventModal
// // //           onClose={() => setIsModalOpen(false)}
// // //           onAddEvent={handleAddEvent}
// // //           personalizedGifts={personalizedGifts}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default EventsPage;

// // // src/components/page-ui/events_page/events_page.tsx
// // 'use client';
// // import React, { useState, useEffect } from 'react';
// // import { useRouter, useSearchParams } from 'next/navigation';
// // import AddEventModal from './add-event-model';
// // import {
// //   createEvents,
// //   fetchEvents,
// //   fetchPersonalizedGifts,
// // } from '@/services/api.service';
// // import {
// //   Tooltip,
// //   TooltipTrigger,
// //   TooltipContent,
// //   TooltipProvider,
// // } from '@/components/ui/tooltip';

// // interface Event {
// //   _id: string;
// //   customer_id: string;
// //   sender_name: string;
// //   event_name: string;
// //   start_datetime: string;
// //   end_datetime: string;
// //   personalize_id: {
// //     _id: string;
// //     name: string;
// //     icon_path: string;
// //     images: Array<{
// //       image_id: string;
// //       image_path: string;
// //     }>;
// //   };
// //   note: string;
// //   color: string;
// //   created_at: string;
// // }

// // const EventsPage = () => {
// //   const [viewMode, setViewMode] = useState<
// //     'week' | 'month' | 'year' | 'occasion'
// //   >('week');
// //   const [selectedDate, setSelectedDate] = useState<Date>(new Date());
// //   const [events, setEvents] = useState<Event[]>([]);
// //   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
// //   const [personalizedGifts, setPersonalizedGifts] = useState<any[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});

// //   const router = useRouter();
// //   const searchParams = useSearchParams();

// //   // For month and year view
// //   const months = Array.from({ length: 12 }, (_, i) =>
// //     new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
// //       new Date(2022, i)
// //     )
// //   );
// //   const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// //   useEffect(() => {
// //     loadEvents();
// //     loadPersonalizedGifts();
// //   }, []);

// //   // When events have loaded, check for the query parameter "selectedEvent".
// //   // If present, bring that event to the top and set it as selected.
// //   // useEffect(() => {
// //   //   const selectedEventId = searchParams.get('selectedEvent');
// //   //   if (selectedEventId && events.length > 0) {
// //   //     const eventIndex = events.findIndex((e) => e._id === selectedEventId);
// //   //     if (eventIndex > -1) {
// //   //       const eventToBring = events[eventIndex];
// //   //       // Reorder events so that the selected event comes first
// //   //       const reorderedEvents = [
// //   //         eventToBring,
// //   //         ...events.filter((_, idx) => idx !== eventIndex),
// //   //       ];
// //   //       setEvents(reorderedEvents);
// //   //       setSelectedEvent(eventToBring);
// //   //     }
// //   //   }
// //   // }, [searchParams, events]);

// //   useEffect(() => {
// //     const selectedEventId = searchParams.get('selectedEvent');
// //     // Proceed only if there is a selectedEventId and events have loaded
// //     if (selectedEventId && events.length > 0) {
// //       // Check if the selected event is already at the top of the list
// //       if (events[0]._id !== selectedEventId) {
// //         const eventIndex = events.findIndex((e) => e._id === selectedEventId);
// //         if (eventIndex > -1) {
// //           const eventToBring = events[eventIndex];
// //           const reorderedEvents = [
// //             eventToBring,
// //             ...events.filter((_, idx) => idx !== eventIndex),
// //           ];
// //           setEvents(reorderedEvents);
// //           setSelectedEvent(eventToBring);
// //         }
// //       }
// //     }
// //   }, [searchParams, events]);

// //   const loadEvents = async () => {
// //     setIsLoading(true);
// //     setError(null);
// //     try {
// //       const response = await fetchEvents();
// //       const fetchedEvents = response?.data || [];
// //       setEvents(Array.isArray(fetchedEvents) ? fetchedEvents : []);
// //     } catch (error) {
// //       setError('Failed to load events. Please try again later.');
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
// //       console.error('Failed to fetch personalized gifts:', error);
// //     }
// //   };

// //   const handleAddEvent = async (eventData: any) => {
// //     try {
// //       await createEvents(eventData);
// //       setIsModalOpen(false);
// //       loadEvents();
// //     } catch (error) {
// //       console.error('Failed to create event:', error);
// //       setError('Failed to create event. Please try again.');
// //     }
// //   };

// //   const handleToggle = (eventId: string) => {
// //     setToggleStates((prevStates) => ({
// //       ...prevStates,
// //       [eventId]: !prevStates[eventId],
// //     }));
// //   };

// //   const handleEventClick = (event: Event) => {
// //     setSelectedEvent(selectedEvent?._id === event._id ? null : event);
// //   };

// //   // This function is called when a calendar event is clicked.
// //   // It navigates to /events with a query parameter for the selected event.
// //   const handleCalendarEventView = (event: Event) => {
// //     router.push(`/events?selectedEvent=${event._id}`);
// //   };

// //   // ─── WEEK VIEW ──────────────────────────────────────────────────────────────
// //   const renderWeekView = () => {
// //     return (
// //       <div className="overflow-x-auto">
// //         <div className="grid grid-cols-7 gap-4 min-w-[700px]">
// //           {daysOfWeek.map((day, index) => (
// //             <div key={index} className="text-center font-medium">
// //               {day}
// //             </div>
// //           ))}
// //           {Array.from({ length: 7 }).map((_, dayIndex) => {
// //             const date = new Date(selectedDate);
// //             date.setDate(date.getDate() + dayIndex);
// //             const normalizedDate = new Date(
// //               date.getFullYear(),
// //               date.getMonth(),
// //               date.getDate()
// //             );
// //             const eventsForDay = events.filter((event) => {
// //               const start = new Date(event.start_datetime);
// //               const end = new Date(event.end_datetime);
// //               const startDate = new Date(
// //                 start.getFullYear(),
// //                 start.getMonth(),
// //                 start.getDate()
// //               );
// //               const endDate = new Date(
// //                 end.getFullYear(),
// //                 end.getMonth(),
// //                 end.getDate()
// //               );
// //               return normalizedDate >= startDate && normalizedDate <= endDate;
// //             });
// //             return (
// //               <div
// //                 key={dayIndex}
// //                 className="border rounded-lg p-4 min-h-[600px]"
// //               >
// //                 <div className="text-right mb-2 font-semibold">
// //                   {date.getDate()}
// //                 </div>
// //                 {eventsForDay.length > 0 ? (
// //                   eventsForDay.map((event) => (
// //                     <div
// //                       key={event._id}
// //                       onClick={() => handleCalendarEventView(event)}
// //                       className="mb-2 p-2 rounded shadow-sm cursor-pointer"
// //                       style={{ backgroundColor: event.color }}
// //                     >
// //                       <div className="font-medium">{event.event_name}</div>
// //                       <div className="text-xs">
// //                         Start:{' '}
// //                         {new Date(event.start_datetime).toLocaleTimeString([], {
// //                           hour: '2-digit',
// //                           minute: '2-digit',
// //                         })}{' '}
// //                         - End:{' '}
// //                         {new Date(event.end_datetime).toLocaleTimeString([], {
// //                           hour: '2-digit',
// //                           minute: '2-digit',
// //                         })}
// //                       </div>
// //                     </div>
// //                   ))
// //                 ) : (
// //                   <div className="text-sm text-gray-400">No Events</div>
// //                 )}
// //               </div>
// //             );
// //           })}
// //         </div>
// //       </div>
// //     );
// //   };

// //   // ─── YEAR VIEW ───────────────────────────────────────────────────────────────
// //   const renderYearView = () => {
// //     return (
// //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// //         {months.map((month, monthIndex) => {
// //           const year = selectedDate.getFullYear();
// //           const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
// //           return (
// //             <div key={month} className="border rounded-lg p-4">
// //               <h3 className="font-semibold mb-2">{month}</h3>
// //               <div className="grid grid-cols-7 gap-1 text-xs">
// //                 {daysOfWeek.map((day, i) => (
// //                   <div key={i} className="text-center text-gray-500">
// //                     {day}
// //                   </div>
// //                 ))}
// //                 {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
// //                   const dayNumber = dayIndex + 1;
// //                   const date = new Date(year, monthIndex, dayNumber);
// //                   // Find events whose start or end matches this day
// //                   const eventsForDay = events.filter((event) => {
// //                     const start = new Date(event.start_datetime);
// //                     const end = new Date(event.end_datetime);
// //                     return (
// //                       (start.getDate() === dayNumber &&
// //                         start.getMonth() === monthIndex &&
// //                         start.getFullYear() === year) ||
// //                       (end.getDate() === dayNumber &&
// //                         end.getMonth() === monthIndex &&
// //                         end.getFullYear() === year)
// //                     );
// //                   });
// //                   let latestEvent;
// //                   if (eventsForDay.length > 0) {
// //                     latestEvent = eventsForDay.reduce((prev, curr) =>
// //                       new Date(curr.start_datetime) > new Date(prev.start_datetime)
// //                         ? curr
// //                         : prev
// //                     );
// //                   }
// //                   return (
// //                     <div key={dayIndex} className="text-center p-1 relative">
// //                       <TooltipProvider>
// //                         {eventsForDay.length > 0 ? (
// //                           <Tooltip>
// //                             <TooltipTrigger asChild>
// //                               <div
// //                                 onClick={() =>
// //                                   handleCalendarEventView(latestEvent!)
// //                                 }
// //                                 className="w-8 h-8 rounded-full flex items-center justify-center mx-auto cursor-pointer"
// //                                 style={{
// //                                   border: `2px solid ${
// //                                     latestEvent?.color || 'transparent'
// //                                   }`,
// //                                 }}
// //                               >
// //                                 {dayNumber}
// //                               </div>
// //                             </TooltipTrigger>
// //                             <TooltipContent>
// //                               <div className="space-y-1">
// //                                 {eventsForDay.map((event) => (
// //                                   <div
// //                                     key={event._id}
// //                                     className="text-xs cursor-pointer"
// //                                     style={{ color: event.color }}
// //                                     onClick={() =>
// //                                       handleCalendarEventView(event)
// //                                     }
// //                                   >
// //                                     {event.event_name}
// //                                     <br />
// //                                     {new Date(
// //                                       event.start_datetime
// //                                     ).toLocaleTimeString([], {
// //                                       hour: '2-digit',
// //                                       minute: '2-digit',
// //                                     })}{' '}
// //                                     -{' '}
// //                                     {new Date(
// //                                       event.end_datetime
// //                                     ).toLocaleTimeString([], {
// //                                       hour: '2-digit',
// //                                       minute: '2-digit',
// //                                     })}
// //                                   </div>
// //                                 ))}
// //                               </div>
// //                             </TooltipContent>
// //                           </Tooltip>
// //                         ) : (
// //                           <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto">
// //                             {dayNumber}
// //                           </div>
// //                         )}
// //                       </TooltipProvider>
// //                     </div>
// //                   );
// //                 })}
// //                 {/* Optional: fill remaining cells if needed */}
// //                 {Array.from({ length: 42 - daysInMonth }).map((_, idx) => (
// //                   <div key={`empty-${idx}`} className="p-1" />
// //                 ))}
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     );
// //   };

// //   // ─── MONTH VIEW ─────────────────────────────────────────────────────────────
// //   const renderMonthView = () => {
// //     const currentMonth = selectedDate.getMonth();
// //     const currentYear = selectedDate.getFullYear();
// //     const firstDay = new Date(currentYear, currentMonth, 1);
// //     const lastDay = new Date(currentYear, currentMonth + 1, 0);
// //     const daysInMonth = lastDay.getDate();
// //     const startingDay = firstDay.getDay();

// //     const days = Array.from({ length: 42 }, (_, i) => {
// //       const dayNumber = i - startingDay + 1;
// //       const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
// //       const date = new Date(currentYear, currentMonth, dayNumber);
// //       const dayEvents = events.filter((event) => {
// //         const eventDate = new Date(event.start_datetime);
// //         return (
// //           eventDate.getDate() === dayNumber &&
// //           eventDate.getMonth() === currentMonth &&
// //           eventDate.getFullYear() === currentYear
// //         );
// //       });

// //       return {
// //         dayNumber,
// //         isCurrentMonth,
// //         events: dayEvents,
// //         date,
// //       };
// //     });

// //     return (
// //       <div className="overflow-x-auto">
// //         <div className="w-full min-w-[500px]">
// //           <div className="grid grid-cols-7 gap-4 mb-4">
// //             {daysOfWeek.map((day, index) => (
// //               <div
// //                 key={index}
// //                 className="text-center font-medium text-gray-600"
// //               >
// //                 {day}
// //               </div>
// //             ))}
// //           </div>
// //           <div className="grid grid-cols-7 gap-1">
// //             {days.map((day, index) => (
// //               <div
// //                 key={index}
// //                 className={`h-24 p-2 ${
// //                   day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
// //                 } relative ${
// //                   day.events.length > 0
// //                     ? 'border-2 border-blue-200'
// //                     : 'border border-gray-100'
// //                 } rounded-lg`}
// //               >
// //                 <span
// //                   className={`${
// //                     day.events.length > 0
// //                       ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center'
// //                       : !day.isCurrentMonth
// //                       ? 'text-gray-400'
// //                       : ''
// //                   }`}
// //                 >
// //                   {day.isCurrentMonth ? day.dayNumber : ''}
// //                 </span>
// //                 {day.events.map((event, i) => (
// //                   <div
// //                     key={i}
// //                     onClick={() => handleCalendarEventView(event)}
// //                     className="text-xs mt-1 truncate cursor-pointer"
// //                     style={{ backgroundColor: event.color }}
// //                   >
// //                     {event.event_name}
// //                   </div>
// //                 ))}
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // ─── OCCASION VIEW ───────────────────────────────────────────────────────────
// //   const renderOccasionView = () => {
// //     const groupedEvents = events.reduce<Record<string, Event[]>>(
// //       (acc, event) => {
// //         const type = event.event_name || 'Other';
// //         if (!acc[type]) acc[type] = [];
// //         acc[type].push(event);
// //         return acc;
// //       },
// //       {}
// //     );

// //     return (
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {Object.entries(groupedEvents).map(([type, events]) => (
// //           <div key={type} className="border rounded-lg p-4">
// //             <h3 className="font-semibold mb-4 flex items-center">
// //               <span className="text-xl mr-2">
// //                 {events[0]?.personalize_id?.icon_path ? (
// //                   <img
// //                     src={events[0].personalize_id.icon_path}
// //                     alt="icon"
// //                     className="w-6 h-6"
// //                   />
// //                 ) : (
// //                   '📅'
// //                 )}
// //               </span>
// //               {type}
// //             </h3>
// //             <div className="space-y-3">
// //               {events.map((event) => (
// //                 <div
// //                   key={event._id}
// //                   className="p-2 rounded-lg text-sm"
// //                   style={{ backgroundColor: event.color }}
// //                 >
// //                   <div className="font-medium">{event.sender_name}</div>
// //                   <div className="text-gray-600">
// //                     {new Date(event.start_datetime).toLocaleDateString()}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="p-6 bg-white min-h-screen">
// //       <div className="flex flex-col md:flex-row justify-between items-center mb-8">
// //         <div className="flex items-center gap-4 mb-4 md:mb-0">
// //           <h1 className="text-2xl font-semibold">Upcoming Dates</h1>
// //           <button
// //             onClick={() => setIsModalOpen(true)}
// //             className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xl hover:bg-green-600 transition-colors"
// //           >
// //             +
// //           </button>
// //         </div>
// //         <div className="flex flex-wrap gap-3">
// //           {['Week', 'Month', 'Year', 'Occasion'].map((mode) => (
// //             <button
// //               key={mode}
// //               onClick={() =>
// //                 setViewMode(
// //                   mode.toLowerCase() as 'week' | 'month' | 'year' | 'occasion'
// //                 )
// //               }
// //               className={`px-8 py-2 rounded-lg ${
// //                 viewMode === mode.toLowerCase()
// //                   ? 'bg-gray-800 text-white'
// //                   : 'bg-gray-100 text-gray-600'
// //               }`}
// //             >
// //               {mode}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {error && (
// //         <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg">
// //           {error}
// //         </div>
// //       )}

// //       {isLoading ? (
// //         <div className="flex justify-center items-center h-64">
// //           <div className="text-gray-500">Loading events...</div>
// //         </div>
// //       ) : (
// //         <div className="flex flex-col md:flex-row gap-6">
// //           {/* Sidebar: List of events */}
// //           <div className="w-full md:w-80">
// //             {events.map((event) => (
// //               <div
// //                 key={event._id}
// //                 className={`rounded-xl p-4 mb-3 relative cursor-pointer ${
// //                   selectedEvent?._id === event._id ? 'ring-2 ring-blue-500' : ''
// //                 }`}
// //                 style={{ backgroundColor: event.color }}
// //                 onClick={() => handleEventClick(event)}
// //               >
// //                 <div className="flex items-center">
// //                   <span className="text-2xl mr-3">
// //                     {event.personalize_id?.icon_path ? (
// //                       <img
// //                         src={event.personalize_id.icon_path}
// //                         alt=""
// //                         className="w-8 h-8"
// //                       />
// //                     ) : (
// //                       '📅'
// //                     )}
// //                   </span>
// //                   <div>
// //                     <h3 className="text-lg font-medium text-gray-800">
// //                       {event.sender_name}
// //                     </h3>
// //                     <p className="text-gray-600">{event.event_name}</p>
// //                     {selectedEvent?._id === event._id && (
// //                       <div className="text-sm mt-2">
// //                         <p>
// //                           Start:{' '}
// //                           {new Date(event.start_datetime).toLocaleString()}
// //                         </p>
// //                         <p>
// //                           End: {new Date(event.end_datetime).toLocaleString()}
// //                         </p>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //                 <div className="absolute top-4 right-4">
// //                   <div
// //                     className={`w-12 h-6 rounded-full p-1 cursor-pointer ${
// //                       toggleStates[event._id] ? 'bg-green-500' : 'bg-gray-200'
// //                     }`}
// //                     onClick={() => handleToggle(event._id)}
// //                   >
// //                     <div
// //                       className={`w-4 h-4 rounded-full transition-transform duration-300 ${
// //                         toggleStates[event._id]
// //                           ? 'bg-green-700 translate-x-6'
// //                           : 'bg-yellow-400'
// //                       }`}
// //                     ></div>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>

// //           {/* Main calendar view */}
// //           <div className="flex-1">
// //             {viewMode === 'week' && renderWeekView()}
// //             {viewMode === 'month' && renderMonthView()}
// //             {viewMode === 'year' && renderYearView()}
// //             {viewMode === 'occasion' && renderOccasionView()}
// //           </div>
// //         </div>
// //       )}

// //       {isModalOpen && (
// //         <AddEventModal
// //           onClose={() => setIsModalOpen(false)}
// //           onAddEvent={handleAddEvent}
// //           personalizedGifts={personalizedGifts}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default EventsPage;

// // src/components/page-ui/events_page/EventsPage.tsx
// import React, { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { WeekView } from './calendar-views/WeekView';
// import { MonthView } from './calendar-views/MonthView';
// import { YearView } from './calendar-views/YearView';
// import { OccasionView } from './calendar-views/OccasionView';
// import { CalendarSkeleton } from './calendar-views/CalendarSkeleton';
// import AddEventModal from './add-event-model';
// import { Event, ViewMode } from './types';
// import { Skeleton } from '@/components/ui/skeleton';
// import {
//   createEvents,
//   fetchEvents,
//   fetchPersonalizedGifts,
// } from '@/services/api.service';

// const EventsPage = () => {
//   const [viewMode, setViewMode] = useState<ViewMode>('week');
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());
//   const [events, setEvents] = useState<Event[]>([]);
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
//   const [personalizedGifts, setPersonalizedGifts] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});

//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const loadData = async () => {
//       setIsLoading(true);
//       try {
//         const [eventsResponse, giftsResponse] = await Promise.all([
//           fetchEvents(),
//           fetchPersonalizedGifts(),
//         ]);

//         setEvents(eventsResponse?.data || []);
//         setPersonalizedGifts(giftsResponse?.data || []);
//       } catch (error) {
//         setError('Failed to load data. Please try again later.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   useEffect(() => {
//     const selectedEventId = searchParams.get('selectedEvent');
//     if (selectedEventId && events.length > 0) {
//       const eventIndex = events.findIndex((e) => e._id === selectedEventId);
//       if (eventIndex > -1 && events[0]._id !== selectedEventId) {
//         const eventToBring = events[eventIndex];
//         setEvents([
//           eventToBring,
//           ...events.filter((_, idx) => idx !== eventIndex),
//         ]);
//         setSelectedEvent(eventToBring);
//       }
//     }
//   }, [searchParams, events]);

//   const handleAddEvent = async (eventData: any) => {
//     try {
//       await createEvents(eventData);
//       setIsModalOpen(false);
//       const response = await fetchEvents();
//       setEvents(response?.data || []);
//     } catch (error) {
//       setError('Failed to create event. Please try again.');
//     }
//   };

//   const handleEventClick = (event: Event) => {
//     router.push(`/events?selectedEvent=${event._id}`);
//   };

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-8">
//         <div className="flex items-center gap-4 mb-4 md:mb-0">
//           <h1 className="text-2xl font-semibold">Upcoming Dates</h1>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xl hover:bg-green-600 transition-colors"
//           >
//             +
//           </button>
//         </div>

//         {/* View Mode Selector */}
//         <div className="flex flex-wrap gap-3">
//           {(['Week', 'Month', 'Year', 'Occasion'] as const).map((mode) => (
//             <button
//               key={mode}
//               onClick={() => setViewMode(mode.toLowerCase() as ViewMode)}
//               className={`px-8 py-2 rounded-lg transition-colors ${
//                 viewMode === mode.toLowerCase()
//                   ? 'bg-gray-800 text-white'
//                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//               }`}
//             >
//               {mode}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg">
//           {error}
//         </div>
//       )}

//       {/* Main Content */}
//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Event List Sidebar */}
//         <div className="w-full md:w-80">
//           {isLoading ? (
//             <div className="space-y-4">
//               {Array.from({ length: 5 }).map((_, index) => (
//                 <Skeleton key={index} className="h-24 w-full" />
//               ))}
//             </div>
//           ) : (
//             events.map((event) => (
//               <div
//                 key={event._id}
//                 className={`rounded-xl p-4 mb-3 relative cursor-pointer transition-all ${
//                   selectedEvent?._id === event._id ? 'ring-2 ring-blue-500' : ''
//                 }`}
//                 style={{ backgroundColor: event.color }}
//                 onClick={() => handleEventClick(event)}
//               >
//                 {/* Event Card Content */}
//                 <div className="flex items-center">
//                   <span className="text-2xl mr-3">
//                     {event.personalize_id?.icon_path ? (
//                       <img
//                         src={event.personalize_id.icon_path}
//                         alt=""
//                         className="w-8 h-8"
//                       />
//                     ) : (
//                       '📅'
//                     )}
//                   </span>
//                   <div>
//                     <h3 className="text-lg font-medium text-gray-800">
//                       {event.sender_name}
//                     </h3>
//                     <p className="text-gray-600">{event.event_name}</p>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Calendar View */}
//         <div className="flex-1">
//           {isLoading ? (
//             <CalendarSkeleton />
//           ) : (
//             <>
//               {viewMode === 'week' && (
//                 <WeekView
//                   events={events}
//                   selectedDate={selectedDate}
//                   onEventClick={handleEventClick}
//                 />
//               )}
//               {viewMode === 'month' && (
//                 <MonthView
//                   events={events}
//                   selectedDate={selectedDate}
//                   onEventClick={handleEventClick}
//                 />
//               )}
//               {viewMode === 'year' && (
//                 <YearView
//                   events={events}
//                   selectedDate={selectedDate}
//                   onEventClick={handleEventClick}
//                 />
//               )}
//               {viewMode === 'occasion' && (
//                 <OccasionView events={events} onEventClick={handleEventClick} />
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Add Event Modal */}
//       {isModalOpen && (
//         <AddEventModal
//           onClose={() => setIsModalOpen(false)}
//           onAddEvent={handleAddEvent}
//           personalizedGifts={personalizedGifts}
//         />
//       )}
//     </div>
//   );
// };

// export default EventsPage;


'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AddEventModal from './add-event-model';
import {
  createEvents,
  fetchEvents,
  fetchPersonalizedGifts,
} from '@/services/api.service';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

interface Event {
  _id: string;
  customer_id: string;
  sender_name: string;
  event_name: string;
  start_datetime: string;
  end_datetime: string;
  personalize_id: {
    _id: string;
    name: string;
    icon_path: string;
    images: Array<{
      image_id: string;
      image_path: string;
    }>;
  };
  note: string;
  color: string;
  created_at: string;
}

const EventsPage = () => {
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'year' | 'occasion'>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [personalizedGifts, setPersonalizedGifts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});

  const router = useRouter();
  const searchParams = useSearchParams();

  // For month and year view
  const months = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2022, i))
  );
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  useEffect(() => {
    loadEvents();
    loadPersonalizedGifts();
  }, []);

  // Instead of reordering the events array, we just mark the selected event
  // and scroll it into view.
  useEffect(() => {
    const selectedEventId = searchParams.get('selectedEvent');
    if (selectedEventId && events.length > 0) {
      const eventToSelect = events.find((e) => e._id === selectedEventId);
      if (eventToSelect) {
        setSelectedEvent(eventToSelect);
        // Scroll the selected event's card into view
        setTimeout(() => {
          const element = document.getElementById(`event-${selectedEventId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [searchParams, events]);

  const loadEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchEvents();
      const fetchedEvents = response?.data || [];
      setEvents(Array.isArray(fetchedEvents) ? fetchedEvents : []);
    } catch (error) {
      setError('Failed to load events. Please try again later.');
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
      console.error('Failed to fetch personalized gifts:', error);
    }
  };

  const handleAddEvent = async (eventData: any) => {
    try {
      await createEvents(eventData);
      setIsModalOpen(false);
      loadEvents();
    } catch (error) {
      console.error('Failed to create event:', error);
      setError('Failed to create event. Please try again.');
    }
  };

  const handleToggle = (eventId: string) => {
    setToggleStates((prevStates) => ({
      ...prevStates,
      [eventId]: !prevStates[eventId],
    }));
  };

  const handleEventClick = (event: Event) => {
    // Just toggle selection; we no longer reorder the list.
    setSelectedEvent(selectedEvent?._id === event._id ? null : event);
  };

  // When a calendar event is clicked, navigate to /events?selectedEvent=ID
  const handleCalendarEventView = (event: Event) => {
    router.push(`/events?selectedEvent=${event._id}`);
  };

  // ─── WEEK VIEW ──────────────────────────────────────────────────────────────
  const renderWeekView = () => {
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
            const normalizedDate = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate()
            );
            const eventsForDay = events.filter((event) => {
              const start = new Date(event.start_datetime);
              const end = new Date(event.end_datetime);
              const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
              const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
              return normalizedDate >= startDate && normalizedDate <= endDate;
            });
            return (
              <div key={dayIndex} className="border rounded-lg p-4 min-h-[600px]">
                <div className="text-right mb-2 font-semibold">{date.getDate()}</div>
                {eventsForDay.length > 0 ? (
                  eventsForDay.map((event) => (
                    <div
                      key={event._id}
                      onClick={() => handleCalendarEventView(event)}
                      className="mb-2 p-2 rounded shadow-sm cursor-pointer"
                      style={{ backgroundColor: event.color }}
                    >
                      <div className="font-medium">{event.event_name}</div>
                      <div className="text-xs">
                        Start:{' '}
                        {new Date(event.start_datetime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        - End:{' '}
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

  // ─── YEAR VIEW ───────────────────────────────────────────────────────────────
  const renderYearView = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {months.map((month, monthIndex) => {
          const year = selectedDate.getFullYear();
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
                    const start = new Date(event.start_datetime);
                    const end = new Date(event.end_datetime);
                    return (
                      (start.getDate() === dayNumber &&
                        start.getMonth() === monthIndex &&
                        start.getFullYear() === year) ||
                      (end.getDate() === dayNumber &&
                        end.getMonth() === monthIndex &&
                        end.getFullYear() === year)
                    );
                  });
                  let latestEvent;
                  if (eventsForDay.length > 0) {
                    latestEvent = eventsForDay.reduce((prev, curr) =>
                      new Date(curr.start_datetime) > new Date(prev.start_datetime)
                        ? curr
                        : prev
                    );
                  }
                  return (
                    <div key={dayIndex} className="text-center p-1 relative">
                      <TooltipProvider>
                        {eventsForDay.length > 0 ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                onClick={() => handleCalendarEventView(latestEvent!)}
                                className="w-8 h-8 rounded-full flex items-center justify-center mx-auto cursor-pointer"
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
                                    onClick={() => handleCalendarEventView(event)}
                                  >
                                    {event.event_name}
                                    <br />
                                    {new Date(event.start_datetime).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}{' '}
                                    -{' '}
                                    {new Date(event.end_datetime).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </div>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto">
                            {dayNumber}
                          </div>
                        )}
                      </TooltipProvider>
                    </div>
                  );
                })}
                {Array.from({ length: 42 - daysInMonth }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="p-1" />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ─── MONTH VIEW ─────────────────────────────────────────────────────────────
  const renderMonthView = () => {
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

      return {
        dayNumber,
        isCurrentMonth,
        events: dayEvents,
        date,
      };
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
                className={`h-24 p-2 ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'} relative ${
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
                    onClick={() => handleCalendarEventView(event)}
                    className="text-xs mt-1 truncate cursor-pointer"
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

  // ─── OCCASION VIEW ───────────────────────────────────────────────────────────
  const renderOccasionView = () => {
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
                  className="p-2 rounded-lg text-sm"
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

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <h1 className="text-2xl font-semibold">Upcoming Dates</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xl hover:bg-green-600 transition-colors"
          >
            +
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {['Week', 'Month', 'Year', 'Occasion'].map((mode) => (
            <button
              key={mode}
              onClick={() =>
                setViewMode(
                  mode.toLowerCase() as 'week' | 'month' | 'year' | 'occasion'
                )
              }
              className={`px-8 py-2 rounded-lg ${
                viewMode === mode.toLowerCase()
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading events...</div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar: List of events */}
          <div className="w-full md:w-80">
            {events.map((event) => (
              <div
                id={`event-${event._id}`}
                key={event._id}
                className={`rounded-xl p-4 mb-3 relative cursor-pointer ${
                  selectedEvent?._id === event._id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{ backgroundColor: event.color }}
                onClick={() => handleEventClick(event)}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">
                    {event.personalize_id?.icon_path ? (
                      <img
                        src={event.personalize_id.icon_path}
                        alt=""
                        className="w-8 h-8"
                      />
                    ) : (
                      '📅'
                    )}
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {event.sender_name}
                    </h3>
                    <p className="text-gray-600">{event.event_name}</p>
                    {selectedEvent?._id === event._id && (
                      <div className="text-sm mt-2">
                        <p>
                          Start:{' '}
                          {new Date(event.start_datetime).toLocaleString()}
                        </p>
                        <p>
                          End: {new Date(event.end_datetime).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <div
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer ${
                      toggleStates[event._id] ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    onClick={() => handleToggle(event._id)}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-transform duration-300 ${
                        toggleStates[event._id]
                          ? 'bg-green-700 translate-x-6'
                          : 'bg-yellow-400'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main calendar view */}
          <div className="flex-1">
            {viewMode === 'week' && renderWeekView()}
            {viewMode === 'month' && renderMonthView()}
            {viewMode === 'year' && renderYearView()}
            {viewMode === 'occasion' && renderOccasionView()}
          </div>
        </div>
      )}

      {isModalOpen && (
        <AddEventModal
          onClose={() => setIsModalOpen(false)}
          onAddEvent={handleAddEvent}
          personalizedGifts={personalizedGifts}
        />
      )}
    </div>
  );
};

export default EventsPage;
