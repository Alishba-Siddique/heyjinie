// src/components/order_history_page/order_history_page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchOrderHistory, addReviews } from '@/services/api.service';
import {
  ChevronDown,
  MoreVertical,
  Star,
  X,
  Gift,
  Instagram,
  Share2,
} from 'lucide-react';
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
import { sendGift } from '@/services/api.service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';

interface OrderResponse {
  success: boolean;
  message: string;
  data: Array<{
    _id: string;
    created_at: string;
    cart_details: Array<{
      product_id: {
        _id: string;
        name: string;
        image_path: string;
        price: number;
        sticker_path_2: string;
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

    await onSubmit(rating, data.review);
    reset();
    setRating(0);
    onClose();
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      reset();
      setRating(0);
    }
  }, [isOpen, reset]);

  // Add new interface for Instagram sharing
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Product</DialogTitle>
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
          />
          {errors.review && (
            <p className="text-sm text-red-500 mt-1">{errors.review.message}</p>
          )}
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4"
          >
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface ShareData {
  url: string;
  stickerPath: string;
  productName: string;
  orderNumber: string;
  price: number;
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
    productId: string;
    orderNumber: string;
    cartId: string;
  } | null>(null);
  const [isSendGiftModalOpen, setIsSendGiftModalOpen] = useState(false);
  const [selectedGiftOrder, setSelectedGiftOrder] = useState<{
    orderId: string;
    orderNumber: string;
  } | null>(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetchOrderHistory();
        if (response.success) {
          setOrders(response.data);
        } else {
          setError(response.message);
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

  if (error) {
    return (
      <div className="mx-auto px-4 py-8">
        <div className="text-center my-auto">
          {error} yet!<br/> <br/> <a href='/shop'>👉 <u>Click here to place your first order!</u></a>
        </div>
      </div>
    );
  }

  const handleReviewSubmit = async (rating: number, review: string) => {
    if (!selectedOrder) return;

    try {
      await addReviews(
        selectedOrder.productId,
        rating,
        review,
        selectedOrder.orderNumber,
        selectedOrder.cartId
      );
      // Refresh order history after successful review
      const response = await fetchOrderHistory();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      // Handle error (you might want to show a toast notification here)
    }
  };

  const handleWhatsAppShare = async (shareData: ShareData) => {
    const shareText = encodeURIComponent(
      `Check out this ${shareData.productName}!\n` +
        `Order #${shareData.orderNumber}\n` +
        `Price: $${shareData.price.toFixed(2)}\n\n` +
        shareData.url
    );
    const whatsappUrl = `https://wa.me/?text=${shareText}`;
    window.open(whatsappUrl, '_blank');
  };



  const handleShare = async (shareData: ShareData) => {
    try {
      // Create a rich text description for the share
      const shareText =
        `Check out this ${shareData.productName}!\n` +
        `Order #${shareData.orderNumber}\n` +
        `Price: $${shareData.price.toFixed(2)}\n\n` +
        shareData.url;

      // If on mobile and Web Share API is available
      if (navigator.share) {
        try {
          // First try to fetch the image
          const response = await fetch(shareData.stickerPath);
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
        await navigator.clipboard.writeText(shareData.url);
        // Here you might want to show a toast notification that the URL was copied
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
      }
    }
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

  const handleFacebookMessengerShare = async (shareData: ShareData) => {
    try {
      // Prepare the message text
      const messageText =
        `Check out this ${shareData.productName}!\n` +
        `Order #${shareData.orderNumber}\n` +
        `Price: $${shareData.price.toFixed(2)}\n\n` +
        shareData.url;

      // Copy text to clipboard
      await navigator.clipboard.writeText(messageText);
      toast.success('Link copied! Opening Messenger...');

      // Try to open Facebook Messenger app first
      const messengerAppUrl = `fb-messenger://share/?link=${encodeURIComponent(
        shareData.url
      )}`;
      window.location.href = messengerAppUrl;

      // Fallback to web version after a short delay
      setTimeout(() => {
        window.open('https://www.messenger.com', '_blank');
      }, 1000);
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error('Failed to copy link');

      // Still try to open Messenger even if copy fails
      window.open('https://www.messenger.com', '_blank');
    }
  };

  const handleInstagramShare = async (shareData: ShareData) => {
    try {
      // Prepare the message text
      const messageText =
        `Check out this ${shareData.productName}!\n` +
        `Order #${shareData.orderNumber}\n` +
        `Price: $${shareData.price.toFixed(2)}\n\n` +
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

  return (
<div className="mx-auto px-4 py-8">
      <h1 className="text-sm sm:text-sm mb-6">Order History</h1>

      <div className="space-y-4">
        {loading ? (
          <>
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
          </>
        ) : (
          orders.map((order) =>
            order.cart_details.map((item, index) => (
              <div
                key={`${order._id}-${index}`}
                className="bg-white rounded-lg shadow"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 w-full">
                      <img
                        src={item.product_id.image_path}
                        alt={item.product_id.name}
                        className="w-full sm:w-24 h-24 rounded-lg object-cover"
                      />
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
                            Total: ${item.orderPrice.toFixed(2)}
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
                                  setSelectedOrder({
                                    productId: item.product_id._id,
                                    orderNumber: item.order_number,
                                    cartId: order._id,
                                  });
                                  setIsReviewModalOpen(true);
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
                              onClick={() =>
                                handleShare({
                                  url: item.url,
                                  stickerPath: item.product_id.sticker_path_2,
                                  productName: item.product_id.name,
                                  orderNumber: item.order_number,
                                  price: item.orderPrice,
                                })
                              }
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
                              onClick={() =>
                                handleWhatsAppShare({
                                  url: item.url,
                                  stickerPath: item.product_id.sticker_path_2,
                                  productName: item.product_id.name,
                                  orderNumber: item.order_number,
                                  price: item.orderPrice,
                                })
                              }
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
                              onClick={() =>
                                handleFacebookMessengerShare({
                                  url: item.url,
                                  stickerPath: item.product_id.sticker_path_2,
                                  productName: item.product_id.name,
                                  orderNumber: item.order_number,
                                  price: item.orderPrice,
                                })
                              }
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
                              onClick={() =>
                                handleInstagramShare({
                                  url: item.url,
                                  stickerPath: item.product_id.sticker_path_2,
                                  productName: item.product_id.name,
                                  orderNumber: item.order_number,
                                  price: item.orderPrice,
                                })
                              }
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
                                  orderId: order._id,
                                  orderNumber: item.order_number,
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