// src/types/personalization.ts

// Represents a message created via the personalization flow
export interface StoredPersonalizedMessage {
    category?: string;
    name: string;
    message: string;
    image_path: string;
    image_id: string;
  }
  
  // Maps a product ID to its selected personalization
  export interface SelectedPersonalizationMap {
    [productId: string]: StoredPersonalizedMessage;
  }
  
  // Groups created messages by category (used by PersonalizedMessages)
  export interface GroupedPersonalizedMessages {
      [category: string]: StoredPersonalizedMessage[];
  }
  
  // Interface for Gift Images (template images)
  export interface GiftImage {
    image_id: string;
    image_path: string;
  }
  
  // Interface for Personalized Gifts Icons/Categories API response item
  export interface PersonalizedGiftsIconData {
    _id: string; // Category ID
    name: string;
    icon_path: string;
    images: GiftImage[];
    created_at: string;
    __v: number;
  }
  
  // Interface for a Product (e.g., TopPick)
  export interface Product {
      _id: string;
      name: string;
      description: string; // Keep as required from API if that's the case
      price: number;
      image_path: string | null;
      background_images: string[]; // Ensure this matches API (might be string)
      total_rating: number;
      company_id: {
          _id: string;
          name: string;
          company_logo: string;
          description: string; // Usually description of the company
      };
  }
  
  // Cart Item structure - Make description optional if context allows
  export interface CartItem {
      _id: string;
      name: string;
      price: number;
      quantity: number;
      image_path: string;
      description?: string; // <-- Made optional to match common cart usage
      personalization?: StoredPersonalizedMessage;
  }