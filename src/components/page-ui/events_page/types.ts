// src/components/page-ui/events_page/types.ts
export interface Event {
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
    }> | null;
  };
  note: string;
  color: string;
  created_at: string;
}

export type ViewMode = 'week' | 'month' | 'year' | 'occasion';