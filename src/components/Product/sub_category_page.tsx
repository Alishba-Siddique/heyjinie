// src/app/components/Product/sub_category_page.tsx
'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  fetchSubCategoryList,
  fetchCompanyList,
  fetchProductDetails, // This fetches products for a company
  placeOrder,
  confirmOrder,
} from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import RatingStars from '../page-ui/rating_stars';
import Link from 'next/link'; // Keep for "Continue Shopping" if not using router.push

const PRODUCT_PLACEHOLDER = '/images/logoicons.png';
const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''; // This might not be needed if paths are absolute/full

// Define type-based background settings (copied from pricefilter)
// --- Helper Function for Default Background Image (Modal Background) ---
const getDefaultBgImageForType = (type?: number): string => {
  const valid_type =
    typeof type === 'number' && type >= 1 && type <= 4 ? type : null;
  switch (valid_type) {
    case 1:
      return `${BASE_URL}/pd_bg_1.jpg`;
    case 2:
      return `${BASE_URL}/pd_bg_2.jpg`;
    case 3:
      return `${BASE_URL}/pd_bg_3.jpg`;
    case 4:
      return `${BASE_URL}/pd_bg_4.jpg`;
    default:
      return `${BASE_URL}/pd_bg_1.jpg`; // Default to type 1 image if invalid
  }
};
// --- End Helper Function ---

const getCategoryBackground = (type?: number): string => {
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
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize each word
    .replace(/ And /gi, ' & '); // Replace 'and' with '&'
};

// Interfaces based on pricefilter/page.tsx for modal consistency
interface CompanyForModal {
  _id: string;
  name: string;
  company_logo: string; // Should be a full URL or resolvable path
}

interface CategoryInfoForModal {
  _id: string;
  name: string;
  type: number;
}

interface ProductForModal {
  _id: string;
  name: string;
  price: number;
  description: string;
  company_id: CompanyForModal;
  category_id: CategoryInfoForModal;
  background_images: string[]; // Array of full URLs or resolvable paths
  sticker_path?: string; // Full URL or resolvable path
  image_path?: string; // Full URL or resolvable path
  specification: Array<{
    name: string;
    type: string;
    values: Array<{
      value: string;
      additional_info?: string;
      price: number; // Additional price for this spec value
      _id: string;
    }>;
  }>;
  total_rating: number;
  rating_count: number;
}

interface PersonalizedMessage {
  name: string;
  message: string;
  image_path: string;
  image_id: string;
  productId?: string;
}

// Original interfaces for SubCategoryPage data fetching
interface Company {
  _id: string;
  name: string;
  company_logo: string; // relative path (or absolute/full if used directly)
  subcategory_ids: Array<{
    _id: string;
    name: string;
    category_id: string;
  }>;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image_path: string; // relative path (or absolute/full if used directly)
  sticker_path: string; // relative path (or absolute/full if used directly)
  description: string;
  category_id: string;
  company_id: string; // ID of company
  subcategory_id: string;
  background_image: string; // relative path (or absolute/full if used directly)
  is_featured: boolean;
  total_rating: number;
  // Optional fields that might come from API or need defaults
  rating_count?: number;
  // Assuming product_background_images might be an array of relative paths (or absolute/full) for a gallery
  product_background_images?: string[];
  specification?: ProductForModal['specification']; // If API provides it
}

// For category info of the current subcategory page
interface PageCategoryInfo {
  _id: string;
  name: string;
  type?: number; // This is the 'type' for background styling
}

const SubCategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const { subcategory: subcategorySlug } = params;

  const [brands, setBrands] = useState<Company[]>([]);
  // const [products, setProducts] = useState<Product[]>([]); // All products, if needed beyond featured
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<string | null>(null);
   const [allCategories, setAllCategories] = useState<CategoryInfoForModal[]>([]);
  const [brandsLoading, setBrandsLoading] = useState<boolean>(true);
  const [pageCategoryInfo, setPageCategoryInfo] =
    useState<PageCategoryInfo | null>(null);

  // --- Modal States (mirroring pricefilter) ---
  const [processing, setProcessing] = useState(false);
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductForModal | null>(null);
  // selectedProductCategoryInfo will be derived from selectedProduct.category_id for modal styling
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('M'); // Default size/spec
  const [selectedSpecPrice, setSelectedSpecPrice] = useState<number>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

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

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  const isInCart = (productId: string) =>
    cartItems.some((item) => item._id === productId);

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
    ); // Current page
    router.push('/messages');
  };

  const handleProductClick = (product: Product) => {
    const companyData = brands.find((b) => b._id === product.company_id);

    let PFGalleryImages: string[] = [];
    // Use product_background_images if available and is an array
    // Assuming these paths are already full URLs or absolute paths like other image fields
    if (
      Array.isArray(product.product_background_images) &&
      product.product_background_images.length > 0
    ) {
      PFGalleryImages = product.product_background_images
        .map((img) => (img ? `${img}` : '')) // Keep as is
        .filter(Boolean);
    }
    // Fallback to individual images if gallery is not available or empty
    if (PFGalleryImages.length === 0) {
      const singleImages = [
        product.background_image, // This is the 'background_image' field from Product interface
      ];
      PFGalleryImages = singleImages
        .map((p) => (p ? `${p}` : '')) // Keep as is
        .filter(Boolean);
    }
    // Ensure unique images and provide placeholder if none found
    PFGalleryImages = [...new Set(PFGalleryImages)];
    if (PFGalleryImages.length === 0) {
      // PFGalleryImages.push(PRODUCT_PLACEHOLDER);
    }

    const productForModal: ProductForModal = {
      _id: product._id,
      name: product.name || 'Unnamed Product',
      price: product.price,
      description: product.description || 'No description available.',
      company_id: {
        _id: companyData?._id || `company-default-${product._id}`,
        name: companyData?.name || 'Brand Unavailable',
        company_logo: companyData?.company_logo // Assumed to be full/absolute path
          ? `${companyData.company_logo}`
          // : PRODUCT_PLACEHOLDER,
          : '',
      },
      category_id: {
        _id: pageCategoryInfo?._id || 'cat-default-id',
        name: pageCategoryInfo?.name || 'Category Unavailable',
        type: pageCategoryInfo?.type ?? 1, // Default to type 1 if not set
      },
      background_images: PFGalleryImages, // These are now assumed to be full/absolute paths
      sticker_path: product.sticker_path // Assumed to be full/absolute path
        ? `${product.sticker_path}`
        : undefined,
      image_path: product.image_path // Assumed to be full/absolute path
        ? `${product.image_path}`
        : undefined,
      specification: product.specification || [
        // Default specification
        {
          name: 'Size',
          type: 'button',
          values: [
            { value: 'M', price: 0, _id: `spec-default-${product._id}-m` },
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
    setQuantity(1);
    setSelectedSize(initialSpecValue);
    setSelectedSpecPrice(isNaN(initialSpecPrice) ? 0 : initialSpecPrice);
    setCurrentImageIndex(0);
    setIsFirstModalOpen(true);
  };

  const handleAddToCart = () => {
    if (selectedProduct && cartContext) {
      const itemToAdd = {
        _id: selectedProduct._id,
        price: selectedProduct.price + selectedSpecPrice, // Combined price
        quantity,
        // image_path:
        //   selectedProduct.background_images?.[0] || PRODUCT_PLACEHOLDER, // Use first background image
        sticker_path: selectedProduct.sticker_path,
        name: selectedProduct.name,
        description: selectedProduct.description,
        company_id: selectedProduct.company_id,
        category_id: selectedProduct.category_id,
        background_images: selectedProduct.background_images,
        personalization: personalizedMessages[selectedProduct._id],
        size: selectedSize,
      };
      addToCart(itemToAdd as any);
      setIsFirstModalOpen(false);
      setIsSecondModalOpen(true);
    }
  };

  const handleGoToCart = () => {
    closeModals();
    router.push('/cart');
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
                    price: selectedSpecPrice,
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
      const totalAmountForPayment = finalProductPrice * quantity * 1.17;
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
        CUSTOMER_MOBILE_NO: '03000000000',
        CUSTOMER_EMAIL_ADDRESS: 'customer@example.com',
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
    setQuantity(1);
    setSelectedSize('M');
    setSelectedSpecPrice(0);
    setCurrentImageIndex(0);
    setProcessing(false);
  };

  // --- Background Logic (Category Type Image for Modals) ---
  const getModalLeftPanelStyle = useCallback(
    (productForModal?: ProductForModal | null): React.CSSProperties => {
      let categoryType: number | undefined = undefined;
      if (productForModal?.category_id) {
        categoryType = productForModal.category_id.type;
      }
      const finalBgImage = getDefaultBgImageForType(categoryType);
      return {
        backgroundImage: `url('${finalBgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    },
    [] // Dependency on allCategories removed as type is directly on productForModal.category_id
  );
  // --- End Background Logic ---


  const fetchPageSubCategoryInfo = async () => {
    try {
      const response = await fetchSubCategoryList();
      if (response.success && Array.isArray(response.data)) {
        const currentSubCategory = response.data.find(
          (sc: any) =>
            sc.name.toLowerCase().replace(/\s+/g, '-') === subcategorySlug ||
            sc.name.toLowerCase().replace(/\s+/g, '') === subcategorySlug
        );

        if (currentSubCategory) {
          setSubCategoryId(currentSubCategory._id);
          setPageCategoryInfo({
            _id: currentSubCategory.category_id._id,
            name: currentSubCategory.category_id.name,
            type: currentSubCategory.category_id.type ?? 1,
          });
          fetchData(currentSubCategory._id);
        } else {
          setError('Subcategory not found.');
          setLoading(false);
          setBrandsLoading(false);
        }
      } else {
        throw new Error(response.message || 'Failed to fetch subcategories.');
      }
    } catch (err: any) {
      console.error('Error fetching subcategory details:', err);
      setError(err.message || 'Error fetching subcategory details.');
      setLoading(false);
      setBrandsLoading(false);
    }
  };

  useEffect(() => {
    if (subcategorySlug) {
      fetchPageSubCategoryInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subcategorySlug]);

  const fetchData = async (currentSubId: string) => {
    setLoading(true);
    setBrandsLoading(true);
    setError(null);
    try {
      const companiesResponse = await fetchCompanyList();
      if (companiesResponse.success && Array.isArray(companiesResponse.data)) {
        const filteredCompanies = companiesResponse.data.filter(
          (company: Company) =>
            company.subcategory_ids.some((sc) => sc._id === currentSubId)
        );
        setBrands(filteredCompanies);

        if (filteredCompanies.length > 0) {
          const productPromises = filteredCompanies.map(
            (company: { _id: string }) => fetchProductDetails(company._id)
          );
          const productResponses = await Promise.all(productPromises);

          let allFetchedProducts: Product[] = [];
          productResponses.forEach((res) => {
            if (res.success && Array.isArray(res.data)) {
              allFetchedProducts = [...allFetchedProducts, ...res.data];
            }
          });

          const featured = allFetchedProducts.filter(
            (p) => p.is_featured && p.subcategory_id === currentSubId
          );
          setFeaturedProducts(featured);
        } else {
          setFeaturedProducts([]);
        }
      } else {
        setError(companiesResponse.message || 'Failed to fetch companies.');
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'An error occurred while fetching data.');
    } finally {
      setLoading(false);
      setBrandsLoading(false);
    }
  };

  const handleSelectSize = (sizeValue: string, specPrice: number) => {
    setSelectedSize(sizeValue);
    setSelectedSpecPrice(isNaN(specPrice) ? 0 : specPrice);
  };

  const handleBrandClick = (
    brandname: string,
    brandLogo: string,
    brandId: string
  ) => {
    const slug = brandname.toLowerCase().replace(/\s+/g, '');
    sessionStorage.setItem('brandLogo', brandLogo); // Store path as is
    router.push(`/subcategory/${subcategorySlug}/${slug}/${brandId}`);
  };

  const handleReviewsClick = (productId: string | undefined) => {
    if (productId) {
      router.push(`/reviews/${productId}`);
    } else {
      toast.warn('Cannot view reviews for this product.');
    }
  };

  const getCardBackgroundStyle = () => {
    const type = pageCategoryInfo?.type ?? 1;
    return { backgroundColor: getCategoryBackground(type) };
  };

  const decodedSubcategoryName =
    typeof subcategorySlug === 'string'
      ? unslugify(decodeURIComponent(subcategorySlug as string))
          // .replace(/-/g, ' ')
          // .replace(/\b\w/g, (l) => l.toUpperCase())
      : 'Subcategory';

  return (
    <div className="at-categories">
      {error && (
        <p className="error-message text-center text-red-600 py-6">{error}</p>
      )}
      <>
        <div className="at-pagesectiontitle mb-6 border-b pb-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {decodedSubcategoryName}
          </h1>
        </div>

        <div className="at-pagesectiontitle">
          <h2>Shop by Brands</h2>
        </div>
        <div className="at-categoriesgrid">
          {brandsLoading &&
            Array.from({ length: 6 }).map((_, brandindex) => (
              <div className="at-branditem" key={`brandskel-${brandindex}`}>
                <Skeleton className="h-20 w-full px-8 bg-gray-200 rounded-lg" />
              </div>
            ))}
          {!brandsLoading && !error && brands.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-4">
              No brands available for this subcategory.
            </p>
          )}
          {!brandsLoading &&
            brands.length > 0 &&
            brands.map((brand) => (
              <div
                key={brand._id}
                className="at-branditem flex items-center justify-center px-4 py-4 h-20 border border-gray-300 rounded-lg cursor-pointer hover:shadow-md hover:border-gray-400 transition-all duration-200 bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  handleBrandClick(brand.name, brand.company_logo, brand._id);
                }}
              >
                <img
                  src={brand.company_logo || PRODUCT_PLACEHOLDER} // Use directly
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PRODUCT_PLACEHOLDER;
                  }}
                />
              </div>
            ))}
        </div>

        <div className="at-giftcard mt-8">
          <div className="at-pagesectiontitle">
            <h2>Featured Products</h2>
          </div>
          <div className="at-cardgrid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
            {loading && (
              <>
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    className="at-carditem rounded-lg overflow-hidden bg-white shadow-md"
                    key={`prodskel-${index}`}
                  >
                    <Skeleton className="h-40 w-full bg-gray-200" />
                    <div className="p-3">
                      <Skeleton className="h-5 w-3/4 mb-2 bg-gray-200" />
                      <Skeleton className="h-4 w-1/2 bg-gray-200" />
                    </div>
                  </div>
                ))}
              </>
            )}
            {!loading && !error && featuredProducts.length === 0 && (
              <p className="col-span-full text-center text-gray-500 py-6">
                No featured products available.
              </p>
            )}
            {!loading &&
              !error &&
              featuredProducts.map((product) => {
                const brand = brands.find((b) => b._id === product.company_id);
                const displayImage = product.sticker_path;

                return (
                  <div
                    className="at-carditem cursor-pointer"
                    key={product._id}
                    onClick={() => handleProductClick(product)}
                  >
                    <figure
                      className="at-giftimage flex-shrink-0 relative h-40"
                      style={getCardBackgroundStyle()}
                    >
                      <img
                        // src={displayImage || PRODUCT_PLACEHOLDER} // Use directly
                        src={displayImage} // Use directly
                        alt={product.name || 'Product Image'}
                        // onError={(e) => {
                        //   (e.target as HTMLImageElement).src =
                        //     PRODUCT_PLACEHOLDER;
                        // }}
                        className="w-full h-full object-contain p-2"
                      />
                    </figure>
                    <div className="at-giftdetails p-3 flex-grow flex flex-col justify-between">
                      <div className="at-gifttitle flex items-center justify-between w-full mb-1">
                        <h3 className="font-bold text-sm m-0 leading-tight text-gray-800 truncate flex-1 mr-2">
                          {product.name || 'Product'}
                        </h3>
                        <span className="text-right text-[#40A574] whitespace-nowrap font-bold text-sm">
                          PKR {product.price}
                        </span>
                      </div>
                      {brand?.name ? (
                        <h4 className="font-semibold text-xs text-gray-600 truncate">
                          {brand.name}
                        </h4>
                      ) : (
                        <h4 className="font-semibold text-xs text-gray-400 truncate italic">
                          {/* Brand not specified */}
                        </h4>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* --- Modals (copied and adapted from pricefilter/page.tsx) --- */}
        {/* First Modal (Product Details) */}
        {/* --- Modals --- */}
             {/* First Modal: Product Details (Styled like PriceFilterResult) */}
             {isFirstModalOpen &&
               selectedProduct &&
               (() => {
                 const modalBackgroundStyle = getModalLeftPanelStyle(selectedProduct);
                 const contentFirstImages = selectedProduct.background_images ?? [];
                 const hasContentSlider = contentFirstImages.length > 1;
                //  let currentContentImageSrc = PRODUCT_PLACEHOLDER;
                let currentContentImageSrc;
                 if (
                   contentFirstImages.length > 0 &&
                   currentImageIndex < contentFirstImages.length
                 ) {
                   currentContentImageSrc = `${BASE_URL}/${contentFirstImages[currentImageIndex]}`;
                //  } else if (selectedProduct.sticker_path) {
                //    currentContentImageSrc = `${selectedProduct.sticker_path}`;
                //  } else if (selectedProduct.image_path) {
                //    currentContentImageSrc = `${selectedProduct.image_path}`;
                 }
       
                 const currentProductBrand = brands.find(
                   (b) => b._id === selectedProduct.company_id._id
                 );
       
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
                         {/* Left Side: Image Panel */}
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
                             <img
                               src={currentContentImageSrc}
                               alt={`${selectedProduct.name} - Image ${
                                 currentImageIndex + 1
                               }`}
                               className="object-contain w-full h-full"
                               onError={(e) => {
                                 e.currentTarget.onerror = null;
                                //  e.currentTarget.src = PRODUCT_PLACEHOLDER;
                               }}
                             />
                             {hasContentSlider && (
                               <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-1 bg-black bg-opacity-25 rounded-full">
                                 {contentFirstImages.map((_, index) => (
                                   <button
                                     key={`dot-${index}`}
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
                           </figure>
                          
                         </div>
       
                         {/* Right Side: Product Details */}
                         <div className="at-popupcontentside w-full md:w-[60%] p-6 flex flex-col justify-between">
                           <div>
                             {' '}
                             {/* Content wrapper */}
                             <div className="at-popuptitlebrandimg flex items-start mb-3">
                               {currentProductBrand?.company_logo && (
                                 <span className="w-12 h-12 mr-3 overflow-hidden flex-shrink-0 border rounded-md flex items-center justify-center bg-white">
                                   <img
                                     src={currentProductBrand.company_logo}
                                     alt={`${currentProductBrand.name} logo`}
                                     className="w-full h-full object-contain"
                                    //  onError={(e) => {
                                    //    (e.target as HTMLImageElement).src =
                                    //      PRODUCT_PLACEHOLDER;
                                    //  }}
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
                                   {currentProductBrand?.name || 'Brand Name'}
                                 </h4>
                                 <RatingStars
                                   rating={Math.round(selectedProduct.total_rating)}
                                 />
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
                                   Rs. {selectedProduct.price + selectedSpecPrice}
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
                               selectedProduct.specification[0].values?.length > 0 && (
                                 <div className="at-productsize mb-4">
                                   <label className="block text-base font-medium text-gray-700 mb-1">
                                     {selectedProduct.specification[0].name ||
                                       'Options'}
                                   </label>
                                   <div className="overflow-x-auto horizontal-scroll snap-x snap-mandatory flex gap-2 pb-1">
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
                 );
               })()}
       
             {/* Second Modal: Order Summary (Styled like PriceFilterResult) */}
             {isSecondModalOpen &&
               selectedProduct &&
               (() => {
               
                 const modalBackgroundStyle = getModalLeftPanelStyle(selectedProduct);
                 const contentSecondImages = selectedProduct.background_images ?? [];
                 const hasContentSlider = contentSecondImages.length > 1;
                 let currentContentImageSrc;
                //  let currentContentImageSrc = PRODUCT_PLACEHOLDER;
                 if (
                   contentSecondImages.length > 0 &&
                   currentImageIndex < contentSecondImages.length
                 ) {
                   currentContentImageSrc = `${BASE_URL}/${contentSecondImages[currentImageIndex]}`;
                //  } else if (selectedProduct.sticker_path) {
                //    currentContentImageSrc = `${selectedProduct.sticker_path}`;
                //  } else if (selectedProduct.image_path) {
                //    currentContentImageSrc = `${selectedProduct.image_path}`;
                 }
       
               
                 const finalProductPrice = selectedProduct.price + selectedSpecPrice;
       
                 return (
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
                         {/* Main container flex-col */}
                         <div className="at-modalcontent w-full">
                           {' '}
                           {/* Added w-full for consistency */}
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
                             <img
                               src={currentContentImageSrc}
                               alt={`${selectedProduct.name} - Image ${
                                 currentImageIndex + 1
                               }`}
                               className="object-contain w-full h-full"
                              //  onError={(e) => {
                              //    e.currentTarget.onerror = null;
                              //    e.currentTarget.src = PRODUCT_PLACEHOLDER;
                              //  }}
                             />
                             {hasContentSlider && (
                               <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-1 bg-black bg-opacity-25 rounded-full">
                                 {contentSecondImages.map((_, index) => (
                                   <button
                                     key={`dot-${index}`}
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
                                     {(
                                       selectedProduct.price + selectedSpecPrice
                                     ).toFixed(2)}
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
                 );
               })()}
      </>
    </div>
  );
};

export default SubCategoryPage;
