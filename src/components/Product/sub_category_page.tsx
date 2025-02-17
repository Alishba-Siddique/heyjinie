// src/app/components/category_page/category_page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  fetchSubCategoryList,
  fetchCompanyList,
  fetchProductDetails,
  placeOrder,
} from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import RatingStars from '../page-ui/rating_stars';

interface Company {
  _id: string;
  name: string;
  company_logo: string;
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
  image_path: string;
  description: string;
  company_id: string;
  subcategory_id: string;
  background_image: string;
  is_featured: boolean;
  total_rating: number;
}

interface PersonalizedMessage {
  name: string;
  message: string;
  image_path: string;
  image_id: string;
  productId?: string;
}

const SubCategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const { subcategory } = params;
  const [brands, setBrands] = useState<Company[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<string | null>(null);
  const [brandsLoading, setBrandsLoading] = useState<boolean>(true);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // Combined modal states
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

  const { cartItems, addToCart, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('M');

  // Personalized messages
  const [personalizedMessages, setPersonalizedMessages] = useState<{
    [key: string]: PersonalizedMessage;
  }>({});

  const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const isInCart = (productId: string) =>
    cartItems.some((item) => item._id === productId);

  const hasPersonalization = (productId: string) => {
    return !!personalizedMessages[productId];
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsFirstModalOpen(true);
  };

  useEffect(() => {
    // Load personalized messages from localStorage
    const loadPersonalizedMessages = () => {
      const storedMessages = localStorage.getItem(
        'selectedPersonalizedMessages'
      );
      if (storedMessages) {
        const messages = JSON.parse(storedMessages);
        const messageMap: { [key: string]: PersonalizedMessage } = {};
        messages.forEach((msg: PersonalizedMessage) => {
          if (msg.productId) {
            messageMap[msg.productId] = msg;
          }
        });
        setPersonalizedMessages(messageMap);
      }
    };

    loadPersonalizedMessages();
  }, []);

  const handlePersonalize = (productId: string) => {
    localStorage.setItem('currentItemId', productId);
    localStorage.setItem('returnPath', window.location.pathname);
    router.push('/messages');
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      const itemToAdd = {
        _id: selectedProduct._id,
        price: selectedProduct.price,
        quantity,
        image_path: selectedProduct.image_path,
        name: selectedProduct.name,
        description: selectedProduct.description,
        personalization: personalizedMessages[selectedProduct._id],
      };
      addToCart(itemToAdd);
      setIsFirstModalOpen(false);
      setIsSecondModalOpen(true);
    }
  };

  const handleGoToCart = () => {
    setIsFirstModalOpen(false);
    router.push('/cart');
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!selectedProduct) return;

    const orderData = {
      cart_details: [
        {
          product_id: selectedProduct._id,
          quantity: quantity,
        },
      ],
      personalized: personalizedMessages[selectedProduct._id], // Use array
    };

    try {
      const response = await placeOrder(orderData);
      if (response.success) {
        toast.success('Order placed successfully!');
        removeFromCart(selectedProduct._id);

        router.push('/thankyou');
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const closeModals = () => {
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
    setSelectedSize('M');
  };

  const fetchSubCategories = async () => {
    try {
      const response = await fetchSubCategoryList();
      console.log('Subcategories Response:', response);
      if (response.success) {
        const subcategories = response.data.find(
          (subCat: any) =>
            subCat.name.toLowerCase().replace(/\s+/g, '') === subcategory
        );
        if (subcategories) {
          setSubCategoryId(subcategories._id);
          fetchData(subcategories._id);
        } else {
          setError('Subcategory not found.');
        }
      } else {
        throw new Error(response.message || 'Failed to fetch subcategories.');
      }
    } catch (err: any) {
      console.error('Error fetching subcategories:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'An error occurred while fetching subcategories.';
      setError(errorMessage);
    }
  };
  useEffect(() => {
    if (subcategory) {
      fetchSubCategories();
    }
  }, [subcategory]);

  const fetchData = async (subCategoryId: string) => {
    setLoading(true);
    setBrandsLoading(true);
    try {
      const companiesResponse = await fetchCompanyList();

      if (companiesResponse.success) {
        const filteredCompanies = companiesResponse.data.filter(
          (company: any) =>
            company.subcategory_ids.some(
              (subCat: any) => subCat._id === subCategoryId
            )
        );
        setBrands(filteredCompanies);

        // Fetch products for each filtered company
        const allProductsPromises = filteredCompanies.map((company: any) =>
          fetchProductDetails(company._id)
        );
        const responses = await Promise.all(allProductsPromises);

        const allProducts = responses.flatMap((response) =>
          response.success ? response.data : []
        );

        const featured = responses.flatMap((response) =>
          response.success
            ? response.data.filter((product: Product) => product.is_featured)
            : []
        );

        setFeaturedProducts(featured);
        setProducts(allProducts);
        setBrandsLoading(false);
      } else {
        setBrandsLoading(false);
        setError(companiesResponse.message);
        throw new Error(
          companiesResponse.message || 'Failed to fetch companies.'
        );
      }
    } catch (err: any) {
      setLoading(false);
      setBrandsLoading(false);
      console.error('Error fetching data:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'An error occurred while fetching data.';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setBrandsLoading(false);
    }
  };

  const handleBrandClick = (
    brandname: string,
    brandLogo: string,
    brandId: string
  ) => {
    const slug = brandname.toLowerCase().replace(/\s+/g, '');
    sessionStorage.setItem('brandLogo', brandLogo);
    router.push(`subcategory/${slug}/${brandId}`);
  };

  const handleReviewsClick = (productId: string) => {
    router.push(`/reviews/${productId}`);
  };

  return (
    <div className="at-categories">
      <div className="at-pagesectiontitle">
        <h2>SubCategory Page</h2>
      </div>
      {/* {loading && <Skeleton className="h-40 w-full" />} */}
      {error && <p className="error-message">{error}</p>}
      <>
        <div className="at-pagesectiontitle">
          <h2>Shop by Brands</h2>
        </div>
        <div className="at-categoriesgrid">
          {brandsLoading &&
            Array.from({ length: 6 }).map((_, brandindex) => (
              <div className="at-branditem" key={brandindex}>
                <Skeleton className="h-24 w-24 px-8 bg-[#d6dadb] gap-4" />{' '}
              </div>
            ))}
          {error && <p className="error-message">{error}</p>}
          {!brandsLoading && brands?.length === 0 && !error && (
            <p>No brands available.</p>
          )}
          {!brandsLoading &&
            brands.length > 0 &&
            brands.map((brand) => (
              <div
                key={brand._id}
                className="at-branditem cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  // e.stopPropagation();
                  handleBrandClick(brand.name, brand.company_logo, brand._id);
                }}
              >
                <img
                  src={brand.company_logo}
                  alt={brand.name}
                />
                {/* <h3>{brand.name}</h3> */}
              </div>
            ))}
        </div>

        {/*Featured Products*/}

        <div className="at-giftcard">
          <div className="at-pagesectiontitle">
            <h2>Featured Products</h2>
          </div>
          <div className="at-cardgrid">
            {brandsLoading && (
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <div className="at-carditem" key={index}>
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-6 w-3/4 mt-2" />
                    <Skeleton className="h-4 w-1/2 mt-1" />
                  </div>
                ))}
              </>
            )}
            {error && !brandsLoading && (
              <p className="error-message">{error}</p>
            )}
            {/* {!brandsLoading &&
              !error &&
              Array.isArray(products) &&
              products?.length === 0 && <p>No products available.</p>}
            {!brandsLoading &&
              Array.isArray(products) &&
              products?.map((product) => { */}
            {!brandsLoading &&
              !error &&
              Array.isArray(featuredProducts) &&
              featuredProducts?.length === 0 && <p>No products available.</p>}
            {!brandsLoading &&
              Array.isArray(featuredProducts) &&
              featuredProducts?.map((product) => {
                const brand = brands.find((b) => b._id === product.company_id);
                return (
                  <div
                    className="at-carditem cursor-pointer"
                    key={product._id}
                    onClick={() => handleProductClick(product)}
                  >
                    <figure
                      className="at-giftimage"
                      // style={{
                      //   backgroundColor:
                      //     colorsPalette[index % colorsPalette.length],
                      // }}
                    >
                      <img src={product.image_path} alt={product.name} />
                    </figure>
                    <div className="at-gifttitle flex items-center justify-between w-full font-bold">
                      {brand && ( // Check if brand exists
                        <h4 className="font-bold text-[14px]">{brand.name}</h4>
                      )}
                      <span className="text-right text-[#40A574]">
                        Rs.{product.price}
                      </span>
                    </div>

                    {brand && (
                      <h4 className="font-bold text-[10px]">{brand.name}</h4>
                    )}
                    {/* {brand && ( // Display brand logo if it exists
                                      <span className="at-giftbrand">
                                        <img
                                          className="rounded-full"
                                          src={brand.company_logo}
                                          alt={`${brand.name} logo`}
                                        />
                                      </span>
                                    )} */}
                  </div>
                );
              })}
          </div>
        </div>
        {/* First Modal */}
        {/* {isFirstModalOpen && selectedProduct && selectedProductIndex !== null && ( */}
        {/* First Modal */}
        {/* Personalization Modal */}
        {isFirstModalOpen && selectedProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setIsFirstModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg at-modaldailouge"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center relative">
                <div className="at-modalcontent p-0">
                  <button
                    onClick={() => setIsFirstModalOpen(false)}
                    className="at-btnpopupclose at-btnpopupclosetwo"
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="16" cy="16" r="16" fill="white" />
                      <path
                        d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321 10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
                        fill="#434343"
                      />
                      <path
                        d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
                        fill="#434343"
                      />
                    </svg>
                  </button>
                  <div className="at-modalleftside p-0">
                    <figure className="at-productimg p-0 m-0">
                      <img
                        src={`${BASE_URL}/${selectedProduct.background_image}`}
                        alt={selectedProduct.name}
                      />
                    </figure>
                  </div>
                  <div className="at-popupcontentside">
                    <div className="at-popuptitlebrandimg">
                      <span>
                        <img
                          src={
                            brands.find(
                              (b) => b._id === selectedProduct.company_id
                            )?.company_logo
                          }
                          alt=""
                        />
                      </span>
                      <div
                        className="at-popupproducttitlerating"
                        onClick={() => handleReviewsClick(selectedProduct._id)}
                      >
                        <h4>
                          {
                            brands.find(
                              (b) => b._id === selectedProduct.company_id
                            )?.name
                          }
                        </h4>
                        <p>3.1 km from you</p>
                        <RatingStars rating={selectedProduct.total_rating} />
                      </div>
                    </div>
                    <div className="at-popupdescription">
                      <p>{selectedProduct.description}</p>
                    </div>
                    <div className="at-popupcolorprice">
                      <div className="at-popupcolor">
                        <h3>{selectedProduct.name}</h3>
                        <span>300ml/530 kcal</span>
                      </div>
                      <div className="at-popupprice">
                        <h3>PKR {selectedProduct.price}</h3>
                      </div>
                    </div>

                    <div className="at-productsize">
                      {['S', 'M', 'L'].map((size) => (
                        <span
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={
                            selectedSize === size
                              ? 'bg-[#40A574] text-white'
                              : 'bg-gray-200'
                          }
                        >
                          {size}
                        </span>
                      ))}
                    </div>

                    <div className="at-btnaddtocart">
                      {isInCart(selectedProduct._id) ? (
                        <button onClick={handleGoToCart} className="at-btn">
                          Go to Cart
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
                        <input
                          type="checkbox"
                          className="align-middle w-4 h-4"
                          checked={hasPersonalization(selectedProduct._id)}
                          readOnly
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Second Modal */}
        {isSecondModalOpen && selectedProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={closeModals}
          >
            <div
              className="bg-white rounded-lg shadow-lg at-modaldailouge"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center flex-col">
                <div className="at-modalcontent">
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
                          d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321 10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
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
                  <div className="at-modalleftside at-modalordersummeryleft p-0">
                    <figure className="at-productimg m-0 p-0">
                      <img
                        src={`${BASE_URL}/${selectedProduct.background_image}`}
                        // src={selectedProduct.image_path}
                        alt={selectedProduct.name}
                      />
                    </figure>
                  </div>
                  <div className="at-popupcontentside">
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
                          <span className="">{quantity}</span>
                          <button onClick={increaseQuantity} className="">
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="at-ordersummery">
                      <h3>Order Summary</h3>
                      <ul>
                        <li>
                          <span>Item</span>
                          {/* <span>{selectedProduct.name}</span> */}
                        </li>
                        <li>
                          {/* <span>Price</span> */}
                          <span>Rs.{selectedProduct.price}</span>
                        </li>
                        <li>
                          <span>Sales Tax 17%</span>
                        </li>
                        <li>
                          <span>
                            Rs.
                            {(selectedProduct.price * 0.17 * quantity).toFixed(
                              2
                            )}
                          </span>
                        </li>
                        <li>
                          <span>Grand Total</span>
                        </li>
                        <li>
                          <span>
                            Rs.
                            {(
                              selectedProduct.price * quantity +
                              selectedProduct.price * 0.17 * quantity
                            ).toFixed(2)}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="at-btnsubmitcontact at-btnprofile at-btnplaceorder">
                  {/* <a href="/checkout"> */}
                  <button
                    type="button"
                    className="at-btn"
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </button>
                  {/* </a> */}
                  <a href="/homepage">
                    <button type="button" className="at-btn at-btncancel">
                      Continue Shopping
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default SubCategoryPage;
