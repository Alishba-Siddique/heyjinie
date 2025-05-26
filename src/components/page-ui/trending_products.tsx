//src/components/page-ui/trending_products.tsx
'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import {
  fetchTrendingProducts,
  placeOrder,
  confirmOrder,
  fetchCategoryList,
} from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import RatingStars from './rating_stars';
import Link from 'next/link';

const PRODUCT_PLACEHOLDER = '/images/logoicons.png';
const MODEL_BG_PATH = '/images/model-bg'; // Path to default background images

// --- Interfaces (Matching API Responses & Modal Needs) ---
interface TrendingProductsCategory {
  _id: string;
  name: string;
  // No 'type' field here
}

interface TrendingProductsCompany {
  _id: string;
  name: string;
  company_logo: string;
}

interface SpecificationValue {
  value: string;
  additional_info?: string;
  price: number; // Additional price for this spec value
  _id: string;
}

interface Specification {
  name: string;
  type: string;
  values: SpecificationValue[];
}

interface TrendingProducts {
  _id: string;
  name: string;
  description: string;
  price: number; // Base price
  image_path: string | null;
  background_images: string[]; // Ensured to be an array
  company_id: TrendingProductsCompany;
  category_id: TrendingProductsCategory;
  sticker_path: string | null; // Allow null
  total_rating: number;
  specification: Specification[]; // Updated for detailed specs
  // Other fields as previously defined
  product_type: string;
  subcategory_id: object;
  sticker_path_2: string | null;
  is_active: boolean;
  is_featured: boolean;
  rating_count: number;
  created_at: string;
  __v: number;
  average_rating: string; // Or number
}

interface Category {
  _id: string;
  name: string;
  type: number; // The important field for background color/image
  // Other fields as previously defined
  description: string;
  search_type: string;
  image_path: string;
  is_active: boolean;
  product_type: string;
  created_at: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: TrendingProducts[];
}

interface CategoryApiResponse {
  success: boolean;
  message: string;
  data: Category[];
}

interface PersonalizedMessage {
  name: string;
  message: string;
  image_path: string;
  image_id: string;
  productId?: string;
}

interface Company {
  _id: string;
  name: string;
  company_logo: string;
  category_ids?: Array<{ _id: string; name?: string }>;
  subcategory_ids?: Array<{ _id: string; name?: string; category_id?: string }>;
}
// --- End Interfaces ---

const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';

// --- Helper Function for Modal Background Image ---
const getDefaultBgImageForType = (type?: number): string => {
  const valid_type =
    typeof type === 'number' && type >= 1 && type <= 4 ? type : null;
  switch (valid_type) {
    case 1:
      return `${MODEL_BG_PATH}/pd_bg_1.jpg`;
    case 2:
      return `${MODEL_BG_PATH}/pd_bg_2.jpg`;
    case 3:
      return `${MODEL_BG_PATH}/pd_bg_3.jpg`;
    case 4:
      return `${MODEL_BG_PATH}/pd_bg_4.jpg`;
    default:
      return `${MODEL_BG_PATH}/pd_bg_1.jpg`; // Default fallback
  }
};

// --- Helper Function for Card Background Color ---
const getCardBackgroundColor = (type?: number): string => {
  switch (type) {
    case 1:
      return '#FFD05E'; // Yellowish
    case 2:
      return '#FF834B'; // Orange
    case 3:
      return '#88C1FD'; // Blue
    case 4:
      return '#40A574'; // Green
    default:
      return '#D6DADA'; // Default light gray for cards
  }
};

const TrendingProducts: React.FC = () => {
  // --- State Variables ---
  const [trendingProducts, setTrendingProducts] = useState<TrendingProducts[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // Full category data for types
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [processing, setProcessing] = useState(false);
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedTopRatedProduct, setSelectedTopRatedProduct] =
    useState<TrendingProducts | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>(''); // Initialize empty
  const [selectedSpecPrice, setSelectedSpecPrice] = useState<number>(0);
  const [currentImageSliderIndex, setCurrentImageSliderIndex] = useState(0);
  
  const [brands, setBrands] = useState<Company[]>([]);

  // Hooks
  const router = useRouter();
  const cartContext = useCart();
  const cartItems = cartContext?.cartItems ?? [];
  const addToCart = cartContext?.addToCart ?? (() => {});
  const removeFromCart = cartContext?.removeFromCart ?? (() => {});

  // Personalization State
  const [personalizedMessages, setPersonalizedMessages] = useState<{
    [key: string]: PersonalizedMessage | undefined;
  }>({});
  // --- End State Variables ---

  // --- Personalized Messages ---
  const loadPersonalizedMessages = useCallback(() => {
    const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
    try {
      const messages = storedMessages ? JSON.parse(storedMessages) : {};
      if (
        messages &&
        typeof messages === 'object' &&
        !Array.isArray(messages)
      ) {
        setPersonalizedMessages(messages);
      } else {
        setPersonalizedMessages({});
      }
    } catch (error) {
      console.error(
        '[loadPersonalizedMessages] ERROR parsing localStorage:',
        error
      );
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
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadPersonalizedMessages]);
  // --- End Personalized Message Logic ---

  // --- Data Fetching Effect ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [picksResponse, categoryResponse] = await Promise.all([
          fetchTrendingProducts() as Promise<ApiResponse>,
          fetchCategoryList() as Promise<CategoryApiResponse>,
        ]);

        let fetchError = null;
        if (picksResponse?.success) {
          setTrendingProducts(picksResponse.data);
        } else {
          fetchError = picksResponse?.message || 'Failed to fetch top picks';
        }
        if (categoryResponse?.success) {
          setCategories(categoryResponse.data);
        } else {
          const catError =
            categoryResponse?.message || 'Failed to fetch categories';
          fetchError = fetchError ? `${fetchError}; ${catError}` : catError;
        }
        if (fetchError) setError(fetchError);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  // --- End Data Fetching Effect ---

  // --- Modal Background Logic ---
  const getModalLeftPanelStyle = useCallback(
    (product?: TrendingProducts | null): React.CSSProperties => {
      let categoryType: number | undefined = undefined;
      if (product?.category_id?._id && categories.length > 0) {
        const fullCategory = categories.find(
          (cat) => cat._id === product.category_id._id
        );
        categoryType = fullCategory?.type;
      }
      const finalBgImage = getDefaultBgImageForType(categoryType);
      return {
        backgroundImage: `url('${finalBgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    },
    [categories]
  ); // Depend on full categories list
  // --- End Modal Background Logic ---

  // --- Event Handlers ---
  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQuantity = () => setQuantity((q) => q + 1);
  const isInCart = (productId: string) =>
    cartItems.some((item) => item._id === productId);

  const handleProductClick = (product: TrendingProducts) => {
    setSelectedTopRatedProduct(product);
    setQuantity(1);
    setCurrentImageSliderIndex(0);

    const firstSpecGroup = product.specification?.[0];
    const initialSpecValue = firstSpecGroup?.values?.[0]?.value || 'M'; // Default to 'M'
    const initialSpec =
      firstSpecGroup?.values?.find((v) => v.value === initialSpecValue) ||
      firstSpecGroup?.values?.[0];
    const rawInitialSpecPrice = initialSpec?.price;
    const initialSpecPriceNum = Number(rawInitialSpecPrice);

    setSelectedSize(initialSpecValue);
    setSelectedSpecPrice(isNaN(initialSpecPriceNum) ? 0 : initialSpecPriceNum);

    setIsFirstModalOpen(true);
  };

  const handleSelectSize = (sizeValue: string, specPrice: number) => {
    setSelectedSize(sizeValue);
    setSelectedSpecPrice(isNaN(specPrice) ? 0 : specPrice);
  };

  const handleReviewsClick = (productId: string) =>
    router.push(`/reviews/${productId}`);
  const handleGoToCart = () => {
    closeModals();
    router.push('/cart');
  };

  const handleAddToCart = () => {
    if (selectedTopRatedProduct) {
      const cartImage = selectedTopRatedProduct.background_images?.[0]
        ? selectedTopRatedProduct.background_images[0] // Assuming full URLs
        : selectedTopRatedProduct.sticker_path
        ? selectedTopRatedProduct.sticker_path
        : selectedTopRatedProduct.image_path
        ? selectedTopRatedProduct.image_path
        : PRODUCT_PLACEHOLDER;

      const itemToAdd = {
        _id: selectedTopRatedProduct._id,
        price: selectedTopRatedProduct.price + selectedSpecPrice,
        quantity,
        image_path: cartImage,
        name: selectedTopRatedProduct.name,
        description: selectedTopRatedProduct.description,
        personalization: personalizedMessages[selectedTopRatedProduct._id],
        specification: selectedTopRatedProduct.specification?.length
          ? selectedTopRatedProduct.specification
          : [
              {
                name: 'Size',
                type: 'button',
                values: [
                  {
                    value: selectedSize,
                    price: selectedSpecPrice,
                    _id: `spec-default-${selectedTopRatedProduct._id}`,
                  },
                ],
              },
            ],
        size: selectedSize,
      };
      addToCart(itemToAdd as any);
      setIsFirstModalOpen(false);
      setIsSecondModalOpen(true);
    }
  };

  const hasPersonalization = (productId: string) =>
    !!personalizedMessages[productId];

  const handlePersonalize = (productId: string) => {
    localStorage.setItem('currentItemId', productId);
    localStorage.setItem('returnPath', window.location.pathname);
    router.push('/messages');
  };

  const handlePlaceOrder = async () => {
    if (!selectedTopRatedProduct) return;
    setProcessing(true);
    try {
      const finalProductPrice =
        selectedTopRatedProduct.price + selectedSpecPrice;
      const orderSpecification =
        selectedSize && selectedTopRatedProduct.specification?.[0]?.name
          ? [
              {
                name: selectedTopRatedProduct.specification[0].name,
                values: [{ value: selectedSize, price: selectedSpecPrice }],
              },
            ]
          : null;

      const orderData = {
        cart_details: [
          {
            product_id: selectedTopRatedProduct._id,
            quantity: quantity,
            personalized:
              personalizedMessages[selectedTopRatedProduct._id] || null,
            specification: orderSpecification,
          },
        ],
      };
      const orderResponse = await placeOrder(orderData);
      if (!orderResponse.success)
        throw new Error(orderResponse.message || 'Failed to place order');

      localStorage.setItem('order_id', orderResponse.data.order_id);
      localStorage.setItem('payment_id', orderResponse.data.payment_id);

      if (orderResponse.data.payment_type === 'free') {
        const confirmResponse = await confirmOrder(
          orderResponse.data.order_id,
          orderResponse.data.payment_id
        );
        if (confirmResponse) {
          removeFromCart(selectedTopRatedProduct._id);
          const currentPersonalizations = { ...personalizedMessages };
          delete currentPersonalizations[selectedTopRatedProduct._id];
          localStorage.setItem(
            'selectedPersonalizedMessages',
            JSON.stringify(currentPersonalizations)
          );
          setPersonalizedMessages(currentPersonalizations);
          closeModals();
          router.push('/thankyou');
        } else {
          throw new Error('Order confirmation failed');
        }
        return;
      }

      const totalAmount = finalProductPrice * quantity * 1.17;
      const orderId = orderResponse.data.order_id;
      const orderDate = new Date().toISOString().split('T')[0];

      const tokenResponse = await fetch(
        `/api/payfast?merchant_id=${process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID}&secured_key=${process.env.NEXT_PUBLIC_PAYFAST_SECURED_KEY}`
      );
      if (!tokenResponse.ok) throw new Error('Failed to fetch PayFast token');
      const responseData = await tokenResponse.json();
      const token = responseData.ACCESS_TOKEN;
      if (!token) throw new Error('Invalid token response from PayFast');

      const generateSignature = (merchantId: string): string =>
        `SIG-${merchantId}-${new Date().getTime()}`;

      const formData = {
        MERCHANT_ID: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
        MERCHANT_NAME: process.env.NEXT_PUBLIC_STORE_NAME || 'Hey Jinie',
        TOKEN: token,
        PROCCODE: '00',
        TXNAMT: totalAmount.toFixed(2),
        CUSTOMER_MOBILE_NO: '03000000000',
        CUSTOMER_EMAIL_ADDRESS: 'test@example.com',
        SIGNATURE: generateSignature(
          process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || ''
        ),
        VERSION: 'PYMT_WEB_DI_1.0', // Match PriceFilter's version
        TXNDESC: `Order ${orderId} - ${selectedTopRatedProduct.name}`,
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
        input.value = String(value);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error: any) {
      console.error('Order placement error:', error);
      toast.error(
        error.message || 'An unexpected error occurred during checkout'
      );
      setProcessing(false);
    }
  };

  const closeModals = () => {
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(false);
    setSelectedTopRatedProduct(null);
    setQuantity(1);
    setSelectedSize('');
    setSelectedSpecPrice(0);
    setCurrentImageSliderIndex(0);
    setProcessing(false);
  };

  const handlePrevContentImage = () => {
    if (
      !selectedTopRatedProduct?.background_images ||
      selectedTopRatedProduct.background_images.length <= 1
    )
      return;
    const imageCount = selectedTopRatedProduct.background_images.length;
    setCurrentImageSliderIndex(
      (prevIndex) => (prevIndex - 1 + imageCount) % imageCount
    );
  };

  const handleNextContentImage = () => {
    if (
      !selectedTopRatedProduct?.background_images ||
      selectedTopRatedProduct.background_images.length <= 1
    )
      return;
    const imageCount = selectedTopRatedProduct.background_images.length;
    setCurrentImageSliderIndex((prevIndex) => (prevIndex + 1) % imageCount);
  };
  // --- End Event Handlers ---

  // --- Render Logic ---
  return (
    <>
      <div>
        <div className="at-giftcard">
          <div className="at-pagesectiontitle">
            <h2>Trending Products</h2>
          </div>
          <div className="at-cardgrid horizontal-scroll overflow-x-auto snap-x snap-mandatory pb-2 flex ">
            {loading &&
              [...Array(5)].map((_, index) => (
                <div
                  className="at-carditem shadow-md rounded-lg overflow-hidden bg-white w-48 md:w-48 flex-shrink-0 snap-start"
                  key={`skeleton-trending-${index}`}
                >
                  <Skeleton className="h-40 w-full" />
                  <div className="p-3">
                    <Skeleton className="h-5 w-3/4 mt-1" />
                    <Skeleton className="h-4 w-1/2 mt-2 mb-1" />
                  </div>
                </div>
              ))}

            {error && !loading && (
              <p className="text-center text-red-600 py-4 w-full">{error}</p>
            )}

            {!loading && !error && trendingProducts.length === 0 && (
              <p className="text-center text-gray-500 py-4 w-full">
                No trending products available.
              </p>
            )}

            {!loading &&
              !error &&
              trendingProducts.length > 0 &&
              trendingProducts.map((trendingProduct) => {
                const fullCategory = categories.find(
                  (c) => c._id === trendingProduct.category_id?._id
                );
                const cardBgColor = getCardBackgroundColor(fullCategory?.type);
                const cardImageSrc =
                  trendingProduct.sticker_path ||
                  trendingProduct.image_path ||
                  PRODUCT_PLACEHOLDER;

                return (
                  <div
                    className="at-carditem cursor-pointer flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 bg-white w-48 md:w-56 flex-shrink-0 snap-start"
                    key={trendingProduct._id}
                    onClick={() => handleProductClick(trendingProduct)}
                  >
                    <figure
                      className="at-giftimage flex-shrink-0 relative h-40 w-full"
                      style={{ backgroundColor: cardBgColor }}
                    >
                      <img
                        src={cardImageSrc}
                        alt={trendingProduct.name || 'Product Image'}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = PRODUCT_PLACEHOLDER;
                        }}
                        className="w-full h-full object-contain p-2"
                      />
                    </figure>
                    <div className="at-giftdetails p-3 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="at-gifttitle flex items-start justify-between w-full mb-1">
                          <h3
                            className="font-bold text-sm m-0 leading-tight text-gray-800 flex-1 mr-2 truncate"
                            title={trendingProduct.name}
                          >
                            {trendingProduct.name}
                          </h3>
                          <span className="text-right text-[#40A574] whitespace-nowrap font-bold text-sm">
                            Rs.{trendingProduct.price}
                          </span>
                        </div>
                        <h4
                          className="font-semibold text-xs text-gray-500 truncate"
                          title={trendingProduct.company_id?.name}
                        >
                          {trendingProduct.company_id?.name || 'Brand'}
                        </h4>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* --- Modals --- */}
      {/* First Modal: Product Details (Styled like PriceFilterResult) */}
     {isFirstModalOpen && selectedTopRatedProduct && (
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
                  {selectedTopRatedProduct.background_images &&
                  selectedTopRatedProduct.background_images.length > 0 ? (
                    <>
                      <img
                        src={
                          selectedTopRatedProduct.background_images[
                            currentImageSliderIndex
                          ] || PRODUCT_PLACEHOLDER
                        }
                        alt={`${selectedTopRatedProduct.name} - image ${
                          currentImageSliderIndex + 1
                        }`}
                        className="object-contain w-full h-full "
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            PRODUCT_PLACEHOLDER;
                        }}
                      />
                      {selectedTopRatedProduct.background_images.length > 1 && ( // Show dots only if more than 1 image
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-1 bg-black bg-opacity-25 rounded-full">
                          {selectedTopRatedProduct.background_images.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageSliderIndex(index);
                              }}
                              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                currentImageSliderIndex === index
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
                      alt={selectedTopRatedProduct.name}
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
                          selectedTopRatedProduct.company_id?.company_logo ||
                          PRODUCT_PLACEHOLDER
                        }
                        alt={`${
                          selectedTopRatedProduct.company_id?.name || 'Brand'
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
                      onClick={() => handleReviewsClick(selectedTopRatedProduct._id)}
                      title="View Reviews"
                    >
                      <h4 className="font-semibold text-lg text-gray-800">
                        {selectedTopRatedProduct.company_id?.name || 'Brand Name'}
                      </h4>
                      <div className="flex justify-start align-middle">
                        <RatingStars
                          rating={Math.round(selectedTopRatedProduct.total_rating)}
                        />{' '}
                        <p className='align-middle'>({Math.round(selectedTopRatedProduct.total_rating)})</p>
                      </div>
                    </div>
                  </div>

                  <div className="at-popupcolorprice flex justify-between items-start my-3">
                    <div className="at-popupcolor flex-grow mr-4">
                      <h3 className="font-bold text-xl text-gray-900">
                        {selectedTopRatedProduct.name}
                      </h3>
                    </div>
                    <div className="at-popupprice flex-shrink-0">
                      <h3 className="font-bold text-xl text-[#40A574]">
                        Rs. {selectedTopRatedProduct.price + selectedSpecPrice}{' '}
                        {/* Display combined price */}
                      </h3>
                    </div>
                  </div>

                  <div className="at-popupdescription mb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedTopRatedProduct.description ||
                        'No description available.'}
                    </p>
                  </div>

                  {selectedTopRatedProduct.specification &&
                    selectedTopRatedProduct.specification.length > 0 &&
                    selectedTopRatedProduct.specification[0].values &&
                    selectedTopRatedProduct.specification[0].values.length > 0 && (
                      <div className="at-productsize mb-4">
                        <label className="block text-base font-medium text-gray-700 mb-1">
                          {selectedTopRatedProduct.specification[0].name || 'Options'}
                        </label>
                        <div className=" overflow-x-auto horizontal-scroll snap-x snap-mandatory flex gap-2">
                          {selectedTopRatedProduct.specification[0].values.map(
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
                  {isInCart(selectedTopRatedProduct._id) ? (
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
                    onClick={() => handlePersonalize(selectedTopRatedProduct._id)}
                  >
                    Personalize
                    <label className="custom-checkbox top-2">
                      <input
                        className="align-middle"
                        type="checkbox"
                        checked={hasPersonalization(selectedTopRatedProduct._id)}
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

      {/* Second Modal: Order Summary (Styled like PriceFilterResult) */}
    {isSecondModalOpen && selectedTopRatedProduct && (
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
                  {selectedTopRatedProduct.background_images &&
                  selectedTopRatedProduct.background_images.length > 0 ? (
                    <>
                      <img
                        src={
                          selectedTopRatedProduct.background_images[
                            currentImageSliderIndex
                          ] || PRODUCT_PLACEHOLDER
                        }
                        alt={`${selectedTopRatedProduct.name} - image ${
                          currentImageSliderIndex + 1
                        }`}
                        className="object-contain w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            PRODUCT_PLACEHOLDER;
                        }}
                      />
                      {selectedTopRatedProduct.background_images.length > 1 && ( // Show dots only if more than 1 image
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-1 bg-black bg-opacity-25 rounded-full">
                          {selectedTopRatedProduct.background_images.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageSliderIndex(index);
                              }}
                              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                currentImageSliderIndex === index
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
                      alt={selectedTopRatedProduct.name}
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
                      <h4>{selectedTopRatedProduct.name}</h4>
                      <p>{selectedTopRatedProduct.description}</p>
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
                          {(selectedTopRatedProduct.price + selectedSpecPrice).toFixed(
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
                            (selectedTopRatedProduct.price + selectedSpecPrice) *
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
                            (selectedTopRatedProduct.price + selectedSpecPrice) *
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
                            (selectedTopRatedProduct.price + selectedSpecPrice) *
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
    </>
  );
};

export default TrendingProducts;
