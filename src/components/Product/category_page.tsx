// src/app/components/Product/category_page.tsx

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  fetchSubCategoryList,
  fetchCompanyList,
  fetchProductDetails,
  fetchCategoryList,
  placeOrder,
  confirmOrder,
} from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import RatingStars from '../page-ui/rating_stars';
import Link from 'next/link';

// --- Interfaces ---
interface SubCategory {
  _id: string;
  name: string;
  category_id: {
    _id: string;
    name: string;
  };
  description: string;
  image_path: string;
}

interface Company {
  _id: string;
  name: string;
  company_logo: string;
  category_ids?: Array<{ _id: string; name?: string }>;
  subcategory_ids?: Array<{ _id: string; name?: string; category_id?: string }>;
}

interface Product {
  _id: string;
  name: string;
  price: number; // Base price
  image_path: string | null;
  company_id: string;
  category_id: string;
  subcategory_id: string;
  background_image?: string[]; // For content slider in first modal
  sticker_path?: string | null;
  description: string;
  is_featured: boolean;
  total_rating: number;
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
}

interface Category {
  _id: string;
  name: string;
  description: string;
  search_type: string;
  image_path: string;
  is_active: boolean;
  product_type: string;
  type: number; // CRITICAL: Used for background image AND feature card color
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
// --- End Interfaces ---

const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';
const PRODUCT_PLACEHOLDER = '/images/logoicons.png';
const MODEL_BG_PATH = '/images/model-bg';

// --- Helper Function for Default Background Image (Modal Background) ---
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
      return `${MODEL_BG_PATH}/pd_bg_1.jpg`; // Default to type 1 image if invalid
  }
};
// --- End Helper Function ---

// --- Helper Function for Category Color (Feature Cards, Subcats) ---
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

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s/g, '-')
    .replace(/-+/g, '-');

const unslugify = (slug: string) => {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize each word
    .replace(/ And /gi, ' & '); // Replace 'and' with '&'
};

// --- End Helper Function ---

const CategoryPage = () => {
  const params = useParams();
  const router = useRouter();
  const cartContext = useCart();
  const cartItems = cartContext?.cartItems ?? [];
  const addToCart = cartContext?.addToCart ?? (() => {});
  const removeFromCart = cartContext?.removeFromCart ?? (() => {});

  const { category } = params;

  // --- State ---
  const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
  const [brands, setBrands] = useState<Company[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(
    null
  );

  // Modals & Product Selection
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [processing, setProcessing] = useState(false);

  const [selectedSize, setSelectedSize] = useState<string>(''); // Initialize empty, set on product click
  const [selectedSpecPrice, setSelectedSpecPrice] = useState<number>(0); // For additional price from spec

  const [currentImageSliderIndex, setCurrentImageSliderIndex] = useState(0);

  // Personalized Messages
  const [personalizedMessages, setPersonalizedMessages] = useState<{
    [key: string]: PersonalizedMessage | undefined;
  }>({});
  // --- End State ---

  // --- Personalized Message Logic ---
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

  const handlePersonalize = (productId: string) => {
    localStorage.setItem('currentItemId', productId);
    localStorage.setItem('returnPath', window.location.pathname);
    router.push('/messages');
  };
  // --- End Personalized Message Logic ---

  // --- Background Logic (Category Type Image for Modals) ---
  const getModalLeftPanelStyle = useCallback(
    (product?: Product | null): React.CSSProperties => {
      let categoryType: number | undefined = undefined;
      if (product?.category_id && allCategories.length > 0) {
        const categoryData = allCategories.find(
          (cat) => cat._id === product.category_id
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
  // --- End Background Logic ---

  // --- Color Logic (Category Type Color for Cards/Subcats) ---
  const getProductBackgroundColor = useCallback(
    (categoryId?: string): string => {
      if (!categoryId || allCategories.length === 0) {
        return getCategoryColor();
      }
      const categoryData = allCategories.find((cat) => cat._id === categoryId);
      return getCategoryColor(categoryData?.type);
    },
    [allCategories]
  );
  // --- End Color Logic ---

  // --- Unified Data Fetching ---
  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsLoading(true);
      setError(null);
      setAllCategories([]);
      setSubCategories([]);
      setBrands([]);
      setProducts([]);
      setFeaturedProducts([]);
      setCurrentCategoryId(null);

      const categorySlug = typeof category === 'string' ? category : null;
      if (!categorySlug) {
        setError('Category slug not found in URL.');
        setIsLoading(false);
        return;
      }

      try {
        const categoriesResponse = await fetchCategoryList();
        if (!categoriesResponse.success || !categoriesResponse.data) {
          throw new Error(
            categoriesResponse.message || 'Failed to fetch categories.'
          );
        }
        setAllCategories(categoriesResponse.data);

        const currentCat = categoriesResponse.data.find(
          (cat: Category) =>
            slugify(cat.name || '') === categorySlug.toLowerCase()
        );

        // const currentCat = categoriesResponse.data.find(
        //   (cat: Category) =>
        //     cat.name?.toLowerCase().replace(/\s+/g, '') ===
        //     categorySlug?.toLowerCase().replace(/\s+/g, '')
        // );
        let resolvedCategoryId: string | null =
          currentCat?._id ||
          categoriesResponse.data.find(
            (cat: Category) => cat._id === categorySlug
          )?._id ||
          null;

        if (!resolvedCategoryId) {
          throw new Error(`Category '${categorySlug}' not found.`);
        }
        setCurrentCategoryId(resolvedCategoryId);

        const subcategoriesPromise = fetchSubCategoryList()
          .then((response) =>
            response.success
              ? response.data.filter(
                  (sub: SubCategory) =>
                    sub.category_id?._id === resolvedCategoryId
                )
              : []
          )
          .catch(() => []);

        const companiesPromise = fetchCompanyList()
          .then((response) =>
            response.success
              ? response.data.filter((company: Company) =>
                  company.category_ids?.some(
                    (c: any) => c._id === resolvedCategoryId
                  )
                )
              : []
          )
          .catch(() => []);

        const [filteredSubCategories, filteredCompanies] = await Promise.all([
          subcategoriesPromise,
          companiesPromise,
        ]);
        setSubCategories(filteredSubCategories);
        setBrands(filteredCompanies);

        if (filteredCompanies.length > 0) {
          const productPromises = filteredCompanies.map(
            (company: { _id: string }) =>
              fetchProductDetails(company._id).catch((err) => {
                console.error(
                  `Failed to fetch products for brand ${company._id}:`,
                  err
                );
                return { success: false, data: [] };
              })
          );
          const productResponses = await Promise.all(productPromises);
          let allProducts: Product[] = productResponses.flatMap((response) =>
            response.success && response.data ? response.data : []
          );

          allProducts = allProducts
            .map((p) => ({
              ...p,
              category_id: p.category_id || resolvedCategoryId || '',
            }))
            .filter((p) => p.category_id === resolvedCategoryId);

          setProducts(allProducts);
          setFeaturedProducts(allProducts.filter((p) => p.is_featured));
        }
      } catch (err: any) {
        console.error('Error fetching category data:', err);
        setError(err.message || 'An error occurred while fetching data.');
        setAllCategories([]);
        setSubCategories([]);
        setBrands([]);
        setProducts([]);
        setFeaturedProducts([]);
        setCurrentCategoryId(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (category) {
      fetchCategoryData();
    }
    return () => {
      setIsLoading(true);
      setError(null);
    };
  }, [category]);
  // --- End Data Fetching ---

  // --- Event Handlers ---
  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQuantity = () => setQuantity((q) => q + 1);
  const isInCart = (productId: string) =>
    cartItems.some((item) => item._id === productId);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setCurrentImageSliderIndex(0);

    // Set initial size and spec price
    const firstSpecGroup = product.specification?.[0];
    const initialSpecValue = firstSpecGroup?.values?.[0]?.value || 'M'; // Default to 'M' or first available
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

  const handleGoToCart = () => {
    closeModals();
    router.push('/cart');
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      const cartImage = selectedProduct.background_image?.[0]
        ? `${BASE_URL}/${selectedProduct.background_image[0]}`
        : selectedProduct.sticker_path
        ? `${BASE_URL}/${selectedProduct.sticker_path}`
        : selectedProduct.image_path
        ? `${BASE_URL}/${selectedProduct.image_path}`
        : PRODUCT_PLACEHOLDER;

      const itemToAdd = {
        _id: selectedProduct._id,
        price: selectedProduct.price + selectedSpecPrice, // Base price + spec additional price
        quantity,
        image_path: cartImage,
        name: selectedProduct.name,
        description: selectedProduct.description,
        specification: selectedProduct.specification?.length
          ? selectedProduct.specification // Store full spec, or selected one if preferred by cart logic
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
        personalization: personalizedMessages[selectedProduct._id],
        // Optionally, if cart needs explicit size/spec details:
        size: selectedSize,
        // specPrice: selectedSpecPrice,
      };
      addToCart(itemToAdd as any); // Cast if itemToAdd doesn't perfectly match CartItem type definition
      setIsFirstModalOpen(false);
      setIsSecondModalOpen(true);
    }
  };

  // --- Order Placement Logic (largely unchanged, ensure prices are correct) ---
  const handlePlaceOrder = async () => {
    if (!selectedProduct) return;
    setProcessing(true);
    try {
      const finalProductPrice = selectedProduct.price + selectedSpecPrice; // Price incl. spec

      // Prepare specification for order if it exists
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
            specification: orderSpecification, // Add selected specification
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
          removeFromCart(selectedProduct._id);
          // Remove personalization for this item
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

      const totalAmount = finalProductPrice * quantity * 1.17; // Price + 17% tax
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
        MERCHANT_NAME: process.env.NEXT_PUBLIC_STORE_NAME || 'Hey Jinie',
        TOKEN: token,
        PROCCODE: '00',
        TXNAMT: totalAmount.toFixed(2),
        CUSTOMER_MOBILE_NO: '03000000000',
        CUSTOMER_EMAIL_ADDRESS: 'test@example.com',
        SIGNATURE: generateSignature(
          process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
          token
        ),
        VERSION: 'MY_VER_1.0', // As per original code, PriceFilter used PYMT_WEB_DI_1.0
        TXNDESC: `Payment for ${selectedProduct.name} (Order ${orderId})`,
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
        input.value = value;
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
  // --- End Order Placement ---

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

  const handleBrandClick = (brandLogo: string) =>
    sessionStorage.setItem('brandLogo', brandLogo);
  const handleReviewsClick = (productId: string) =>
    router.push(`/reviews/${productId}`);

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

  // --- Render Logic ---
  return (
    <div className="at-categories px-4 md:px-6 lg:px-8 py-6">
      <div className="at-pagesectiontitle mb-6 border-b pb-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 capitalize">
          {typeof category === 'string'
            ? unslugify(decodeURIComponent(category))
            : 'Category'}
        </h1>
      </div>

      {isLoading && (
        <>
          {/* Skeleton for Subcategories */}
          <div className="at-pagesectiontitle mb-4">
            <Skeleton className="h-7 w-1/3" />
          </div>
          <div className="at-categoriesgrid">
            {[...Array(5)].map((_, index) => (
              <div
                key={`subcat-skel-${index}`}
                className="at-categoryitem flex flex-col items-center"
              >
                <Skeleton className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-gray-200" />
                <Skeleton className="h-4 w-20 mt-2 bg-gray-200" />
              </div>
            ))}
          </div>

          {/* Skeleton for Brands */}
          <div className="mt-10">
            <div className="at-pagesectiontitle mb-4">
              <Skeleton className="h-7 w-1/4" />
            </div>
            <div className="at-categoriesgrid at-brandsgrid overflow-x-auto horizontal-scroll snap-x snap-mandatory pb-2 ">
              {[...Array(6)].map((_, index) => (
                <div
                  key={`brand-skel-${index}`}
                  className="at-branditem flex items-center justify-center px-4 py-4 h-20 border border-gray-200 rounded-lg bg-gray-100"
                >
                  <Skeleton className="h-8 w-24 bg-gray-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton for Featured Products */}
          <div className="at-giftcard mt-10">
            <div className="at-pagesectiontitle mb-4">
              <Skeleton className="h-7 w-1/2" />
            </div>
            <div className="at-cardgrid">
              {[...Array(6)].map((_, index) => (
                <div
                  key={`prod-skel-${index}`}
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
        </>
      )}
      {error && !isLoading && (
        <p className="error-message text-center text-red-600 mb-4 bg-red-100 p-3 rounded border border-red-300">
          {error}
        </p>
      )}

      {!isLoading && !error && (
        <>
          {subcategories.length > 0 ? (
            <>
              <div className="at-pagesectiontitle">
                <h2>Browse by Sub Category</h2>
              </div>
              <div className="at-categoriesgrid">
                {subcategories.map((subcategory) => {
                  const parentCategory = allCategories.find(
                    (cat) => cat._id === subcategory.category_id?._id
                  );
                  const backgroundColor = getProductBackgroundColor(
                    parentCategory?._id
                  );
                  const subCategorySlug = slugify(subcategory.name);
                  return (
                    <Link
                      key={subcategory._id}
                      className="at-categoryitem cursor-pointer text-center group"
                      href={`/subcategory/${subCategorySlug}`}
                      title={subcategory.name}
                    >
                      <figure className="flex flex-col items-center">
                        <span
                          className="at-imageparent rounded-full overflow-hidden w-20 h-20 md:w-24 md:h-24 flex items-center justify-center shadow"
                          style={{ backgroundColor }}
                        >
                          <img
                            src={
                              subcategory.image_path
                                ? `${BASE_URL}/${subcategory.image_path}`
                                : PRODUCT_PLACEHOLDER
                            }
                            alt={subcategory.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = PRODUCT_PLACEHOLDER;
                            }}
                            className="w-3/4 h-3/4 object-contain"
                          />
                        </span>
                        <figcaption className="at-categorycontent mt-2">
                          <h3 className="at-categorytitle font-bold">
                            {subcategory.name}
                          </h3>
                        </figcaption>
                      </figure>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 my-4">
              No sub categories found.
            </p>
          )}

          {brands.length > 0 ? (
            <div className="mt-10">
              <div className="at-pagesectiontitle">
                <h2>Shop by Brands</h2>
              </div>
              <div className="at-categoriesgrid at-brandsgrid overflow-x-auto horizontal-scroll snap-x snap-mandatory pb-2">
                {brands.map((brand) => {
                  const brandSlug = slugify(brand.name)
                    // .toLowerCase()
                    // .replace(/\s+/g, '-');
                  return (
                    <Link
                      key={brand._id}
                      href={`/category/category/${brandSlug}/${brand._id}`}
                      className="at-branditem snap-start flex items-center justify-center px-4 py-4 h-20 border border-gray-300 rounded-lg cursor-pointer hover:shadow-md hover:border-gray-400 transition-all duration-200 bg-white"
                      onClick={() => handleBrandClick(brand.company_logo)}
                      title={brand.name}
                    >
                      <img
                        src={brand.company_logo || PRODUCT_PLACEHOLDER}
                        alt={`${brand.name} logo`}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = PRODUCT_PLACEHOLDER;
                        }}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 my-4">
              No brands found for this category.
            </p>
          )}

          {featuredProducts.length > 0 ? (
            <div className="at-giftcard mt-10">
              <div className="at-pagesectiontitle">
                <h2>Featured Products</h2>
              </div>
              <div className="at-cardgrid">
                {featuredProducts.map((product) => {
                  const brand = brands.find(
                    (b) => b._id === product.company_id
                  );
                  const backgroundColor = getProductBackgroundColor(
                    product.category_id
                  );
                  const cardImageSrc = product.sticker_path
                    ? `${product.sticker_path}`
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
                              title={product.name}
                            >
                              {product.name}
                            </h3>
                            <span className="text-right text-[#40A574] whitespace-nowrap font-bold text-sm">
                              Rs.{product.price}
                            </span>
                          </div>
                          {brand && (
                            <h4
                              className="font-semibold text-xs text-gray-500 truncate"
                              title={brand.name}
                            >
                              {brand.name}
                            </h4>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : products.length > 0 ? (
            <p className="text-center text-gray-500 my-6">
              No featured products currently available.
            </p>
          ) : (
            <p className="text-center text-gray-500 my-6">
              No products found for this category.
            </p>
          )}
        </>
      )}

      {/* --- Modals --- */}
      {/* First Modal: Product Details (Styled like PriceFilterResult) */}
      {isFirstModalOpen &&
        selectedProduct &&
        (() => {
          const modalBackgroundStyle = getModalLeftPanelStyle(selectedProduct);
          const contentFirstImages = selectedProduct.background_image ?? [];
          const hasContentSlider = contentFirstImages.length > 1;
          let currentContentImageSrc = PRODUCT_PLACEHOLDER;
          if (
            contentFirstImages.length > 0 &&
            currentImageSliderIndex < contentFirstImages.length
          ) {
            currentContentImageSrc = `${BASE_URL}/${contentFirstImages[currentImageSliderIndex]}`;
          } else if (selectedProduct.sticker_path) {
            currentContentImageSrc = `${selectedProduct.sticker_path}`;
          } else if (selectedProduct.image_path) {
            currentContentImageSrc = `${selectedProduct.image_path}`;
          }

          const currentProductBrand = brands.find(
            (b) => b._id === selectedProduct.company_id
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
                          currentImageSliderIndex + 1
                        }`}
                        className="object-contain w-full h-full"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = PRODUCT_PLACEHOLDER;
                        }}
                      />
                      {hasContentSlider && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-1 bg-black bg-opacity-25 rounded-full">
                          {contentFirstImages.map((_, index) => (
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
          const contentSecondImages = selectedProduct.background_image ?? [];
          const hasContentSlider = contentSecondImages.length > 1;
          let currentContentImageSrc = PRODUCT_PLACEHOLDER;
          if (
            contentSecondImages.length > 0 &&
            currentImageSliderIndex < contentSecondImages.length
          ) {
            currentContentImageSrc = `${BASE_URL}/${contentSecondImages[currentImageSliderIndex]}`;
          } else if (selectedProduct.sticker_path) {
            currentContentImageSrc = `${selectedProduct.sticker_path}`;
          } else if (selectedProduct.image_path) {
            currentContentImageSrc = `${selectedProduct.image_path}`;
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
                          currentImageSliderIndex + 1
                        }`}
                        className="object-contain w-full h-full"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = PRODUCT_PLACEHOLDER;
                        }}
                      />
                      {hasContentSlider && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-1 bg-black bg-opacity-25 rounded-full">
                          {contentSecondImages.map((_, index) => (
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
    </div>
  );
};

export default CategoryPage;
