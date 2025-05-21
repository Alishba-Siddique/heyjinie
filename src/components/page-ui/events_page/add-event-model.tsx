// // // src/components/page_ui/add-event-model.tsx
// // 'use client';
// // import { useState, useEffect } from 'react';
// // import { useForm, Controller } from 'react-hook-form';
// // import { z } from 'zod';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { X, Calendar } from 'lucide-react';
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription, // <-- Import DialogDescription
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// // } from '@/components/ui/dialog';
// // import { Button } from '@/components/ui/button';
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// // } from '@/components/ui/dropdown-menu';
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import { Textarea } from '@/components/ui/textarea';

// // const eventSchema = z
// //   .object({
// //     sender_name: z.string().min(1, { message: 'Name is required' }),
// //     event_name: z.string().min(1, { message: 'Event type is required' }),
// //     // Ensure personalize_id is always part of the schema and required
// //     personalize_id: z
// //       .string()
// //       .min(1, { message: 'Personalized ID is required' }),
// //     start_datetime: z
// //       .string()
// //       .min(1, { message: 'Start date and time are required' }),
// //     end_datetime: z
// //       .string()
// //       .min(1, { message: 'End date and time are required' }),
// //     color: z.string().optional().default('#4CAF50'),
// //     note: z.string().optional().default(''),
// //   })
// //   .refine(
// //     (data) => {
// //       // Add defensive check for valid dates before comparing
// //       try {
// //         const start = new Date(data.start_datetime);
// //         const end = new Date(data.end_datetime);
// //         // Check if dates are valid before comparing
// //         if (isNaN(start.getTime()) || isNaN(end.getTime())) {
// //           return false; // Invalid date input
// //         }
// //         return end >= start;
// //       } catch (e) {
// //         return false; // Handle potential errors from new Date()
// //       }
// //     },
// //     {
// //       message: 'End date and time must be on or after start date and time',
// //       path: ['end_datetime'], // Apply error to end_datetime field
// //     }
// //   );

// // type EventFormData = z.infer<typeof eventSchema>;

// // const AddEventModal = ({
// //   isOpen, // Control dialog visibility via prop
// //   onClose,
// //   onAddEvent,
// //   personalizedGifts,
// // }: {
// //   isOpen: boolean; // Added prop to control open state
// //   onClose: () => void;
// //   onAddEvent: (eventData: EventFormData) => void;
// //   personalizedGifts: { _id: string; name: string; icon_path?: string }[];
// // }) => {
// //   const {
// //     control,
// //     register,
// //     handleSubmit,
// //     setValue,
// //     watch,
// //     reset, // Add reset to clear form on close/success
// //     formState: { errors },
// //   } = useForm<EventFormData>({
// //     resolver: zodResolver(eventSchema),
// //     mode: 'onChange', // Keep onChange or consider onBlur/onSubmit for less aggressive validation
// //     defaultValues: {
// //       sender_name: '',
// //       event_name: '',
// //       personalize_id: '', // Initialize personalize_id
// //       start_datetime: new Date().toISOString().slice(0, 16),
// //       end_datetime: new Date().toISOString().slice(0, 16),
// //       color: '#4CAF50',
// //       note: '',
// //     },
// //   });

// //   const [activeColor, setActiveColor] = useState('#4CAF50');
// //   // Dropdown state no longer needed as Shadcn handles it
// //   // const [showDropdown, setShowDropdown] = useState(false);
// //   const eventName = watch('event_name');
// //   const startDateTime = watch('start_datetime');
// //   const selectedColor = watch('color'); // Renamed watch variable for clarity

// //   // Sync activeColor state with form value when form value changes
// //   useEffect(() => {
// //     setActiveColor(selectedColor || '#4CAF50');
// //   }, [selectedColor]);

// //   // Ensure end date is not before start date
// //   useEffect(() => {
// //     const startDate = new Date(startDateTime);
// //     const endDate = new Date(watch('end_datetime'));

// //     if (
// //       !isNaN(startDate.getTime()) &&
// //       !isNaN(endDate.getTime()) &&
// //       endDate < startDate
// //     ) {
// //       setValue('end_datetime', startDateTime, { shouldValidate: true });
// //     }
// //   }, [startDateTime, setValue, watch]);

// //   const handleFormSubmit = (data: EventFormData) => {
// //     console.log('Submitting data:', data); // Debug: Check submitted data
// //     onAddEvent(data);
// //     reset(); // Clear the form after successful submission
// //     onClose(); // Close the modal
// //   };

// //   const handleColorSelect = (color: string) => {
// //     setActiveColor(color);
// //     setValue('color', color, {
// //       shouldValidate: true, // Ensure validation runs if needed
// //       shouldDirty: true,
// //       shouldTouch: true,
// //     });
// //   };

// //   const handleModalClose = () => {
// //     reset(); // Reset form fields when closing manually
// //     onClose();
// //   };

// //   // Handle Dropdown selection
// //   const handleEventSelect = (gift: { _id: string; name: string }) => {
// //     setValue('event_name', gift.name, { shouldValidate: true });
// //     // Crucially, also set personalize_id and validate
// //     setValue('personalize_id', gift._id, { shouldValidate: true });
// //     // Dropdown closes automatically via Shadcn
// //   };

// //   return (
// //     // Control Dialog visibility using the isOpen prop
// //     <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
// //       {/* Link content to description using aria-describedby */}
// //       <DialogContent
// //         className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
// //         aria-describedby="add-event-modal-description"
// //       >
// //         <DialogHeader>
// //           <DialogTitle>Add Event</DialogTitle>
// //           {/* The description with matching id */}
// //           <DialogDescription
// //             id="add-event-modal-description"
// //             className="sr-only"
// //           >
// //             {' '}
// //             {/* Use sr-only if it should be hidden visually */}
// //             Use this form to add a new event to your calendar.
// //           </DialogDescription>
// //           <button /* close button */>
// //             <span className="sr-only">Close</span>
// //           </button>
// //         </DialogHeader>

// //         {/* Use React Hook Form's handleSubmit */}
// //         <form
// //           onSubmit={handleSubmit(handleFormSubmit)}
// //           className="space-y-4 px-2 py-4"
// //         >
// //           {/* Sender Name Input */}
// //           <div>
// //             <Label htmlFor="sender_name">Name</Label>
// //             <Input
// //               id="sender_name"
// //               placeholder="Enter name"
// //               className={`w-full p-3 border rounded-lg mt-1 ${
// //                 errors.sender_name ? 'border-red-500' : 'border-gray-300'
// //               }`}
// //               {...register('sender_name')}
// //             />
// //             {errors.sender_name && (
// //               <p className="text-red-500 text-sm mt-1">
// //                 {errors.sender_name.message}
// //               </p>
// //             )}
// //           </div>

// //           {/* Event Type Dropdown */}
// //           <div>
// //             <Label>Event Type</Label>
// //             {/* Hidden input to register personalize_id, though setValue should handle it */}
// //             <input type="hidden" {...register('personalize_id')} />
// //             <DropdownMenu>
// //               <DropdownMenuTrigger asChild>
// //                 <Button
// //                   type="button" // Prevent form submission
// //                   variant="outline"
// //                   role="combobox"
// //                   className={`flex border justify-between p-3 rounded-lg w-full cursor-pointer items-center mt-1 ${
// //                     errors.event_name ? 'border-red-500' : 'border-gray-300'
// //                   } ${!eventName ? 'text-gray-500' : ''}`}
// //                 >
// //                   {eventName || 'Select Event Type'}
// //                   <Calendar className="h-4 w-4 ml-2 opacity-50" />
// //                 </Button>
// //               </DropdownMenuTrigger>
// //               <DropdownMenuContent className="w-[calc(600px-4rem)] max-w-[550px]">
// //                 {' '}
// //                 {/* Adjust width relative to modal */}
// //                 {personalizedGifts.length > 0 ? (
// //                   personalizedGifts.map((gift) => (
// //                     <DropdownMenuItem
// //                       key={gift._id}
// //                       onSelect={() => handleEventSelect(gift)} // Use handler to set both fields
// //                       className="cursor-pointer"
// //                     >
// //                       <div className="flex items-center">
// //                         {gift.icon_path && (
// //                           <img
// //                             src={gift.icon_path}
// //                             alt=""
// //                             className="h-4 w-4 mr-2 object-contain" // Added object-contain
// //                           />
// //                         )}
// //                         <span>{gift.name}</span>
// //                       </div>
// //                     </DropdownMenuItem>
// //                   ))
// //                 ) : (
// //                   <DropdownMenuItem disabled>
// //                     No event types available
// //                   </DropdownMenuItem>
// //                 )}
// //               </DropdownMenuContent>
// //             </DropdownMenu>
// //             {(errors.event_name || errors.personalize_id) && ( // Show error if either field fails validation
// //               <p className="text-red-500 text-sm mt-1">
// //                 {errors.event_name?.message || errors.personalize_id?.message}
// //               </p>
// //             )}
// //           </div>

// //           {/* Date Inputs */}
// //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //             <div>
// //               <Label htmlFor="start_datetime">Start Date & Time</Label>
// //               <Controller
// //                 name="start_datetime"
// //                 control={control}
// //                 render={({ field }) => (
// //                   <Input
// //                     id="start_datetime"
// //                     type="datetime-local"
// //                     className={`mt-1 ${
// //                       errors.start_datetime
// //                         ? 'border-red-500'
// //                         : 'border-gray-300'
// //                     }`}
// //                     {...field}
// //                   />
// //                 )}
// //               />
// //               {errors.start_datetime && (
// //                 <p className="text-red-500 text-sm mt-1">
// //                   {errors.start_datetime.message}
// //                 </p>
// //               )}
// //             </div>
// //             <div>
// //               <Label htmlFor="end_datetime">End Date & Time</Label>
// //               <Controller
// //                 name="end_datetime"
// //                 control={control}
// //                 render={({ field }) => (
// //                   <Input
// //                     id="end_datetime"
// //                     type="datetime-local"
// //                     className={`mt-1 ${
// //                       errors.end_datetime ? 'border-red-500' : 'border-gray-300'
// //                     }`}
// //                     min={startDateTime} // Ensure min is set dynamically
// //                     {...field}
// //                   />
// //                 )}
// //               />
// //               {errors.end_datetime && (
// //                 <p className="text-red-500 text-sm mt-1">
// //                   {errors.end_datetime.message}
// //                 </p>
// //               )}
// //             </div>
// //           </div>

// //           {/* Color Picker */}
// //           <div>
// //             <Label>Color</Label>
// //             <div className="flex gap-2 items-center mt-1">
// //               {['#4CAF50', '#FFC107', '#FF9898', '#90CAF9', '#FF5722'].map(
// //                 (colorValue) => (
// //                   <Button
// //                     key={colorValue}
// //                     type="button" // Explicitly set type="button"
// //                     variant="ghost" // Use ghost for better styling control
// //                     className={`w-8 h-8 rounded-full p-0 border border-gray-300 ${
// //                       activeColor === colorValue
// //                         ? 'ring-2 ring-offset-2 ring-blue-500'
// //                         : ''
// //                     }`}
// //                     style={{ backgroundColor: colorValue }}
// //                     onClick={() => handleColorSelect(colorValue)} // Corrected variable name
// //                     aria-label={`Select color ${colorValue}`}
// //                   />
// //                 )
// //               )}
// //               {/* Optionally, add hidden input for color if needed, though setValue should suffice */}
// //               {/* <input type="hidden" {...register('color')} /> */}
// //             </div>
// //             {errors.color && ( // Add error display for color if validation added
// //               <p className="text-red-500 text-sm mt-1">
// //                 {errors.color.message}
// //               </p>
// //             )}
// //           </div>

// //           {/* Notes */}
// //           <div>
// //             <Label htmlFor="note">Notes (Optional)</Label>
// //             <Textarea
// //               id="note"
// //               placeholder="Type notes here"
// //               className="resize-none mt-1 border-gray-300"
// //               rows={3} // Set initial rows
// //               {...register('note')}
// //             />
// //             {errors.note && ( // Add error display for note if validation added
// //               <p className="text-red-500 text-sm mt-1">{errors.note.message}</p>
// //             )}
// //           </div>

// //           {/* Submit Button */}
// //           <DialogFooter className="mt-6">
// //             {/* Add Cancel Button */}
// //             <Button type="button" variant="outline" onClick={handleModalClose}>
// //               Cancel
// //             </Button>
// //             <Button
// //               type="submit"
// //               className="bg-[#40A574]  text-white hover:bg-[#40A574] rounded-full transition-colors sm:w-auto w-full"
// //             >
// //               Save Event
// //             </Button>
// //           </DialogFooter>
// //         </form>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // };

// // export default AddEventModal;

// // src/components/page_ui/add-event-model.tsx
// 'use client';
// import { useState, useEffect } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { X, Calendar } from 'lucide-react';
// import { format, parseISO } from 'date-fns';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';

// const eventSchema = z
//   .object({
//     sender_name: z.string().min(1, { message: 'Name is required' }),
//     event_name: z.string().min(1, { message: 'Event type is required' }),
//     personalize_id: z
//       .string()
//       .min(1, { message: 'Personalized ID is required' }),
//     start_datetime: z
//       .string()
//       .min(1, { message: 'Start date and time are required' }),
//     end_datetime: z
//       .string()
//       .min(1, { message: 'End date and time are required' }),
//     color: z.string().optional().default('#4CAF50'),
//     note: z.string().optional().default(''),
//   })
//   .refine(
//     (data) => {
//       try {
//         const start = new Date(data.start_datetime);
//         const end = new Date(data.end_datetime);
//         if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//           return false;
//         }
//         return end >= start;
//       } catch (e) {
//         return false;
//       }
//     },
//     {
//       message: 'End date and time must be on or after start date and time',
//       path: ['end_datetime'],
//     }
//   );

// type EventFormData = z.infer<typeof eventSchema>;

// // Interface for the transformed data that matches API expectations
// interface ApiEventData extends Omit<EventFormData, 'start_datetime' | 'end_datetime'> {
//   start_datetime: string;
//   end_datetime: string;
// }

// const AddEventModal = ({
//   isOpen,
//   onClose,
//   onAddEvent,
//   personalizedGifts,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   onAddEvent: (eventData: ApiEventData) => void;
//   personalizedGifts: { _id: string; name: string; icon_path?: string }[];
// }) => {
//   const {
//     control,
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm<EventFormData>({
//     resolver: zodResolver(eventSchema),
//     mode: 'onChange',
//     defaultValues: {
//       sender_name: '',
//       event_name: '',
//       personalize_id: '',
//       start_datetime: new Date().toISOString().slice(0, 16),
//       end_datetime: new Date().toISOString().slice(0, 16),
//       color: '#4CAF50',
//       note: '',
//     },
//   });

//   const [activeColor, setActiveColor] = useState('#4CAF50');
//   const eventName = watch('event_name');
//   const startDateTime = watch('start_datetime');
//   const selectedColor = watch('color');

//   useEffect(() => {
//     setActiveColor(selectedColor || '#4CAF50');
//   }, [selectedColor]);

//   useEffect(() => {
//     const startDate = new Date(startDateTime);
//     const endDate = new Date(watch('end_datetime'));

//     if (
//       !isNaN(startDate.getTime()) &&
//       !isNaN(endDate.getTime()) &&
//       endDate < startDate
//     ) {
//       setValue('end_datetime', startDateTime, { shouldValidate: true });
//     }
//   }, [startDateTime, setValue, watch]);

//   const formatDateForApi = (dateString: string): string => {
//     try {
//       // For HTML datetime-local inputs, the format is YYYY-MM-DDTHH:MM
//       // We need to convert it to YYYY-MM-DD:HH:MM:00
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return dateString;

//       return format(date, "yyyy-MM-dd:HH:mm:00");
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return dateString;
//     }
//   };

//   const handleFormSubmit = (data: EventFormData) => {
//     // Format dates for API
//     const formattedData: ApiEventData = {
//       ...data,
//       start_datetime: formatDateForApi(data.start_datetime),
//       end_datetime: formatDateForApi(data.end_datetime)
//     };

//     console.log('Submitting data:', formattedData);
//     onAddEvent(formattedData);
//     reset();
//     onClose();
//   };

//   const handleColorSelect = (color: string) => {
//     setActiveColor(color);
//     setValue('color', color, {
//       shouldValidate: true,
//       shouldDirty: true,
//       shouldTouch: true,
//     });
//   };

//   const handleModalClose = () => {
//     reset();
//     onClose();
//   };

//   const handleEventSelect = (gift: { _id: string; name: string }) => {
//     setValue('event_name', gift.name, { shouldValidate: true });
//     setValue('personalize_id', gift._id, { shouldValidate: true });
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
//       <DialogContent
//         className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
//         aria-describedby="add-event-modal-description"
//       >
//         <DialogHeader>
//           <DialogTitle>Add Event</DialogTitle>
//           <DialogDescription
//             id="add-event-modal-description"
//             className="sr-only"
//           >
//             Use this form to add a new event to your calendar.
//           </DialogDescription>
//           <button
//             onClick={handleModalClose}
//             className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
//           >
//             <X className="h-4 w-4" />
//             <span className="sr-only">Close</span>
//           </button>
//         </DialogHeader>

//         <form
//           onSubmit={handleSubmit(handleFormSubmit)}
//           className="space-y-4 px-2 py-4"
//         >
//           {/* Sender Name Input */}
//           <div>
//             <Label htmlFor="sender_name">Name</Label>
//             <Input
//               id="sender_name"
//               placeholder="Enter name"
//               className={`w-full p-3 border rounded-lg mt-1 ${
//                 errors.sender_name ? 'border-red-500' : 'border-gray-300'
//               }`}
//               {...register('sender_name')}
//             />
//             {errors.sender_name && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.sender_name.message}
//               </p>
//             )}
//           </div>

//           {/* Event Type Dropdown */}
//           <div>
//             <Label>Event Type</Label>
//             <input type="hidden" {...register('personalize_id')} />
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   role="combobox"
//                   className={`flex border justify-between p-3 rounded-lg w-full cursor-pointer items-center mt-1 ${
//                     errors.event_name ? 'border-red-500' : 'border-gray-300'
//                   } ${!eventName ? 'text-gray-500' : ''}`}
//                 >
//                   {eventName || 'Select Event Type'}
//                   <Calendar className="h-4 w-4 ml-2 opacity-50" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-[calc(600px-4rem)] max-w-[550px]">
//                 {personalizedGifts.length > 0 ? (
//                   personalizedGifts.map((gift) => (
//                     <DropdownMenuItem
//                       key={gift._id}
//                       onSelect={() => handleEventSelect(gift)}
//                       className="cursor-pointer"
//                     >
//                       <div className="flex items-center">
//                         {gift.icon_path && (
//                           <img
//                             src={gift.icon_path}
//                             alt=""
//                             className="h-4 w-4 mr-2 object-contain"
//                           />
//                         )}
//                         <span>{gift.name}</span>
//                       </div>
//                     </DropdownMenuItem>
//                   ))
//                 ) : (
//                   <DropdownMenuItem disabled>
//                     No event types available
//                   </DropdownMenuItem>
//                 )}
//               </DropdownMenuContent>
//             </DropdownMenu>
//             {(errors.event_name || errors.personalize_id) && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.event_name?.message || errors.personalize_id?.message}
//               </p>
//             )}
//           </div>

//           {/* Date Inputs - Fixed layout to prevent shifting */}
//           <div className="flex flex-col gap-4 mt-4">
//             {/* Date-time section container */}
//             <div className="flex flex-wrap md:flex-nowrap gap-4">
//               <div className="w-full md:w-1/2">
//                 <Label htmlFor="start_datetime">Start Date & Time</Label>
//                 <Controller
//                   name="start_datetime"
//                   control={control}
//                   render={({ field }) => (
//                     <Input
//                       id="start_datetime"
//                       type="datetime-local"
//                       className={`mt-1 ${
//                         errors.start_datetime
//                           ? 'border-red-500'
//                           : 'border-gray-300'
//                       }`}
//                       {...field}
//                     />
//                   )}
//                 />
//                 {errors.start_datetime && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.start_datetime.message}
//                   </p>
//                 )}
//               </div>
//               <div className="w-full md:w-1/2">
//                 <Label htmlFor="end_datetime">End Date & Time</Label>
//                 <Controller
//                   name="end_datetime"
//                   control={control}
//                   render={({ field }) => (
//                     <Input
//                       id="end_datetime"
//                       type="datetime-local"
//                       className={`mt-1 ${
//                         errors.end_datetime ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                       min={startDateTime}
//                       {...field}
//                     />
//                   )}
//                 />
//                 {errors.end_datetime && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.end_datetime.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Color Picker */}
//           <div>
//             <Label>Color</Label>
//             <div className="flex gap-2 items-center mt-1">
//               {['#4CAF50', '#FFC107', '#FF9898', '#90CAF9', '#FF5722'].map(
//                 (colorValue) => (
//                   <Button
//                     key={colorValue}
//                     type="button"
//                     variant="ghost"
//                     className={`w-8 h-8 rounded-full p-0 border border-gray-300 ${
//                       activeColor === colorValue
//                         ? 'ring-2 ring-offset-2 ring-blue-500'
//                         : ''
//                     }`}
//                     style={{ backgroundColor: colorValue }}
//                     onClick={() => handleColorSelect(colorValue)}
//                     aria-label={`Select color ${colorValue}`}
//                   />
//                 )
//               )}
//             </div>
//             {errors.color && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.color.message}
//               </p>
//             )}
//           </div>

//           {/* Notes */}
//           <div>
//             <Label htmlFor="note">Notes (Optional)</Label>
//             <Textarea
//               id="note"
//               placeholder="Type notes here"
//               className="resize-none mt-1 border-gray-300"
//               rows={3}
//               {...register('note')}
//             />
//             {errors.note && (
//               <p className="text-red-500 text-sm mt-1">{errors.note.message}</p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <DialogFooter className="mt-6">
//             <Button type="button" variant="outline" onClick={handleModalClose}>
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="bg-[#40A574] text-white hover:bg-[#40A574] rounded-full transition-colors sm:w-auto w-full"
//             >
//               Save Event
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AddEventModal;

// // src/components/page_ui/add-event-model.tsx
// 'use client';
// import { useState, useEffect } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { X, Calendar } from 'lucide-react';
// import { format } from 'date-fns';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';

// const eventSchema = z
//   .object({
//     sender_name: z.string().min(1, { message: 'Name is required' }),
//     event_name: z.string().min(1, { message: 'Event type is required' }),
//     personalize_id: z
//       .string()
//       .min(1, { message: 'Personalized ID is required' }),
//     start_datetime: z
//       .string()
//       .min(1, { message: 'Start date and time are required' }),
//     end_datetime: z
//       .string()
//       .min(1, { message: 'End date and time are required' }),
//     color: z.string().optional().default('#4CAF50'),
//     note: z.string().optional().default(''),
//   })
//   .refine(
//     (data) => {
//       try {
//         const start = new Date(data.start_datetime);
//         const end = new Date(data.end_datetime);
//         if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//           return false;
//         }
//         return end >= start;
//       } catch (e) {
//         return false;
//       }
//     },
//     {
//       message: 'End date and time must be on or after start date and time',
//       path: ['end_datetime'],
//     }
//   );

// type EventFormData = z.infer<typeof eventSchema>;

// // Helper function to format date from datetime-local input to required API format
// const formatDateForApi = (dateString: string): string => {
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) {
//       throw new Error("Invalid date");
//     }

//     // Format as "YYYY-MM-DD:HH:MM:00"
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');

//     return `${year}-${month}-${day}:${hours}:${minutes}:00`;
//   } catch (error) {
//     console.error("Error formatting date:", error);
//     return dateString;
//   }
// };

// const AddEventModal = ({
//   isOpen,
//   onClose,
//   onAddEvent,
//   personalizedGifts,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   onAddEvent: (eventData: any) => void;
//   personalizedGifts: { _id: string; name: string; icon_path?: string }[];
// }) => {
//   const {
//     control,
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm<EventFormData>({
//     resolver: zodResolver(eventSchema),
//     mode: 'onChange',
//     defaultValues: {
//       sender_name: '',
//       event_name: '',
//       personalize_id: '',
//       start_datetime: new Date().toISOString().slice(0, 16),
//       end_datetime: new Date().toISOString().slice(0, 16),
//       color: '#4CAF50',
//       note: '',
//     },
//   });

//   const [activeColor, setActiveColor] = useState('#4CAF50');
//   const eventName = watch('event_name');
//   const startDateTime = watch('start_datetime');
//   const selectedColor = watch('color');

//   useEffect(() => {
//     setActiveColor(selectedColor || '#4CAF50');
//   }, [selectedColor]);

//   useEffect(() => {
//     const startDate = new Date(startDateTime);
//     const endDate = new Date(watch('end_datetime'));

//     if (
//       !isNaN(startDate.getTime()) &&
//       !isNaN(endDate.getTime()) &&
//       endDate < startDate
//     ) {
//       setValue('end_datetime', startDateTime, { shouldValidate: true });
//     }
//   }, [startDateTime, setValue, watch]);

//   const handleFormSubmit = (data: EventFormData) => {
//     // Format dates exactly as required by the API
//     const formattedData = {
//       sender_name: data.sender_name,
//       event_name: data.event_name,
//       personalize_id: data.personalize_id,
//       start_datetime: formatDateForApi(data.start_datetime),
//       end_datetime: formatDateForApi(data.end_datetime),
//       color: data.color,
//       note: data.note
//     };

//     console.log('Submitting data:', formattedData);
//     onAddEvent(formattedData);
//     reset();
//     onClose();
//   };

//   const handleColorSelect = (color: string) => {
//     setActiveColor(color);
//     setValue('color', color, {
//       shouldValidate: true,
//       shouldDirty: true,
//       shouldTouch: true,
//     });
//   };

//   const handleModalClose = () => {
//     reset();
//     onClose();
//   };

//   const handleEventSelect = (gift: { _id: string; name: string }) => {
//     setValue('event_name', gift.name, { shouldValidate: true });
//     setValue('personalize_id', gift._id, { shouldValidate: true });
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
//       <DialogContent
//         className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
//         aria-describedby="add-event-modal-description"
//       >
//         <DialogHeader>
//           <DialogTitle>Add Event</DialogTitle>
//           <DialogDescription
//             id="add-event-modal-description"
//             className="sr-only"
//           >
//             Use this form to add a new event to your calendar.
//           </DialogDescription>
//           <button
//             onClick={handleModalClose}
//             className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
//           >
//             <X className="h-4 w-4" />
//             <span className="sr-only">Close</span>
//           </button>
//         </DialogHeader>

//         <form
//           onSubmit={handleSubmit(handleFormSubmit)}
//           className="space-y-4 px-2 py-4"
//         >
//           {/* Sender Name Input */}
//           <div>
//             <Label htmlFor="sender_name">Name</Label>
//             <Input
//               id="sender_name"
//               placeholder="Enter name"
//               className={`w-full p-3 border rounded-lg mt-1 ${
//                 errors.sender_name ? 'border-red-500' : 'border-gray-300'
//               }`}
//               {...register('sender_name')}
//             />
//             {errors.sender_name && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.sender_name.message}
//               </p>
//             )}
//           </div>

//           {/* Event Type Dropdown */}
//           <div>
//             <Label>Event Type</Label>
//             <input type="hidden" {...register('personalize_id')} />
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   role="combobox"
//                   className={`flex border justify-between p-3 rounded-lg w-full cursor-pointer items-center mt-1 ${
//                     errors.event_name ? 'border-red-500' : 'border-gray-300'
//                   } ${!eventName ? 'text-gray-500' : ''}`}
//                 >
//                   {eventName || 'Select Event Type'}
//                   <Calendar className="h-4 w-4 ml-2 opacity-50" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-[calc(600px-4rem)] max-w-[550px]">
//                 {personalizedGifts.length > 0 ? (
//                   personalizedGifts.map((gift) => (
//                     <DropdownMenuItem
//                       key={gift._id}
//                       onSelect={() => handleEventSelect(gift)}
//                       className="cursor-pointer"
//                     >
//                       <div className="flex items-center">
//                         {gift.icon_path && (
//                           <img
//                             src={gift.icon_path}
//                             alt=""
//                             className="h-4 w-4 mr-2 object-contain"
//                           />
//                         )}
//                         <span>{gift.name}</span>
//                       </div>
//                     </DropdownMenuItem>
//                   ))
//                 ) : (
//                   <DropdownMenuItem disabled>
//                     No event types available
//                   </DropdownMenuItem>
//                 )}
//               </DropdownMenuContent>
//             </DropdownMenu>
//             {(errors.event_name || errors.personalize_id) && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.event_name?.message || errors.personalize_id?.message}
//               </p>
//             )}
//           </div>

//           {/* Date Inputs - Fixed layout to prevent shifting */}
//           <div className="flex flex-col gap-4 mt-4">
//             {/* Date-time section container */}
//             <div className="flex flex-wrap md:flex-nowrap gap-4">
//               <div className="w-full md:w-1/2">
//                 <Label htmlFor="start_datetime">Start Date & Time</Label>
//                 <Controller
//                   name="start_datetime"
//                   control={control}
//                   render={({ field }) => (
//                     <Input
//                       id="start_datetime"
//                       type="datetime-local"
//                       className={`mt-1 ${
//                         errors.start_datetime
//                           ? 'border-red-500'
//                           : 'border-gray-300'
//                       }`}
//                       {...field}
//                     />
//                   )}
//                 />
//                 {errors.start_datetime && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.start_datetime.message}
//                   </p>
//                 )}
//               </div>
//               <div className="w-full md:w-1/2">
//                 <Label htmlFor="end_datetime">End Date & Time</Label>
//                 <Controller
//                   name="end_datetime"
//                   control={control}
//                   render={({ field }) => (
//                     <Input
//                       id="end_datetime"
//                       type="datetime-local"
//                       className={`mt-1 ${
//                         errors.end_datetime ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                       min={startDateTime}
//                       {...field}
//                     />
//                   )}
//                 />
//                 {errors.end_datetime && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.end_datetime.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Color Picker */}
//           <div>
//             <Label>Color</Label>
//             <div className="flex gap-2 items-center mt-1">
//               {['#4CAF50', '#FFC107', '#FF9898', '#90CAF9', '#FF5722'].map(
//                 (colorValue) => (
//                   <Button
//                     key={colorValue}
//                     type="button"
//                     variant="ghost"
//                     className={`w-8 h-8 rounded-full p-0 border border-gray-300 ${
//                       activeColor === colorValue
//                         ? 'ring-2 ring-offset-2 ring-blue-500'
//                         : ''
//                     }`}
//                     style={{ backgroundColor: colorValue }}
//                     onClick={() => handleColorSelect(colorValue)}
//                     aria-label={`Select color ${colorValue}`}
//                   />
//                 )
//               )}
//             </div>
//             {errors.color && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.color.message}
//               </p>
//             )}
//           </div>

//           {/* Notes */}
//           <div>
//             <Label htmlFor="note">Notes (Optional)</Label>
//             <Textarea
//               id="note"
//               placeholder="Type notes here"
//               className="resize-none mt-1 border-gray-300"
//               rows={3}
//               {...register('note')}
//             />
//             {errors.note && (
//               <p className="text-red-500 text-sm mt-1">{errors.note.message}</p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <DialogFooter className="mt-6">
//             <Button type="button" variant="outline" onClick={handleModalClose}>
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="bg-[#40A574] text-white hover:bg-[#40A574] rounded-full transition-colors sm:w-auto w-full"
//             >
//               Save Event
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AddEventModal;

// src/components/page_ui/add-event-model.tsx
'use client';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';

const eventSchema = z
  .object({
    sender_name: z.string().min(1, { message: 'Name is required' }),
    event_name: z.string().min(1, { message: 'Event type is required' }),
    personalize_id: z
      .string()
      .min(1, { message: 'Personalized ID is required' }),
    start_datetime: z
      .string()
      .min(1, { message: 'Start date and time are required' }),
    end_datetime: z
      .string()
      .min(1, { message: 'End date and time are required' }),
    color: z.string().optional().default('#4CAF50'),
    note: z.string().optional().default(''),
  })
  .refine(
    (data) => {
      try {
        const start = new Date(data.start_datetime);
        const end = new Date(data.end_datetime);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          return false;
        }
        return end >= start;
      } catch (e) {
        return false;
      }
    },
    {
      message: 'End date and time must be on or after start date and time',
      path: ['end_datetime'],
    }
  );

type EventFormData = z.infer<typeof eventSchema>;

const AddEventModal = ({
  isOpen,
  onClose,
  onAddEvent,
  personalizedGifts,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (eventData: any) => void;
  personalizedGifts: { _id: string; name: string; icon_path?: string }[];
}) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    mode: 'onChange',
    defaultValues: {
      sender_name: '',
      event_name: '',
      personalize_id: '',
      start_datetime: new Date().toISOString().slice(0, 16),
      end_datetime: new Date().toISOString().slice(0, 16),
      color: '#4CAF50',
      note: '',
    },
  });

  const [activeColor, setActiveColor] = useState('#4CAF50');
  const eventName = watch('event_name');
  const startDateTime = watch('start_datetime');
  const selectedColor = watch('color');

  useEffect(() => {
    setActiveColor(selectedColor || '#4CAF50');
  }, [selectedColor]);

  useEffect(() => {
    const startDate = new Date(startDateTime);
    const endDate = new Date(watch('end_datetime'));

    if (
      !isNaN(startDate.getTime()) &&
      !isNaN(endDate.getTime()) &&
      endDate < startDate
    ) {
      setValue('end_datetime', startDateTime, { shouldValidate: true });
    }
  }, [startDateTime, setValue, watch]);

  // src/components/page_ui/add-event-model.tsx (partial update)
  const formatDateTimeForAPI = (localDateTimeString: string): string => {
    // Input is like "2025-04-11T07:30" from datetime-local input
    if (!localDateTimeString) {
      // Handle case where input might be empty initially
      // You might want to throw an error or return an empty string depending on validation
      console.error(
        'Invalid empty date string provided to formatDateTimeForAPI'
      );
      throw new Error('Date/Time cannot be empty.'); // Or return '' if schema allows optional
    }

    const date = new Date(localDateTimeString); // Parse the local string

    // Validate the date - crucial!
    if (isNaN(date.getTime())) {
      console.error(
        `Invalid date string provided to formatDateTimeForAPI: ${localDateTimeString}`
      );
      // Throw an error so the form submission stops
      throw new Error(
        `Invalid date format: ${localDateTimeString}. Please re-enter.`
      );
    }

    // Extract components based on the *local* time represented by the input string
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Construct the exact format required by the API: YYYY-MM-DD:HH:MM:00
    const formattedDate = `${year}-${month}-${day}:${hours}:${minutes}:00`; // Use colon separator

    console.log(
      `Formatted date for API: ${formattedDate} (from ${localDateTimeString})`
    );
    return formattedDate;
  };

  const handleFormSubmit = (data: EventFormData) => {
    try {
      // Build the payload using the corrected formatter
      const payload = {
        sender_name: data.sender_name,
        event_name: data.event_name,
        personalize_id: data.personalize_id,
        // --- Use the formatter directly ---
        start_datetime: formatDateTimeForAPI(data.start_datetime),
        end_datetime: formatDateTimeForAPI(data.end_datetime),
        color: data.color,
        note: data.note,
      };

      console.log('Raw form data:', data);
      console.log('Formatted payload being sent to onAddEvent:', payload); // Check this log

      onAddEvent(payload); // Pass the already formatted payload
      reset();
      onClose();
    } catch (error: any) {
      // Catch errors from formatDateTimeForAPI (like invalid dates)
      console.error('Error during form submission prep:', error);
      toast.error(error.message || 'Failed to prepare event data.');
      // Don't close the modal or reset if formatting failed
    }
  };

  const handleColorSelect = (color: string) => {
    setActiveColor(color);
    setValue('color', color, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleModalClose = () => {
    reset();
    onClose();
  };

  const handleEventSelect = (gift: { _id: string; name: string }) => {
    setValue('event_name', gift.name, { shouldValidate: true });
    setValue('personalize_id', gift._id, { shouldValidate: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        aria-describedby="add-event-modal-description"
      >
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
          <DialogDescription
            id="add-event-modal-description"
            className="sr-only"
          >
            Use this form to add a new event to your calendar.
          </DialogDescription>
          <button onClick={handleModalClose}>
            {' '}
            {/* <X className="h-4 w-4" /> */}
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 px-2 py-4"
        >
          {/* Sender Name Input */}
          <div>
            <Label htmlFor="sender_name">Name</Label>
            <Input
              id="sender_name"
              placeholder="Enter name"
              className={`w-full p-3 border rounded-lg mt-1 ${
                errors.sender_name ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('sender_name')}
            />
            {errors.sender_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.sender_name.message}
              </p>
            )}
          </div>

          {/* Event Type Dropdown */}
          <div>
            <Label>Event Type</Label>
            <input type="hidden" {...register('personalize_id')} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  className={`flex border justify-between p-3 rounded-lg w-full cursor-pointer items-center mt-1 ${
                    errors.event_name ? 'border-red-500' : 'border-gray-300'
                  } ${!eventName ? 'text-gray-500' : ''}`}
                >
                  {eventName || 'Select Event Type'}
                  <Calendar className="h-4 w-4 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[calc(600px-4rem)] max-w-[550px]">
                {personalizedGifts.length > 0 ? (
                  personalizedGifts.map((gift) => (
                    <DropdownMenuItem
                      key={gift._id}
                      onSelect={() => handleEventSelect(gift)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        {gift.icon_path && (
                          <img
                            src={gift.icon_path}
                            alt=""
                            className="h-4 w-4 mr-2 object-contain"
                          />
                        )}
                        <span>{gift.name}</span>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    No event types available
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {(errors.event_name || errors.personalize_id) && (
              <p className="text-red-500 text-sm mt-1">
                {errors.event_name?.message || errors.personalize_id?.message}
              </p>
            )}
          </div>

          {/* Date Inputs - Fixed layout to prevent shifting */}
          <div className="flex flex-col gap-4 mt-4">
            {/* Date-time section container */}
            <div className="flex flex-wrap md:flex-nowrap gap-4">
              <div className="w-full md:w-1/2">
                <Label htmlFor="start_datetime">Start Date & Time</Label>
                <Controller
                  name="start_datetime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="start_datetime"
                      type="datetime-local"
                      className={`mt-1 ${
                        errors.start_datetime
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      {...field}
                    />
                  )}
                />
                {errors.start_datetime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.start_datetime.message}
                  </p>
                )}
              </div>
              <div className="w-full md:w-1/2">
                <Label htmlFor="end_datetime">End Date & Time</Label>
                <Controller
                  name="end_datetime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="end_datetime"
                      type="datetime-local"
                      className={`mt-1 ${
                        errors.end_datetime
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      min={startDateTime}
                      {...field}
                    />
                  )}
                />
                {errors.end_datetime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.end_datetime.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <Label>Color</Label>
            <div className="flex gap-2 items-center mt-1">
              {['#4CAF50', '#FFC107', '#FF9898', '#90CAF9', '#FF5722'].map(
                (colorValue) => (
                  <Button
                    key={colorValue}
                    type="button"
                    variant="ghost"
                    className={`w-8 h-8 rounded-full p-0 border border-gray-300 ${
                      activeColor === colorValue
                        ? 'ring-2 ring-offset-2 ring-blue-500'
                        : ''
                    }`}
                    style={{ backgroundColor: colorValue }}
                    onClick={() => handleColorSelect(colorValue)}
                    aria-label={`Select color ${colorValue}`}
                  />
                )
              )}
            </div>
            {errors.color && (
              <p className="text-red-500 text-sm mt-1">
                {errors.color.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="note">Notes (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Type notes here"
              className="resize-none mt-1 border-gray-300"
              rows={3}
              {...register('note')}
            />
            {errors.note && (
              <p className="text-red-500 text-sm mt-1">{errors.note.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#40A574] text-white hover:bg-[#40A574] rounded-full transition-colors sm:w-auto w-full"
            >
              Save Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
