// src/components/Product/brand_shop.tsx
'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/CartContext';
import {
  fetchProductDetails, // For brand-specific products
  fetchStickerList, // For global promo sliders and categories
  fetchCategoryList, // Specifically for all categories if not in fetchStickerList
  placeOrder,
  confirmOrder,
} from '@/services/api.service';
import { toast } from 'react-toastify';
import RatingStars from '../page-ui/rating_stars';
import Link from 'next/link';

const PRODUCT_PLACEHOLDER = '/images/logoicons.png';
const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';
const MODEL_BG_PATH = '/images/model-bg';

// --- Interfaces (Keep existing interfaces) ---
interface SpecificationValue {
  value: string;
  additional_info?: string;
  price: number;
  _id: string;
}

interface Specification {
  name: string;
  type: string;
  values: SpecificationValue[];
}

interface CompanyMin {
  _id: string;
  name: string;
  company_logo?: string;
}

interface CategoryMin {
  _id: string;
  name?: string;
  type?: number; // For background/color logic
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_path: string | null;
  background_image?: string[]; // Array of strings for image paths
  is_featured: boolean;
  sticker_path: string | null;
  total_rating: number;
  category_id?: string | CategoryMin; // Can be string ID or populated object
  company_id?: string | CompanyMin; // Can be string ID or populated object
  specification?: Specification[];
  quantity?: number;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  search_type: string;
  image_path: string;
  is_active: boolean;
  product_type: string;
  type: number;
  created_at: string;
  __v: number;
}

interface PersonalizedMessage {
  name: string;
  message: string;
  image_path: string;
  image_id: string;
  productId?: string;
}

interface PromoProductItem {
  product_id: Product; // Full product object
  discounted_price: number;
  product_promo_image: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  is_active: boolean;
  created_at: string;
  sticker_path: string | null;
  image_path: string | null;
}

interface PromoSliderData {
  _id: string;
  start_date: string;
  end_date: string;
  company_id: CompanyMin;
  title: string;
  description: string;
  promo_image: string;
  discount_percentage: number;
  promo_slider: string;
  products_data: PromoProductItem[];
  country_id: string;
  state_id: string;
  city: string;
}
// --- End Interfaces ---

// --- Slugify/Unslugify (Keep existing functions) ---
const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const unslugify = (slug: string) => {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/ And /gi, ' & ');
};
// --- End Slugify/Unslugify ---

// --- Helper Functions for Styling (Keep existing functions) ---
const getCategoryIdStr = (
  catField: string | CategoryMin | undefined | null
): string | undefined => {
  if (typeof catField === 'string') return catField;
  if (typeof catField === 'object' && catField !== null && catField._id)
    return catField._id;
  return undefined;
};

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
      return `${MODEL_BG_PATH}/pd_bg_1.jpg`;
  }
};

const getCategoryColor = (type?: number): string => {
  const valid_type =
    typeof type === 'number' && type >= 1 && type <= 4 ? type : null;
  switch (valid_type) {
    case 1:
      return '#FFD05E';
    case 2:
      return '#FF834B';
    case 3:
      return '#88C1FD';
    case 4:
      return '#40A574';
    default:
      return '#D6DADA';
  }
};
// --- End Helper Functions ---

export default function BrandShop() {
  const { brandId: rawBrandId, brandname: rawBrandname } = useParams();
  // Ensure brandId and brandname are strings or undefined, not string[]
  const brandId = Array.isArray(rawBrandId) ? rawBrandId[0] : rawBrandId;
  const brandname = Array.isArray(rawBrandname)
    ? rawBrandname[0]
    : rawBrandname;

  const router = useRouter();
  const cartContext = useCart();
  const cartItems = cartContext?.cartItems ?? [];
  const addToCart = cartContext?.addToCart ?? (() => {});
  const removeFromCart = cartContext?.removeFromCart ?? (() => {});

  // --- State Declarations ---
  const [brandProducts, setBrandProducts] = useState<Product[]>([]);
  const [brandFeaturedProducts, setBrandFeaturedProducts] = useState<Product[]>(
    []
  );
  const [promoSliders, setPromoSliders] = useState<PromoSliderData[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedSpecPrice, setSelectedSpecPrice] = useState<number>(0);
  const [currentImageSliderIndex, setCurrentImageSliderIndex] = useState(0);
  const [brandLogo, setBrandLogo] = useState<string | null>(null);
  const [personalizedMessages, setPersonalizedMessages] = useState<{
    [key: string]: PersonalizedMessage | undefined;
  }>({});
  // --- End State Declarations ---

  // --- Modal Styling Helpers (Keep existing) ---
  const getModalLeftPanelStyle = useCallback(
    (product?: Product | null): React.CSSProperties => {
      let categoryType: number | undefined;
      if (product?.category_id && allCategories.length > 0) {
        const categoryIdToFind = getCategoryIdStr(product.category_id);
        const categoryData = allCategories.find(
          (cat) => cat._id === categoryIdToFind
        );
        categoryType = categoryData?.type;
      }
      const finalBgImage = getDefaultBgImageForType(categoryType);
      return {
        backgroundImage: `url('${finalBgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    },
    [allCategories]
  );

  const getProductCardBackgroundColor = useCallback(
    (productCategoryId?: string | CategoryMin | null): string => {
      if (!productCategoryId || allCategories.length === 0) {
        return getCategoryColor(); // Default color
      }
      const categoryIdToFind = getCategoryIdStr(productCategoryId);
      const categoryData = allCategories.find(
        (cat) => cat._id === categoryIdToFind
      );
      return getCategoryColor(categoryData?.type);
    },
    [allCategories]
  );
  // --- End Modal Styling Helpers ---

  // --- Data Fetching ---
  const fetchInitialData = useCallback(async () => {
    if (!brandId) {
      // brandId is now guaranteed to be string or undefined
      setError('Brand ID is missing.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    // Reset brand logo on new brand fetch, to allow sessionStorage to be the source if page reloads
    // but clear it if navigating to a new brand.
    // Consider if setBrandLogo(null) is needed here if previous brand's logo might persist.
    // For now, sessionStorage will handle persistence per brandId.

    try {
      const [brandProductsResponse, globalDataResponse, categoriesResponse] =
        await Promise.all([
          fetchProductDetails(brandId as string), // brandId is checked, so cast is safer
          fetchStickerList(),
          fetchCategoryList(),
        ]);

      let fetchError: string | null = null;
      let determinedBrandLogo: string | null = null;
      const sessionKey = `brandLogo`;

      // 1. Try sessionStorage first
      const storedLogo = sessionStorage.getItem(sessionKey);
      if (storedLogo) {
        determinedBrandLogo = storedLogo;
      }

      // 2. Process Brand-Specific Products and try to get logo
      if (brandProductsResponse && brandProductsResponse.success) {
        const prods = brandProductsResponse.data || [];
        setBrandProducts(prods);
        setBrandFeaturedProducts(prods.filter((p: Product) => p.is_featured));

        if (!determinedBrandLogo) {
          // Only if not found in session
          for (const product of prods) {
            if (
              product.company_id &&
              typeof product.company_id !== 'string' &&
              product.company_id.company_logo
            ) {
              determinedBrandLogo = product.company_id.company_logo;
              break; // Found logo from one of the brand's products
            }
          }
        }
      } else {
        const err =
          brandProductsResponse?.message || 'Failed to load brand products';
        fetchError = fetchError ? `${fetchError}; ${err}` : err;
      }

      // 3. Set brandLogo state and update sessionStorage if a new logo was found from API
      if (determinedBrandLogo) {
        setBrandLogo(determinedBrandLogo);
        if (!storedLogo && determinedBrandLogo) {
          // If it came from API, not session, store it
          sessionStorage.setItem(sessionKey, determinedBrandLogo);
        }
      }

      // 4. Process Global Promo Sliders (filter for current brand)
      if (globalDataResponse && globalDataResponse.success) {
        const allPromoProductsFromAPI = globalDataResponse.promoProducts || [];
        const brandFilteredPromos = allPromoProductsFromAPI.filter(
          (promo: { products_data: any[] }) => {
            if (promo.products_data && promo.products_data.length > 0) {
              return promo.products_data.some((promoProductItem) => {
                const productData = promoProductItem.product_id;
                if (productData && productData.company_id) {
                  const productCompanyId =
                    typeof productData.company_id === 'string'
                      ? productData.company_id
                      : (productData.company_id as CompanyMin)._id;
                  return productCompanyId === brandId;
                }
                return false;
              });
            }
            return false;
          }
        );
        setPromoSliders(brandFilteredPromos);
      } else {
        const err =
          globalDataResponse?.message || 'Failed to load promo sliders';
        fetchError = fetchError ? `${fetchError}; ${err}` : err;
      }

      // 5. Process All Categories
      if (categoriesResponse && categoriesResponse.success) {
        setAllCategories(categoriesResponse.data || []);
      } else {
        const err = categoriesResponse?.message || 'Failed to load categories';
        fetchError = fetchError ? `${fetchError}; ${err}` : err;
      }

      if (fetchError) setError(fetchError);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data');
      console.error('Error fetching initial data:', err);
    } finally {
      setLoading(false);
    }
  }, [brandId]); // Removed setBrandLogo from dependencies as it's set inside

  useEffect(() => {
    if (brandId) {
      fetchInitialData();
    }
  }, [brandId, fetchInitialData]);
  // --- End Data Fetching ---

  // --- Personalized Messages (Keep existing) ---
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

  const hasPersonalization = (productId: string) =>
    !!personalizedMessages[productId];
  // --- End Personalized Message Logic ---

  // --- Event Handlers (Keep existing) ---
  const handlePersonalize = (productId: string) => {
    localStorage.setItem('currentItemId', productId);
    localStorage.setItem('returnPath', window.location.pathname);
    router.push('/messages');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setCurrentImageSliderIndex(0);

    const firstSpecGroup = product.specification?.[0];
    const initialSpecValue = firstSpecGroup?.values?.[0]?.value || '';
    const initialSpec = firstSpecGroup?.values?.find(
      (v) => v.value === initialSpecValue
    );
    const rawInitialSpecPrice = initialSpec?.price;
    const initialSpecPriceNum = Number(rawInitialSpecPrice);

    setSelectedSize(initialSpecValue);
    setSelectedSpecPrice(isNaN(initialSpecPriceNum) ? 0 : initialSpecPriceNum);

    setIsFirstModalOpen(true);
  };

  const handleSelectSize = (sizeValue: string, specPrice: number) => {
    setSelectedSize(sizeValue);
    setSelectedSpecPrice(isNaN(specPrice) ? 0 : Number(specPrice));
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const cartImage =
      selectedProduct.background_image?.[0] &&
      selectedProduct.background_image?.[0] !== null
        ? `${BASE_URL}/${selectedProduct.background_image[0]}`
        : selectedProduct.sticker_path
        ? `${selectedProduct.sticker_path}`
        : selectedProduct.image_path
        ? `${selectedProduct.image_path}`
        : PRODUCT_PLACEHOLDER;

    const itemToAdd = {
      _id: selectedProduct._id,
      price: selectedProduct.price + selectedSpecPrice,
      quantity,
      image_path: cartImage,
      name: selectedProduct.name,
      description: selectedProduct.description,
      personalization: personalizedMessages[selectedProduct._id],
      specification: selectedProduct.specification?.length
        ? selectedProduct.specification
        : [
            {
              name: 'Size',
              type: 'button',
              values: [
                {
                  value: selectedSize,
                  price: selectedSpecPrice,
                  _id: `spec-default-${selectedProduct._id}`,
                },
              ],
            },
          ],
      size: selectedSize,
    };

    addToCart(itemToAdd as any);
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(true);
  };

  const handleGoToCart = () => {
    closeModals();
    router.push('/cart');
  };

  const handleReviewsClick = (productId: string) => {
    router.push(`/reviews/${productId}`);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const isInCart = (productId: string) =>
    cartItems.some((item) => item._id === productId);

  const handlePlaceOrder = async () => {
    if (!selectedProduct) return;
    setProcessing(true);
    try {
      const finalProductPrice = selectedProduct.price + selectedSpecPrice;

      const orderSpecification =
        selectedSize && selectedProduct.specification?.[0]?.name
          ? [
              {
                name: selectedProduct.specification[0].name,
                values: [{ value: selectedSize, price: selectedSpecPrice }],
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
          },
        ],
      };

      const orderResponse = await placeOrder(orderData);
      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to place order');
      }

      localStorage.setItem('order_id', orderResponse.data.order_id);
      localStorage.setItem('payment_id', orderResponse.data.payment_id);

      if (orderResponse.data.payment_type === 'free') {
        const confirmResponse = await confirmOrder(
          orderResponse.data.order_id,
          orderResponse.data.payment_id
        );
        if (confirmResponse) {
          removeFromCart(selectedProduct._id);
          const currentPersonalizations = { ...personalizedMessages };
          delete currentPersonalizations[selectedProduct._id];
          localStorage.setItem(
            'selectedPersonalizedMessages',
            JSON.stringify(currentPersonalizations)
          );
          setPersonalizedMessages(currentPersonalizations);
          closeModals();
          router.replace('/thankyou');
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

      const generateSignature = (merchantId: string, token: string): string =>
        `SIG-${merchantId}-${new Date().getTime()}`;

      const formData = {
        MERCHANT_ID: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
        MERCHANT_NAME: process.env.NEXT_PUBLIC_STORE_NAME || 'My Merchant',
        TOKEN: token,
        PROCCODE: '00',
        TXNAMT: totalAmount.toFixed(2),
        CUSTOMER_MOBILE_NO: '03000000000',
        CUSTOMER_EMAIL_ADDRESS: 'rizcmt195@gmail.com',
        SIGNATURE: generateSignature(
          process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
          token
        ),
        VERSION: 'MY_VER_1.0',
        TXNDESC: `Payment for ${selectedProduct.name}`,
        SUCCESS_URL: `${window.location.origin}/success?order_id=${orderId}&payment_id=${orderResponse.data.payment_id}`,
        FAILURE_URL: `${window.location.origin}/failure?order_id=${orderId}`,
        BASKET_ID: orderId,
        ORDER_DATE: orderDate,
        CHECKOUT_URL: `${window.location.origin}/confirm`,
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
        input.value = value as string;
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
    setSelectedProduct(null);
    setQuantity(1);
    setCurrentImageSliderIndex(0);
    setSelectedSize('');
    setSelectedSpecPrice(0);
    setProcessing(false);
  };

  const handlePrevContentImage = () => {
    if (
      !selectedProduct?.background_image ||
      selectedProduct.background_image.length <= 1
    )
      return;
    const imageCount = selectedProduct.background_image.length;
    setCurrentImageSliderIndex(
      (prevIndex) => (prevIndex - 1 + imageCount) % imageCount
    );
  };

  const handleNextContentImage = () => {
    if (
      !selectedProduct?.background_image ||
      selectedProduct.background_image.length <= 1
    )
      return;
    const imageCount = selectedProduct.background_image.length;
    setCurrentImageSliderIndex((prevIndex) => (prevIndex + 1) % imageCount);
  };
  // --- End Event Handlers ---

  // --- Render Functions (Keep existing, including the updated renderPromoSlider) ---
  const renderBrandFeaturedProducts = () => {
    if (loading && brandFeaturedProducts.length === 0) {
      return (
        <div className="mt-8">
          <div className="at-cardgrid">
            {[...Array(3)].map((_, i) => (
              <div
                key={`brand-feat-skel-${i}`}
                className="at-carditem shadow-md rounded-lg overflow-hidden"
              >
                <Skeleton className="h-40 w-full" />
                <div className="p-3">
                  <Skeleton className="h-5 w-3/4 mt-1" />
                  <Skeleton className="h-4 w-1/2 mt-2 mb-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (!loading && brandFeaturedProducts.length === 0) {
      return (
        <p className="mt-7 font-xl text-center text-gray-500">
          No Featured Products Available for this Brand.
        </p>
      );
    }
    return (
      <div className="mt-8">
        <div className="at-pagesectiontitle">
          <h2>Featured Products</h2>
        </div>
        <div className="at-cardgrid">
          {brandFeaturedProducts.map((product) => {
            const backgroundColor = getProductCardBackgroundColor(
              product.category_id
            );
            const cardImageSrc = product.sticker_path
              ? product.sticker_path
              : product.image_path
              ? product.image_path
              : PRODUCT_PLACEHOLDER;
            return (
              <div
                className="at-carditem cursor-pointer flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 bg-white"
                key={product._id}
                onClick={() => handleProductClick(product)}
              >
                <figure
                  className="at-giftimage flex-shrink-0 relative h-40 w-full"
                  style={{ backgroundColor }}
                >
                  <img
                    src={cardImageSrc}
                    alt={product.name || 'Product Image'}
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).src = PRODUCT_PLACEHOLDER;
                    }}
                    className="w-full h-full object-contain p-2"
                  />
                </figure>
                <div className="at-giftdetails p-3 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="at-gifttitle flex items-start justify-between w-full mb-1">
                      <h3
                        className="font-bold text-sm m-0 leading-tight text-gray-800 flex-1 mr-2 truncate"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                      <span className="text-right text-[#40A574] whitespace-nowrap font-bold text-sm">
                        Rs.{product.price}
                      </span>
                    </div>
                    <h4
                      className="font-semibold text-xs text-gray-600 truncate"
                      title={
                        typeof brandname === 'string'
                          ? decodeURIComponent(brandname)
                          : 'Brand'
                      }
                    >
                      {typeof brandname === 'string'
                        ? decodeURIComponent(brandname)
                        : 'Brand'}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPromoSlider = () => {
    const promosToDisplay = promoSliders.filter(
      (promo) => promo.products_data && promo.products_data.length > 0
    );

    if (loading && promosToDisplay.length === 0) {
      return (
        <div className="mt-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-60 w-full mb-4" />
        </div>
      );
    }

    if (!loading && promosToDisplay.length === 0) {
      // return (
      //   <p className="mt-7 font-xl text-center text-gray-500">
      //     No Deal of the Day promotions with products currently available for
      //     this brand.
      //   </p>
      // );
      return;
    }

    if (promosToDisplay.length === 0) {
      return null;
    }

    return (
      <div className="mt-8">
        <div className="at-pagesectiontitle">
          <h2>Deal of the Day</h2>
        </div>
        {promosToDisplay.map((promo) => (
          <div key={promo._id} className="mb-20">
            {promo.promo_slider && (
              <div className="w-full h-64">
                <img
                  src={promo.promo_slider}
                  alt={promo.title}
                  className="w-full h-full object-contain object-left"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderBrandMenuProducts = () => {
    if (loading && brandProducts.length === 0) {
      return (
        <div className="mt-8">
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="at-cardgrid">
            {[...Array(4)].map((_, i) => (
              <div
                key={`menu-skel-${i}`}
                className="at-carditem shadow-md rounded-lg overflow-hidden"
              >
                <Skeleton className="h-40 w-full" />
                <div className="p-3">
                  <Skeleton className="h-5 w-3/4 mt-1" />
                  <Skeleton className="h-4 w-1/2 mt-2 mb-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (!loading && brandProducts.length === 0) {
      return (
        <h2 className="mt-7 font-xl text-center text-gray-500">
          No Menu Products Available for this Brand.
        </h2>
      );
    }
    return (
      <div className="mt-8">
        <div className="at-pagesectiontitle">
          <h2>Menu</h2>
        </div>
        <div className="at-cardgrid">
          {brandProducts.map((product) => {
            const backgroundColor = getProductCardBackgroundColor(
              product.category_id
            );
            const cardImageSrc = product.sticker_path
              ? product.sticker_path
              : product.image_path
              ? product.image_path
              : PRODUCT_PLACEHOLDER;
            return (
              <div
                className="at-carditem cursor-pointer flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 bg-white"
                key={product._id}
                onClick={() => handleProductClick(product)}
              >
                <figure
                  className="at-giftimage flex-shrink-0 relative h-40 w-full"
                  style={{ backgroundColor }}
                >
                  <img
                    src={cardImageSrc}
                    alt={product.name || 'Product Image'}
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).src = PRODUCT_PLACEHOLDER;
                    }}
                    className="w-full h-full object-contain p-2"
                  />
                </figure>
                <div className="at-giftdetails p-3 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="at-gifttitle flex items-start justify-between w-full mb-1">
                      <h3
                        className="font-bold text-sm m-0 leading-tight text-gray-800 flex-1 mr-2 truncate"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                      <span className="text-right text-[#40A574] whitespace-nowrap font-bold text-sm">
                        Rs.{product.price}
                      </span>
                    </div>
                    <h4
                      className="font-semibold text-xs text-gray-600 truncate"
                      title={
                        typeof brandname === 'string'
                          ? decodeURIComponent(brandname)
                          : 'Brand'
                      }
                    >
                      {typeof brandname === 'string'
                        ? decodeURIComponent(brandname)
                        : 'Brand'}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  // --- End Render Functions ---

  // --- Main Return ---
  return (
    <>
      <div className="at-giftcard px-4 md:px-6 lg:px-8 py-6">
        {error && (
          <p className="error-message text-center text-red-600 mb-4 bg-red-100 p-3 rounded border border-red-300">
            {error}
          </p>
        )}
        <div className="at-pagesectiontitle flex items-center gap-3 mb-6 border-b pb-4">
          {loading && !brandLogo ? (
            <Skeleton className="w-14 h-14 rounded-full" />
          ) : brandLogo ? (
            <img
              width={56}
              height={56}
              src={brandLogo}
              alt={`${
                typeof brandname === 'string'
                  ? decodeURIComponent(brandname)
                  : 'Brand'
              } logo`}
              className="rounded-full border object-contain bg-white"
              // Add onError for debugging logo image issues
              onError={(e) => {
                console.error(
                  'Brand logo failed to load:',
                  (e.target as HTMLImageElement).src
                );
                // (e.target as HTMLImageElement).style.display = 'none'; // Optionally hide broken image
              }}
            />
          ) : (
            !loading && (
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                No Logo
              </div>
            )
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {typeof brandname === 'string'
              ? unslugify(decodeURIComponent(brandname))
              : 'Brand'}{' '}
            Shop
          </h1>
        </div>

        {renderBrandFeaturedProducts()}
        {renderPromoSlider()}
        {renderBrandMenuProducts()}
      </div>

      {/* --- Modals (Keep existing) --- */}
      {isFirstModalOpen &&
        selectedProduct &&
        (() => {
          const modalBackgroundStyle = getModalLeftPanelStyle(selectedProduct);
          const contentImages = selectedProduct.background_image ?? [];
          const hasContentSlider = contentImages.length > 1;

          let currentContentImageSrc = PRODUCT_PLACEHOLDER;
          if (
            contentImages.length > 0 &&
            currentImageSliderIndex < contentImages.length &&
            contentImages[currentImageSliderIndex] !== null
          ) {
            currentContentImageSrc = contentImages[
              currentImageSliderIndex
            ].startsWith('http')
              ? contentImages[currentImageSliderIndex]
              : `${BASE_URL}/${contentImages[currentImageSliderIndex]}`;
          } else if (selectedProduct.sticker_path) {
            currentContentImageSrc = selectedProduct.sticker_path.startsWith(
              'http'
            )
              ? selectedProduct.sticker_path
              : `${BASE_URL}/${selectedProduct.sticker_path}`;
          } else if (selectedProduct.image_path) {
            currentContentImageSrc = selectedProduct.image_path.startsWith(
              'http'
            )
              ? selectedProduct.image_path
              : `${BASE_URL}/${selectedProduct.image_path}`;
          }

          const currentProductBrandInfo =
            typeof selectedProduct.company_id === 'object' &&
            selectedProduct.company_id !== null
              ? selectedProduct.company_id
              : brandProducts.find((p) => {
                  if (
                    typeof p.company_id === 'object' &&
                    p.company_id !== null
                  ) {
                    // Ensure selectedProduct.company_id is treated as string if it is
                    const targetCompanyId =
                      typeof selectedProduct.company_id === 'string'
                        ? selectedProduct.company_id
                        : (selectedProduct.company_id as CompanyMin)?._id;
                    return p.company_id._id === targetCompanyId;
                  }
                  return false;
                })?.company_id ?? {
                  name:
                    typeof brandname === 'string'
                      ? decodeURIComponent(brandname)
                      : 'Brand',
                  company_logo: brandLogo || undefined,
                };

          const companyLogoToShow =
            typeof currentProductBrandInfo === 'object' &&
            currentProductBrandInfo !== null &&
            currentProductBrandInfo.company_logo
              ? currentProductBrandInfo.company_logo
              : brandLogo;
          const companyNameToShow =
            typeof currentProductBrandInfo === 'object' &&
            currentProductBrandInfo !== null
              ? currentProductBrandInfo.name
              : typeof brandname === 'string'
              ? decodeURIComponent(brandname)
              : 'Brand';

          return (
            <div
              className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
              onClick={closeModals}
            >
              <div
                className="bg-white rounded-lg shadow-lg at-modaldailouge w-full max-w-3xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col md:flex-row">
                  <div
                    className="at-modalleftside w-full md:w-[40%] flex-shrink-0 p-6 flex items-center justify-center relative"
                    style={modalBackgroundStyle}
                  >
                    <button
                      onClick={closeModals}
                      className="at-btnpopupclose at-btnpopupclosetwo"
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {' '}
                        <circle cx="16" cy="16" r="16" fill="white" />{' '}
                        <path
                          d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321 10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
                          fill="#434343"
                        />{' '}
                        <path
                          d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
                          fill="#434343"
                        />{' '}
                      </svg>
                    </button>
                    <figure className="at-productimg relative w-full h-full max-w-full flex items-center justify-center">
                      <img
                        src={currentContentImageSrc}
                        alt={`${selectedProduct.name} - Image ${
                          currentImageSliderIndex + 1
                        }`}
                        className="object-contain w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src =
                            PRODUCT_PLACEHOLDER;
                        }}
                      />
                      {hasContentSlider && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-1 bg-black bg-opacity-25 rounded-full">
                          {contentImages.map((_, index) => (
                            <button
                              key={`dot-${index}`}
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
                    </figure>
                  </div>

                  <div className="at-popupcontentside w-full md:w-[60%] p-6 flex flex-col justify-between">
                    <div>
                      <div className="at-popuptitlebrandimg flex items-start mb-3">
                        {companyLogoToShow && (
                          <span className="w-12 h-12 mr-3 overflow-hidden flex-shrink-0 border rounded-md flex items-center justify-center bg-white">
                            <img
                              src={companyLogoToShow}
                              alt={`${companyNameToShow} logo`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  PRODUCT_PLACEHOLDER;
                              }}
                            />
                          </span>
                        )}
                        <div
                          className="at-popupproducttitlerating flex-grow cursor-pointer"
                          onClick={() =>
                            handleReviewsClick(selectedProduct._id)
                          }
                          title="View Reviews"
                        >
                          <h4 className="font-semibold text-lg text-gray-800">
                            {' '}
                            {companyNameToShow}{' '}
                          </h4>
                          <RatingStars
                            rating={Math.round(selectedProduct.total_rating)}
                          />
                        </div>
                      </div>
                      <div className="at-popupcolorprice flex justify-between items-start my-3">
                        <div className="at-popupcolor flex-grow mr-4">
                          <h3 className="font-bold text-xl text-gray-900">
                            {' '}
                            {selectedProduct.name}{' '}
                          </h3>
                        </div>
                        <div className="at-popupprice flex-shrink-0">
                          <h3 className="font-bold text-xl text-[#40A574]">
                            {' '}
                            Rs. {selectedProduct.price + selectedSpecPrice}{' '}
                          </h3>
                        </div>
                      </div>
                      <div className="at-popupdescription mb-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {' '}
                          {selectedProduct.description ||
                            'No description available.'}{' '}
                        </p>
                      </div>
                      {selectedProduct.specification &&
                        selectedProduct.specification.length > 0 &&
                        selectedProduct.specification[0].values?.length > 0 && (
                          <div className="at-productsize mb-4">
                            <label className="block text-base font-medium text-gray-700 mb-1">
                              {' '}
                              {selectedProduct.specification[0].name ||
                                'Options'}{' '}
                            </label>
                            <div className="overflow-x-auto horizontal-scroll snap-x snap-mandatory flex gap-2 pb-1">
                              {selectedProduct.specification[0].values.map(
                                (specValue) => {
                                  const specPriceNum = Number(specValue.price);
                                  const displaySpecPrice =
                                    isNaN(specPriceNum) || specPriceNum === 0
                                      ? ''
                                      : ` (+Rs.${specPriceNum})`;
                                  return (
                                    <button
                                      key={specValue._id || specValue.value}
                                      onClick={() =>
                                        handleSelectSize(
                                          specValue.value,
                                          specPriceNum
                                        )
                                      }
                                      className={`px-5 py-3 border rounded-full text-base transition-colors duration-150 whitespace-nowrap snap-start ${
                                        selectedSize === specValue.value
                                          ? 'bg-[#40A574] text-white border-[#40A574]'
                                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                      }`}
                                    >
                                      {' '}
                                      {specValue.value} {displaySpecPrice}{' '}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="at-btnaddtocart mt-auto">
                      {isInCart(selectedProduct._id) ? (
                        <button onClick={handleGoToCart} className="at-btn">
                          {' '}
                          Go to Cart{' '}
                          <svg
                            className="mt-3"
                            width="24"
                            height="24"
                            viewBox="0 0 32 32"
                            fill="#ffffff"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            {' '}
                            <circle cx="16" cy="16" r="16" fill="white" />{' '}
                            <path
                              d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
                              fill="#40A574"
                            />{' '}
                          </svg>{' '}
                        </button>
                      ) : (
                        <button onClick={handleAddToCart} className="at-btn">
                          {' '}
                          Add to Cart{' '}
                          <svg
                            className="mt-3"
                            width="24"
                            height="24"
                            viewBox="0 0 32 32"
                            fill="#ffffff"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            {' '}
                            <circle cx="16" cy="16" r="16" fill="white" />{' '}
                            <path
                              d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
                              fill="#40A574"
                            />{' '}
                          </svg>{' '}
                        </button>
                      )}
                      <button
                        className="at-btn at-btnpersonal"
                        onClick={() => handlePersonalize(selectedProduct._id)}
                      >
                        {' '}
                        Personalize{' '}
                        <label className="custom-checkbox top-2">
                          {' '}
                          <input
                            className="align-middle"
                            type="checkbox"
                            checked={hasPersonalization(selectedProduct._id)}
                            readOnly
                          />{' '}
                          <span className="checkmark"></span>{' '}
                        </label>{' '}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {isSecondModalOpen &&
        selectedProduct &&
        (() => {
          const modalBackgroundStyle = getModalLeftPanelStyle(selectedProduct);
          let currentContentImageSrc = PRODUCT_PLACEHOLDER;
          const contentImages = selectedProduct.background_image ?? [];
          if (
            contentImages.length > 0 &&
            currentImageSliderIndex < contentImages.length &&
            contentImages[currentImageSliderIndex] !== null
          ) {
            currentContentImageSrc = contentImages[
              currentImageSliderIndex
            ].startsWith('http')
              ? contentImages[currentImageSliderIndex]
              : `${BASE_URL}/${contentImages[currentImageSliderIndex]}`;
          } else if (selectedProduct.sticker_path) {
            currentContentImageSrc = selectedProduct.sticker_path.startsWith(
              'http'
            )
              ? selectedProduct.sticker_path
              : `${BASE_URL}/${selectedProduct.sticker_path}`;
          } else if (selectedProduct.image_path) {
            currentContentImageSrc = selectedProduct.image_path.startsWith(
              'http'
            )
              ? selectedProduct.image_path
              : `${BASE_URL}/${selectedProduct.image_path}`;
          }

          return (
            <div
              className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
              onClick={closeModals}
            >
              <div
                className="bg-white rounded-lg shadow-lg at-modaldailouge w-full max-w-3xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col md:flex-row">
                  <div
                    className="at-modalleftside at-modalordersummeryleft w-full md:w-[40%] flex-shrink-0 p-6 flex items-center justify-center relative"
                    style={modalBackgroundStyle}
                  >
                    <button
                      onClick={closeModals}
                      className="at-btnpopupclose at-btnpopupclosetwo"
                    >
                      {' '}
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {' '}
                        <circle cx="16" cy="16" r="16" fill="white" />{' '}
                        <path
                          d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321 10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
                          fill="#434343"
                        />{' '}
                        <path
                          d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
                          fill="#434343"
                        />{' '}
                      </svg>{' '}
                    </button>
                    <figure className="at-productimg relative w-full h-full max-w-full flex items-center justify-center">
                      {' '}
                      <img
                        src={currentContentImageSrc}
                        alt={selectedProduct.name}
                        className="object-contain w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src =
                            PRODUCT_PLACEHOLDER;
                        }}
                      />{' '}
                    </figure>
                  </div>
                  <div className="at-popupcontentside p-6">
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
                            {' '}
                            -{' '}
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
                          {' '}
                          <span>Item Price</span>{' '}
                        </li>
                        <li>
                          {' '}
                          <span>
                            {' '}
                            Rs.{' '}
                            {(
                              selectedProduct.price + selectedSpecPrice
                            ).toFixed(2)}{' '}
                          </span>{' '}
                        </li>
                        <li>
                          {' '}
                          <span>Quantity</span>{' '}
                        </li>
                        <li>
                          {' '}
                          <span>{quantity}</span>{' '}
                        </li>
                        <li>
                          {' '}
                          <span>Subtotal</span>{' '}
                        </li>
                        <li>
                          {' '}
                          <span>
                            {' '}
                            Rs.{' '}
                            {(
                              (selectedProduct.price + selectedSpecPrice) *
                              quantity
                            ).toFixed(2)}{' '}
                          </span>{' '}
                        </li>
                        <li>
                          {' '}
                          <span>Sales Tax 17%</span>{' '}
                        </li>
                        <li>
                          {' '}
                          <span>
                            {' '}
                            Rs.{' '}
                            {(
                              (selectedProduct.price + selectedSpecPrice) *
                              quantity *
                              0.17
                            ).toFixed(2)}{' '}
                          </span>{' '}
                        </li>
                        <li>
                          {' '}
                          <span>Grand Total</span>{' '}
                        </li>
                        <li>
                          {' '}
                          <span>
                            {' '}
                            Rs.{' '}
                            {(
                              (selectedProduct.price + selectedSpecPrice) *
                              quantity *
                              1.17
                            ).toFixed(2)}{' '}
                          </span>{' '}
                        </li>
                      </ul>
                    </div>
                    <div className="at-btnsubmitcontact at-btnprofile at-btnplaceorder pt-5">
                      <button
                        type="button"
                        className="at-btn"
                        onClick={handlePlaceOrder}
                        disabled={processing}
                      >
                        {' '}
                        {processing ? 'Processing...' : 'Place Order'}{' '}
                      </button>
                      <a href="/home">
                        {' '}
                        <button type="button" className="at-btn at-btncancel">
                          {' '}
                          Continue Shopping{' '}
                        </button>{' '}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </>
  );
}
