// src/components/page-ui/top_rated_products.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { fetchTopPicks, placeOrder } from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import RatingStars from './rating_stars';

interface TopPicks {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_path: string;
  background_image: string;
  total_rating: number;
  company_id: {
    _id: string;
    name: string;
    company_logo: string;
    description: string;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: TopPicks[];
}

interface PersonalizedMessage {
  name: string;
  message: string;
  image_path: string;
  image_id: string;
  productId?: string;
}

const TopPicksProducts: React.FC = () => {
  const [topPicks, setTopPicks] = useState<TopPicks[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedTopRatedProduct, setSelectedTopRatedProduct] =
    useState<TopPicks | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('M');

  const router = useRouter();

  const { cartItems, addToCart, removeFromCart } = useCart();

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

  const handleProductClick = (product: TopPicks) => {
    setSelectedTopRatedProduct(product);
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
    if (selectedTopRatedProduct) {
      const itemToAdd = {
        _id: selectedTopRatedProduct._id,
        price: selectedTopRatedProduct.price,
        quantity,
        image_path: selectedTopRatedProduct.image_path,
        name: selectedTopRatedProduct.name,
        description: selectedTopRatedProduct.description,
        personalization: personalizedMessages[selectedTopRatedProduct._id],
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
    if (!selectedTopRatedProduct) return;

    const orderData = {
      cart_details: [
        {
          product_id: selectedTopRatedProduct._id,
          quantity: quantity,
        },
      ],
      personalized: personalizedMessages[selectedTopRatedProduct._id],
    };

    try {
      const response = await placeOrder(orderData);
      if (response.success) {
        toast.success('Order placed successfully!');
        removeFromCart(selectedTopRatedProduct._id);
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
    setSelectedTopRatedProduct(null);
    setQuantity(1);
    setSelectedSize('M');
  };

  const handleReviewsClick = (productId: string) => {
    router.push(`/reviews/${productId}`);
  };

  useEffect(() => {
    const getTopPicks = async () => {
      setLoading(true);
      try {
        const response: ApiResponse = await fetchTopPicks();
        if (response && response.success) {
          setTopPicks(response.data || []); // Safeguard against undefined
        } else {
          setError(response.message || 'Failed to fetch top picks.');
        }
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'An error occurred while fetching categories.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    getTopPicks();
  }, []);

  return (
    <>
      <div>
        <div className="at-giftcard">
          <div className="at-pagesectiontitle">
            <h2>Top Picks</h2>
          </div>
          <div className="at-cardgrid">
            {loading && (
              <>
                {[...Array(5)].map((_, index) => (
                  <div className="at-carditem" key={index}>
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-6 w-3/4 mt-2" />
                    <Skeleton className="h-4 w-1/2 mt-1" />
                  </div>
                ))}
              </>
            )}

            {error && !loading && <p className="error-message">{error}</p>}
            {!loading &&
              !error &&
              Array.isArray(topPicks) &&
              topPicks.length === 0 && <p>No products available.</p>}
            {!loading &&
              Array.isArray(topPicks) &&
              topPicks.map((topPick, index) => {
                return (
                  <div
                    className="at-carditem cursor-pointer"
                    key={topPick._id}
                    onClick={() => handleProductClick(topPick)}
                  >
                    <figure className="at-giftimage">
                      <img
                        src={topPick.image_path}
                        alt={topPick.name}
                      />
                    </figure>
                    <div className="at-gifttitle flex items-center justify-between w-full font-bold">
                      <h3 className="font-bold text-[14px] m-0">
                        {topPick.name}{' '}
                      </h3>
                      <span className="text-right text-[#40A574]">
                        Rs.{topPick.price}
                      </span>
                    </div>
                    <h4 className="font-bold text-[10px]">
                      {topPick.company_id.name}
                    </h4>
                  </div>
                );
              })}
          </div>
        </div>

        {/* First Modal */}
        {isFirstModalOpen && selectedTopRatedProduct && (
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
                        src={selectedTopRatedProduct.background_image}
                        alt={selectedTopRatedProduct.name}
                      />
                    </figure>
                  </div>
                  <div className="at-popupcontentside">
                    <div className="at-popuptitlebrandimg">
                      <span>
                        <img
                          src={`${selectedTopRatedProduct.company_id.company_logo}`}
                          alt={`${selectedTopRatedProduct.company_id.name} logo`}
                        />
                      </span>
                      <div
                        className="at-popupproducttitlerating"
                        onClick={() =>
                          handleReviewsClick(selectedTopRatedProduct._id)
                        }
                      >
                        <h4>{selectedTopRatedProduct.company_id.name}</h4>
                        <p>3.1 km from you</p>
                        <RatingStars
                          rating={Math.round(
                            selectedTopRatedProduct.total_rating
                          )}
                        />
                      </div>
                    </div>
                    <div className="at-popupdescription">
                      <p>{selectedTopRatedProduct.description}</p>
                    </div>
                    <div className="at-popupcolorprice">
                      <div className="at-popupcolor">
                        <h3>{selectedTopRatedProduct.name}</h3>
                        <span>300ml/530 kcal</span>
                      </div>
                      <div className="at-popupprice">
                        <h3>PKR {selectedTopRatedProduct.price}</h3>
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
                      {isInCart(selectedTopRatedProduct._id) ? (
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
                              d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568
                              8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
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
                        onClick={() =>
                          handlePersonalize(selectedTopRatedProduct._id)
                        }
                      >
                        Personalize
                        <input
                          type="checkbox"
                          className="align-middle w-4 h-4"
                          checked={hasPersonalization(
                            selectedTopRatedProduct._id
                          )}
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
        {isSecondModalOpen && selectedTopRatedProduct && (
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
                        src={selectedTopRatedProduct.background_image}
                        alt={selectedTopRatedProduct.name}
                      />
                    </figure>
                  </div>
                  <div className="at-popupcontentside">
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
                          <span>Rs.{selectedTopRatedProduct.price}</span>
                        </li>
                        <li>
                          <span>Sales Tax 17%</span>
                          <span>
                            Rs.
                            {(
                              selectedTopRatedProduct.price *
                              0.17 *
                              quantity
                            ).toFixed(2)}
                          </span>
                        </li>
                        <li>
                          <span>Grand Total</span>
                          <span>
                            Rs.
                            {(
                              selectedTopRatedProduct.price * quantity +
                              selectedTopRatedProduct.price * 0.17 * quantity
                            ).toFixed(2)}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="at-btnsubmitcontact at-btnprofile at-btnplaceorder">
                  <button
                    type="button"
                    className="at-btn"
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </button>
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
      </div>
    </>
  );
};

export default TopPicksProducts;