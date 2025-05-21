// src/app/components/Jazz/jazz_sticker.tsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchEnvelopeList, placeEnvelopeOrder } from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-toastify';

const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

interface Company {
  _id: string;
  name: string;
  company_logo: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_path: string;
  company_id: Company;
  sticker_path: string;
  background_image: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    totalDocuments: number;
    totalPages: number;
    currentPage: number;
    products: Product[]; // Updated to match the new response structure
  };
}

const colorsPalette = [
  '#ffd05e',
  '#fd9298',
  '#89c1fe',
  '#42a674',
  '#ff834b',
  '#D6DADA',
];

const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

export default function JazzSticker() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [isOpenModel1, setIsOpenModel1] = useState(false); // First modal state
  const [isOpenModel2, setIsOpenModel2] = useState(false); // Second modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // State to hold selected product

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ amount: string; name: string; message: string }>();

  const openModal1 = (product: Product) => {
    setSelectedProduct(product);
    setIsOpenModel1(true);
  };

  const closeModal1 = () => {
    setIsOpenModel1(false);
    setSelectedProduct(null); // Reset selected product on close
  };

  const openModal2 = () => {
    setIsOpenModel2(true);
  };

  const closeModal2 = () => {
    setIsOpenModel2(false);
  };

  const onSubmit = async (data: {
    amount: string;
    name: string;
    message: string;
  }) => {
    if (selectedProduct) {
      const orderData = {
        data: '',
        cart_details: [
          {
            product_id: selectedProduct._id,
            price: parseInt(data.amount, 10),
            quantity: 1,
            personalized: {
              name: data.name,
              message: data.message,
            },
          },
        ],
      };

      try {
        const response = await placeEnvelopeOrder(orderData);
        if (response.success) {
          toast.success(response.message || 'Order placed successfully!');
          closeModal2();
          closeModal1();
        } else {
          toast.error(response.message || 'Failed to place order.');
          setError(response.message || 'Failed to place order.');
        }
      } catch (err) {
        console.error('Error placing order:', err);
        toast.error('Failed to place order. Please try again.');
        setError('An error occurred while placing the order.');
      }
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const response: ApiResponse = await fetchEnvelopeList(); // Fetch envelope list
        if (response.success) {
          setProducts(response.data.products); // Updated path to products array
        } else {
          setError(response.message || 'Failed to fetch products.');
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          'An error occurred while fetching products.';
        console.error('Error fetching products:', err);
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false); // Set loading to false after the fetch is complete
      }
    };

    getProducts();
  }, []);
  // error.response.data.message
  return (
    <>
      <div className="at-giftcard">
        <div className="at-pagesectiontitle">
          <h2>Eidi Templates</h2>
        </div>
        <div className="at-cardgrid">
          {loading && (
            <>
              {/* Show skeletons while loading */}
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="at-carditem" key={index}>
                  <Skeleton className="h-40 w-full" />{' '}
                  <Skeleton className="h-6 w-3/4 mt-2" />{' '}
                  <Skeleton className="h-4 w-1/2 mt-1" />{' '}
                </div>
              ))}
            </>
          )}
          {error && !loading && <p className="error-message">{error}</p>}
          {!loading && products.length === 0 && !error && (
            <p>No products available.</p>
          )}
          {!loading &&
            products.length > 0 &&
            products.map((product, index) => (
              <div
                className="at-carditem cursor-pointer"
                key={product._id}
                onClick={() => openModal1(product)}
              >
                <figure
                  className="at-giftimagejazzcash at-imagers"
                  style={{
                    backgroundColor:
                      colorsPalette[index % colorsPalette.length],
                  }}
                >
                  {product.sticker_path !== null ? (
                    <img src={product.sticker_path} alt={product.name} />
                  ) : (
                    <img
                      src={PRODUCT_PLACEHOLDER}
                      alt={product.name !== '' ? product.name : 'Sticker Name'}
                    />
                  )}
                </figure>
                <div className="at-gifttitle">
                  <h3 className="font-bold text-[14px]">{product.name}</h3>
                  <h4 className="font-bold text-[10px]">
                    #{product._id.slice(0, 10)}
                  </h4>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* First Modal */}
      {isOpenModel1 && selectedProduct && (
        <div
          className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal1} // Close when clicking outside
        >
          <div
            className="bg-white rounded-lg shadow-lg at-modaldailouge"
            onClick={(e) => e.stopPropagation()} // Prevent closing on inner click
          >
            <div className="flex justify-between items-center">
              <div className="at-modalcontent">
                <div className="at-modalleftside">
                  <button onClick={closeModal1} className="at-btnpopupclose">
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
                  <figure className="at-productimg">
                    {selectedProduct.sticker_path !== null ? (
                      <img
                        src={selectedProduct.sticker_path}
                        alt={selectedProduct.name}
                      />
                    ) : (
                      <img
                        src={PRODUCT_PLACEHOLDER}
                        alt={
                          selectedProduct.name !== ''
                            ? selectedProduct.name
                            : 'Sticker Name'
                        }
                      />
                    )}
                  </figure>
                </div>
                <div className="at-popupcontentside">
                  <div className="at-popuptitlebrandimg">
                    <span>
                      <img
                        src={`${BASE_URL}/${selectedProduct.company_id.company_logo}`}
                        alt={selectedProduct.company_id.name}
                      />
                    </span>
                    <div className="at-popupproducttitlerating">
                      <h4>{selectedProduct.company_id.name}</h4>
                      <p>Pakistan</p>
                      <em>
                        <svg
                          width="93"
                          height="14"
                          viewBox="0 0 93 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.36104 11.6082L2.81252 14L3.68126 8.93493L0 5.34725L5.08567 4.6082L7.36104 0L9.63566 4.6082L14.7213 5.34725L11.0408 8.93493L11.9103 14L7.36104 11.6082Z"
                            fill="#FFD05E"
                          />
                          <path
                            d="M26.7983 11.6082L22.2498 14L23.1185 8.93493L19.4373 5.34725L24.5229 4.6082L26.7983 0L29.0729 4.6082L34.1586 5.34725L30.4781 8.93493L31.3475 14L26.7983 11.6082Z"
                            fill="#FFD05E"
                          />
                          <path
                            d="M46.2355 11.6082L41.687 14L42.5558 8.93493L38.8745 5.34725L43.9602 4.6082L46.2355 0L48.5102 4.6082L53.5958 5.34725L49.9153 8.93493L50.7848 14L46.2355 11.6082Z"
                            fill="#FFD05E"
                          />
                          <path
                            d="M65.673 11.6082L61.1245 14L61.9933 8.93493L58.312 5.34725L63.3977 4.6082L65.673 0L67.9477 4.6082L73.0333 5.34725L69.3528 8.93493L70.2223 14L65.673 11.6082Z"
                            fill="#FFD05E"
                          />
                          <path
                            d="M85.1105 11.6082L80.562 14L81.4308 8.93493L77.7495 5.34725L82.8352 4.6082L85.1105 0L87.3852 4.6082L92.4708 5.34725L88.7903 8.93493L89.6598 14L85.1105 11.6082Z"
                            fill="#FFD05E"
                          />
                        </svg>
                      </em>
                    </div>
                  </div>
                  <div className="at-popupdescription">
                    <p>
                      End and receive money to and from your friends and family
                      through Jazz Cash
                    </p>
                  </div>
                  <div className="at-popupproducttitlerating at-widthfull mb-3">
                    <h4>Amount you want to send</h4>
                  </div>
                  <form onSubmit={handleSubmit(() => openModal2())}>
                    <div className="at-popupproducttitlerating at-widthfull">
                      <div className="form-group  at-inputshadow">
                        <input
                          type="text"
                          className="form-control"
                          {...register('amount', {
                            required: true,
                            validate: (value) =>
                              parseInt(value) >= 500 ||
                              'Minimum amount is 500 Rs.',
                          })}
                          placeholder="Minimum 500 Rs."
                        />
                        {errors.amount && (
                          <span className="error-message">
                            {errors.amount.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="at-btnaddtocart mt-10">
                      <button type="submit" className="at-btn">
                        Add to cart
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Second Modal */}
      {isOpenModel2 && (
        <div
          className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal2} // Close when clicking outside
        >
          <div
            className="bg-white rounded-lg shadow-lg at-modaldailouge"
            onClick={(e) => e.stopPropagation()} // Prevent closing on inner click
          >
            <div className="flex justify-between items-center">
              <div className="at-modalcontent">
                {/* <div className="at-modalleftsidejazzcash"> */}
                <div className="at-modalleftside">
                  <button onClick={closeModal2} className="at-btnpopupclose">
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
                  {selectedProduct && (
                    <figure className="at-productimg">
                      {selectedProduct.sticker_path !== null ? (
                        <img
                          src={selectedProduct.sticker_path}
                          alt={selectedProduct.name}
                        />
                      ) : (
                        <img
                          src={PRODUCT_PLACEHOLDER}
                          alt={
                            selectedProduct.name !== ''
                              ? selectedProduct.name
                              : 'Sticker Name'
                          }
                        />
                      )}
                    </figure>
                  )}
                </div>
                <div className="at-popupcontentside">
                  <div className="at-popupproducttitlerating at-widthfull">
                    <h4>Personalize your Eidi</h4>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="at-popupproducttitlerating at-widthfull">
                      <div className="form-group  at-inputshadow">
                        <input
                          type="text"
                          {...register('name', { required: true })}
                          placeholder="Name"
                        />
                        {errors.name && (
                          <span className="error-message">
                            Name is required
                          </span>
                        )}
                      </div>
                      <div className="form-group  at-inputshadow">
                        <textarea
                          placeholder="Message"
                          {...register('message')}
                        />
                      </div>
                    </div>
                    <div className="at-btnaddtocart mt-10">
                      <button type="submit" className="at-btn">
                        Add to cart
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
