export interface PriceFilterProduct {
  company_id: {
    _id: string; // This could store the original company_id string if it was an ID
    name: string;
    company_logo: string;
  };
  // These are new properties not present in the base PriceFilterProduct type
  category_id: {
    _id: string; // Made non-optional for direct use in CategoryInfo
    name: string; // Made non-optional
    type?: number;
  };
  background_images: string[];
  // sticker_path is inherited from PriceFilterProduct
  // sticker_path_2?: string; // This was in ProductForModal, if needed, add it. Assuming not for now.


  rating_count: number;
  // description is inherited
  specification: any[];
  _id: string;
  name: string;
  description: string;
  price: number;
  image_path: string | null;
  sticker_path: string | null;
  total_rating: number;
  created_at: string;
  __v: number;
  // Add other relevant fields if needed
}

export interface Recipient {
  _id: string;
  name: string;
  tag: string;
  image_path: string;
}

export interface Occasion {
  _id: string;
  name: string;
  tag: string;
  image_path: string;
}

export interface RecOccData {
  recipient: Recipient[];
  occasion: Occasion[];
}

export interface RecOccApiResponse {
  success: boolean;
  data: RecOccData;
  message?: string; // Optional message field
}


export interface PriceFilterApiResponse {
  success: boolean;
  data: PriceFilterProduct[];
  message?: string; // Optional message field
}