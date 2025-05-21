// src/components/Product/gift_card.tsx

import { useEffect, useState } from 'react';
import { fetchProductDetails, fetchCompanyList } from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

interface Company {
  _id: string;
  name: string;
  company_logo: string;
  images?: string[];
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_path: string;
  company_id: string;
  sticker_path: string;
  background_image: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
  'https://stagingbackend.heyjinie.com/public';

// const colorsPalette = [
//   '#ffd05e',
//   '#fd9298',
//   '#89c1fe',
//   '#42a674',
//   '#ff834b',
//   '#D6DADA',
// ];

const GiftCard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [companyMap, setCompanyMap] = useState<Record<string, Company>>({});

  // Combined modal states
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('M');

  const router = useRouter();

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Modal control functions
  // const openFirstModal = (product: Product, index: number) => {
  //   // setSelectedProduct(product);
  //   // setSelectedProductIndex(index);
  //   setIsFirstModalOpen(true);
  //   setIsSecondModalOpen(false);
  // };
  const openFirstModal = (product: Product) => {
    setSelectedProduct(product);
    // setSelectedProductIndex(index);
    setIsFirstModalOpen(true);
    setIsSecondModalOpen(false);
  };

  const openSecondModal = () => {
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(true);
  };

  const closeModals = () => {
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
    setSelectedSize('M');
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetchCompanyList();
        if (response.success) {
          const companies: Company[] = response.data;
          const map = companies.reduce(
            (acc, company) => ({ ...acc, [company._id]: company }),
            {} as Record<string, Company>
          );
          setCompanyMap(map);
          await fetchAllProducts(companies);
        } else {
          setError('Failed to fetch companies.');
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('An error occurred while fetching companies.');
      }
    };

    fetchCompanies();
  }, []);

  const fetchAllProducts = async (companies: Company[]) => {
    setLoading(true);
    try {
      const allProductsPromises = companies.map((company) =>
        fetchProductDetails(company._id)
      );

      const responses = await Promise.all(allProductsPromises);

      const allProducts = responses.flatMap((response) =>
        response.success ? response.data : []
      );
      setProducts(allProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('An error occurred while fetching products.');
    } finally {
      setLoading(false);
    }
  };

  const getCompanyLogo = (company: Company) => {
    if (company.images && company.images.length > 0) {
      return `${company.images[0]}`;
    }
    if (company.company_logo) {
      return `${company.company_logo}`;
    }
    return '';
  };

  const { cartItems, addToCart } = useCart();

  const handleAddToCart = () => {
    if (selectedProduct) {
      const itemToAdd = {
        _id: selectedProduct._id,
        price: selectedProduct.price,
        quantity,
        image_path: selectedProduct.image_path,
        name: selectedProduct.name,
        description: selectedProduct.description,
      };
      if (isInCart) {
        // Navigate to the cart page if the item is already in the cart
        router.push('/cart');
      } else {
        addToCart(itemToAdd);
        openSecondModal();
      }
    }
  };

  const isInCart = cartItems.some((item) => item._id === selectedProduct?._id);

  return (
    <>
      <div className="at-giftcard">
        <div className="at-pagesectiontitle">
          <h2>Featured Products</h2>
        </div>
        <div className="at-cardgrid">
          {loading && (
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
          {error && !loading && <p className="error-message">{error}</p>}
          {!loading &&
            !error &&
            Array.isArray(products) &&
            products.length === 0 && <p>No products available.</p>}
          {!loading &&
            Array.isArray(products) &&
            products.map((product) => {
              const company = companyMap[product.company_id];

              if (!company) return null;

              return (
                <div
                  className="at-carditem cursor-pointer"
                  key={product._id}
                  onClick={() => openFirstModal(product)}
                >
                  <figure className="at-giftimage">
                    {product.image_path !== null ? (
                      <img src={product.image_path} alt={product.name} />
                    ) : (
                      <img
                        src={PRODUCT_PLACEHOLDER}
                        alt={
                          product.name !== '' ? product.name : 'Product Name'
                        }
                      />
                    )}
                  </figure>
                  <div className="at-gifttitle flex items-center justify-between w-full font-bold">
                    <h3 className="font-bold text-[14px] m-0">
                      {product.name}{' '}
                    </h3>
                    <span className="text-right text-[#40A574]">
                      Rs.{product.price}
                    </span>
                  </div>
                  <h4 className="font-bold text-[10px]">{company.name}</h4>
                  {/* <span className="at-giftbrand">
                    <img
                      className="rounded-full"
                      src={getCompanyLogo(company)}
                      alt={`${company.name} logo`}
                    />
                  </span> */}
                </div>
              );
            })}
        </div>
      </div>

      {/* First Modal */}
      {/* {isFirstModalOpen && selectedProduct && selectedProductIndex !== null && ( */}
      {isFirstModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModals}
        >
          <div
            className="bg-white rounded-lg shadow-lg at-modaldailouge"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
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
                  <figure className="at-productimg m-0 p-0">
                    {selectedProduct.background_image ? (
                      <img
                        src={
                          `${BASE_URL}/${selectedProduct.background_image[0]}` ||
                          PRODUCT_PLACEHOLDER
                        }
                        alt={selectedProduct.name}
                        className="w-full h-1/2 rounded-lg object-contain"
                      />
                    ) : (
                      <img
                        src={PRODUCT_PLACEHOLDER}
                        alt="Product Name"
                        className="w-full sm:w-24 h-24 rounded-lg object-cover"
                      />
                    )}
                  </figure>
                </div>
                <div className="at-popupcontentside">
                  <div className="at-popuptitlebrandimg">
                    <span>
                      <img
                        src={
                          companyMap[selectedProduct.company_id]?.company_logo
                        }
                        alt=""
                      />
                    </span>
                    <div className="at-popupproducttitlerating">
                      <h4>{companyMap[selectedProduct.company_id]?.name}</h4>
                      <p>3.1 km from you</p>
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
                    <p>{selectedProduct.description}</p>
                  </div>
                  <div className="at-popupcolorprice">
                    <div className="at-popupcolor">
                      <h3>{selectedProduct.name}</h3>
                      <span>300ml/530 kcal</span>
                    </div>
                    <div className="at-popupprice">
                      <h3>Rs. {selectedProduct.price}</h3>
                    </div>
                  </div>

                  <div className="at-productsize">
                    {['S', 'M', 'L'].map((size) => (
                      <span
                        key={size}
                        className={selectedSize === size ? 'selected' : ''}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </span>
                    ))}
                  </div>

                  <div className="at-btnaddtocart">
                    <button onClick={handleAddToCart} className="at-btn ">
                      {isInCart ? 'Go to Checkout' : 'Add to Cart'}
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

                    <Link href="/personalize">
                      <button className="at-btn at-btnpersonal">
                        Personalize
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Second Modal */}
      {isSecondModalOpen && selectedProduct && (
        // selectedProductIndex !== null && (
        <div
          className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
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
                        d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9. 9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
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
                    {selectedProduct.background_image ? (
                      <img
                        src={
                          `${BASE_URL}/${selectedProduct.background_image[0]}` ||
                          PRODUCT_PLACEHOLDER
                        }
                        alt={selectedProduct.name}
                        className="w-full h-1/2 rounded-lg object-contain"
                      />
                    ) : (
                      <img
                        src={PRODUCT_PLACEHOLDER}
                        alt="Product Name"
                        className="w-full sm:w-24 h-24 rounded-lg object-cover"
                      />
                    )}
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
                          className=""
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
                          {(selectedProduct.price * 0.17 * quantity).toFixed(2)}
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
                <Link href="/checkout">
                  <button type="button" className="at-btn">
                    Place Order
                  </button>
                </Link>
                <Link href="/home">
                  <button type="button" className="at-btn at-btncancel">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GiftCard;
