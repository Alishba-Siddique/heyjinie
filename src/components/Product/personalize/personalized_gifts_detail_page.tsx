// src/components/Product/personalize/personalized_gifts_detail_page.tsx
import { useEffect, useState } from 'react';
import { placeOrder } from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

interface GiftImage {
  image_id: string;
  image_path: string;
}

const PersonalizedGiftDetailPage = ({
  params,
}: {
  params: { slug: string };
}) => {
  const [images, setImages] = useState<GiftImage[]>([]);
  const [productId, setProductId] = useState<string>(''); // Changed to string type
  const [categoryName, setCategoryName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPersonalizedGiftsModalOpen, setIsPersonalizedGiftsModalOpen] =
    useState(false);
  const [selectedImage, setSelectedImage] = useState<GiftImage | null>(null);
  const [personalizedMessages, setPersonalizedMessages] = useState<{
    [key: string]: {
      name: string;
      message: string;
      image_path: string;
      image_id: string;
    }[];
  }>({});
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');

  const router = useRouter();

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

  const openPersonalizedGiftsModal = (user_image: GiftImage) => {
    setSelectedImage(user_image);
    setIsPersonalizedGiftsModalOpen(true);
  };

  const closePersonalizedGiftsModal = () => {
    setIsPersonalizedGiftsModalOpen(false);
  };

  useEffect(() => {
    const loadLocalStorageData = () => {
      try {
        // Load and validate images
        const storedImages = localStorage.getItem('selectedGiftImages');
        const storedId = localStorage.getItem('selectedProductId');
        const storedName = localStorage.getItem('selectedGiftName');

        if (!storedImages || !storedId || !storedName) {
          throw new Error('Required localStorage data is missing');
        }

        let parsedImages: GiftImage[];
        try {
          parsedImages = JSON.parse(storedImages);
          if (!Array.isArray(parsedImages)) {
            parsedImages = [parsedImages];
          }

          // Validate image structure
          if (!parsedImages.every((img) => img.image_id && img.image_path)) {
            throw new Error('Invalid image data structure');
          }
        } catch (parseError) {
          console.error('Error parsing images:', parseError);
          throw new Error('Invalid image data format');
        }

        setImages(parsedImages);
        setProductId(storedId);

        // Format category name from slug
        const formattedName = params.slug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setCategoryName(formattedName);

        // Load personalized messages
        const storedMessages = localStorage.getItem('personalizedMessages');
        if (storedMessages) {
          try {
            const parsedMessages = JSON.parse(storedMessages) as {
              [key: string]: {
                name: string;
                message: string;
                image_path: string;
                image_id: string;
              }[];
            };
            setPersonalizedMessages(parsedMessages || {});
          } catch (parseError) {
            console.error('Error parsing messages:', parseError);
            setPersonalizedMessages({});
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error loading data:', errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadLocalStorageData();
  }, [params.slug]);

  const onSubmit = async () => {
    if (!selectedImage || !productId) {
      toast.error('Missing required information');
      return;
    }

    const storedName = localStorage.getItem('selectedGiftName'); // Retrieve gift name
    if (!storedName) {
      toast.error('Gift name is missing');
      return;
    }

    const orderData = {
      data: '',
      cart_details: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      personalized: [
        {
          name,
          message,
          image_path: selectedImage.image_path,
          image_id: selectedImage.image_id,
        },
      ],
    };

    try {
      const response = await placeOrder(orderData);
      if (response.success) {
        const newMessage = {
          name,
          message,
          image_path: selectedImage.image_path || '/images/placeholder.png',
          image_id: selectedImage.image_id,
        };

        // Update localStorage with categorized messages
        const storedName =
          localStorage.getItem('selectedGiftName') || 'unknown'; // <-- Reads the name
        const updatedMessages = { ...personalizedMessages }; // personalizedMessages state holds the categorized structure
        if (!updatedMessages[storedName]) {
          // <-- Uses name as key
          updatedMessages[storedName] = [];
        }
        updatedMessages[storedName].push(newMessage); // <-- Pushes message into the category array

        setPersonalizedMessages(updatedMessages); // Updates local state
        localStorage.setItem(
          'personalizedMessages', // <-- Saves to this key
          JSON.stringify(updatedMessages) // <-- Saves the structure like {"Wedding": [...], "Birthday": [...]}
        );

        window.dispatchEvent(new Event('storage'));
        setName('');
        setMessage('');
        closePersonalizedGiftsModal();
        router.push('/messages');
        toast.success('Personalization Message added successfully!');
      } else {
        throw new Error(response.message || 'Failed to place order');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to place order';
      console.error('Error placing order:', error);
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <>
      <div className="at-shopcategories">
        <div className="at-pagesectiontitle">
          <h2>{categoryName}</h2>
        </div>
        <div className="at-shopcategoriesgrid">
          {loading &&
            Array(5)
              .fill(0)
              .map((_, index) => (
                <div className="at-shopcategorieitems" key={index}>
                  <Skeleton className="h-40 w-full bg-[#d6dadb]" />
                </div>
              ))}
          {error && <p className="error-message">{error}</p>}
          {!loading && images.length === 0 && !error && (
            <p>No {categoryName} gifts available.</p>
          )}
          {!loading &&
            images.length > 0 &&
            images.map((user_image) => (
              <div
                className="at-shopcategoriesgriditem"
                key={user_image.image_id}
              >
                <figure>
                  <img
                    src={user_image.image_path}
                    alt={`${categoryName} gift`}
                    className="w-full h-64 object-cover cursor-pointer"
                    onClick={() => openPersonalizedGiftsModal(user_image)}
                    onError={(e) => {
                      console.error(
                        'Image failed to load:',
                        user_image.image_path
                      );
                      // Set a fallback image or add error handling UI
                      (e.target as HTMLImageElement).src =
                        '/placeholder-image.jpg';
                    }}
                  />
                </figure>
              </div>
            ))}
        </div>

        {isPersonalizedGiftsModalOpen && (
          <div
            className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
            onClick={closePersonalizedGiftsModal}
          >
            <div
              className="bg-white rounded-lg shadow-lg at-modaldailouge"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <div className="at-modalcontent">
                  <button
                    onClick={closePersonalizedGiftsModal}
                    className=" at-btnpopupclose at-btnpopupclosetwo"
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
                    {selectedImage && (
                      <figure className="at-productimg m-0 p-0">
                        <img
                          src={selectedImage.image_path}
                          alt={`${categoryName} gift`}
                        />
                      </figure>
                    )}
                  </div>
                  <div className="at-popupcontentside">
                    <div className="at-popupproducttitlerating">
                      <h4>Personalize your Gift</h4>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="at-popupproducttitlerating at-widthfull">
                        <div className="form-group at-inputshadow">
                          <input
                            type="text"
                            placeholder="Name"
                            {...register('name', { required: true })}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-4"
                          />
                          {errors.name && (
                            <span className="error-message">
                              Name is required
                            </span>
                          )}

                          <textarea
                            placeholder="Message"
                            className="mt-3"
                            {...register('message', { required: true })}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
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
      </div>
    </>
  );
};

export default PersonalizedGiftDetailPage;
