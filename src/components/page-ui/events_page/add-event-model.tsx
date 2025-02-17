// src/components/page_ui/add-event-model.tsx

'use client';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Calendar } from 'lucide-react';

// Zod schema for event validation
const eventSchema = z.object({
  sender_name: z.string().min(1, { message: 'Name is required' }),
  event_name: z.string().min(1, { message: 'Event type is required' }),
  personalize_id: z.string().min(1, { message: 'Event type is required' }),
  start_datetime: z
    .string()
    .min(1, { message: 'Start date and time are required' }),
  end_datetime: z
    .string()
    .min(1, { message: 'End date and time are required' }),
  color: z.string().optional().default('#4CAF50'),
  note: z.string().optional().default(''),
});

type EventFormData = z.infer<typeof eventSchema>;

const AddEventModal = ({
  onClose,
  onAddEvent,
  personalizedGifts,
}: {
  onClose: () => void;
  onAddEvent: (eventData: EventFormData) => void;
  personalizedGifts: { _id: string; name: string; icon_path?: string }[];
}) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
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

  const [showDropdown, setShowDropdown] = React.useState(false);
  const eventName = watch('event_name');

  const handleFormSubmit = (data: EventFormData) => {
    onAddEvent(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-1/3">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Event</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Sender Name Input */}
          <div className="mb-4 border rounded-lg">
            <input
              type="text"
              placeholder="Name"
              className={`w-full p-3 border rounded-lg ${
                errors.sender_name ? 'border-red-500' : ''
              }`}
              {...register('sender_name')}
            />
            {errors.sender_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.sender_name.message}
              </p>
            )}
          </div>

          {/* Custom Dropdown */}
          <div className="relative mb-4">
            <div
              className="w-full p-3 border rounded-lg flex items-center justify-between cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span>{eventName || 'Select Event Type'}</span>
              <Calendar className="w-6 h-6 text-gray-400" />
            </div>

            {errors.event_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.event_name.message}
              </p>
            )}

            {showDropdown && (
              <ul className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {personalizedGifts.map((gift) => (
                  <li
                    key={gift._id}
                    className="p-3 hover:bg-gray-50 cursor-pointer flex items-center"
                    onClick={() => {
                      setValue('event_name', gift.name);
                      setValue('personalize_id', gift._id);
                      setShowDropdown(false);
                    }}
                  >
                    {gift.icon_path && (
                      <img
                        src={gift.icon_path}
                        alt=""
                        className="w-6 h-6 mr-2"
                      />
                    )}
                    {gift.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Start and End Date */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-2">Start Date</label>
              <Controller
                name="start_datetime"
                control={control}
                render={({ field }) => (
                  <input
                    type="datetime-local"
                    className={`p-3 border rounded-lg ${
                      errors.start_datetime ? 'border-red-500' : ''
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
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-2">End Date</label>
              <Controller
                name="end_datetime"
                control={control}
                render={({ field }) => (
                  <input
                    type="datetime-local"
                    className={`p-3 border rounded-lg ${
                      errors.end_datetime ? 'border-red-500' : ''
                    }`}
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

          {/* Color Picker */}
          <div className="flex gap-2 mb-4">
            <Controller
              name="color"
              control={control}
              render={({ field: { value, onChange } }) => (
                <>
                  {['#4CAF50', '#FFC107', '#FF9898', '#90CAF9', '#FF5722'].map(
                    (color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full cursor-pointer 
                ${value === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => onChange(color)}
                      />
                    )
                  )}
                </>
              )}
            />
          </div>

          {/* Notes */}
          <textarea
            placeholder="Type notes here"
            className="w-full p-3  border rounded-lg mb-6 h-32 resize-none"
            {...register('note')}
          />

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-full font-medium hover:bg-green-600 transition-colors"
          >
            Save Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
