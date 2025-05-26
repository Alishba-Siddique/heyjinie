// src/components/page-ui/header.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { FiShoppingCart } from 'react-icons/fi';
import { FaRegUserCircle } from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';
import withAuth from '@/hoc/withAuth';
import AlgoliaSearch from '@/components/page-ui/search/algolia_search';
import { ChevronDown } from 'lucide-react';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (path: React.SetStateAction<string>) => {
    setCurrentPath(path);
    setIsMenuOpen(false);
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  // Check if current path is contact-us to hide search
  const shouldHideSearch = pathname === '/contact-us';

  return (
    <header className="at-header">
      <div
        className="at-headersearch"
        style={{ visibility: shouldHideSearch ? 'hidden' : 'visible' }}
      >
        <AlgoliaSearch />
      </div>

      <div className="at-headerright">
        <div className="at-profilearea">
          <div className="flex justify-between items-center gap-4">
            <button
              className="at-headerbtn at-cartbtn"
              onClick={handleCartClick}
              aria-label="Cart"
            >
              {cartCount > 0 && (
                <span className="at-cartcount">{cartCount}</span>
              )}
              <FiShoppingCart size={20} />
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={toggleMenu}
                className="flex items-center space-x-2  rounded-md p-2"
              >
                <FaRegUserCircle size={20} />
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {/* Profile Page Option */}
                    <a
                      href="/profile"
                      onClick={() => handleMenuItemClick('/profile')}
                      className={`group flex items-center px-4 py-3 text-sm  hover:bg-[#FE9399] hover:text-white transition-colors duration-200 ${
                        currentPath === '/profile' ? 'bg-[#FE9399] ' : ''
                      }`}
                    >
                      <FaRegUserCircle
                        size={20}
                        className="group-hover:text-white"
                      />
                      <span className="ml-3">Profile</span>
                    </a>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-1"></div>

                    {/* Privacy Policy */}
                    <a
                      href="/privacy-policy-page"
                      onClick={() =>
                        handleMenuItemClick('/privacy-policy-page')
                      }
                      className={`group flex items-center px-4 py-3 text-sm  hover:bg-[#FE9399] hover:text-white transition-colors duration-200 ${
                        currentPath === '/privacy-policy-page'
                          ? 'bg-[#FE9399] '
                          : ''
                      }`}
                    >
                      <em>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_3242_6050)">
                            <path
                              d="M18.0922 2.51707C16.6374 2.51707 15.3034 1.66273 14.6937 0.340586C14.598 0.132969 14.3903 0 14.1617 0H5.83879C5.61016 0 5.40242 0.132969 5.30668 0.340586C4.69699 1.66273 3.36301 2.51707 1.9082 2.51707C1.58461 2.51707 1.32227 2.77941 1.32227 3.10301V7.99715C1.32227 10.1189 1.87848 12.2142 2.9307 14.0566C3.98297 15.8991 5.50508 17.4427 7.33258 18.5207L9.7025 19.9188C9.79434 19.9729 9.89726 20 10.0002 20C10.1031 20 10.2061 19.9729 10.2979 19.9188L12.6678 18.5207C14.4953 17.4427 16.0174 15.8991 17.0697 14.0566C18.122 12.2142 18.6781 10.1189 18.6781 7.99715V3.10301C18.6782 2.77937 18.4158 2.51707 18.0922 2.51707ZM10.0002 3.94527C12.9058 3.94527 15.2696 6.31094 15.2696 9.21871C15.2696 12.1265 12.9058 14.4921 10.0002 14.4921C7.09469 14.4921 4.73082 12.1265 4.73082 9.21871C4.73082 6.31094 7.09465 3.94527 10.0002 3.94527Z"
                              fill="currentColor"
                              className="group-hover:fill-white"
                            />
                            <path
                              d="M7.23752 12.245C7.47967 11.6834 7.88682 11.2137 8.39467 10.8923C8.03596 10.5029 7.81639 9.98316 7.81639 9.41301C7.81639 8.20801 8.79611 7.22774 10.0003 7.22774C11.2046 7.22774 12.1843 8.20805 12.1843 9.41301C12.1843 9.98277 11.9651 10.5021 11.6068 10.8915C12.1149 11.2127 12.5215 11.6826 12.7634 12.2448C13.583 11.4943 14.0979 10.4156 14.0979 9.21875C14.0979 6.95715 12.2597 5.11719 10.0004 5.11719C7.741 5.11719 5.90283 6.95715 5.90283 9.21875C5.90275 10.4158 6.41775 11.4946 7.23752 12.245Z"
                              fill="currentColor"
                              className="group-hover:fill-white"
                            />
                            <path
                              d="M10 13.3203C10.6308 13.3203 11.2286 13.1768 11.7629 12.9208C11.5388 12.149 10.8283 11.5983 10 11.5983C9.17367 11.5983 8.46172 12.1496 8.2373 12.9209C8.77156 13.1768 9.36934 13.3203 10 13.3203Z"
                              fill="currentColor"
                              className="group-hover:fill-white"
                            />
                            <path
                              d="M10.0004 10.4263C10.5593 10.4263 11.0124 9.97262 11.0124 9.41293C11.0124 8.85325 10.5593 8.39954 10.0004 8.39954C9.4414 8.39954 8.98828 8.85325 8.98828 9.41293C8.98828 9.97262 9.4414 10.4263 10.0004 10.4263Z"
                              fill="currentColor"
                              className="group-hover:fill-white"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_3242_6050">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </em>
                      <span className="ml-3">Privacy</span>
                    </a>

                    {/* Terms & Conditions */}
                    <a
                      href="/terms-conditions-page"
                      onClick={() =>
                        handleMenuItemClick('/terms-conditions-page')
                      }
                      className={`group flex items-center px-4 py-3 text-sm  hover:bg-[#FE9399] hover:text-white transition-colors duration-200 ${
                        currentPath === '/terms-conditions-page'
                          ? 'bg-[#FE9399] '
                          : ''
                      }`}
                    >
                      <em>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M13.8804 19.9041L17.7819 16.0026H13.8804V19.9041Z"
                            fill="currentColor"
                            className="group-hover:fill-white"
                          />
                          <path
                            d="M17.8778 14.8307V0H2.12256V20H12.7085V14.8307H17.8778ZM7.50014 3.58074H12.5001V4.75262H7.50014V3.58074ZM5.20846 6.49738H14.7918V7.66926H5.20846V6.49738ZM5.20846 8.99738H14.7918V10.1693H5.20846V8.99738ZM6.43893 16.0026H5.2085V14.8307H6.43893V16.0026ZM10.0001 16.0026H7.6108V14.8307H10.0001V16.0026ZM5.20846 12.6693V11.4974H14.7918V12.6693H5.20846Z"
                            fill="currentColor"
                            className="group-hover:fill-white"
                          />
                        </svg>
                      </em>
                      <span className="ml-3">Terms & Conditions</span>
                    </a>

                    {/* FAQ's */}
                    <a
                      href="/FAQs"
                      onClick={() => handleMenuItemClick('/FAQs')}
                      className={`group flex items-center px-4 py-3 text-sm  hover:bg-[#FE9399] hover:text-white transition-colors duration-200 ${
                        currentPath === '/FAQs' ? 'bg-[#FE9399] ' : ''
                      }`}
                    >
                      <em>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_3242_6060)">
                            <path
                              d="M17.9293 16.3004L16.6936 12.7041C17.2879 11.5028 17.6023 10.1636 17.6044 8.81615C17.608 6.49576 16.7102 4.30173 15.0763 2.63824C13.4422 0.974474 11.2646 0.0379819 8.94486 0.00117326C7.72947 -0.0183385 6.55012 0.205607 5.43778 0.666048C4.36492 1.11014 3.40279 1.75347 2.57817 2.57813C1.75351 3.40275 1.11019 4.36487 0.666091 5.43774C0.20558 6.55008 -0.0181195 7.73003 0.00114612 8.94482C0.0378844 11.2646 0.974412 13.4421 2.63815 15.0763C4.29837 16.7069 6.48677 17.6044 8.80216 17.6044C8.80666 17.6044 8.81148 17.6044 8.81601 17.6044C10.1635 17.6023 11.5026 17.288 12.7041 16.6936L16.3003 17.9293C16.4386 17.9768 16.5804 18 16.7206 18C17.0537 18 17.3776 17.8691 17.6234 17.6234C17.9725 17.2743 18.0897 16.7674 17.9293 16.3004ZM8.71554 13.82C8.41639 13.82 8.19487 13.5755 8.18194 13.2864C8.16903 12.9983 8.43643 12.7528 8.71554 12.7528C9.01468 12.7528 9.2362 12.9973 9.24914 13.2864C9.26208 13.5746 8.99464 13.82 8.71554 13.82ZM9.24914 9.74431V11.4409C9.24914 11.7356 9.01022 11.9745 8.71554 11.9745C8.42086 11.9745 8.18194 11.7356 8.18194 11.4409V9.26456C8.18194 8.96988 8.42086 8.73096 8.71554 8.73096C9.59093 8.73096 10.3032 8.01873 10.3032 7.14334C10.3032 6.26795 9.59093 5.55572 8.71554 5.55572C7.84015 5.55572 7.12792 6.26795 7.12792 7.14334C7.12792 7.43802 6.88899 7.67694 6.59431 7.67694C6.29963 7.67694 6.06071 7.43802 6.06071 7.14334C6.06071 5.67951 7.25167 4.48852 8.71554 4.48852C10.1794 4.48852 11.3704 5.67947 11.3704 7.14334C11.3704 8.42451 10.4582 9.49663 9.24914 9.74431Z"
                              fill="currentColor"
                              className="group-hover:fill-white"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_3242_6060">
                              <rect width="18" height="18" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </em>
                      <span className="ml-3">FAQ's</span>
                    </a>

                    {/* Delivery Policy */}
                    <a
                      href="/delivery-policy"
                      onClick={() => handleMenuItemClick('/delivery-policy')}
                      className={`group flex items-center px-4 py-3 text-sm  hover:bg-[#FE9399] hover:text-white transition-colors duration-200 ${
                        currentPath === '/delivery-policy'
                          ? 'bg-[#FE9399] '
                          : ''
                      }`}
                    >
                      <em>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_3248_6966)">
                            <path
                              d="M19.4141 7.03125H11.1328C10.8089 7.03125 10.5469 7.29332 10.5469 7.61719V19.4141C10.5469 19.7379 10.8089 20 11.1328 20H19.4141C19.7379 20 20 19.7379 20 19.4141V7.61719C20 7.29332 19.7379 7.03125 19.4141 7.03125ZM14.6484 9.45312H15.8984C16.2223 9.45312 16.4844 9.7152 16.4844 10.0391C16.4844 10.3629 16.2223 10.625 15.8984 10.625H14.6484C14.3246 10.625 14.0625 10.3629 14.0625 10.0391C14.0625 9.7152 14.3246 9.45312 14.6484 9.45312ZM14.6484 17.6562H13.4766C13.1527 17.6562 12.8906 17.3942 12.8906 17.0703C12.8906 16.7464 13.1527 16.4844 13.4766 16.4844H14.6484C14.9723 16.4844 15.2344 16.7464 15.2344 17.0703C15.2344 17.3942 14.9723 17.6562 14.6484 17.6562ZM17.0703 15.3125H13.4766C13.1527 15.3125 12.8906 15.0504 12.8906 14.7266C12.8906 14.4027 13.1527 14.1406 13.4766 14.1406H17.0703C17.3942 14.1406 17.6562 14.4027 17.6562 14.7266C17.6562 15.0504 17.3942 15.3125 17.0703 15.3125ZM17.0703 12.9688H13.4766C13.1527 12.9688 12.8906 12.7067 12.8906 12.3828C12.8906 12.0589 13.1527 11.7969 13.4766 11.7969H17.0703C17.3942 11.7969 17.6562 12.0589 17.6562 12.3828C17.6562 12.7067 17.3942 12.9688 17.0703 12.9688Z"
                              fill="currentColor"
                              className="group-hover:fill-white"
                            />
                            <path
                              d="M8.78906 3.75824L6.85957 5.68773C6.69191 5.85539 6.43957 5.90574 6.22098 5.81477C6.00184 5.72434 5.85938 5.51031 5.85938 5.27344V0H1.75781C0.788516 0 0 0.788516 0 1.75781V15.8984C0 16.8677 0.788516 17.6562 1.75781 17.6562H9.375V7.61719C9.375 6.64789 10.1635 5.85938 11.1328 5.85938C10.9806 5.85938 10.8307 5.79988 10.7186 5.6877L8.78906 3.75824ZM5.27344 15.3125H2.92969C2.60582 15.3125 2.34375 15.0504 2.34375 14.7266C2.34375 14.4027 2.60582 14.1406 2.92969 14.1406H5.27344C5.5973 14.1406 5.85938 14.4027 5.85938 14.7266C5.85938 15.0504 5.5973 15.3125 5.27344 15.3125ZM5.27344 12.9688H2.92969C2.60582 12.9688 2.34375 12.7067 2.34375 12.3828C2.34375 12.0589 2.60582 11.7969 2.92969 11.7969H5.27344C5.5973 11.7969 5.85938 12.0589 5.85938 12.3828C5.85938 12.7067 5.5973 12.9688 5.27344 12.9688Z"
                              fill="currentColor"
                              className="group-hover:fill-white"
                            />
                            <path
                              d="M9.20332 2.51543L10.5469 3.85895V0H7.03125V3.85895L8.3748 2.51539C8.60367 2.28652 8.97445 2.28652 9.20332 2.51543Z"
                              fill="currentColor"
                              className="group-hover:fill-white"
                            />
                            <path
                              d="M15.8203 0H11.7188V5.27344C11.7188 5.51031 11.5763 5.72434 11.3571 5.81473C11.2845 5.84504 11.2083 5.85938 11.1328 5.85938H17.5781V1.75781C17.5781 0.788516 16.7896 0 15.8203 0Z"
                              fill="currentColor"
                              className="group-hover:fill-white"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_3248_6966">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </em>
                      <span className="ml-3">Delivery Policy</span>
                    </a>

                    {/* Return Policy */}
                    <a
                      href="/return-policy"
                      onClick={() => handleMenuItemClick('/return-policy')}
                      className={`group flex items-center px-4 py-3 text-sm  hover:bg-[#FE9399] hover:text-white transition-colors duration-200 ${
                        currentPath === '/return-policy' ? 'bg-[#FE9399] ' : ''
                      }`}
                    >
                      <em>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_3248_6940)">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M8.564 2.81204L9.92188 3.5022V0H6.67969V3.5022L8.03619 2.81281C8.19626 2.73163 8.39142 2.72507 8.564 2.81204Z"
                              fill="currentColor"
                              className="group-hover:fill-white"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M16.6016 7.07962V0.585938C16.6016 0.262299 16.3393 0 16.0156 0H11.0938V4.45557C11.0938 4.87686 10.6442 5.20111 10.2052 4.95728L8.30078 3.98956L6.35696 4.97742C5.9668 5.17502 5.50888 4.88663 5.50919 4.45557L5.50781 0H0.585938C0.262299 0 0 0.262299 0 0.585938V16.0156C0 16.3393 0.262299 16.6016 0.585938 16.6016H7.07962C6.35681 14.8206 6.36444 12.8395 7.09976 11.0645C8.63739 7.35214 12.8781 5.56854 16.6016 7.07962Z"
                              fill="currentColor"
                              className="group-hover:fill-white"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M18.2008 9.51401C17.0892 8.4024 15.5536 7.71484 13.8574 7.71484C12.1613 7.71484 10.6256 8.4024 9.51401 9.51401C8.4024 10.6256 7.71484 12.1613 7.71484 13.8574C7.71484 15.5536 8.4024 17.0892 9.51401 18.2008C10.6256 19.3124 12.1613 20 13.8574 20C15.5536 20 17.0892 19.3124 18.2008 18.2008C19.3124 17.0892 20 15.5536 20 13.8574C20 12.1613 19.3124 10.6256 18.2008 9.51401ZM16.3275 15.7808C15.9174 16.1909 15.3508 16.4453 14.7264 16.4453H11.9922C11.6685 16.4453 11.4062 16.183 11.4062 15.8594C11.4062 15.5357 11.6685 15.2734 11.9922 15.2734H14.7264C15.3282 15.2734 15.8203 14.7813 15.8203 14.1795C15.8203 13.8541 15.7187 13.5878 15.499 13.3682C15.3008 13.1699 15.0273 13.0469 14.7264 13.0469H13.0942L13.4422 13.3943C13.6711 13.6218 13.6722 13.9919 13.4447 14.2206C13.2172 14.4495 12.8471 14.4504 12.6184 14.2229L11.272 12.879C11.0431 12.6515 11.0422 12.2816 11.2697 12.0528L12.6135 10.7065C12.841 10.4778 13.2109 10.4767 13.4398 10.7042C13.6685 10.9317 13.6696 11.3016 13.4421 11.5305L13.0981 11.875H14.7264C15.9752 11.875 16.9922 12.892 16.9922 14.1408C16.9922 14.7911 16.7587 15.3496 16.3275 15.7808Z"
                              fill="currentColor"
                              className="group-hover:fill-white"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_3248_6940">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </em>
                      <span className="ml-3">Return Policy</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default withAuth(Header);
