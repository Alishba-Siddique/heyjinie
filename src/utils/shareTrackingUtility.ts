
// shareTrackingUtility.ts - Improved implementation
export enum ShareSource {
    WHATSAPP = 'whatsapp',
    MESSENGER = 'messenger',
    INSTAGRAM = 'instagram',
    EMAIL = 'email'
  }
  
  const SHARE_TRACKING_KEY = 'heyjinie_shared_gifts';
  
  interface SharedGiftInfo {
    shareId: string; // Unique identifier for each share action
    orderId: string;
    orderNumber: string;
    shareSource: ShareSource;
    timestamp: number;
  }
  
  // Generate a unique ID for each share action
  const generateShareId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };
  
  // Add a new share record without overwriting previous shares of the same gift
  export const trackGiftShare = (orderId: string, orderNumber: string, shareSource: ShareSource): void => {
    try {
      // Get existing shares or initialize empty array
      const existingSharesStr = localStorage.getItem(SHARE_TRACKING_KEY);
      const existingShares: SharedGiftInfo[] = existingSharesStr ? JSON.parse(existingSharesStr) : [];
      
      // Create new share info with unique ID
      const shareInfo: SharedGiftInfo = {
        shareId: generateShareId(),
        orderId,
        orderNumber,
        shareSource,
        timestamp: Date.now()
      };
      
      // Add to array and save back to localStorage
      existingShares.push(shareInfo);
      localStorage.setItem(SHARE_TRACKING_KEY, JSON.stringify(existingShares));
      
    } catch (error) {
      console.error('Error tracking gift share:', error);
    }
  };
  
  // Get all share information for a specific order
  export const getGiftShareSources = (orderId: string): ShareSource[] => {
    try {
      const sharesStr = localStorage.getItem(SHARE_TRACKING_KEY);
      if (!sharesStr) return [];
      
      const shares: SharedGiftInfo[] = JSON.parse(sharesStr);
      // Filter all shares for this orderId and extract their sources
      const orderShares = shares.filter(share => share.orderId === orderId);
      
      // Get unique share sources (no duplicates)
      const uniqueSources = [...new Set(orderShares.map(share => share.shareSource))];
      return uniqueSources;
    } catch (error) {
      console.error('Error retrieving gift share sources:', error);
      return [];
    }
  };
  
  // Get the most recent share source for a specific order
  export const getLatestShareSource = (orderId: string): ShareSource | null => {
    try {
      const sharesStr = localStorage.getItem(SHARE_TRACKING_KEY);
      if (!sharesStr) return null;
      
      const shares: SharedGiftInfo[] = JSON.parse(sharesStr);
      // Filter shares for this orderId
      const orderShares = shares.filter(share => share.orderId === orderId);
      
      if (orderShares.length === 0) return null;
      
      // Sort by timestamp descending and get the most recent
      const latestShare = orderShares.sort((a, b) => b.timestamp - a.timestamp)[0];
      return latestShare.shareSource;
    } catch (error) {
      console.error('Error retrieving latest gift share source:', error);
      return null;
    }
  };
  
  // Get all shared gifts info
  export const getAllSharedGifts = (): SharedGiftInfo[] => {
    try {
      const sharesStr = localStorage.getItem(SHARE_TRACKING_KEY);
      return sharesStr ? JSON.parse(sharesStr) : [];
    } catch (error) {
      console.error('Error retrieving all shared gifts:', error);
      return [];
    }
  };