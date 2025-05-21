// src/components/page-ui/order_history_page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  fetchOrderHistory,
  addReviews,
  sendGift,
} from '@/services/api.service';
import { ChevronDown, Star, X, Gift, Instagram, Share2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PiMessengerLogoBold } from 'react-icons/pi';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { getCookie } from '@/utils/cookieUtility';
import { ShareSource, trackGiftShare } from '@/utils/shareTrackingUtility';

interface OrderResponse {
  success: boolean;
  message: string;
  data: Array<{
    _id: string | null;
    created_at: string;
    cart_details: Array<{
      product_id: {
        _id: string | null;
        name: string | null;
        image_path: string | null;
        price: number | null;
        sticker_path_2: string | null;
      };
      quantity: number;
      order_number: string;
      orderPrice: number;
      is_claimed: boolean;
      is_reviewed: boolean;
      claimed_date: string;
      url: string;
    }>;
    payment_status: boolean;
  }>;
}

const PLACEHOLDER_IMAGE = '/images/logoicons.png';

const OrderSkeleton = () => (
  <div className="bg-white rounded-lg shadow animate-pulse">
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 w-full">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="flex gap-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  </div>
);

interface OrderStatusProps {
  createdAt: string;
  isClaimed: boolean;
  isReviewed: boolean;
  claimedDate: string;
}

const OrderStatus = ({
  createdAt,
  isClaimed,
  isReviewed,
  claimedDate,
}: OrderStatusProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatuses = () => {
    const statuses = [
      {
        label: 'Order placed',
        date: formatDate(createdAt),
        active: true,
      },
      {
        label: 'Order Claimed',
        date: isClaimed ? formatDate(claimedDate) : 'pending',
        active: isClaimed,
      },
      {
        label: 'Review Status',
        date: isReviewed ? formatDate(claimedDate) : 'pending',
        active: isReviewed,
      },
      {
        label: 'Order Completed',
        date: isReviewed ? formatDate(claimedDate) : 'pending',
        active: isReviewed,
      },
    ];

    return statuses;
  };

  const statuses = getStatuses();

  return (
    <div className="px-4 py-4 sm:px-6 bg-gray-50 rounded-lg mt-4 overflow-x-auto">
      <div className="flex justify-between items-start min-w-[600px]">
        {statuses.map((status, index) => (
          <div
            key={status.label}
            className="flex flex-col items-center gap-2 relative"
          >
            <div
              className={`w-3 h-3 rounded-full ${
                status.active ? 'bg-[#fd9298]' : 'bg-gray-300'
              }`}
            ></div>
            {/* {index < statuses.length - 1 && (
              <div
                className={`absolute w-[100px] h-0.5 top-1.5 left-3 ${
                  status.active ? 'bg-[#fd9298]' : 'bg-gray-300'
                }`}
              ></div>
            )} */}
            <span className="text-sm text-gray-600 mt-4 text-center whitespace-nowrap">
              {status.label}
            </span>
            <span
              className={`text-xs ${
                status.active ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              {status.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => Promise<void>;
}

interface ReviewFormInputs {
  review: string;
}

const ReviewModal = ({ isOpen, onClose, onSubmit }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewFormInputs>({
    defaultValues: {
      review: '',
    },
  });

  const onSubmitForm = async (data: ReviewFormInputs) => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, data.review);
      toast.success('Review submitted successfully!');
      reset();
      setRating(0);
      onClose();
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      reset();
      setRating(0);
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle> Rate Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="flex justify-center space-x-2 my-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer ${
                  star <= (hoveredStar || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          {rating === 0 && (
            <p className="text-sm text-red-500 text-center mb-2">
              Please select a rating
            </p>
          )}
          <Textarea
            {...register('review', {
              required: 'Please write a review',
              maxLength: {
                value: 150,
                message: 'Review cannot exceed 150 characters',
              },
            })}
            placeholder="Write your review here upto 150 characters"
            className={`min-h-[100px] ${
              errors.review ? 'border-red-500 focus-visible:ring-red-500' : ''
            }`}
            disabled={isSubmitting}
          />
          {errors.review && (
            <p className="text-sm text-black mt-1">{errors.review.message}</p>
          )}
          <Button
            type="submit"
            className="w-full bg-[#FD9298] hover:bg-[#FD9298] text-white mt-4 flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting && <span className="animate-spin">⭕</span>}
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface ShareData {
  productId: string | null;
  cart_details: Array<{
    product_id: string | null;
    quantity: number;
  }>;
  url: string;
  stickerPath: string | null;
  productName: string | null;
  orderNumber: string | null;
  price: number | null;
}

interface SendGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

const SendGiftModal = ({ isOpen, onClose, onSubmit }: SendGiftModalProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(email);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send gift');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
        isOpen ? 'block' : 'hidden'
      }`}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Send Gift via HeyJine</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient's Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter email address"
              />
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Gift'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const OrderHistory = () => {
  const [orders, setOrders] = useState<OrderResponse['data']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{
    productId: string | null;
    orderNumber: string | null;
    cartId: string | null;
  } | null>(null);
  const [isSendGiftModalOpen, setIsSendGiftModalOpen] = useState(false);
  const [selectedGiftOrder, setSelectedGiftOrder] = useState<{
    url: any;
    orderId: string;
    orderNumber: string;
  } | null>(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetchOrderHistory();
        if (response && response.success) {
          setOrders(response.data);
        } else if (response && !response.success) {
          setError(response.message);
        } else {
          setError('Error fetching order history.');
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleSendGift = async (email: string) => {
    if (!selectedGiftOrder) return;

    try {
      await sendGift(
        selectedGiftOrder.orderId,
        selectedGiftOrder.orderNumber,
        email
      );
      toast.success('Gift sent successfully');
    } catch (error: any) {
      throw error;
    }
  };

  const handleReviewSubmit = async (rating: number, review: string) => {
    if (!selectedOrder) {
      toast.error('No order selected. Please select an order to review.');
      return;
    }

    const { productId, orderNumber, cartId } = selectedOrder;

    // Check if any required fields are missing
    if (!productId || !orderNumber || !cartId) {
      toast.error(
        'Missing required productId, orderNumber or cartId to submit the review.'
      );
      return;
    }

    try {
      await addReviews(productId, rating, review, orderNumber, cartId);

      // Refresh order history after successful review
      const response = await fetchOrderHistory();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    }
  };

  // Update the handleWhatsAppShare function in OrderHistory component
  const handleWhatsAppShare = async (shareData: ShareData) => {
    try {
      // First call the sendGift API to register this share
      if (selectedGiftOrder) {
        try {
          let recipientEmail = 'whatsapp-share';
          const userDataCookie = getCookie('userData');
          if (userDataCookie) {
            try {
              const userData = JSON.parse(userDataCookie);
              if (userData.email) {
                recipientEmail = userData.email;
              }
            } catch (error) {
              console.error('Error parsing userData cookie:', error);
            }
          }
          await sendGift(
            selectedGiftOrder.orderId,
            selectedGiftOrder.orderNumber,
            recipientEmail
          );
        } catch (error) {
          console.error('Error registering WhatsApp share as gift:', error);
        }
      }

      // Get personalized message if available
      let personalizedMessage = '';
      const storedMessages = localStorage.getItem(
        'selectedPersonalizedMessages'
      );
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages);
          const productMessage = parsedMessages.find(
            (msg: any) => msg.productId === shareData.productId
          );
          if (productMessage) {
            personalizedMessage = `\nPersonalized Message: "${productMessage.message}" - From ${productMessage.name}`;
          }
        } catch (error) {
          console.error('Error parsing personalized messages:', error);
        }
      }

      // Create a rich text description for the share with personalized message
      const shareText =
        `A little joy from HeyJinie! Tap the link to unwrap your surprise.\n ` +
        shareData.url;

      // Send via WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        shareText
      )}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
      toast.error('Failed to share on WhatsApp');
    }
  };

  // Update the handleFacebookMessengerShare function
  const handleFacebookMessengerShare = async (shareData: ShareData) => {
    try {
      // First call the sendGift API to register this share
      if (selectedGiftOrder) {
        try {
          // Using recipient email as "messenger-share" to mark this as a Messenger share
          let recipientEmail = 'messenger-share';
          const userDataCookie = getCookie('userData');
          if (userDataCookie) {
            try {
              const userData = JSON.parse(userDataCookie);
              if (userData.email) {
                recipientEmail = userData.email;
              }
            } catch (error) {
              console.error('Error parsing userData cookie:', error);
            }
          }
          await sendGift(
            selectedGiftOrder.orderId,
            selectedGiftOrder.orderNumber,
            recipientEmail
          );
        } catch (error) {
          console.error('Error registering Messenger share as gift:', error);
        }
      }

      // Get personalized message if available
      let personalizedMessage = '';
      const storedMessages = localStorage.getItem(
        'selectedPersonalizedMessages'
      );
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages);
          const productMessage = parsedMessages.find(
            (msg: any) => msg.productId === shareData.productId
          );
          if (productMessage) {
            personalizedMessage = `\nPersonalized Message: "${productMessage.message}" - From ${productMessage.name}`;
          }
        } catch (error) {
          console.error('Error parsing personalized messages:', error);
        }
      }

      const messageText =
        `A little joy from HeyJinie! Tap the link to unwrap your surprise.\n ` +
        shareData.url;

      await navigator.clipboard.writeText(messageText);
      toast.success('Link copied! Opening Messenger...');

      // Try to detect if opening the app will succeed
      const now = Date.now();
      const timeoutDuration = 1000; // 1 second

      // Attempt to open the messenger app
      window.location.href = `fb-messenger://share/?link=${encodeURIComponent(
        shareData.url ?? PLACEHOLDER_IMAGE
      )}`;

      // Use a focus event to detect if the user returns to the browser quickly
      const handleFocus = () => {
        // If we get focus back quickly, the app probably didn't open
        if (Date.now() - now < timeoutDuration) {
          window.open('https://www.messenger.com', '_blank');
        }
        window.removeEventListener('focus', handleFocus);
      };

      window.addEventListener('focus', handleFocus);

      // Fallback if focus event doesn't fire
      setTimeout(() => {
        window.removeEventListener('focus', handleFocus);
        // Only open if we haven't recently regained focus
        if (document.hasFocus() && Date.now() - now >= timeoutDuration) {
          window.open('https://www.messenger.com', '_blank');
        }
      }, timeoutDuration);
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share');
    }
  };

  // Update the handleInstagramShare function
  const handleInstagramShare = async (shareData: ShareData) => {
    try {
      // First call the sendGift API to register this share
      if (selectedGiftOrder) {
        try {
          // Using recipient email as "instagram-share" to mark this as an Instagram share
          let recipientEmail = 'instagram-share';
          const userDataCookie = getCookie('userData');
          if (userDataCookie) {
            try {
              const userData = JSON.parse(userDataCookie);
              if (userData.email) {
                recipientEmail = userData.email;
              }
            } catch (error) {
              console.error('Error parsing userData cookie:', error);
            }
          }
          await sendGift(
            selectedGiftOrder.orderId,
            selectedGiftOrder.orderNumber,
            recipientEmail
          );
        } catch (error) {
          console.error('Error registering Instagram share as gift:', error);
        }
      }

      // Get personalized message if available
      let personalizedMessage = '';
      const storedMessages = localStorage.getItem(
        'selectedPersonalizedMessages'
      );
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages);
          const productMessage = parsedMessages.find(
            (msg: any) => msg.productId === shareData.productId
          );
          if (productMessage) {
            personalizedMessage = `\nPersonalized Message: "${productMessage.message}" - From ${productMessage.name}`;
          }
        } catch (error) {
          console.error('Error parsing personalized messages:', error);
        }
      }

      // Prepare the message text with personalized message
      const messageText =
        `A little joy from HeyJinie! Tap the link to unwrap your surprise.\n ` +
        shareData.url;

      // Copy text to clipboard
      await navigator.clipboard.writeText(messageText);
      toast.success('Link copied! Opening Instagram...');

      // Open Instagram direct messages
      window.open('https://instagram.com/direct/inbox', '_blank');
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error('Failed to copy link');

      // Still try to open Instagram even if copy fails
      window.open('https://instagram.com/direct/inbox', '_blank');
    }
  };


  //  const handleWhatsAppShare = async (p0: { productId: string; cart_details: { product_id: string; quantity: number; }[]; url: string; stickerPath: string; productName: string; orderNumber: string; price: number; }) => {
  //     if (!selectedGiftOrder) return;
    
  //     try {
  //       // First register this share as a gift using the existing API
  //       if (selectedGiftOrder.orderId) {
  //         try {
  //           let recipientEmail = 'whatsapp-share';
  //           const userDataCookie = getCookie('userData');
  //           if (userDataCookie) {
  //             try {
  //               const userData = JSON.parse(userDataCookie);
  //               if (userData.email) {
  //                 recipientEmail = userData.email;
  //               }
  //             } catch (error) {
  //               console.error('Error parsing userData cookie:', error);
  //             }
  //           }
            
  //           // Use the existing sendGift API function
  //           await sendGift(
  //             selectedGiftOrder.orderId,
  //             selectedGiftOrder.orderNumber,
  //             recipientEmail
  //           );
            
  //           // Track the share source in localStorage
  //           trackGiftShare(
  //             selectedGiftOrder.orderId,
  //             selectedGiftOrder.orderNumber, 
  //             ShareSource.WHATSAPP
  //           );
            
  //           toast.success('Gift shared via WhatsApp!');
  //         } catch (error) {
  //           console.error('Error registering WhatsApp share as gift:', error);
  //           toast.error('Failed to track share');
  //         }
  //       }
    
  //       // Simplified share message
  //       const shareText = `A little joy from HeyJinie! Tap the link to unwrap your surprise.\n ${selectedGiftOrder.url}`;
    
  //       // Open WhatsApp with the prepared message
  //       const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  //       window.open(whatsappUrl, '_blank');
  //     } catch (error) {
  //       console.error('Error sharing via WhatsApp:', error);
  //       toast.error('Failed to share on WhatsApp');
  //     }
  //   };
    
  //   // Fixed Facebook Messenger share handler with debounce
  //   // let messengerShareInProgress = false;
    
  //   const handleFacebookMessengerShare = async (p0: { productId: string; cart_details: { product_id: string; quantity: number; }[]; url: string; stickerPath: string; productName: string; orderNumber: string; price: number; }) => {
  //     if (!selectedGiftOrder) return;
    
  //     // messengerShareInProgress = true;
  //     // setTimeout(() => { messengerShareInProgress = false; }, 2000); // Prevent multiple clicks
    
  //     try {
  //       // First register this share as a gift
  //       if (selectedGiftOrder.orderId) {
  //         try {
  //           let recipientEmail = 'messenger-share';
  //           const userDataCookie = getCookie('userData');
  //           if (userDataCookie) {
  //             try {
  //               const userData = JSON.parse(userDataCookie);
  //               if (userData.email) {
  //                 recipientEmail = userData.email;
  //               }
  //             } catch (error) {
  //               console.error('Error parsing userData cookie:', error);
  //             }
  //           }
            
  //           // Use the existing sendGift API function
  //           await sendGift(
  //             selectedGiftOrder.orderId,
  //             selectedGiftOrder.orderNumber,
  //             recipientEmail
  //           );
            
  //           // Track the share source in localStorage
  //           trackGiftShare(
  //             selectedGiftOrder.orderId,
  //             selectedGiftOrder.orderNumber, 
  //             ShareSource.MESSENGER
  //           );
  //         } catch (error) {
  //           console.error('Error registering Messenger share as gift:', error);
  //         }
  //       }
    
  //       // Simplified share message
  //       const messageText = `A little joy from HeyJinie! Tap the link to unwrap your surprise.\n ${selectedGiftOrder.url}`;
    
  //       // Copy to clipboard
  //       await navigator.clipboard.writeText(messageText);
  //       toast.success('Link copied! Opening Messenger...');
    
  //       // Always open Messenger in a new tab to ensure it works
  //       window.open('https://www.messenger.com', '_blank');
        
  //     } catch (error) {
  //       console.error('Error sharing:', error);
  //       toast.error('Failed to share. Please try again.');
        
  //       // Still try to open Messenger even if there was an error
  //       window.open('https://www.messenger.com', '_blank');
  //     }
  //   };
    
  //   // Instagram share handler - Same implementation but with debounce added
  //   // let instagramShareInProgress = false;
    
  //   const handleInstagramShare = async (p0: { productId: string; cart_details: { product_id: string; quantity: number; }[]; url: string; stickerPath: string; productName: string; orderNumber: string; price: number; }) => {
  //     if (!selectedGiftOrder ) return;
    
  //     // instagramShareInProgress = true;
  //     // setTimeout(() => { instagramShareInProgress = false; }, 2000); // Prevent multiple clicks
      
  //     try {
  //       // First register this share as a gift
  //       if (selectedGiftOrder.orderId) {
  //         try {
  //           let recipientEmail = 'instagram-share';
  //           const userDataCookie = getCookie('userData');
  //           if (userDataCookie) {
  //             try {
  //               const userData = JSON.parse(userDataCookie);
  //               if (userData.email) {
  //                 recipientEmail = userData.email;
  //               }
  //             } catch (error) {
  //               console.error('Error parsing userData cookie:', error);
  //             }
  //           }
            
  //           // Use the existing sendGift API function
  //           await sendGift(
  //             selectedGiftOrder.orderId,
  //             selectedGiftOrder.orderNumber,
  //             recipientEmail
  //           );
            
  //           // Track the share source in localStorage
  //           trackGiftShare(
  //             selectedGiftOrder.orderId,
  //             selectedGiftOrder.orderNumber, 
  //             ShareSource.INSTAGRAM
  //           );
            
  //           toast.success('Gift shared via Instagram!');
  //         } catch (error) {
  //           console.error('Error registering Instagram share as gift:', error);
  //           toast.error('Failed to track share');
  //         }
  //       }
    
  //       // Simplified share message
  //       const messageText = `A little joy from HeyJinie! Tap the link to unwrap your surprise.\n ${selectedGiftOrder.url}`;
    
  //       // Copy text to clipboard
  //       await navigator.clipboard.writeText(messageText);
  //       toast.success('Link copied! Opening Instagram...');
    
  //       // Open Instagram direct messages in a new tab
  //       window.open('https://instagram.com/direct/inbox', '_blank');
  //     } catch (error) {
  //       console.error('Error copying link:', error);
  //       toast.error('Failed to copy link');
        
  //       // Still try to open Instagram even if copy fails
  //       window.open('https://instagram.com/direct/inbox', '_blank');
  //     }
  //   };

  // Update the handleShare function to include personalized messages and use the sendGift API
  const handleShare = async (shareData: ShareData) => {
    try {
      // First call the sendGift API to register this share
      if (selectedGiftOrder) {
        try {
          // Using recipient email as "general-share" for the generic share function
          let recipientEmail = 'general-share';
          const userDataCookie = getCookie('userData');
          if (userDataCookie) {
            try {
              const userData = JSON.parse(userDataCookie);
              if (userData.email) {
                recipientEmail = userData.email;
              }
            } catch (error) {
              console.error('Error parsing userData cookie:', error);
            }
          }
          await sendGift(
            selectedGiftOrder.orderId,
            selectedGiftOrder.orderNumber,
            recipientEmail
          );
        } catch (error) {
          console.error('Error registering share as gift:', error);
        }
      }

      // Get personalized message if available
      let personalizedMessage = '';
      const storedMessages = localStorage.getItem(
        'selectedPersonalizedMessages'
      );
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages);
          const productMessage = parsedMessages.find(
            (msg: any) => msg.productId === shareData.productId
          );
          if (productMessage) {
            personalizedMessage = `\nPersonalized Message: "${productMessage.message}" - From ${productMessage.name}`;
          }
        } catch (error) {
          console.error('Error parsing personalized messages:', error);
        }
      }

      // Create a rich text description for the share
      const shareText =
        `A little joy from HeyJinie! Tap the link to unwrap your surprise.\n ` +
        shareData.url;

      // If on mobile and Web Share API is available
      if (navigator.share) {
        try {
          // First try to fetch the image
          const response = await fetch(
            shareData.stickerPath !== null
              ? shareData.stickerPath
              : PLACEHOLDER_IMAGE
          );
          const blob = await response.blob();
          const file = new File([blob], 'product.png', { type: 'image/png' });

          await navigator.share({
            title: `${shareData.productName} - Order #${shareData.orderNumber}`,
            text: shareText,
            url: shareData.url,
            files: [file], // Send the thumbnail as a file
          });
        } catch (shareError) {
          // Fallback to sharing without image if image sharing fails
          await navigator.share({
            title: `${shareData.productName} - Order #${shareData.orderNumber}`,
            text: shareText,
            url: shareData.url,
          });
        }
      } else {
        // For WhatsApp web or desktop sharing
        const whatsappText = encodeURIComponent(shareText);
        const whatsappUrl = `https://wa.me/?text=${whatsappText}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url ?? PLACEHOLDER_IMAGE);
        toast.success('Link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
      }
    }
  };

  // Add this function to store the selected gift order before opening the share buttons
  const prepareShareData = (orderId: string, orderNumber: string) => {
    setSelectedGiftOrder({
      orderId: orderId !== null ? orderId : '123',
      orderNumber: orderNumber !== null ? orderNumber : '123',
      url: '', // You can set the URL here if needed
    });
  };

  // Add this to your component initialization to ensure gift order is selected before sharing
  useEffect(() => {
    // Make sure to initialize selectedGiftOrder when the component first mounts
    if (orders.length > 0 && orders[0].cart_details.length > 0) {
      const firstOrder = orders[0];
      const firstItem = firstOrder.cart_details[0];
      setSelectedGiftOrder({
        orderId: firstOrder._id !== null ? firstOrder._id : '123',
        orderNumber:
          firstItem.order_number !== null ? firstItem.order_number : '123',
          url: firstItem.url,
      });
    }
  }, [orders]);

  return (
    <div className="mx-auto px-4">
      <div className="space-y-4">
        {loading ? (
          // 1. Loading State: Skeletons
          <>
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
          </>
        ) : error ? (
          // 2. Error State: Error Message
          <div className="mx-auto px-4 py-8">
            <div className="text-center my-auto">
              {/* {error} */}
              {/* <br /> <br /> */}
              No orders found yet!
              <br /> <br />
              <Link href="/home">
                👉 <u>Click here to place your first order!</u>
              </Link>
            </div>
          </div>
        ) : orders.length === 0 ? (
          // 3. No Orders State: "No orders found" message
          <div className="mx-auto px-4 py-8">
            <div className="text-center my-auto">
              No orders found yet!
              <br /> <br />
              <Link href="/home">
                👉 <u>Click here to shop now!</u>
              </Link>
            </div>
          </div>
        ) : (
          // 4. Orders Present State: Render order items
          orders.map((order) =>
            order.cart_details.map((item, index) => (
              <div
                key={`${order._id}-${index}`}
                className="bg-white rounded-lg shadow"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 w-full">
                      {item.product_id ? (
                        <img
                          src={item.product_id.image_path || PLACEHOLDER_IMAGE}
                          alt={item.product_id.name || 'Product Name'}
                          className="w-full sm:w-24 h-24 rounded-lg object-cover"
                        />
                      ) : (
                        <img
                          src={PLACEHOLDER_IMAGE}
                          alt="Product Name"
                          className="w-full sm:w-24 h-24 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">
                          Order #{item.order_number}
                        </h3>
                        <p className="text-gray-500 mt-1">
                          Placed on {formatDate(order.created_at)}
                        </p>
                        <div className="mt-2 space-x-6">
                          <span className="text-sm">
                            Items: {item.quantity}
                          </span>
                          <span className="text-sm">
                            Total: Rs.{item.orderPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <TooltipProvider>
                        {!item.is_reviewed && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  if (item.product_id) {
                                    setSelectedOrder({
                                      productId:
                                        item.product_id._id !== null
                                          ? item.product_id._id
                                          : '123',
                                      orderNumber:
                                        item.order_number !== null
                                          ? item.order_number
                                          : '123',
                                      cartId:
                                        order._id !== null ? order._id : '123',
                                    });
                                    setIsReviewModalOpen(true);
                                  } else {
                                    setSelectedOrder({
                                      productId: '123',
                                      orderNumber:
                                        item.order_number !== null
                                          ? item.order_number
                                          : '123',
                                      cartId:
                                        order._id !== null ? order._id : '123',
                                    });
                                    setIsReviewModalOpen(true);
                                  }
                                }}
                              >
                                <Star className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Write a review</p>
                            </TooltipContent>
                          </Tooltip>
                        )}

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                if (item.product_id) {
                                  handleShare({
                                    productId:
                                      item.product_id._id !== null
                                        ? item.product_id._id
                                        : '123',
                                    cart_details: [
                                      {
                                        product_id:
                                          item.product_id._id !== null
                                            ? item.product_id._id
                                            : '123',
                                        quantity: item.quantity,
                                      },
                                    ],
                                    url: item.url,
                                    stickerPath:
                                      item.product_id.sticker_path_2 !== null
                                        ? item.product_id.sticker_path_2
                                        : PLACEHOLDER_IMAGE,
                                    productName:
                                      item.product_id.name !== null
                                        ? item.product_id.name
                                        : 'Product Name',
                                    orderNumber: item.order_number,
                                    price: item.orderPrice,
                                  });
                                } else {
                                  handleShare({
                                    productId: '123',
                                    cart_details: [
                                      {
                                        product_id: '123',
                                        quantity: item.quantity,
                                      },
                                    ],
                                    url: item.url,
                                    stickerPath: PLACEHOLDER_IMAGE,
                                    productName: 'Product Name',
                                    orderNumber: '123',
                                    price: 123,
                                  });
                                }
                              }}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share with others</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                if (item.product_id) {
                                  handleWhatsAppShare({
                                    productId:
                                      item.product_id._id !== null
                                        ? item.product_id._id
                                        : '123',
                                    cart_details: [
                                      {
                                        product_id:
                                          item.product_id._id !== null
                                            ? item.product_id._id
                                            : '123',
                                        quantity: item.quantity,
                                      },
                                    ],
                                    url: item.url,
                                    stickerPath:
                                      item.product_id.sticker_path_2 !== null
                                        ? item.product_id.sticker_path_2
                                        : PLACEHOLDER_IMAGE,
                                    productName:
                                      item.product_id.name !== null
                                        ? item.product_id.name
                                        : 'Product Name',
                                    orderNumber: item.order_number,
                                    price: item.orderPrice,
                                  });
                                } else {
                                  handleWhatsAppShare({
                                    productId: '123',
                                    url: item.url,
                                    cart_details: [
                                      {
                                        product_id: '123',
                                        quantity: item.quantity,
                                      },
                                    ],
                                    stickerPath: PLACEHOLDER_IMAGE,
                                    productName: 'Product Name',
                                    orderNumber: item.order_number,
                                    price: item.orderPrice,
                                  });
                                }
                              }}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                className="h-4 w-4"
                                fill="currentColor"
                              >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                              </svg>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share on WhatsApp</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                if (item.product_id) {
                                  handleFacebookMessengerShare({
                                    productId:
                                      item.product_id._id !== null
                                        ? item.product_id._id
                                        : '123',
                                    cart_details: [
                                      {
                                        product_id:
                                          item.product_id._id !== null
                                            ? item.product_id._id
                                            : '123',
                                        quantity: item.quantity,
                                      },
                                    ],
                                    url: item.url,
                                    stickerPath:
                                      item.product_id.sticker_path_2 !== null
                                        ? item.product_id.sticker_path_2
                                        : PLACEHOLDER_IMAGE,
                                    productName:
                                      item.product_id.name !== null
                                        ? item.product_id.name
                                        : 'Product Name',

                                    orderNumber:
                                      item.order_number !== null
                                        ? item.order_number
                                        : 'Order Number',
                                    price:
                                      item.orderPrice !== null
                                        ? item.orderPrice
                                        : 0,
                                  });
                                } else {
                                  handleFacebookMessengerShare({
                                    productId: '123',
                                    cart_details: [
                                      {
                                        product_id: '123',
                                        quantity: item.quantity,
                                      },
                                    ],
                                    url: item.url,
                                    stickerPath: PLACEHOLDER_IMAGE,
                                    productName: 'Product Name',
                                    orderNumber:
                                      item.order_number !== null
                                        ? item.order_number
                                        : 'Order Number',
                                    price:
                                      item.orderPrice !== null
                                        ? item.orderPrice
                                        : 0,
                                  });
                                }
                              }}
                            >
                              <PiMessengerLogoBold className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share on Messenger</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                if (item.product_id) {
                                  handleInstagramShare({
                                    productId:
                                      item.product_id._id !== null
                                        ? item.product_id._id
                                        : '123',
                                    cart_details: [
                                      {
                                        product_id:
                                          item.product_id._id !== null
                                            ? item.product_id._id
                                            : '123',
                                        quantity: item.quantity,
                                      },
                                    ],
                                    url:
                                      item.url !== null
                                        ? item.url
                                        : 'placeholder',
                                    stickerPath:
                                      item.product_id.sticker_path_2 !== null
                                        ? item.product_id.sticker_path_2
                                        : PLACEHOLDER_IMAGE,
                                    productName:
                                      item.product_id.name !== null
                                        ? item.product_id.name
                                        : 'Product Name',
                                    orderNumber:
                                      item.order_number !== null
                                        ? item.order_number
                                        : 'Order Number',
                                    price:
                                      item.orderPrice !== null
                                        ? item.orderPrice
                                        : 0,
                                  });
                                } else {
                                  handleInstagramShare({
                                    productId: '123',
                                    cart_details: [
                                      {
                                        product_id: '123',
                                        quantity: item.quantity,
                                      },
                                    ],
                                    url:
                                      item.url !== null
                                        ? item.url
                                        : 'placeholder',
                                    stickerPath: PLACEHOLDER_IMAGE,
                                    productName: 'Product Name',
                                    orderNumber:
                                      item.order_number !== null
                                        ? item.order_number
                                        : 'Order Number',
                                    price:
                                      item.orderPrice !== null
                                        ? item.orderPrice
                                        : 0,
                                  });
                                }
                              }}
                            >
                              <Instagram className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share on Instagram</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedGiftOrder({
                                  orderId:
                                    order._id !== null ? order._id : '123',
                                  orderNumber:
                                    item.order_number !== null
                                      ? item.order_number
                                      : '123',
                                  url: item.url,
                                });
                                setIsSendGiftModalOpen(true);
                              }}
                            >
                              <Gift className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Send as a gift</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <ChevronDown
                              className={`w-6 h-6 text-gray-400 transform transition-transform cursor-pointer ${
                                expandedOrders.has(`${order._id}-${index}`)
                                  ? 'rotate-180'
                                  : ''
                              }`}
                              onClick={() =>
                                toggleOrderExpansion(`${order._id}-${index}`)
                              }
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Show order details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                {expandedOrders.has(`${order._id}-${index}`) && (
                  <OrderStatus
                    createdAt={order.created_at}
                    isClaimed={item.is_claimed}
                    isReviewed={item.is_reviewed}
                    claimedDate={item.claimed_date}
                  />
                )}
              </div>
            ))
          )
        )}
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedOrder(null);
        }}
        onSubmit={handleReviewSubmit}
      />
      <SendGiftModal
        isOpen={isSendGiftModalOpen}
        onClose={() => {
          setIsSendGiftModalOpen(false);
          setSelectedGiftOrder(null);
        }}
        onSubmit={handleSendGift}
      />
    </div>
  );
};

export default OrderHistory;
