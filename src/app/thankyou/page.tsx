// src/app/thankyou/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchOrderHistory } from '@/services/api.service';
import Loader from '@/components/page-ui/Loader';

interface LatestOrder {
  productName: string | null;
  productImage: string | null;
  orderNumber: string;
  price: number;
  url: string;
  stickerPath: string | null;
  description: string | null;
  customerName: string;
  companyName: string;
  created_at: string;
}

const PLACEHOLDER_IMAGE = '/images/logoicons.png';

const ThankYou = () => {
  const [latestOrder, setLatestOrder] = useState<LatestOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLatestOrder = async () => {
      try {
        const response = await fetchOrderHistory();
        if (response.success && response.data.length > 0) {
          // Get the most recent order
          const mostRecentOrder = response.data[0];
          const orderItem = mostRecentOrder.cart_details[0];

          setLatestOrder({
            productName:
              orderItem.product_id.name !== null
                ? orderItem.product_id.sticker_path
                : 'Product Name',
            productImage:
              orderItem.product_id.sticker_path !== null
                ? orderItem.product_id.sticker_path
                : PLACEHOLDER_IMAGE,
            orderNumber: orderItem.order_number,
            price: orderItem.orderPrice,
            url: orderItem.url,
            stickerPath: orderItem.product_id.sticker_path_2,
            description:
              orderItem.product_id.description || 'Product Description',
            customerName: mostRecentOrder.customer_id.full_name,
            companyName: orderItem.product_id.company_id.name,
            created_at: mostRecentOrder.created_at,
          });
        } else {
          setError('No orders found');
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getLatestOrder();
  }, []);

  const handleShare = async (platform: string) => {
    if (!latestOrder) return;

    try {
      const shareText = `
                Check out this ${latestOrder.productName || 'Product'} from ${
        latestOrder.companyName || 'Company'
      }!
                Order #${latestOrder.orderNumber || 'Order Number'}
                Price: $${latestOrder.price.toFixed(2) || 'Price'}
                ${latestOrder.description || 'Description'}

                ${latestOrder.url || 'URL'}
            `;

      switch (platform) {
        case 'whatsapp':
          const whatsappText = encodeURIComponent(shareText);
          window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
          break;

        case 'messenger':
          await navigator.clipboard.writeText(shareText);
          toast.success('Link copied! Opening Messenger...');

          const messengerAppUrl = `fb-messenger://share/?link=${encodeURIComponent(
            latestOrder.url
          )}`;
          window.location.href = messengerAppUrl;

          setTimeout(() => {
            window.open('https://www.messenger.com', '_blank');
          }, 1000);
          break;

        case 'instagram':
          await navigator.clipboard.writeText(shareText);
          toast.success('Link copied! Opening Instagram...');
          window.open('https://instagram.com/direct/inbox', '_blank');
          break;
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share');
    }
  };

  if (loading) {
    return <Loader />;
  }

  
  return (
    <div
      className="at-maincontentwrapper"
      style={{
        backgroundImage: 'url("/images/thankyoubg.png")',
        backgroundSize: 'contain',
        backgroundPosition: 'top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Main content */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24">
            <img
              src="/images/logoicons.png"
              alt="Hey Jinie Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Thank you text */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-[#40A574] mb-2 font-[pacifico]">
            Thank you
          </h1>
          <p className=" text-lg font-bold text-[#434343]">
            For Placing your order
          </p>
        </div>

        {/* Product image */}
        <div className="flex justify-center mb-4">
          <div className="w-32">
            <img
              src={latestOrder?.productImage || PLACEHOLDER_IMAGE}
              alt="Product Image"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Description */}
        {latestOrder && (
          <div className="text-center mb-4 max-w-2xl mx-auto">
            <p className="text-gray-700 text-lg">
              {latestOrder.description || 'Product Description'}
            </p>
          </div>
        )}

        {/* Share section */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#434343] mb-6">
            Share With Gift As A Sticker
          </h2>
          <div className="flex justify-center gap-4">
            {/* WhatsApp */}
            <button
              onClick={() => handleShare('whatsapp')}
              className="w-16 h-16 rounded-2xl bg-[#88C1FD] text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
            >
              <img
                className="w-10 h-10"
                src="/images/icon-whatsapp.svg"
                alt="whatsapp"
              />
            </button>

            {/* Messenger */}
            <button
              onClick={() => handleShare('messenger')}
              className="w-16 h-16 rounded-2xl bg-[#FD9399] text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
            >
              <img
                className="w-10 h-10"
                src="/images/icon-messenger.svg"
                alt="messenger"
              />
            </button>

            {/* Instagram */}
            <button
              onClick={() => handleShare('instagram')}
              className="w-16 h-16 rounded-2xl bg-[#FFD05E] text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
            >
              <img
                className="w-10 h-10"
                src="/images/icon-insta.svg"
                alt="instagram"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
