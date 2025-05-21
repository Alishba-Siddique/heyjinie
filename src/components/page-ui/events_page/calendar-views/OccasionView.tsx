// // src/components/page-ui/events_page/calendar-views/OccasionView.tsx
// import { Event } from '../types';

// interface OccasionViewProps {
//   events: Event[];
//   onEventClick: (event: Event) => void;
// }

// export const OccasionView = ({ events, onEventClick }: OccasionViewProps) => {
//   const groupedEvents = events.reduce<Record<string, Event[]>>(
//     (acc, event) => {
//       const type = event.event_name || 'Other';
//       if (!acc[type]) acc[type] = [];
//       acc[type].push(event);
    
//       return acc;
//     },
//     {}
//   );

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {Object.entries(groupedEvents).map(([type, events]) => (
//         <div key={type} className="border rounded-lg p-4">
//           <h3 className="font-semibold mb-4 flex items-center">
//             <span className="text-xl mr-2">
//               {events[0]?.personalize_id?.icon_path ? (
//                 <img
//                   src={events[0].personalize_id.icon_path}
//                   alt="icon"
//                   className="w-6 h-6"
//                 />
                
//               ) : (
//                 '📅'
//               )}
//             </span>
//             {type}
//           </h3>
//           <div className="space-y-3">
//             {events.map((event) => (
//               <div
//                 key={event._id}
//                 onClick={() => onEventClick(event)}
//                 className="p-2 rounded-lg text-sm cursor-pointer transition-colors hover:opacity-90"
//                 style={{ backgroundColor: event.color }}
//               >
//                 <div className="font-medium text-white">{event.sender_name}</div>
//                 <div className="text-[#e6e6e6]">
//                   {new Date(event.start_datetime).toLocaleDateString()}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// src/components/page-ui/events_page/calendar-views/OccasionView.tsx
import { Event } from '../types';
import { format } from 'date-fns';

interface OccasionViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export const OccasionView = ({ events, onEventClick }: OccasionViewProps) => {
  // Group events by occasion/type
  const groupedEvents = events.reduce((acc, event) => {
    const occasionType = event.event_name || 'Other';
    if (!acc[occasionType]) {
      acc[occasionType] = [];
    }
    acc[occasionType].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents).length > 0 ? (
        Object.entries(groupedEvents).map(([occasionType, typeEvents]) => (
          <div key={occasionType} className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium mb-3 text-gray-800">
              {occasionType}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({typeEvents.length} event{typeEvents.length !== 1 ? 's' : ''})
              </span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {typeEvents.map((event) => (
                <div
                  key={event._id}
                  onClick={() => onEventClick(event)}
                  className="p-3 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  style={{ 
                    borderLeft: `4px solid ${event.color || '#40A574'}`,
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <div className="font-medium">{event.sender_name || 'Unnamed Event'}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {format(new Date(event.start_datetime), 'PPP')}
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>
                      {format(new Date(event.start_datetime), 'p')} - {format(new Date(event.end_datetime), 'p')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10 bg-white rounded-lg">
          <p className="text-gray-500">No events found</p>
        </div>
      )}
    </div>
  );
};
