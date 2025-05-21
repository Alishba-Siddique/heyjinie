// src/app/products/filter/price/page.tsx
'use client';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  applyPriceFilter,
  placeOrder,
  confirmOrder,
} from '@/services/api.service';
import { PriceFilterProduct, PriceFilterApiResponse } from '@/types/api'; // Your existing types
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import RatingStars from '@/components/page-ui/rating_stars';
import { Button } from '@/components/ui/button';

// Define type-based background settings
const getCategoryBackground = (type?: number) => {
  switch (type) {
    case 1:
      return { image: 'pd_bg_1.jpg', color: '#FFD05E' }; // Yellow
    case 2:
      return { image: 'pd_bg_2.jpg', color: '#FF834B' }; // Orange
    case 3:
      return { image: 'pd_bg_3.jpg', color: '#88C1FD' }; // Blue
    case 4:
      return { image: 'pd_bg_4.jpg', color: '#40A574' }; // Green
    default:
      return { image: 'pd_bg_1.jpg', color: '#D6D6DA' }; // Default fallback (Yellow)
  }
};

// ProductForModal: Defines the data structure for the product when displayed in a modal.
interface ProductForModal extends PriceFilterProduct {
  category_id: CategoryInfo;
  company_id: {
    _id: string;
    name: string;
    company_logo: string;
  };
  background_images: string[]; // Ensured to be an array, potentially with fallbacks
  specification: Array<{
    name: string;
    type: string;
    values: Array<{
      value: string;
      additional_info?: string;
      price: number; // Price here is the additional price for the spec
      _id: string;
    }>;
  }>;
}

// CategoryInfo: Used to pass category details, especially for styling.
interface CategoryInfo {
  _id: string;
  name: string;
  type: number;
}

interface PersonalizedMessage {
  name: string;
  message: string;
  image_path: string;
  image_id: string;
  productId?: string;
}

const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

// --- Product Card Component ---
const ProductCard: React.FC<{
  product: PriceFilterProduct;
  onClick: (product: PriceFilterProduct) => void;
}> = ({ product, onClick }) => {
  const getCardBackgroundStyle = () => {
    const categoryType = product.category_id?.type ?? 1;
    const { color } = getCategoryBackground(categoryType);
    return { backgroundColor: color }; // Use color for feature cards
  };

  const companyName = product.company_id?.name;

  return (
    <div
      className="at-carditem cursor-pointer"
      onClick={() => onClick(product)}
    >
      <figure
        className="at-giftimage flex-shrink-0 relative h-40"
        style={getCardBackgroundStyle()}
      >
        <img
          src={
            product.sticker_path || product.image_path || PRODUCT_PLACEHOLDER
          }
          alt={product.name || 'Product Image'}
          onError={(e) => {
            (e.target as HTMLImageElement).src = PRODUCT_PLACEHOLDER;
          }}
          className="w-full h-full object-contain p-2"
        />
      </figure>
      <div className="at-giftdetails p-3 flex-grow flex flex-col justify-between">
        <div className="at-gifttitle flex items-center justify-between w-full mb-1">
          <h3 className="font-bold text-sm m-0 leading-tight text-gray-800 truncate flex-1 mr-2">
            {product.name}
          </h3>
          <span className="text-right text-[#40A574] whitespace-nowrap font-bold text-sm">
            PKR {product.price}
          </span>
        </div>
        {companyName ? (
          <h4 className="font-semibold text-xs text-gray-600 truncate">
            {companyName}
          </h4>
        ) : (
          <h4 className="font-semibold text-xs text-gray-400 truncate italic">
            {/* Brand not specified or name missing */}
          </h4>
        )}
      </div>
    </div>
  );
};

// --- Main Content Component for Price Filter Results ---
const PriceFilterResultsContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<PriceFilterProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- State for Modals ---
  const [processing, setProcessing] = useState(false);
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductForModal | null>(null);
  const [selectedProductCategoryInfo, setSelectedProductCategoryInfo] =
    useState<CategoryInfo | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedSpecPrice, setSelectedSpecPrice] = useState<number>(0); // For additional price from spec
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0); // For slider

  const cartContext = useCart();
  const cartItems = cartContext?.cartItems ?? [];
  const addToCart =
    cartContext?.addToCart ??
    (() => {
      toast.error('Cart functionality is not available.');
      console.error('addToCart not available');
    });
  const removeFromCart =
    cartContext?.removeFromCart ??
    (() => {
      toast.error('Cart functionality is not available.');
      console.error('removeFromCart not available');
    });

  const minPrice = searchParams.get('min');
  const maxPrice = searchParams.get('max');

  useEffect(() => {
    if (minPrice === null || maxPrice === null) {
      setError('Price range not specified.');
      setLoading(false);
      return;
    }
    const fetchFilteredProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { start_price: minPrice, end_price: maxPrice };
        const response = (await applyPriceFilter(
          params
        )) as PriceFilterApiResponse;

        if (response.success && Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.success && !Array.isArray(response.data)) {
          setProducts([]);
          setError('Received invalid product data format.');
          toast.error('Received invalid product data format.');
        } else {
          setError(response.message || 'Failed to fetch filtered products.');
          toast.error(response.message || 'Failed to fetch filtered products.');
        }
      } catch (err: any) {
        const errorMessage =
          err.message || 'An error occurred fetching products.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredProducts();
  }, [minPrice, maxPrice]);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  const isInCart = (productId: string) =>
    cartItems.some((item) => item._id === productId);

  const handleProductClick = (product: PriceFilterProduct) => {
    const productForModal: ProductForModal = {
      ...product,
      company_id: {
        _id: product.company_id?._id || `company-default-${product._id}`,
        name: product.company_id?.name || 'Brand Unavailable',
        company_logo: product.company_id?.company_logo || PRODUCT_PLACEHOLDER,
      },
      category_id: {
        _id: product.category_id._id,
        name: product.category_id.name,
        type: product.category_id.type ?? 1,
      },
      background_images: product.background_images?.length
        ? product.background_images
        : ([
            product.image_path || product.sticker_path || PRODUCT_PLACEHOLDER,
          ].filter(Boolean) as string[]),
      specification: product.specification?.length
        ? product.specification
        : [
            {
              name: 'Size',
              type: 'button',
              values: [
                {
                  value: 'M',
                  price: 0,
                  _id: `spec-default-${product._id}`,
                },
              ],
            },
          ],
      total_rating: Number(product.total_rating) || 0,
      rating_count: Number(product.rating_count) || 0,
    };

    const firstSpecGroup = productForModal.specification?.[0];
    const initialSpecValue = firstSpecGroup?.values?.[0]?.value || 'M';
    const rawInitialSpecPrice = firstSpecGroup?.values?.[0]?.price;
    const initialSpecPrice = Number(rawInitialSpecPrice);

    setSelectedProduct(productForModal);
    setSelectedProductCategoryInfo(productForModal.category_id);
    setQuantity(1);
    
    setSelectedSize(initialSpecValue);
    setSelectedSpecPrice(isNaN(initialSpecPrice) ? 0 : initialSpecPrice);
    setCurrentImageIndex(0);
    setIsFirstModalOpen(true);
  };

  const handleReviewsClick = (productId: string | undefined) => {
    if (productId) {
      router.push(`/reviews/${productId}`);
    } else {
      toast.warn('Cannot view reviews for this product.');
    }
  };

  const handleGoToCart = () => {
    closeModals();
    router.push('/cart');
  };

  const handleAddToCart = () => {
    if (selectedProduct && cartContext) {
      const itemToAdd = {
        _id: selectedProduct._id,
        price: selectedProduct.price + selectedSpecPrice, // Combined price
        quantity,
        image_path:
          selectedProduct.background_images?.[0] || // Use first background image or fallback
          selectedProduct.image_path ||
          PRODUCT_PLACEHOLDER,
        sticker_path: selectedProduct.sticker_path,
        name: selectedProduct.name,
        description: selectedProduct.description,
        company_id: selectedProduct.company_id,
        category_id: selectedProduct.category_id,
        background_images: selectedProduct.background_images,
        personalization: personalizedMessages[selectedProduct._id],
        size: selectedSize,
        // specPrice: selectedSpecPrice, // Optionally pass specPrice separately if cart needs it
      };
      addToCart(itemToAdd as any);
      setIsFirstModalOpen(false);
      setIsSecondModalOpen(true);
    }
  };

  const [personalizedMessages, setPersonalizedMessages] = useState<{
    [key: string]: PersonalizedMessage | undefined;
  }>({});
  const loadPersonalizedMessages = useCallback(() => {
    const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
    try {
      const messages = storedMessages ? JSON.parse(storedMessages) : {};
      setPersonalizedMessages(
        messages && typeof messages === 'object' && !Array.isArray(messages)
          ? messages
          : {}
      );
    } catch (error) {
      console.error('Error parsing personalized messages:', error);
      setPersonalizedMessages({});
    }
  }, []);
  useEffect(() => {
    loadPersonalizedMessages();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'selectedPersonalizedMessages') {
        loadPersonalizedMessages();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadPersonalizedMessages]);
  const hasPersonalization = (productId: string) =>
    !!personalizedMessages[productId];
  const handlePersonalize = (productId: string) => {
    localStorage.setItem('currentItemId', productId);
    localStorage.setItem(
      'returnPath',
      window.location.pathname + window.location.search
    );
    router.push('/messages');
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct) return;

    try {
      setProcessing(true);
      const orderSpecification =
        selectedSize && selectedProduct.specification?.[0]?.name
          ? [
              {
                name: selectedProduct.specification[0].name,
                values: [
                  {
                    value: selectedSize,
                    price: selectedSpecPrice, // Price of the selected specification option
                  },
                ],
              },
            ]
          : null;

      const orderData = {
        cart_details: [
          {
            product_id: selectedProduct._id,
            quantity: quantity,
            personalized: personalizedMessages[selectedProduct._id] || null,
            specification: orderSpecification,
            // The backend should calculate total price based on product's base price + spec price
          },
        ],
      };

      const orderResponse = await placeOrder(orderData);
      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to place order');
      }

      localStorage.setItem('order_id', orderResponse.data.order_id);
      localStorage.setItem('payment_id', orderResponse.data.payment_id);
      const orderId = orderResponse.data.order_id;

      if (orderResponse.data.payment_type === 'free') {
        const confirmResponse = await confirmOrder(
          orderId,
          orderResponse.data.payment_id
        );
        if (confirmResponse && confirmResponse.success) {
          removeFromCart(selectedProduct._id);
          const currentPersonalizations = { ...personalizedMessages };
          delete currentPersonalizations[selectedProduct._id];
          localStorage.setItem(
            'selectedPersonalizedMessages',
            JSON.stringify(currentPersonalizations)
          );
          setPersonalizedMessages(currentPersonalizations);
          closeModals();
          router.push('/thankyou');
        } else {
          throw new Error(
            confirmResponse?.message || 'Order confirmation failed'
          );
        }
        return;
      }

      const finalProductPrice = selectedProduct.price + selectedSpecPrice;
      const totalAmountForPayment = finalProductPrice * quantity * 1.17; // Price incl. spec, quantity, and tax
      const orderDate = new Date().toISOString().split('T')[0];

      const merchantId = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID;
      const securedKey = process.env.NEXT_PUBLIC_PAYFAST_SECURED_KEY;
      const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Your Store';

      if (!merchantId || !securedKey) {
        throw new Error('PayFast merchant details are not configured.');
      }

      const tokenResponse = await fetch(
        `/api/payfast?merchant_id=${merchantId}&secured_key=${securedKey}`
      );
      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch PayFast token');
      }
      const tokenData = await tokenResponse.json();
      const token = tokenData.ACCESS_TOKEN;
      if (!token) throw new Error('Invalid token received from PayFast');

      const generateSignature = (merchantIdSig: string): string => {
        const timestamp = new Date().getTime();
        return `SIG-${merchantIdSig}-${timestamp}`;
      };

      const formData: Record<string, string> = {
        MERCHANT_ID: merchantId,
        MERCHANT_NAME: storeName,
        TOKEN: token,
        PROCCODE: '00',
        TXNAMT: totalAmountForPayment.toFixed(2),
        CUSTOMER_MOBILE_NO: '03000000000', // Placeholder
        CUSTOMER_EMAIL_ADDRESS: 'customer@example.com', // Placeholder
        SIGNATURE: generateSignature(merchantId),
        VERSION: 'PYMT_WEB_DI_1.0',
        TXNDESC: `Order ${orderId} - ${selectedProduct.name}`,
        SUCCESS_URL: `${window.location.origin}/success?order_id=${orderId}&payment_id=${orderResponse.data.payment_id}`,
        FAILURE_URL: `${window.location.origin}/failure?order_id=${orderId}`,
        BASKET_ID: orderId,
        ORDER_DATE: orderDate,
        CHECKOUT_URL: `${window.location.origin}/confirm?order_id=${orderId}`,
      };

      const form = document.createElement('form');
      form.method = 'POST';
      form.action =
        'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction';
      form.style.display = 'none';
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error: any) {
      console.error('Order placement error:', error);
      toast.error(
        error.message || 'An unexpected error occurred during checkout.'
      );
      setProcessing(false);
    }
  };

  const closeModals = () => {
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(false);
    setSelectedProduct(null);
    setSelectedProductCategoryInfo(null);
    setQuantity(1);
    setSelectedSize('M');
    setSelectedSpecPrice(0);
    setCurrentImageIndex(0);
    setProcessing(false);
  };

  const getModalLeftPanelStyle = () => {
    // Use category-based image for modal background
    const type = selectedProductCategoryInfo?.type ?? 1; // Default to type 1
    const { image: imageName } = getCategoryBackground(type);
    const imageUrl = `/images/model-bg/${imageName}`;
    return {
      backgroundImage: `url('${imageUrl}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  };

  // --- Render ---
  return (
    <div className="at-maincontentwrapper">
      <div className="at-pagesectiontitle mb-6 border-b pb-3 flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-4 p-1 rounded-full hover:bg-gray-100"
          aria-label="Go back"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Products by Price
          </h1>
          {minPrice !== null && maxPrice !== null && (
            <p className="text-sm text-gray-600">
              Range: PKR {minPrice} - {maxPrice}
            </p>
          )}
        </div>
      </div>

      <div className="at-giftcard">
        {loading && (
          <div className="at-cardgrid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[...Array(10)].map((_, index) => (
              <div
                className="at-carditem rounded-lg overflow-hidden bg-white shadow-md"
                key={`skeleton-${index}`}
              >
                <Skeleton className="h-40 w-full bg-gray-200" />
                <div className="p-3">
                  <Skeleton className="h-5 w-3/4 mb-2 bg-gray-200" />
                  <Skeleton className="h-4 w-1/2 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}
        {error && !loading && (
          <p className="error-message text-center text-red-600 py-6">
            Error: {error}
          </p>
        )}
        {!loading && !error && products.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-6">
            No products found in this price range.
          </p>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="at-cardgrid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onClick={handleProductClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- Modals --- */}
      {/* First Modal (Product Details) */}
      {isFirstModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModals}
        >
          <div
            className="bg-white rounded-lg shadow-lg at-modaldailouge"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row">
              <div
                className="at-modalleftside w-full md:w-[40%] flex-shrink-0 p-6 flex items-center justify-center relative"
                style={getModalLeftPanelStyle()}
              >
                <button
                  onClick={closeModals}
                  className="at-btnpopupclose at-btnpopupclosetwo"
                >
                  {/* Close SVG */}
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_252_1556)">
                      <path
                        d="M16 32C7.17725 32 0 24.8228 0 16C0 7.17725 7.17725 0 16 0C24.8228 0 32 7.17725 32 16C32 24.8228 24.8228 32 16 32ZM16 2C8.28003 2 2 8.28003 2 16C2 23.72 8.28003 30 16 30C23.72 30 30 23.72 30 16C30 8.28003 23.72 2 16 2Z"
                        fill="#434343"
                      />
                      <path
                        d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321  10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
                        fill="#434343"
                      />
                      <path
                        d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
                        fill="#434343"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_252_1556">
                        <rect width="32" height="32" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <figure className="at-productimg relative w-full h-full max-w-full flex items-center justify-center">
                  {selectedProduct.background_images &&
                  selectedProduct.background_images.length > 0 ? (
                    <>
                      <img
                        src={
                          selectedProduct.background_images[
                            currentImageIndex
                          ] || PRODUCT_PLACEHOLDER
                        }
                        alt={`${selectedProduct.name} - image ${
                          currentImageIndex + 1
                        }`}
                        className="object-contain w-full h-full "
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            PRODUCT_PLACEHOLDER;
                        }}
                      />
                      {selectedProduct.background_images.length > 1 && ( // Show dots only if more than 1 image
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-1 bg-black bg-opacity-25 rounded-full">
                          {selectedProduct.background_images.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex(index);
                              }}
                              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                currentImageIndex === index
                                  ? 'bg-white'
                                  : 'bg-gray-300 hover:bg-gray-100'
                              }`}
                              aria-label={`View image ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    // Fallback if background_images array is somehow empty (shouldn't happen with ProductForModal transform)
                    <img
                      src={PRODUCT_PLACEHOLDER}
                      alt={selectedProduct.name}
                      className="object-contain w-full h-full transition-opacity duration-300 ease-in-out"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          PRODUCT_PLACEHOLDER;
                      }}
                    />
                  )}
                </figure>
              </div>

              <div className="at-popupcontentside w-full md:w-[60%] p-6 flex flex-col justify-between">
                <div>
                  <div className="at-popuptitlebrandimg flex items-start mb-3">
                    <span className="w-12 h-12 mr-3 overflow-hidden flex-shrink-0">
                      <img
                        src={
                          selectedProduct.company_id?.company_logo ||
                          PRODUCT_PLACEHOLDER
                        }
                        alt={`${
                          selectedProduct.company_id?.name || 'Brand'
                        } logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            PRODUCT_PLACEHOLDER;
                        }}
                      />
                    </span>
                    <div
                      className="at-popupproduct titlerating flex-grow cursor-pointer"
                      onClick={() => handleReviewsClick(selectedProduct._id)}
                      title="View Reviews"
                    >
                      <h4 className="font-semibold text-lg text-gray-800">
                        {selectedProduct.company_id?.name || 'Brand Name'}
                      </h4>
                      <div className="flex justify-start align-middle">
                        <RatingStars
                          rating={Math.round(selectedProduct.total_rating)}
                        />{' '}
                        <p className='align-middle'>({Math.round(selectedProduct.total_rating)})</p>
                      </div>
                    </div>
                  </div>

                  <div className="at-popupcolorprice flex justify-between items-start my-3">
                    <div className="at-popupcolor flex-grow mr-4">
                      <h3 className="font-bold text-xl text-gray-900">
                        {selectedProduct.name}
                      </h3>
                    </div>
                    <div className="at-popupprice flex-shrink-0">
                      <h3 className="font-bold text-xl text-[#40A574]">
                        Rs. {selectedProduct.price + selectedSpecPrice}{' '}
                        {/* Display combined price */}
                      </h3>
                    </div>
                  </div>

                  <div className="at-popupdescription mb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedProduct.description ||
                        'No description available.'}
                    </p>
                  </div>

                  {selectedProduct.specification &&
                    selectedProduct.specification.length > 0 &&
                    selectedProduct.specification[0].values &&
                    selectedProduct.specification[0].values.length > 0 && (
                      <div className="at-productsize mb-4">
                        <label className="block text-base font-medium text-gray-700 mb-1">
                          {selectedProduct.specification[0].name || 'Options'}
                        </label>
                        <div className=" overflow-x-auto horizontal-scroll snap-x snap-mandatory flex gap-2">
                          {selectedProduct.specification[0].values.map(
                            (specValue) => {
                              const specPriceNum = Number(specValue.price);
                              const displaySpecPrice =
                                isNaN(specPriceNum) || specPriceNum === 0
                                  ? ''
                                  : ` (+${specPriceNum})`;
                              return (
                                <button
                                  key={specValue._id || specValue.value}
                                  onClick={() => {
                                    setSelectedSize(specValue.value);
                                    setSelectedSpecPrice(
                                      isNaN(specPriceNum) ? 0 : specPriceNum
                                    );
                                  }}
                                  className={`px-5 py-3 border rounded-full text-base transition-colors duration-150 ${
                                    selectedSize === specValue.value
                                      ? 'bg-[#40A574] text-white border-[#40A574]'
                                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                  }`}
                                >
                                  {specValue.value}
                                  {displaySpecPrice}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                </div>

                <div className="at-btnaddtocart">
                  {isInCart(selectedProduct._id) ? (
                    <button onClick={handleGoToCart} className="at-btn">
                      Go to Cart
                      {/* SVG */}
                      <svg
                        className="mt-3"
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                        fill="#ffffff"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="16" cy="16" r="16" fill="white" />
                        <path
                          d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
                          fill="#40A574"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button onClick={handleAddToCart} className="at-btn">
                      Add to Cart
                      {/* SVG */}
                      <svg
                        className="mt-3"
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                        fill="#ffffff"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="16" cy="16" r="16" fill="white" />
                        <path
                          d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
                          fill="#40A574"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    className="at-btn at-btnpersonal"
                    onClick={() => handlePersonalize(selectedProduct._id)}
                  >
                    Personalize
                    <label className="custom-checkbox top-2">
                      <input
                        className="align-middle"
                        type="checkbox"
                        checked={hasPersonalization(selectedProduct._id)}
                        readOnly
                      />
                      <span className="checkmark"></span>
                    </label>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Second Modal (Order Summary) */}
      {isSecondModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModals}
        >
          <div
            className="bg-white rounded-lg shadow-lg at-modaldailouge"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center flex-col">
              {' '}
              {/* Changed: flex-col to match typical modal flow better */}
              <div className="at-modalcontent w-full">
                {' '}
                {/* Added w-full for consistency */}
                <div
                className="at-modalleftside w-full md:w-[40%] flex-shrink-0 p-6 flex items-center justify-center relative"
                style={getModalLeftPanelStyle()}
              >
                <button
                  onClick={closeModals}
                  className="at-btnpopupclose at-btnpopupclosetwo"
                >
                  {/* Close SVG */}
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_252_1556)">
                      <path
                        d="M16 32C7.17725 32 0 24.8228 0 16C0 7.17725 7.17725 0 16 0C24.8228 0 32 7.17725 32 16C32 24.8228 24.8228 32 16 32ZM16 2C8.28003 2 2 8.28003 2 16C2 23.72 8.28003 30 16 30C23.72 30 30 23.72 30 16C30 8.28003 23.72 2 16 2Z"
                        fill="#434343"
                      />
                      <path
                        d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321  10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
                        fill="#434343"
                      />
                      <path
                        d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
                        fill="#434343"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_252_1556">
                        <rect width="32" height="32" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <figure className="at-productimg relative w-full h-full max-w-full flex items-center justify-center">
                  {selectedProduct.background_images &&
                  selectedProduct.background_images.length > 0 ? (
                    <>
                      <img
                        src={
                          selectedProduct.background_images[
                            currentImageIndex
                          ] || PRODUCT_PLACEHOLDER
                        }
                        alt={`${selectedProduct.name} - image ${
                          currentImageIndex + 1
                        }`}
                        className="object-contain w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            PRODUCT_PLACEHOLDER;
                        }}
                      />
                      {selectedProduct.background_images.length > 1 && ( // Show dots only if more than 1 image
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-1 bg-black bg-opacity-25 rounded-full">
                          {selectedProduct.background_images.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex(index);
                              }}
                              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                currentImageIndex === index
                                  ? 'bg-white'
                                  : 'bg-gray-300 hover:bg-gray-100'
                              }`}
                              aria-label={`View image ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    // Fallback if background_images array is somehow empty (shouldn't happen with ProductForModal transform)
                    <img
                      src={PRODUCT_PLACEHOLDER}
                      alt={selectedProduct.name}
                      className="object-contain w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          PRODUCT_PLACEHOLDER;
                      }}
                    />
                  )}
                </figure>
              </div>
                <div className="at-popupcontentside p-6">
                  {' '}
                  {/* Added padding for consistency */}
                  <div className="at-popuptitlebrandimg at-modaltitleqnty">
                    <div className="at-popupproducttitlerating at-ordersummerytitlearea">
                      <h4>{selectedProduct.name}</h4>
                      <p>{selectedProduct.description}</p>
                    </div>
                    <div className="at-orderquntatiy">
                      <div className="at-btnquntatiyholder">
                        <button
                          onClick={decreaseQuantity}
                          disabled={quantity === 1}
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button onClick={increaseQuantity}>+</button>
                      </div>
                    </div>
                  </div>
                  <div className="at-ordersummery">
                    <h3>Order Summary</h3>
                    <ul>
                      <li>
                        <span>Item Price</span>
                      </li>
                      <li>
                        <span>
                          Rs.
                          {(selectedProduct.price + selectedSpecPrice).toFixed(
                            2
                          )}
                        </span>
                      </li>
                      <li>
                        <span>Quantity</span>
                      </li>
                      <li>
                        <span>{quantity}</span>
                      </li>
                      <li>
                        <span>Subtotal</span>
                      </li>
                      <li>
                        <span>
                          Rs.
                          {(
                            (selectedProduct.price + selectedSpecPrice) *
                            quantity
                          ).toFixed(2)}
                        </span>
                      </li>
                      <li>
                        <span>Sales Tax 17%</span>
                      </li>
                      <li>
                        <span>
                          Rs.
                          {(
                            (selectedProduct.price + selectedSpecPrice) *
                            quantity *
                            0.17
                          ).toFixed(2)}
                        </span>
                      </li>
                      <li>
                        <span>Grand Total</span>
                      </li>
                      <li>
                        <span>
                          Rs.
                          {(
                            (selectedProduct.price + selectedSpecPrice) *
                            quantity *
                            1.17
                          ).toFixed(2)}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="at-btnsubmitcontact at-btnprofile at-btnplaceorder pt-5">
                    {' '}
                    {/* Adjusted margin/padding */}
                    <button
                      type="button"
                      className="at-btn"
                      onClick={handlePlaceOrder}
                      disabled={processing}
                    >
                      {processing ? 'Processing...' : 'Place Order'}
                    </button>
                    <a href="/home">
                      {' '}
                      {/* Consider using router.push('/home') for SPA navigation */}
                      <button type="button" className="at-btn at-btncancel">
                        Continue Shopping
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Page Component with Suspense ---
const PriceFilterResultsPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="at-maincontentwrapper flex items-center justify-center min-h-screen">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.75V6.25m0 11.5v1.5m8.44-11.94l-1.06 1.06M6.62 17.38l-1.06 1.06M19.25 12h-1.5m-11.5 0h-1.5m8.44 7.44l-1.06-1.06M6.62 6.62l-1.06-1.06"
              />
            </svg>
            <p className="mt-2 text-gray-500">Loading products...</p>
          </div>
        </div>
      }
    >
      <PriceFilterResultsContent />
    </Suspense>
  );
};

export default PriceFilterResultsPage;
