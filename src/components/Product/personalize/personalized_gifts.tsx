// src/components/personalized_gifts/personalized_gifts.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchPersonalizedGifts, placeOrder } from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-toastify';

interface PersonalizedGifts {
  _id: string;
  name: string;
  icon_path: string;
  images: {
    image_id: string;
    image_path: string;
  }[];
  created_at: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: PersonalizedGifts[];
}

export default function PersonalizedGifts() {
  const [personalizedGifts, setPersonalizedGifts] = useState<
    PersonalizedGifts[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPersonalizedGiftsModalOpen, setIsPersonalizedGiftsModalOpen] =
    useState(false);
  const [selectedPersonalizedGifts, setSelectedPersonalizedGift] =
    useState<PersonalizedGifts | null>(null);
  const [personalizedList, setPersonalizedList] = useState<
    { name: string; message: string; image_path: string; image_id: string }[]
  >([]);
  const [selectedName, setSelectedName] = useState<string>('');
  const [selectedMessage, setSelectedMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    name: string;
    message: string;
    image_path: string;
    image_id: string;
  }>();

  const openPersonalizedGiftsModal = (gift: PersonalizedGifts) => {
    setSelectedPersonalizedGift(gift);
    setIsPersonalizedGiftsModalOpen(true);
  };

  const closePersonalizedGiftsModal = () => {
    setIsPersonalizedGiftsModalOpen(false);
  };


  useEffect(() => {
    const getPersonalizedGifts = async () => {
      setLoading(true);
      try {
        const response: ApiResponse = await fetchPersonalizedGifts();
        if (response && response.success) {
          setPersonalizedGifts(response.data || []);
        } else {
          setError(response.message || 'Failed to fetch personalized gifts.');
        }
      } catch (err: any) {
        const errorMessage =
          err?.message ||
          err?.response?.data?.message ||
          'An error occurred while fetching personalized gifts.';
        console.error('Error fetching personalized gifts:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }

      const storedMessages = localStorage.getItem('personalizedMessages');
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        if (Array.isArray(parsedMessages)) {
          setPersonalizedList(parsedMessages);
        } else {
          setPersonalizedList([]);
        }
      } else {
        setPersonalizedList([]);
      }
    };

    getPersonalizedGifts();
  }, []);

  const onSubmit = async (data: { name: string; message: string }) => {
    if (selectedPersonalizedGifts) {
      const orderData = {
        data: '',
        cart_details: [
          { product_id: selectedPersonalizedGifts._id, quantity: 1 },
        ],
        personalized: [
          {
            name: selectedName || data.name,
            message: selectedMessage || data.message,
            image_path: selectedPersonalizedGifts.images[0].image_path,
            image_id: selectedPersonalizedGifts.images[0].image_id,
          },
        ],
      };

      try {
        const response = await placeOrder(orderData);
        if (response.success) {
          const newMessage = {
            name: selectedName || data.name,
            message: selectedMessage || data.message,
            image_path: selectedPersonalizedGifts.images[0].image_path,
            image_id: selectedPersonalizedGifts.images[0].image_id,
          };
          setPersonalizedList((prevList) => [...prevList, newMessage]);
          localStorage.setItem(
            'personalizedMessages',
            JSON.stringify([...personalizedList, newMessage])
          );
          setSelectedName('');
          setSelectedMessage('');
          closePersonalizedGiftsModal();
          toast.success(response.message || 'Message added successfully!');
        } else {
          toast.error(response.message || 'Failed to place order.');
          setError(response.message || 'Failed to place order.');
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          'An error occurred while placing the order.';
        console.error('Error placing order:', err);
        toast.error(errorMessage);
        setError(errorMessage);
      }
    }
  };

  return (
    <>
      <div className="at-shopcategories">
        <div className="at-shopcategoriesgrid">
          {loading &&
            Array.from({ length: 5 }).map((_, index) => (
              <div className="at-shopcategorieitems" key={index}>
                <Skeleton className="h-40 w-full" />
              </div>
            ))}
          {error && <p className="error-message">{error}</p>}
          {!loading && personalizedGifts.length === 0 && !error && (
            <p>No personalized gifts available.</p>
          )}
          {!loading &&
            personalizedGifts.length > 0 &&
            personalizedGifts.map((personalizedGift) => (
              <div
                className="at-shopcategoriesgriditem cursor-pointer"
                key={personalizedGift._id}
              >
                <figure>
                  <img
                    src={personalizedGift.images[0]?.image_path}
                    alt={personalizedGift.name}
                    onClick={() => openPersonalizedGiftsModal(personalizedGift)} // Open modal on image click
                  />
                </figure>
              </div>
            ))}
        </div>
      </div>
      {isPersonalizedGiftsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closePersonalizedGiftsModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg at-modaldailouge"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
                  <button
                    onClick={closePersonalizedGiftsModal}
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
              <div className="at-modalcontent p-0">
                <div className="at-modalleftside p-0">
                  {selectedPersonalizedGifts && (
                    <figure className="at-productimg p-0 m-0">
                      <img
                        src={selectedPersonalizedGifts.images[0].image_path}
                        alt={selectedPersonalizedGifts.name}
                      />
                    </figure>
                  )}
                </div>
                <div className="at-popupcontentside">
                  <div className="at-popupproducttitlerating mb-3">
                    <h4>Personalize your Gift</h4>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="at-popupproducttitlerating at-widthfull">
                      <div className="form-group at-inputshadow">
                        <input
                          type="text"
                          placeholder="Name"
                          {...register('name', { required: true })}
                          value={selectedName}
                          onChange={(e) => setSelectedName(e.target.value)}
                        />
                        {errors.name && (
                          <span className="error-message">
                            Name is required
                          </span>
                        )}
                        <textarea
                          placeholder="Message"
                          className='mt-5'
                          {...register('message', { required: true })}
                          value={selectedMessage}
                          onChange={(e) => setSelectedMessage(e.target.value)}
                        />
                        {errors.message && (
                          <span className="error-message">
                            Message is required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="at-btnaddtocart mt-10">
                      <button type="submit" className="at-btn at-btnpersonal">
                        Personalize
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </>
  );
}
