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
