//src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/auth');
  }, [router]);

  return null;
}




// 'use client'; // Added for client-side hooks and interactivity
// import Script from 'next/script';
// import '../css/style.css'
// // Placeholder for the base64 image data for SVGs.
// // In a real application, this would be the full base64 string.                      
// const HomePage = () => {
//   const SvgImageDefinitions = () => (
//   <defs>
//     <pattern id="pattern0_160_3459_logo" patternContentUnits="objectBoundingBox" width="1" height="1">
//       <use xlinkHref="#image0_160_3459_logo_data" transform="matrix(0.000478779 0 0 0.00157562 -0.348066 -1.865)"/>
//     </pattern>
//     {/* <image id="image0_160_3459_logo_data" width="3508" height="3002" xlinkHref={SVG_LOGO_BASE64_DATA}/> */}
//     <image id="image0_160_3459_logo_data" width="3508" height="3002"/>
//   </defs>
// );
// return (  
//   <>         
//     <nav
//       role="navigation"
//       data-lenis-prevent=""
//       className="nav-menu-wrapper w-nav-menu"
//     >
//       <div className="nav-menu">
//         <div className="menu-gradient"></div>
//         <div className="nav-link-wrapper">
//           <a href="#marketplace" className="nav-link w-nav-link">Marketplace</a>
//           <a href="#" className="nav-link hover w-nav-link">Marketplace</a>
//           <div className="hover-line-wrapper">
//             <div className="hover-line-svg set-1 w-embed">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="100%"
//                 height="100%"
//                 viewBox="0 0 104 5"
//                 fill="none"
//               >
//                 <path
//                   d="M1 2.40328C6.61864 2.81974 21 4.5 40.0604 2.81974C71.8745 0.015184 79.2288 1.41048 103 2.81974"
//                   stroke="#88C0FC"
//                   strokeLinecap="round" />
//               </svg>
//             </div>
//           </div>
//         </div>
//         <div className="nav-space"></div>
//         <div className="nav-link-wrapper">
//           <a href="#pricing" className="nav-link w-nav-link">Pricing</a>
//           <a href="#" className="nav-link hover w-nav-link">Pricing</a>
//           <div className="hover-line-wrapper">
//             <div className="hover-line-svg set-2 w-embed">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="100%"
//                 height="100%"
//                 viewBox="0 0 50 3"
//                 fill="none"
//               >
//                 <path
//                   d="M1 1.40305C3.64407 1.81951 10.3559 2.25414 19.3814 1.81951C34.4069 1.09595 37.8136 0.410231 49 1.81951"
//                   stroke="#88C0FC"
//                   strokeLinecap="round" />
//               </svg>
//             </div>
//           </div>
//         </div>
//         <div className="nav-space"></div>
//         <div className="nav-link-wrapper hidden">
//           <a href="#" className="nav-link w-nav-link">Blog</a>
//           <a href="#" className="nav-link hover w-nav-link">Blog</a>
//           <div className="hover-line-wrapper">
//             <div className="hover-line-svg set-3 w-embed">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="100%"
//                 height="100%"
//                 viewBox="0 0 32 3"
//                 fill="none"
//               >
//                 <path
//                   d="M1 1.40305C2.65254 1.81951 6.84746 2.25414 12.4883 1.81951C21.8793 1.09595 24.0085 0.410231 31 1.81951"
//                   stroke="#88C0FC"
//                   strokeLinecap="round" />
//               </svg>
//             </div>
//           </div>
//         </div>
//         <div className="nav-link-wrapper">
//           <a
//             data-close-contact // Renamed from close-contact=""
//             data-stop-scroll // Renamed from stop-scroll=""
//             data-w-id="3eec7af4-0276-6645-7224-400000252098"
//             href="#"
//             className="nav-link w-nav-link"
//           >Contact us</a>
//           <a href="#" className="nav-link hover w-nav-link">Contact us</a>
//           <div className="hover-line-wrapper">
//             <div className="hover-line-svg set-4 w-embed">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="100%"
//                 height="100%"
//                 viewBox="0 0 83 3"
//                 fill="none"
//               >
//                 <path
//                   d="M1 1.40305C5.46186 1.81951 16.7881 2.25414 32.0185 1.81951C57.3741 1.09595 63.1229 0.410231 82 1.81951"
//                   stroke="#88C0FC"
//                   strokeLinecap="round" />
//               </svg>
//             </div>
//           </div>
//         </div>
//         <div className="menu-buttons">
//           <div className="download-buttons">
//             <a
//               href="https://apps.apple.com/us/app/fitonist-ai-gym-workout-plan/id6443644593"
//               target="_blank"
//               className="button-wrapper w-inline-block"
//             ><span className="dot-span dot dot-1"></span>
//               <span className="dot-span dot dot-2"></span>
//               <span className="dot-span dot dot-3"></span>
//               <span className="dot-span dot dot-4"></span>
//               <span className="dot-span dot dot-5"></span>
//               <span className="dot-span dot dot-6"></span>
//               <span className="dot-span dot dot-7"></span>
//               <span
//                 className="button app-store buton bg-yellow-500 px-16 py-4 rounded-full"
//               ><div className="icon-app w-embed">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="100%"
//                     height="100%"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <path
//                       d="M14.7129 5.42285C15.3086 4.7002 15.7285 3.71387 15.7285 2.71777C15.7285 2.58105 15.7188 2.44434 15.6992 2.33691C14.7227 2.37598 13.5508 2.98145 12.8574 3.80176C12.3008 4.42676 11.793 5.42285 11.793 6.41895C11.793 6.5752 11.8223 6.72168 11.832 6.77051C11.8906 6.78027 11.9883 6.7998 12.0957 6.7998C12.9648 6.7998 14.0586 6.21387 14.7129 5.42285ZM15.3965 7.00488C13.9414 7.00488 12.75 7.89355 11.9883 7.89355C11.1777 7.89355 10.123 7.06348 8.85352 7.06348C6.44141 7.06348 4 9.05566 4 12.8057C4 15.1494 4.89844 17.6201 6.02148 19.2119C6.97852 20.5596 7.81836 21.6631 9.0293 21.6631C10.2207 21.6631 10.748 20.8721 12.2324 20.8721C13.7363 20.8721 14.0781 21.6436 15.3965 21.6436C16.7051 21.6436 17.5742 20.4424 18.4043 19.2607C19.3223 17.9033 19.7129 16.585 19.7227 16.5166C19.6445 16.4971 17.1445 15.4717 17.1445 12.6104C17.1445 10.1299 19.1074 9.0166 19.2246 8.92871C17.9258 7.06348 15.9434 7.00488 15.3965 7.00488Z"
//                       fill="currentColor" />
//                   </svg>
//                 </div>
//                 App Store</span></a>
//             <a
//               href="https://play.google.com/store/apps/details?id=com.fitonist&pli=1"
//               target="_blank"
//               className="button-wrapper w-inline-block"
//             ><span className="dot-span dot dot-1"></span>
//               <span className="dot-span dot dot-2"></span>
//               <span className="dot-span dot dot-3"></span>
//               <span className="dot-span dot dot-4"></span>
//               <span className="dot-span dot dot-5"></span>
//               <span className="dot-span dot dot-6"></span>
//               <span className="dot-span dot dot-7"></span>
//               <span
//                 className="button buton bg-yellow-500 px-16 py-4 rounded-full"
//               ><div className="icon-app w-embed">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="100%"
//                     height="100%"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       clipRule="evenodd"
//                       d="M6 3.29877C6.70254 2.90598 7.5327 2.89682 8.23976 3.29305L17 8.19549L14.2339 11L6 3.29877ZM5 5.11054C5 4.70929 5.12092 4.33078 5.33193 4L14 11.667L5.3094 20C5.11025 19.676 5 19.3055 5 18.9167V5.11054ZM20.8208 10.3833L18.08 9L15 11.816L18.7746 15L20.822 13.9666C21.5588 13.5931 22 12.9234 22 12.1744C21.9988 11.4253 21.5588 10.7557 20.8208 10.3833ZM6 20.672L14.5204 12L18 15.2666L8.33671 20.6945C7.97392 20.8985 7.57751 21 7.18343 21C6.77543 21 6.36975 20.8867 6 20.672Z"
//                       fill="currentColor" />
//                   </svg>
//                 </div>
//                 Google Play</span></a>

//           </div>

//           <div className="free-tag">
//             <div className="body-b2-bold blue">Available for free</div>
//             <div className="hero-tag-line blue w-embed">
//               <svg
//                 width="100%"
//                 height="100%"
//                 viewBox="0 0 143 5"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M1.5 2.20914C9.21186 3.45854 28.7881 4.76242 55.1123 3.45854C98.9368 1.28785 108.873 -0.769308 141.5 3.45854"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round" />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//     <div className="menu-button w-nav-button">
//         <div className="menu-button-lines">
//           <div className="menu-line line-1"></div>
//           <div className="menu-line line-2"></div>
//         </div>
//       </div>
//       <div className="nav-buttons navbar-set">
//         <a
//           href="https://apps.apple.com/us/app/fitonist-ai-gym-workout-plan/id6443644593"
//           target="_blank"
//           className="button-wrapper white-button w-inline-block"
//         ><span className="dot-span dot dot-1 white-dot"></span>
//           <span className="dot-span dot dot-2 white-dot"></span>
//           <span className="dot-span dot dot-3 white-dot"></span>
//           <span className="dot-span dot dot-4 white-dot"></span>
//           <span className="dot-span dot dot-5 white-dot"></span>
//           <span className="dot-span dot dot-6 white-dot"></span>
//           <span className="dot-span dot dot-7 white-dot"></span>
//           <span
//             className="button radial buton bg-yellow-500 px-16 py-4 rounded-full"
//           ><div className="icon-app w-embed">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="100%"
//                 height="100%"
//                 viewBox="0 0 24 24"
//                 fill="none"
//               >
//                 <path
//                   d="M14.7129 5.42285C15.3086 4.7002 15.7285 3.71387 15.7285 2.71777C15.7285 2.58105 15.7188 2.44434 15.6992 2.33691C14.7227 2.37598 13.5508 2.98145 12.8574 3.80176C12.3008 4.42676 11.793 5.42285 11.793 6.41895C11.793 6.5752 11.8223 6.72168 11.832 6.77051C11.8906 6.78027 11.9883 6.7998 12.0957 6.7998C12.9648 6.7998 14.0586 6.21387 14.7129 5.42285ZM15.3965 7.00488C13.9414 7.00488 12.75 7.89355 11.9883 7.89355C11.1777 7.89355 10.123 7.06348 8.85352 7.06348C6.44141 7.06348 4 9.05566 4 12.8057C4 15.1494 4.89844 17.6201 6.02148 19.2119C6.97852 20.5596 7.81836 21.6631 9.0293 21.6631C10.2207 21.6631 10.748 20.8721 12.2324 20.8721C13.7363 20.8721 14.0781 21.6436 15.3965 21.6436C16.7051 21.6436 17.5742 20.4424 18.4043 19.2607C19.3223 17.9033 19.7129 16.585 19.7227 16.5166C19.6445 16.4971 17.1445 15.4717 17.1445 12.6104C17.1445 10.1299 19.1074 9.0166 19.2246 8.92871C17.9258 7.06348 15.9434 7.00488 15.3965 7.00488Z"
//                   fill="currentColor" />
//               </svg></div></span></a>
//         <a
//           href="https://play.google.com/store/apps/details?id=com.fitonist&pli=1"
//           target="_blank"
//           className="button-wrapper white-button w-inline-block"
//         ><span className="dot-span dot dot-1 white-dot"></span>
//           <span className="dot-span dot dot-2 white-dot"></span>
//           <span className="dot-span dot dot-3 white-dot"></span>
//           <span className="dot-span dot dot-4 white-dot"></span>
//           <span className="dot-span dot dot-5 white-dot"></span>
//           <span className="dot-span dot dot-6 white-dot"></span>
//           <span className="dot-span dot dot-7 white-dot"></span>
//           <span
//             className="button radial buton bg-yellow-500 px-16 py-4 rounded-full"
//           ><div className="icon-app w-embed">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="100%"
//                 height="100%"
//                 viewBox="0 0 24 24"
//                 fill="none"
//               >
//                 <path
//                   fillRule="evenodd"
//                   clipRule="evenodd"
//                   d="M6 3.29877C6.70254 2.90598 7.5327 2.89682 8.23976 3.29305L17 8.19549L14.2339 11L6 3.29877ZM5 5.11054C5 4.70929 5.12092 4.33078 5.33193 4L14 11.667L5.3094 20C5.11025 19.676 5 19.3055 5 18.9167V5.11054ZM20.8208 10.3833L18.08 9L15 11.816L18.7746 15L20.822 13.9666C21.5588 13.5931 22 12.9234 22 12.1744C21.9988 11.4253 21.5588 10.7557 20.8208 10.3833ZM6 20.672L14.5204 12L18 15.2666L8.33671 20.6945C7.97392 20.8985 7.57751 21 7.18343 21C6.77543 21 6.36975 20.8867 6 20.672Z"
//                   fill="currentColor" />
//               </svg></div></span></a>
//         <div className="download-buttons">
//           <a
//             href="https://heyjinie.vercel.app/"
//             target="_blank"
//             className="button-wrapper w-inline-block">
//             <span className="dot-span dot dot-1"></span>
//             <span className="dot-span dot dot-2"></span>
//             <span className="dot-span dot dot-3"></span>
//             <span className="dot-span dot dot-4"></span>
//             <span className="dot-span dot dot-5"></span>
//             <span className="dot-span dot dot-6"></span>
//             <span className="dot-span dot dot-7"></span>
//             <span className="button app-store buton bg-yellow-500 px-16 py-4 rounded-full">
//               <div className="icon-app w-embed">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="100%"
//                   height="100%"
//                   viewBox="0 0 20 20"
//                   fill="none"
//                 >
//                   <path
//                     d="M16.6663 10.0001V15.0001C16.6663 16.8417 15.1747 18.3334 13.333 18.3334H6.66634C4.82467 18.3334 3.33301 16.8417 3.33301 15.0001V10.0001C3.33301 9.54175 3.70801 9.16675 4.16634 9.16675H5.80801C6.26634 9.16675 6.64134 9.54175 6.64134 10.0001V12.6167C6.64134 13.2334 6.98301 13.8001 7.52467 14.0917C7.76634 14.2251 8.03301 14.2917 8.30801 14.2917C8.62467 14.2917 8.94134 14.2001 9.21634 14.0167L10.008 13.5001L10.7413 13.9917C11.2497 14.3334 11.8997 14.3751 12.4413 14.0834C12.9913 13.7917 13.333 13.2334 13.333 12.6084V10.0001C13.333 9.54175 13.708 9.16675 14.1663 9.16675H15.833C16.2913 9.16675 16.6663 9.54175 16.6663 10.0001Z"
//                     fill="#434343" />
//                   <path
//                     d="M17.9163 5.83341V6.66675C17.9163 7.58341 17.4747 8.33341 16.2497 8.33341H3.74967C2.47467 8.33341 2.08301 7.58341 2.08301 6.66675V5.83341C2.08301 4.91675 2.47467 4.16675 3.74967 4.16675H16.2497C17.4747 4.16675 17.9163 4.91675 17.9163 5.83341Z"
//                     fill="#434343" />
//                   <path
//                     d="M9.69998 4.16662H5.09998C4.81665 3.85828 4.82498 3.38328 5.12498 3.08328L6.30832 1.89995C6.61665 1.59162 7.12498 1.59162 7.43332 1.89995L9.69998 4.16662Z"
//                     fill="#434343" />
//                   <path
//                     d="M14.8915 4.16662H10.2915L12.5582 1.89995C12.8665 1.59162 13.3748 1.59162 13.6832 1.89995L14.8665 3.08328C15.1665 3.38328 15.1748 3.85828 14.8915 4.16662Z"
//                     fill="#434343" />
//                   <path
//                     d="M11.6414 9.16675C12.0997 9.16675 12.4747 9.54175 12.4747 10.0001V12.6084C12.4747 13.2751 11.733 13.6751 11.183 13.3001L10.433 12.8001C10.158 12.6167 9.79971 12.6167 9.51637 12.8001L8.73304 13.3167C8.18304 13.6834 7.44971 13.2834 7.44971 12.6251V10.0001C7.44971 9.54175 7.82471 9.16675 8.28304 9.16675H11.6414Z"
//                     fill="#434343" />
//                 </svg>
//               </div>
//               <span style={{ fontStyle: 'normal' }}>Start Gifting</span></span>
//           </a>
//         </div>
//       </div>
//           {/* Header Down */}
//           <header
//             data-w-id="b32d4afb-1ba7-572e-01ab-ab75fd6e172e"
//             className="header down"
//           >
//             <div
//               data-w-id="b32d4afb-1ba7-572e-01ab-ab75fd6e172f"
//               data-animation="default"
//               data-collapse="tiny"
//               data-duration="2000"
//               data-easing="ease-out-expo"
//               data-easing2="ease-out-expo"
//               role="banner"
//               className="navbar down w-nav"
//             >
//               <div className="open-sticker-wrapper">
//                 <div
//                   data-w-id="295811e4-e926-3268-dc1a-251440935b01"
//                   className="open-sticker"
//                 ></div>
//               </div>
//               <address className="nav-container down"> {/* Using address as in original */}
//                 <div
//                   data-w-id="b32d4afb-1ba7-572e-01ab-ab75fd6e1731"
//                   className="logo down"
//                 >
//                   <div className="logo-svg w-embed">
//                   <svg width="181" height="55" viewBox="0 0 181 55" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
//                     <rect width="181" height="55" fill="url(#pattern0_160_3459_header_down_normal)"/>
//                     <defs>
//                     <pattern id="pattern0_160_3459_header_down_normal" patternContentUnits="objectBoundingBox" width="1" height="1">
//                     <use xlinkHref="#image0_160_3459_logo" transform="matrix(0.000478779 0 0 0.00157562 -0.348066 -1.865)"/>
//                     </pattern>
//                     {/* image0_160_3459_logo is defined in the first header */}
//                     </defs>
//                     </svg>
//                   </div>
//                   <div
//                     data-w-id="b32d4afb-1ba7-572e-01ab-ab75fd6e1733"
//                     className="logo-svg hover w-embed"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="100%"
//                       height="100%"
//                       viewBox="0 0 100 28"
//                       fill="none"
//                     >
//                       <path
//                         d="M14.1139 9.71678V27.1182H10.5402V13.1037H3.57372V27.1182H0V7.73138C0 5.22043 0.642335 3.28759 1.91533 1.99124C3.21168 0.671535 5.02774 0 7.31679 0C10.1139 0 12.2686 0.969339 13.7168 2.87883L13.8861 3.10657L11.2642 5.23211L11.0832 4.98685C10.2832 3.9124 9.21461 3.38685 7.80147 3.38685C4.95767 3.38685 3.57372 4.91679 3.57372 8.06423V9.71678H14.1139Z"
//                         fill="url(#paint0_radial_3546_14390_header_down_hover)"
//                       />
//                       <path
//                         d="M27.3752 25.8041L27.2059 25.9384C25.9855 26.9252 24.4789 27.4216 22.7271 27.4216C20.8176 27.4216 19.3986 26.8318 18.4935 25.6639C17.6117 24.5194 17.1621 22.7617 17.1621 20.4435V5.05078H20.7358V9.72231H26.9023V13.1092H20.7358V20.1398C20.7358 22.7617 21.6176 24.0347 23.4336 24.0347C24.3387 24.0347 25.1679 23.7427 25.9095 23.1646L26.2132 22.9252L27.3752 25.8041Z"
//                         fill="url(#paint1_radial_3546_14390_header_down_hover)"
//                       />
//                       <path
//                         d="M43.5854 11.9355C41.892 10.2128 39.6438 9.34277 36.911 9.34277C34.1781 9.34277 31.9183 10.2128 30.2015 11.9355C28.508 13.6231 27.6497 15.807 27.6497 18.4172C27.6497 20.9982 28.508 23.1939 30.2015 24.934L30.2073 24.9457C31.9475 26.6333 34.2015 27.4917 36.911 27.4917C39.6438 27.4917 41.892 26.6333 43.5854 24.9398C45.3022 23.2231 46.1723 21.0274 46.1723 18.4172C46.1723 15.807 45.3022 13.6231 43.5854 11.9355ZM40.8526 22.5515C39.8424 23.5851 38.5168 24.1106 36.911 24.1106C35.3051 24.1106 33.9679 23.5734 32.9343 22.5165C31.9241 21.4829 31.4102 20.1048 31.4102 18.4231C31.4102 16.7413 31.9358 15.369 32.9694 14.3296H32.9752C33.9854 13.2727 35.311 12.7355 36.911 12.7355C38.5168 12.7355 39.8365 13.2727 40.8467 14.3296C41.8862 15.4099 42.4117 16.788 42.4117 18.4231C42.4117 20.1048 41.8862 21.4946 40.8526 22.5515Z"
//                         fill="url(#paint2_radial_3546_14390_header_down_hover)"
//                       />
//                       <path
//                         d="M71.4802 3.69014C71.4802 4.33832 71.2817 4.88722 70.8788 5.3135C70.47 5.72226 69.962 5.92663 69.3605 5.92663C68.7357 5.92663 68.2043 5.72809 67.778 5.32517C67.3401 4.89306 67.124 4.34416 67.124 3.69014C67.124 3.08285 67.3459 2.58064 67.7839 2.20108C68.2043 1.80984 68.7357 1.60547 69.3605 1.60547C69.962 1.60547 70.47 1.80984 70.8729 2.2186C71.2758 2.59232 71.4802 3.09452 71.4802 3.69014Z"
//                         fill="url(#paint3_radial_3546_14390_header_down_hover)"
//                       />
//                       <path
//                         d="M71.0715 9.7168H67.4978V27.1183H71.0715V9.7168Z"
//                         fill="url(#paint4_radial_3546_14390_header_down_hover)"
//                       />
//                       <path
//                         d="M87.6731 22.1194C87.6731 23.8829 87.0015 25.2435 85.6818 26.1661C84.4147 27.0479 82.7972 27.4917 80.876 27.4917C79.5213 27.4917 78.2132 27.2055 76.9811 26.645C75.6965 26.0377 74.8614 25.4187 74.4293 24.7413L74.3184 24.5661L76.3446 21.9968L76.5782 22.2596C77.0454 22.8026 77.7402 23.2756 78.6454 23.6844C80.6074 24.5194 82.2191 24.4435 83.1709 23.7486C83.6672 23.3807 83.9125 22.8961 83.9125 22.2654C83.9125 21.7691 83.6497 21.3603 83.1125 21.0158C82.5169 20.6362 81.7811 20.3209 80.911 20.0814C80.0293 19.807 79.13 19.4858 78.2308 19.1355C77.2906 18.7734 76.4848 18.1895 75.8307 17.407C75.1651 16.5836 74.8322 15.5676 74.8322 14.3822C74.8322 12.8756 75.3928 11.6435 76.5081 10.7209C77.6001 9.80408 79.06 9.34277 80.841 9.34277C83.3753 9.34277 85.3899 10.0377 86.8322 11.4041L87.0074 11.5676L85.279 14.3413L85.022 14.1136C83.8366 13.0741 82.4819 12.5428 80.9928 12.5428C80.2629 12.5428 79.6731 12.7238 79.2293 13.08C78.803 13.4187 78.5928 13.8333 78.5928 14.3413C78.5928 14.8961 78.8556 15.3398 79.3987 15.7077C79.9884 16.0873 80.7183 16.4143 81.5651 16.6829C82.4527 16.9282 83.3694 17.2318 84.2746 17.5822C85.2089 17.9209 86.0147 18.4815 86.6687 19.2347C87.3344 20.0172 87.6731 20.9866 87.6731 22.1194Z"
//                         fill="url(#paint5_radial_3546_14390_header_down_hover)"
//                       />
//                       <path
//                         d="M100 25.8041L99.8365 25.9384C98.6161 26.9252 97.1095 27.4216 95.3519 27.4216C93.4482 27.4216 92.0234 26.8318 91.1241 25.6639C90.2423 24.5194 89.7927 22.7617 89.7927 20.4435V5.05078H93.3664V9.72231H99.5329V13.1092H93.3664V20.1398C93.3664 22.7617 94.2482 24.0347 96.0643 24.0347C96.9635 24.0347 97.7986 23.7427 98.5343 23.1646L98.8438 22.9252L100 25.8041Z"
//                         fill="url(#paint6_radial_3546_14390_header_down_hover)"
//                       />
//                       <path
//                         d="M64.0877 17.1156V27.1244H60.514V17.6762C60.514 14.5638 59.2001 12.9696 56.4906 12.8236C53.7811 12.9696 52.4673 14.5638 52.4673 17.6762V27.1244H48.8936V17.1156C48.8936 14.0032 49.8045 11.8251 51.6089 10.6047C52.7592 9.82218 54.5812 9.2207 56.4906 9.2207C58.4001 9.2207 60.222 9.82218 61.3724 10.6047C63.1768 11.8251 64.0877 14.0032 64.0877 17.1156Z"
//                         fill="url(#paint7_radial_3546_14390_header_down_hover)"
//                       />
//                       <defs>
//                         <radialGradient
//                           id="paint0_radial_3546_14390_header_down_hover"
//                           cx="0"
//                           cy="0"
//                           r="1"
//                           gradientUnits="userSpaceOnUse"
//                           gradientTransform="translate(72.8334 27.4917) rotate(-160.644) scale(82.9454 55.0158)"
//                         >
//                           <stop stopColor="#FFB8E0" />
//                           <stop offset="0.38895" stopColor="#BE9EFF" />
//                           <stop offset="0.673962" stopColor="#88C0FC" />
//                           <stop offset="1" stopColor="#86FF99" />
//                         </radialGradient>
//                         <radialGradient
//                           id="paint1_radial_3546_14390_header_down_hover"
//                           cx="0"
//                           cy="0"
//                           r="1"
//                           gradientUnits="userSpaceOnUse"
//                           gradientTransform="translate(72.8334 27.4917) rotate(-160.644) scale(82.9454 55.0158)"
//                         >
//                           <stop stopColor="#FFB8E0" />
//                           <stop offset="0.38895" stopColor="#BE9EFF" />
//                           <stop offset="0.673962" stopColor="#88C0FC" />
//                           <stop offset="1" stopColor="#86FF99" />
//                         </radialGradient>
//                         <radialGradient
//                           id="paint2_radial_3546_14390_header_down_hover"
//                           cx="0"
//                           cy="0"
//                           r="1"
//                           gradientUnits="userSpaceOnUse"
//                           gradientTransform="translate(72.8334 27.4917) rotate(-160.644) scale(82.9454 55.0158)"
//                         >
//                           <stop stopColor="#FFB8E0" />
//                           <stop offset="0.38895" stopColor="#BE9EFF" />
//                           <stop offset="0.673962" stopColor="#88C0FC" />
//                           <stop offset="1" stopColor="#86FF99" />
//                         </radialGradient>
//                         <radialGradient
//                           id="paint3_radial_3546_14390_header_down_hover"
//                           cx="0"
//                           cy="0"
//                           r="1"
//                           gradientUnits="userSpaceOnUse"
//                           gradientTransform="translate(72.8334 27.4917) rotate(-160.644) scale(82.9454 55.0158)"
//                         >
//                           <stop stopColor="#FFB8E0" />
//                           <stop offset="0.38895" stopColor="#BE9EFF" />
//                           <stop offset="0.673962" stopColor="#88C0FC" />
//                           <stop offset="1" stopColor="#86FF99" />
//                         </radialGradient>
//                         <radialGradient
//                           id="paint4_radial_3546_14390_header_down_hover"
//                           cx="0"
//                           cy="0"
//                           r="1"
//                           gradientUnits="userSpaceOnUse"
//                           gradientTransform="translate(72.8334 27.4917) rotate(-160.644) scale(82.9454 55.0158)"
//                         >
//                           <stop stopColor="#FFB8E0" />
//                           <stop offset="0.38895" stopColor="#BE9EFF" />
//                           <stop offset="0.673962" stopColor="#88C0FC" />
//                           <stop offset="1" stopColor="#86FF99" />
//                         </radialGradient>
//                         <radialGradient
//                           id="paint5_radial_3546_14390_header_down_hover"
//                           cx="0"
//                           cy="0"
//                           r="1"
//                           gradientUnits="userSpaceOnUse"
//                           gradientTransform="translate(72.8334 27.4917) rotate(-160.644) scale(82.9454 55.0158)"
//                         >
//                           <stop stopColor="#FFB8E0" />
//                           <stop offset="0.38895" stopColor="#BE9EFF" />
//                           <stop offset="0.673962" stopColor="#88C0FC" />
//                           <stop offset="1" stopColor="#86FF99" />
//                         </radialGradient>
//                         <radialGradient
//                           id="paint6_radial_3546_14390_header_down_hover"
//                           cx="0"
//                           cy="0"
//                           r="1"
//                           gradientUnits="userSpaceOnUse"
//                           gradientTransform="translate(72.8334 27.4917) rotate(-160.644) scale(82.9454 55.0158)"
//                         >
//                           <stop stopColor="#FFB8E0" />
//                           <stop offset="0.38895" stopColor="#BE9EFF" />
//                           <stop offset="0.673962" stopColor="#88C0FC" />
//                           <stop offset="1" stopColor="#86FF99" />
//                         </radialGradient>
//                         <radialGradient
//                           id="paint7_radial_3546_14390_header_down_hover"
//                           cx="0"
//                           cy="0"
//                           r="1"
//                           gradientUnits="userSpaceOnUse"
//                           gradientTransform="translate(72.8334 27.4917) rotate(-160.644) scale(82.9454 55.0158)"
//                         >
//                           <stop stopColor="#FFB8E0" />
//                           <stop offset="0.38895" stopColor="#BE9EFF" />
//                           <stop offset="0.673962" stopColor="#88C0FC" />
//                           <stop offset="1" stopColor="#86FF99" />
//                         </radialGradient>
//                       </defs>
//                     </svg>
//                   </div>
//                 </div>
//                 <nav
//                   role="navigation"
//                   data-lenis-prevent=""
//                   className="nav-menu-wrapper w-nav-menu"
//                 >
//                   <div className="nav-menu">
//                     <div className="nav-link-wrapper">
//                       <a href="#marketplace" className="nav-link w-nav-link">Marketplace</a>
//                       <a href="#" className="nav-link hover w-nav-link">Marketplace</a>
//                       <div className="hover-line-wrapper">
//                         <div className="hover-line-svg set-1 w-embed">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="100%"
//                             height="100%"
//                             viewBox="0 0 104 5"
//                             fill="none"
//                           >
//                             <path
//                               d="M1 2.40328C6.61864 2.81974 21 4.5 40.0604 2.81974C71.8745 0.015184 79.2288 1.41048 103 2.81974"
//                               stroke="#88C0FC"
//                               strokeLinecap="round"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="nav-space"></div>
//                     <div className="nav-link-wrapper">
//                       <a href="#pricing" className="nav-link w-nav-link">Pricing</a>
//                       <a href="#" className="nav-link hover w-nav-link">Pricing</a>
//                       <div className="hover-line-wrapper">
//                         <div className="hover-line-svg set-2 w-embed">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="100%"
//                             height="100%"
//                             viewBox="0 0 50 3"
//                             fill="none"
//                           >
//                             <path
//                               d="M1 1.40305C3.64407 1.81951 10.3559 2.25414 19.3814 1.81951C34.4069 1.09595 37.8136 0.410231 49 1.81951"
//                               stroke="#88C0FC"
//                               strokeLinecap="round"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="nav-space"></div>
//                     <div className="nav-link-wrapper hidden">
//                       <a href="#" className="nav-link w-nav-link">Blog</a>
//                       <a href="#" className="nav-link hover w-nav-link">Blog</a>
//                       <div className="hover-line-wrapper">
//                         <div className="hover-line-svg set-3 w-embed">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="100%"
//                             height="100%"
//                             viewBox="0 0 32 3"
//                             fill="none"
//                           >
//                             <path
//                               d="M1 1.40305C2.65254 1.81951 6.84746 2.25414 12.4883 1.81951C21.8793 1.09595 24.0085 0.410231 31 1.81951"
//                               stroke="#88C0FC"
//                               strokeLinecap="round"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="nav-link-wrapper">
//                       <a
//                         data-close-contact
//                         data-stop-scroll
//                         data-w-id="b32d4afb-1ba7-572e-01ab-ab75fd6e174e"
//                         href="#"
//                         className="nav-link w-nav-link"
//                       >Contact us</a>
//                       <a href="#" className="nav-link hover w-nav-link">Contact us</a>
//                       <div className="hover-line-wrapper">
//                         <div className="hover-line-svg set-4 w-embed">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="100%"
//                             height="100%"
//                             viewBox="0 0 83 3"
//                             fill="none"
//                           >
//                             <path
//                               d="M1 1.40305C5.46186 1.81951 16.7881 2.25414 32.0185 1.81951C57.3741 1.09595 63.1229 0.410231 82 1.81951"
//                               stroke="#88C0FC"
//                               strokeLinecap="round"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="menu-buttons">
//                       <div className="download-buttons">
//                         <a
//                           href="https://apps.apple.com/us/app/fitonist-ai-gym-workout-plan/id6443644593"
//                           target="_blank"
//                           className="button-wrapper w-inline-block"
//                         ><span className="dot-span dot dot-1"></span>
//                         <span className="dot-span dot dot-2"></span>
//                         <span className="dot-span dot dot-3"></span>
//                         <span className="dot-span dot dot-4"></span>
//                         <span className="dot-span dot dot-5"></span>
//                         <span className="dot-span dot dot-6"></span>
//                         <span className="dot-span dot dot-7"></span>
//                         <span
//                             className="button app-store buton bg-yellow-500 px-16 py-4 rounded-full"
//                           ><div className="icon-app w-embed">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="100%"
//                                 height="100%"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                               >
//                                 <path
//                                   d="M14.7129 5.42285C15.3086 4.7002 15.7285 3.71387 15.7285 2.71777C15.7285 2.58105 15.7188 2.44434 15.6992 2.33691C14.7227 2.37598 13.5508 2.98145 12.8574 3.80176C12.3008 4.42676 11.793 5.42285 11.793 6.41895C11.793 6.5752 11.8223 6.72168 11.832 6.77051C11.8906 6.78027 11.9883 6.7998 12.0957 6.7998C12.9648 6.7998 14.0586 6.21387 14.7129 5.42285ZM15.3965 7.00488C13.9414 7.00488 12.75 7.89355 11.9883 7.89355C11.1777 7.89355 10.123 7.06348 8.85352 7.06348C6.44141 7.06348 4 9.05566 4 12.8057C4 15.1494 4.89844 17.6201 6.02148 19.2119C6.97852 20.5596 7.81836 21.6631 9.0293 21.6631C10.2207 21.6631 10.748 20.8721 12.2324 20.8721C13.7363 20.8721 14.0781 21.6436 15.3965 21.6436C16.7051 21.6436 17.5742 20.4424 18.4043 19.2607C19.3223 17.9033 19.7129 16.585 19.7227 16.5166C19.6445 16.4971 17.1445 15.4717 17.1445 12.6104C17.1445 10.1299 19.1074 9.0166 19.2246 8.92871C17.9258 7.06348 15.9434 7.00488 15.3965 7.00488Z"
//                                   fill="currentColor"
//                                 />
//                               </svg>
//                             </div>
//                             App Store</span></a>
//                         <a
//                           href="https://play.google.com/store/apps/details?id=com.fitonist&pli=1"
//                           target="_blank"
//                           className="button-wrapper w-inline-block"
//                         ><span className="dot-span dot dot-1"></span>
//                         <span className="dot-span dot dot-2"></span>
//                         <span className="dot-span dot dot-3"></span>
//                         <span className="dot-span dot dot-4"></span>
//                         <span className="dot-span dot dot-5"></span>
//                         <span className="dot-span dot dot-6"></span>
//                         <span className="dot-span dot dot-7"></span>
//                         <span
//                             className="button buton bg-yellow-500 px-16 py-4 rounded-full"
//                           ><div className="icon-app w-embed">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="100%"
//                                 height="100%"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                               >
//                                 <path
//                                   fillRule="evenodd"
//                                   clipRule="evenodd"
//                                   d="M6 3.29877C6.70254 2.90598 7.5327 2.89682 8.23976 3.29305L17 8.19549L14.2339 11L6 3.29877ZM5 5.11054C5 4.70929 5.12092 4.33078 5.33193 4L14 11.667L5.3094 20C5.11025 19.676 5 19.3055 5 18.9167V5.11054ZM20.8208 10.3833L18.08 9L15 11.816L18.7746 15L20.822 13.9666C21.5588 13.5931 22 12.9234 22 12.1744C21.9988 11.4253 21.5588 10.7557 20.8208 10.3833ZM6 20.672L14.5204 12L18 15.2666L8.33671 20.6945C7.97392 20.8985 7.57751 21 7.18343 21C6.77543 21 6.36975 20.8867 6 20.672Z"
//                                   fill="currentColor"
//                                 />
//                               </svg>
//                             </div>
//                             Google Play</span></a>
//                       </div>
//                       <div className="free-tag">
//                         <div className="body-b2-bold blue">Available for free</div>
//                         <div className="hero-tag-line blue w-embed">
//                           <svg
//                             width="100%"
//                             height="100%"
//                             viewBox="0 0 143 5"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <path
//                               d="M1.5 2.20914C9.21186 3.45854 28.7881 4.76242 55.1123 3.45854C98.9368 1.28785 108.873 -0.769308 141.5 3.45854"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                               strokeLinecap="round"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="menu-gradient"></div>
//                 </nav>
//                 <div className="menu-button w-nav-button">
//                   <div className="menu-button-lines">
//                     <div className="menu-line line-1"></div>
//                     <div className="menu-line line-2"></div>
//                   </div>
//                 </div>
//                 <div className="nav-buttons navbar-set">
//                   <a
//                     href="https://apps.apple.com/us/app/fitonist-ai-gym-workout-plan/id6443644593"
//                     target="_blank"
//                     className="button-wrapper white-button w-inline-block"
//                   ><span className="dot-span dot dot-1 white-dot"></span>
//                   <span className="dot-span dot dot-2 white-dot"></span>
//                   <span className="dot-span dot dot-3 white-dot"></span>
//                   <span className="dot-span dot dot-4 white-dot"></span>
//                   <span className="dot-span dot dot-5 white-dot"></span>
//                   <span className="dot-span dot dot-6 white-dot"></span>
//                   <span className="dot-span dot dot-7 white-dot"></span>
//                   <span
//                       className="button radial buton bg-yellow-500 px-16 py-4 rounded-full"
//                     ><div className="icon-app w-embed">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="100%"
//                           height="100%"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                         >
//                           <path
//                             d="M14.7129 5.42285C15.3086 4.7002 15.7285 3.71387 15.7285 2.71777C15.7285 2.58105 15.7188 2.44434 15.6992 2.33691C14.7227 2.37598 13.5508 2.98145 12.8574 3.80176C12.3008 4.42676 11.793 5.42285 11.793 6.41895C11.793 6.5752 11.8223 6.72168 11.832 6.77051C11.8906 6.78027 11.9883 6.7998 12.0957 6.7998C12.9648 6.7998 14.0586 6.21387 14.7129 5.42285ZM15.3965 7.00488C13.9414 7.00488 12.75 7.89355 11.9883 7.89355C11.1777 7.89355 10.123 7.06348 8.85352 7.06348C6.44141 7.06348 4 9.05566 4 12.8057C4 15.1494 4.89844 17.6201 6.02148 19.2119C6.97852 20.5596 7.81836 21.6631 9.0293 21.6631C10.2207 21.6631 10.748 20.8721 12.2324 20.8721C13.7363 20.8721 14.0781 21.6436 15.3965 21.6436C16.7051 21.6436 17.5742 20.4424 18.4043 19.2607C19.3223 17.9033 19.7129 16.585 19.7227 16.5166C19.6445 16.4971 17.1445 15.4717 17.1445 12.6104C17.1445 10.1299 19.1074 9.0166 19.2246 8.92871C17.9258 7.06348 15.9434 7.00488 15.3965 7.00488Z"
//                             fill="currentColor"
//                           />
//                         </svg></div></span></a>
//                   <a
//                     href="https://play.google.com/store/apps/details?id=com.fitonist&amp;pli=1"
//                     target="_blank"
//                     className="button-wrapper white-button w-inline-block"
//                   ><span className="dot-span dot dot-1 white-dot"></span>
//                   <span className="dot-span dot dot-2 white-dot"></span>
//                   <span className="dot-span dot dot-3 white-dot"></span>
//                   <span className="dot-span dot dot-4 white-dot"></span>
//                   <span className="dot-span dot dot-5 white-dot"></span>
//                   <span className="dot-span dot dot-6 white-dot"></span>
//                   <span className="dot-span dot dot-7 white-dot"></span>
//                   <span
//                       className="button radial buton bg-yellow-500 px-16 py-4 rounded-full"
//                     ><div className="icon-app w-embed">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="100%"
//                           height="100%"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             clipRule="evenodd"
//                             d="M6 3.29877C6.70254 2.90598 7.5327 2.89682 8.23976 3.29305L17 8.19549L14.2339 11L6 3.29877ZM5 5.11054C5 4.70929 5.12092 4.33078 5.33193 4L14 11.667L5.3094 20C5.11025 19.676 5 19.3055 5 18.9167V5.11054ZM20.8208 10.3833L18.08 9L15 11.816L18.7746 15L20.822 13.9666C21.5588 13.5931 22 12.9234 22 12.1744C21.9988 11.4253 21.5588 10.7557 20.8208 10.3833ZM6 20.672L14.5204 12L18 15.2666L8.33671 20.6945C7.97392 20.8985 7.57751 21 7.18343 21C6.77543 21 6.36975 20.8867 6 20.672Z"
//                             fill="currentColor"
//                           />
//                         </svg></div></span></a>
//                 </div>
//               </address>
//             </div>
//           </header>
//           <div
//             id="hero"
//             data-scroll-time="0"
//             style={{
//               transform: 'translate3d(null, 0vh, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//             }}
//             className="sections"
//           >
//             <section id="hero-3" data-scroll-time="0.3" className="hero-sc">
//               <div
//                 data-w-id="83f81923-1b75-c8dc-d4eb-6d2d733b9ce9"
//                 className="hero-height"
//               >
//                 <div className="hero-sticky">
//                   <div className="container hero-s">
//                     <div className="hero-background-wrapper">
//                       <div data-set-size className="hero-mobiles-frame"> {/* Renamed from set-size="" */}
//                         <div
//                           data-w-id="0d266ba2-097f-e8bc-8721-e41ab0acc793"
//                           style={{
//                             transform: 'translate3d(0, 60vh, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                           }}
//                           className="lotties-frame"
//                         >
//                           <div className="div-block-6">
//                             <img
//                               src="../images/phone_035.png"
//                               loading="lazy"
//                               sizes="(max-width: 479px) 100vw, 24vw"
//                               srcSet="
//                                 ../images/phone_035.png 500w,
//                                 ../images/phone_035.png 720w
//                               "
//                               alt=""
//                               className="image-contain index"
//                             />
//                             <div className="ellipses-frame">
//                               <div
//                                 data-is-ix2-target="1"
//                                 className="lottie-animation-2"
//                                 data-w-id="8baac767-853b-391c-0c9f-bdcf2c265242"
//                                 data-animation-type="lottie"
//                                 data-src="/json/waves-v3.json"
//                                 data-loop="0"
//                                 data-direction="1"
//                                 data-autoplay="0"
//                                 data-renderer="svg"
//                                 data-duration="0"
//                               ></div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="load-block">
//                           <div className="hero-image-frame blue bluetwo">
//                             <img
//                               src="../images/Blue.png"
//                               loading="lazy"
//                               style={{
//                                 transform: 'translate3d(0, 150vh, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                               }}
//                               sizes="(max-width: 479px) 100vw, 22vw"
//                               alt=""
//                               srcSet="
//                                 ../images/Blue.png 500w,
//                                 ../images/Blue.png      532w
//                               "
//                               className="image-contain hero"
//                             />
//                           </div>
//                         </div>
//                         <div className="load-block">
//                           <div className="hero-image-frame blue">
//                             <img
//                               src="../images/Headphones.png"
//                               loading="lazy"
//                               style={{
//                                 transform: 'translate3d(0, 150vh, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                               }}
//                               sizes="(max-width: 479px) 100vw, 22vw"
//                               alt=""
//                               srcSet="
//                                 ../images/Headphones.png 500w,
//                                 ../images/Headphones.png      532w
//                               "
//                               className="image-contain hero"
//                             />
//                           </div>
//                         </div>
//                         <div className="load-block">
//                           <div className="hero-image-frame watch">
//                             <img
//                               src="../images/Chocolates.png"
//                               loading="lazy"
//                               style={{
//                                 transform: 'translate3d(0, 150vh, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                               }}
//                               sizes="(max-width: 479px) 100vw, 19vw"
//                               alt=""
//                               srcSet="
//                                 ../images/Chocolates.png 500w,
//                                 ../images/Chocolates.png       516w
//                               "
//                               className="image-contain hero"
//                             />
//                           </div>
//                         </div>
//                         <div className="load-block">
//                           <div className="hero-image-frame green">
//                             <img
//                               src="../images/Green.png"
//                               loading="lazy"
//                               style={{
//                                 transform: 'translate3d(0, 150vh, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                               }}
//                               sizes="(max-width: 479px) 100vw, 22vw"
//                               alt=""
//                               srcSet="
//                                 ../images/Green.png 500w,
//                                 ../images/Green.png       678w
//                               "
//                               className="image-contain hero"
//                             />
//                           </div>
//                         </div>
//                         <div className="load-block">
//                           <div className="hero-image-frame pink">
//                             <img
//                               src="../images/Cupcake.png"
//                               loading="lazy"
//                               style={{
//                                 transform: 'translate3d(0, 150vh, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                               }}
//                               sizes="(max-width: 479px) 100vw, 22vw"
//                               alt=""
//                               srcSet="
//                                 ../images/Cupcake.png 500w,
//                                 ../images/Cupcake.png       678w
//                               "
//                               className="image-contain hero"
//                             />
//                           </div>
//                         </div>
//                         <div className="load-block">
//                           <div className="hero-image-frame stats">
//                             <img
//                               src="../images/Sambas.png"
//                               loading="lazy"
//                               style={{
//                                 transform: 'translate3d(0, 150vh, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                               }}
//                               alt=""
//                               className="image-contain hero"
//                             />
//                           </div>
//                         </div>
//                         <div className="load-block">
//                           <div className="hero-image-frame stats">
//                             <img
//                               src="../images/Sambas.png"
//                               loading="lazy"
//                               style={{
//                                 transform: 'translate3d(0, 150vh, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                               }}
//                               alt=""
//                               className="image-contain hero"
//                             />
//                           </div>
//                         </div>
//                         <div
//                           data-w-id="7d98cfe2-d593-e33a-1a6b-4612262cc9ec"
//                           style={{ display: 'none' }}
//                           className="mobiles-header-position"
//                         >
//                           <div className="mobiles-header">
//                             <div className="at-mobileiconcolors">
//                               <div className="mobiles-icon">
//                                 <span>
//                                   <img src="../images/001.png" alt="icon" />
//                                 </span>
//                               </div>
//                               <div className="mobiles-icon">
//                                 <span>
//                                   <img src="../images/002.png" alt="icon" />
//                                 </span>
//                               </div>
//                               <div className="mobiles-icon">
//                                 <span>
//                                   <img src="../images/003.png" alt="icon" />
//                                 </span>
//                               </div>
//                             </div>
//                             <div className="text-block mobiles-s">
//                               <h1
//                                 data-w-id="d02a23e5-7a0a-ef8d-d454-ce45c63f9cd0"
//                                 className="heading-5 black"
//                               >
//                                 Heyjinie Stickers = Real Surprises
//                               </h1>
//                             </div>
//                             <div
//                               data-w-id="252731c4-ead5-c060-902b-2f34848445c7"
//                               className="body-b2 black hero-s"
//                               style={{textAlign: 'center'}}
//                             >
//                               These are not just cute stickers.<br/>
//                               They come with real products you or your friends can tap and claim instantly — whether you&apos;re sharing a moment or treating yourself.
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div
//                         data-w-id="ec5e3b76-083e-51ce-6c1b-3b204fa6cb37"
//                         style={{ display: 'none' }}
//                         className="hero-top-block"
//                       >
//                         <div className="text-block hero-s">
//                           <h2
//                             data-w-id="2dd29685-6e5b-9788-94cb-31867e0dac0f"
//                             style={{
//                               textAlign: 'center',
//                               opacity: 0,
//                               transform: 'translate3d(0, 10rem, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                             }}
//                             className="heading-3"
//                           >
//                             Effortless Gifting,<br />Endless Possibilities...
//                           </h2>
//                           <p data-w-id="2dd29685-6e5b-9788-94cb-31867e0dac0f"
//                             className="body-b2 gray-3"
//                           >With Heyjinie, you can send real, fun gifts from your chat — anytime, anywhere.</p>
//                         </div>
//                         <div
//                           data-w-id="77a7cfba-bf1e-d301-bca9-d53c83f21e07"
//                           style={{
//                             opacity: 0,
//                             transform: 'translate3d(0, 20rem, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                           }}
//                           className="download-buttons"
//                         >
//                           <a
//                             href="https://apps.apple.com/us/app/fitonist-ai-gym-workout-plan/id6443644593"
//                             target="_blank"
//                             className="button-wrapper white-button w-inline-block"
//                           ><span className="dot-span dot dot-1 white-dot"></span>
//                           <span className="dot-span dot dot-2 white-dot"></span>
//                           <span className="dot-span dot dot-3 white-dot"></span>
//                           <span className="dot-span dot dot-4 white-dot"></span>
//                           <span className="dot-span dot dot-5 white-dot"></span>
//                           <span className="dot-span dot dot-6 white-dot"></span>
//                           <span className="dot-span dot dot-7 white-dot"></span>
//                           <span
//                               className="button white app-store buton bg-yellow-500 px-16 py-4 rounded-full"
//                             ><div className="icon-app w-embed">
//                                 <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   width="100%"
//                                   height="100%"
//                                   viewBox="0 0 24 24"
//                                   fill="none"
//                                 >
//                                   <path
//                                     d="M14.7129 5.42285C15.3086 4.7002 15.7285 3.71387 15.7285 2.71777C15.7285 2.58105 15.7188 2.44434 15.6992 2.33691C14.7227 2.37598 13.5508 2.98145 12.8574 3.80176C12.3008 4.42676 11.793 5.42285 11.793 6.41895C11.793 6.5752 11.8223 6.72168 11.832 6.77051C11.8906 6.78027 11.9883 6.7998 12.0957 6.7998C12.9648 6.7998 14.0586 6.21387 14.7129 5.42285ZM15.3965 7.00488C13.9414 7.00488 12.75 7.89355 11.9883 7.89355C11.1777 7.89355 10.123 7.06348 8.85352 7.06348C6.44141 7.06348 4 9.05566 4 12.8057C4 15.1494 4.89844 17.6201 6.02148 19.2119C6.97852 20.5596 7.81836 21.6631 9.0293 21.6631C10.2207 21.6631 10.748 20.8721 12.2324 20.8721C13.7363 20.8721 14.0781 21.6436 15.3965 21.6436C16.7051 21.6436 17.5742 20.4424 18.4043 19.2607C19.3223 17.9033 19.7129 16.585 19.7227 16.5166C19.6445 16.4971 17.1445 15.4717 17.1445 12.6104C17.1445 10.1299 19.1074 9.0166 19.2246 8.92871C17.9258 7.06348 15.9434 7.00488 15.3965 7.00488Z"
//                                     fill="currentColor"
//                                   />
//                                 </svg>
//                               </div>
//                               App Store</span></a>
//                           <a
//                             href="https://play.google.com/store/apps/details?id=com.fitonist&amp;pli=1"
//                             target="_blank"
//                             className="button-wrapper white-button w-inline-block"
//                           ><span className="dot-span dot dot-1 white-dot"></span>
//                           <span className="dot-span dot dot-2 white-dot"></span>
//                           <span className="dot-span dot dot-3 white-dot"></span>
//                           <span className="dot-span dot dot-4 white-dot"></span>
//                           <span className="dot-span dot dot-5 white-dot"></span>
//                           <span className="dot-span dot dot-6 white-dot"></span>
//                           <span className="dot-span dot dot-7 white-dot"></span>
//                           <span
//                               className="button white buton bg-yellow-500 px-16 py-4 rounded-full"
//                             ><div className="icon-app w-embed">
//                                 <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   width="100%"
//                                   height="100%"
//                                   viewBox="0 0 24 24"
//                                   fill="none"
//                                 >
//                                   <path
//                                     fillRule="evenodd"
//                                     clipRule="evenodd"
//                                     d="M6 3.29877C6.70254 2.90598 7.5327 2.89682 8.23976 3.29305L17 8.19549L14.2339 11L6 3.29877ZM5 5.11054C5 4.70929 5.12092 4.33078 5.33193 4L14 11.667L5.3094 20C5.11025 19.676 5 19.3055 5 18.9167V5.11054ZM20.8208 10.3833L18.08 9L15 11.816L18.7746 15L20.822 13.9666C21.5588 13.5931 22 12.9234 22 12.1744C21.9988 11.4253 21.5588 10.7557 20.8208 10.3833ZM6 20.672L14.5204 12L18 15.2666L8.33671 20.6945C7.97392 20.8985 7.57751 21 7.18343 21C6.77543 21 6.36975 20.8867 6 20.672Z"
//                                     fill="currentColor"
//                                   />
//                                 </svg>
//                               </div>
//                               Google Play</span></a>
//                         </div>
//                       </div>
//                       <div
//                         data-w-id="3a9e7d67-d644-0c9d-bfe2-4ae01364b680"
//                         className="hero-background-card"
//                       >
//                         <div className="bg-card-css w-embed">
//                           <style jsx global>{`
//                             .hero-background-card {
//                               background: url(.../images/bgbanner.png) no-repeat;
//                               background-position: center;
//                               background-size: cover;
//                               border-radius: 24px;
//                             }
//                           `}</style>
//                         </div>
//                       </div>
//                       <div
//                         data-w-id="43f2b9ae-e245-b884-bb82-f10012d757fd"
//                         style={{
//                           transform: 'translate3d(0, 0, 0) scale3d(2, 2, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                           opacity: 1,
//                         }}
//                         className="hero-background-card preloader"
//                       ></div>
//                       <div
//                         data-preloader-element
//                         data-w-id="beabe77a-f0fe-e95a-e72f-9551ddb53804"
//                         style={{ display: 'flex' }}
//                         className="preloader-lottie-wrapper"
//                       >
//                         <div
//                           className="preloader-element"
//                         >
//                         <img src='../images/loader.png' alt="loader" />
//                       </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div
//                   data-w-id="b5bf6b45-92cc-1e99-761d-44890f674486"
//                   className="down-navbar-anchor"
//                 ></div>
//               </div>
//             </section>
//             <section className="workouts-sc">
//               <div className="workouts-height">
//                 <div
//                   data-w-id="439ace2f-163b-ba6d-dd45-89037edc1b74"
//                   className="workouts-subheight"
//                 >
//                   <div id="wrkout-plans" className="workout-anchor"></div>
//                   <div className="workouts-sticky">
//                     <div className="container workouts-s">
//                       <div className="workouts-text-column">
//                         <div className="workouts-text-block set-1">
//                           <div className="workouts-header-block">
//                             <div className="workouts-header-cell">
//                               <h2 className="heading-5 black">Gifts for Every Occasion</h2>
//                             </div>
//                           </div>
//                           <div className="body-b2 black m-lg-4">From birthdays to “just because” — or even a little something for yourself.<br/>
//                             Explore our huge collection of fun and useful products ready to send, share, or shop in seconds.</div>
//                           <div className="workouts-mobile-header">
//                             <h2 className="heading-5 black">Create unlimited</h2>
//                             <div className="header-space set-1"></div>
//                             <h2 className="heading-5 black">Custom-Made workouts</h2>
//                           </div>
//                         </div>
//                       </div>
//                       <div
//                         className="lottie-animation"
//                       >
//                       <img src="../images/work-s.png" alt="work" />
//                     </div>
//                       <div className="gradient-workouts"></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>
//             <section
//               style={{ backgroundColor: 'rgb(255, 255, 255)' }}
//               className=""
//             >
//               <div className="categories-height">
//                 <div
//                   id="categoriesSection"
//                   data-w-id="a4173fd1-d22c-cfe1-4a50-7064c0dfc847"
//                   className="categories-subheight"
//                 >
//                   <div className="categories-sticky">
//                     <div className="container categories-s">
//                       <div className="workouts-second-header">
//                         <div className="flex-row">
//                         <h1
//                           id="movingText"
//                           data-moving-text // Renamed from moving-text=""
//                           className="heading-3 white fade"
//                           style={{textAlign: 'center'}}
//                         >
//                         Celebrate, No Matter the Distance
//                         </h1>
//                         <p id="movingText"
//                           data-moving-text
//                           className="gray-3 body-b2"
//                           style={{textAlign: 'center'}}
//                           >Near or far, you can still make someone smile — or lift your own mood.</p>
//                         </div>
//                         <div className="fade-header-js w-embed w-script">
//                           <Script id="moving-text-script" strategy="lazyOnload">
//                             {`
//                               document.addEventListener('scroll', () => {
//                                 const section = document.getElementById('categoriesSection');
//                                 const text = document.getElementById('movingText');
//                                 if (!section || !text) return;
//                                 const sectionTop = section.offsetTop;
//                                 const sectionHeight = section.offsetHeight;
//                                 const scrollPosition = window.scrollY;

//                                 const scrollStart = sectionTop + sectionHeight * 0.0;
//                                 const scrollEnd = sectionTop + sectionHeight * 0.35;

//                                 if (
//                                   scrollPosition >= scrollStart &&
//                                   scrollPosition <= scrollEnd
//                                 ) {
//                                   const scrollProgress =
//                                     (scrollPosition - scrollStart) /
//                                     (scrollEnd - scrollStart);
//                                   const backgroundPosition =
//                                     -500 + scrollProgress * 1000;
//                                   text.style.backgroundPosition = \`\${backgroundPosition}% 0\`;
//                                 }
//                               });
//                             `}
//                           </Script>
//                         </div>
//                       </div>
//                       <div className="categories-content-wrapper">
//                         <div className="widget-js w-embed w-script">
//                           <Script id="remove-categories-widget-script" strategy="lazyOnload">
//                             {`
//                               function removeCategoriesWidget() {
//                                 const element = document.querySelector('.categories-widget');
//                                 if (window.innerWidth <= 479 && element) {
//                                   element.remove();
//                                 }
//                               }
//                               window.addEventListener('load', removeCategoriesWidget);
//                               window.addEventListener('resize', removeCategoriesWidget);
//                             `}
//                           </Script>
//                         </div>
//                         <div className="categories-headers-wrapper">
//                           <div className="categories-header-cell cell-1">
//                             <div
//                               id="w-node-_382baee8-fecc-3e74-4c4c-a9262e686189-16bb975d"
//                               className="categories-color-header"
//                             >
//                               <div
//                                 style={{ color: 'rgb(0, 0, 0)' }}
//                                 className="heading-3 black height size-set"
//                               >
//                                 Send
//                               </div>
//                               <div className="heading-3 gradient">Send</div>
//                             </div>
//                             <div
//                               id="w-node-_8d375ac2-f312-55bc-2b7c-95450772689f-16bb975d"
//                               style={{ color: 'rgb(0, 0, 0)' }}
//                               className="heading-3 black height size-set"
//                             >
//                               real product
//                             </div>
//                           </div>
//                           <div className="categories-header-cell cell-2">
//                             <div
//                               id="w-node-e0326c6c-8dac-dbf7-bd6e-00a74fe2ccd4-16bb975d"
//                               className="categories-color-header"
//                             >
//                               <div
//                                 style={{ color: 'rgb(0, 0, 0)' }}
//                                 className="heading-3 black height size-set"
//                               >
//                                 stickers instantly
//                               </div>
//                               <div
//                                 data-w-id="45b34588-bc97-25cd-4d6b-2bc55c7ac845"
//                                 className="heading-3 gradient"
//                               >
//                               instantly
//                               </div>
//                             </div>
//                             <div
//                               id="w-node-e0326c6c-8dac-dbf7-bd6e-00a74fe2ccd7-16bb975d"
//                               style={{ color: 'rgb(0, 0, 0)' }}
//                               className="heading-3 black height size-set"
//                             >
                            
//                             </div>
//                           </div>
//                           <div className="categories-header-cell cell-3">
//                             <div
//                               id="w-node-ed1c1e19-4ab7-9db5-9c32-b5cf851147fd-16bb975d"
//                               className="categories-color-header"
//                             >
//                               <div
//                                 style={{ color: 'rgb(0, 0, 0)' }}
//                                 className="heading-3 black height size-set"
//                               >
//                               right from your keyboard
//                               </div>
//                               <div
//                                 data-w-id="13144530-df0e-8854-608c-bf17bf76eca3"
//                                 className="heading-3 gradient"
//                               >
//                               your keyboard
//                               </div>
//                             </div>
//                             <div
//                               id="w-node-ed1c1e19-4ab7-9db5-9c32-b5cf85114800-16bb975d"
//                               style={{ color: 'rgb(0, 0, 0)' }}
//                               className="heading-3 black height size-set"
//                             >
                              
//                             </div>
//                           </div>
//                           <div className="categories-header-cell cell-4">
//                             <div
//                               id="w-node-cc18a607-3a30-bed9-3ffa-dae5382c84f9-16bb975d"
//                               className="categories-color-header"
//                             >
//                               <div
//                                 style={{ color: 'rgb(0, 0, 0)' }}
//                                 className="heading-3 black height size-set"
//                               >
//                               inside your favorite 
//                               </div>
//                               <div
//                                 data-w-id="41eba5c2-58e7-5b1a-c5b5-04aa06ef355d"
//                                 className="heading-3 gradient"
//                               >
//                               favorite
//                               </div>
//                             </div>
//                             <div
//                               id="w-node-cc18a607-3a30-bed9-3ffa-dae5382c84fc-16bb975d"
//                               data-w-id="cc18a607-3a30-bed9-3ffa-dae5382c84fc"
//                               style={{ color: 'rgb(0, 0, 0)' }}
//                               className="heading-3 black height size-set"
//                             >
                           
//                             </div>
//                           </div>
//                           <div className="categories-header-cell cell-5">
//                             <div
//                               id="w-node-cc18a607-3a30-bed9-3ffa-dae5382c84f9-16bb975d"
//                               className="categories-color-header"
//                             >
//                               <div
//                                 style={{ color: 'rgb(0, 0, 0)' }}
//                                 className="heading-3 black height size-set"
//                               >
//                               messenger 
//                               </div>
//                               <div
//                                 data-w-id="41eba5c2-58e7-5b1a-c5b5-04aa06ef355d"
//                                 className="heading-3 gradient"
//                               >
//                               messenger
//                               </div>
//                             </div>
//                             <div
//                               id="w-node-cc18a607-3a30-bed9-3ffa-dae5382c84fc-16bb975d"
//                               data-w-id="cc18a607-3a30-bed9-3ffa-dae5382c84fc"
//                               style={{ color: 'rgb(0, 0, 0)' }}
//                               className="heading-3 black height size-set"
//                             >
//                           app
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>
//             <section style={{ backgroundColor: 'rgb(255, 255, 255)' }} className="categories-mobile-sc">
//               <div className="container categories-mobile-s">
//                 <div className="categories-wrapper">
//                   <div className="category-block">
//                     <div className="category-icon-wrapper">
//                       <img
//                         src="../images/0001.png"
//                         loading="lazy"
//                         alt=""
//                         className="image-contain"
//                       />
//                     </div>
//                     <div className="category-text-wrapper">
//                       <div className="category-first-header">
//                         <h2
//                           style={{ color: 'rgb(0, 0, 0)' }}
//                           className="heading-3 white height size-set"
//                         >
//                           Increase
//                         </h2>
//                         <h2 className="heading-3 gradient">Increase</h2>
//                       </div>
//                       <h2
//                         style={{ color: 'rgb(0, 0, 0)' }}
//                         className="heading-3 white height size-set"
//                       >
//                         muscle size
//                       </h2>
//                     </div>
//                   </div>
//                   <div className="category-block">
//                     <div className="category-icon-wrapper">
//                       <img src="../images/0002.png" loading="lazy" alt="" />
//                     </div>
//                     <div className="category-text-wrapper">
//                       <div className="category-first-header">
//                         <h2
//                           style={{ color: 'rgb(0, 0, 0)' }}
//                           className="heading-3 white height size-set"
//                         >
//                           Lose
//                         </h2>
//                         <h2 className="heading-3 gradient">Lose</h2>
//                       </div>
//                       <h2
//                         style={{ color: 'rgb(0, 0, 0)' }}
//                         className="heading-3 white height size-set"
//                       >
//                         weight
//                       </h2>
//                     </div>
//                   </div>
//                   <div className="category-block">
//                     <div className="category-icon-wrapper">
//                       <img
//                         src="../images/0003.png"
//                         loading="lazy"
//                         alt=""
//                         className="image-contain"
//                       />
//                     </div>
//                     <div className="category-text-wrapper">
//                       <div className="category-first-header">
//                         <h2
//                           style={{ color: 'rgb(0, 0, 0)' }}
//                           className="heading-3 white height size-set"
//                         >
//                           Track
//                         </h2>
//                         <h2 className="heading-3 gradient">Track</h2>
//                       </div>
//                       <h2
//                         style={{ color: 'rgb(0, 0, 0)' }}
//                         className="heading-3 white height size-set"
//                       >
//                         results
//                       </h2>
//                     </div>
//                   </div>
//                   <div className="category-block">
//                     <div className="category-icon-wrapper">
//                       <img
//                         src="../images/0004.png"
//                         loading="lazy"
//                         alt=""
//                         className="image-contain"
//                       />
//                     </div>
//                     <div className="category-text-wrapper">
//                       <div className="category-first-header">
//                         <h2
//                           style={{ color: 'rgb(0, 0, 0)' }}
//                           className="heading-3 white height size-set"
//                         >
//                           Stay
//                         </h2>
//                         <h2 className="heading-3 gradient">Stay</h2>
//                       </div>
//                       <h2
//                         style={{ color: 'rgb(0, 0, 0)' }}
//                         className="heading-3 white height size-set"
//                       >
//                         motivated
//                       </h2>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="category-fade-area">
//                   <div
//                     id="categoriesSectionMobile"
//                     data-w-id="8bea9967-8f83-9106-87d3-8c937e1ea6fe"
//                     className="category-fade-height"
//                   >
//                     <div className="categody-fade-sticky">
//                       <div className="workouts-second-header">
//                         <div className="category-mask-wrapper">
//                           <h1 className="heading-3 white fade">Define your goal</h1>
//                           <div className="category-mask"></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>
//             <section style={{ backgroundColor: 'rgb(255, 255, 255)' }} className="rotate-sc">
//               <div className="rotate-height">
//                 <div
//                   data-w-id="9daae68c-791a-b52b-db16-559b608e3973"
//                   className="rotate-subheight"
//                 >
//                   <div className="rotate-sticky">
//                     <div className="container rotate-s">
//                       <div className="rotate-first-header">
//                         <p
//                           data-w-id="242bd14e-aa7a-f2cc-a379-3f5c2ab017b3"
//                           style={{ color: 'rgb(0, 0, 0)' }}
//                           className="body-b2"
//                         >
//                           How it works
//                         </p>
//                         <div className="rotate-header-block-desktop">
//                           <h2
//                             data-w-id="b54c2ee7-2b37-b44e-8e91-1e4acf5e7c65"
//                             style={{ color: 'rgb(0, 0, 0)' }}
//                             className="heading-2"
//                           >
//                             Choose How
//                           </h2>
//                           <div
//                             data-w-id="34a129a9-4ff7-e6d6-0c34-a9b7196a365e"
//                             className="header-space"
//                           ></div>
//                           <h2 className="heading-2">
//                             you gift
//                             <span className="rotate-span set-1">Personalize</span>
//                             <span className="rotate-span set-2">Everything</span>
//                           </h2>
//                         </div>
//                         <div className="rotate-header-block-mobile">
//                           <h2
//                             data-w-id="03db594e-16d3-a3fe-aa76-3ea06efa052a"
//                             style={{ color: 'rgb(0, 0, 0)' }}
//                             className="heading-3"
//                           >
//                             Choose your style<br /><span className="rotate-span set-1">Home</span><span className="rotate-span set-2"> Outdoor</span>
//                           </h2>
//                         </div>
//                       </div>
//                       <div className="rotate-cards-flexbox">
//                         <div className="rotate-ellipse">
//                           <div className="rotate-card card-1">
//                             <div className="video-cover set-1 w-embed">
//                               <div
//                                 style={{ width: '100%', height: '100%' }}
//                                 className="w-background-video w-background-video-atom"
//                               >
//                                 <video
//                                   className="card-video"
//                                   autoPlay
//                                   muted
//                                   loop
//                                   playsInline
//                                   // loading="lazy"
//                                 >
//                                   <source
//                                     src="../video/Discover.mov"
//                                     data-wf-ignore="true"
//                                   />
//                                 </video>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="rotate-card card-2">
//                             <div className="video-cover set-2 w-embed">
//                               <div
//                                 style={{ width: '100%', height: '100%' }}
//                                 className="w-background-video w-background-video-atom"
//                               >
//                                 <video
//                                   className="card-video"
//                                   autoPlay
//                                   muted
//                                   loop
//                                   playsInline
//                                   // loading="lazy"
//                                 >
//                                   <source
//                                     src="../video/Send.mov"
//                                     data-wf-ignore="true"
//                                   />
//                                 </video>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="rotate-card card-3">
//                             <div className="video-cover set-3 w-embed">
//                               <div
//                                 style={{ width: '100%', height: '100%' }}
//                                 className="w-background-video w-background-video-atom"
//                               >
//                                 <video
//                                   className="card-video"
//                                   autoPlay
//                                   muted
//                                   loop
//                                   playsInline
//                                   // loading="lazy"
//                                 >
//                                   <source
//                                     src="../video/Redeem.mov"
//                                     data-wf-ignore="true"
//                                   />
//                                 </video>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="rotate-card card-5"></div>
//                         </div>
//                       </div>
//                       <div className="rotate-swap-headers-wrapper">
//                         <div className="rotate-swap-icons">
//                           <div
//                             data-w-id="8e411552-adb0-16bd-82e7-3a5c5b06588d"
//                             className="rotate-swap-icon"
//                           >
//                             <div className="swap-iocn">
//                               <img
//                                 src="../images/Discover.png"
//                                 loading="lazy"
//                                 alt=""
//                                 className="image-contain"
//                               />
//                             </div>
//                           </div>
//                           <div
//                             data-w-id="379bbc29-f9ea-385d-47af-e46ddc422dad"
//                             className="rotate-swap-icon"
//                           >
//                             <div className="swap-iocn">
//                               <img
//                                 src="../images/Send.png"
//                                 loading="lazy"
//                                 alt=""
//                                 className="image-contain"
//                               />
//                             </div>
//                           </div>
//                           <div
//                             data-w-id="6fe3ae2b-1889-f5c0-4131-58531a49c9de"
//                             className="rotate-swap-icon"
//                           >
//                             <div className="swap-iocn">
//                               <img
//                                 src="../images/Redeem.png"
//                                 loading="lazy"
//                                 alt=""
//                                 className="image-contain"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                         <div className="rotate-swap-headers-frame">
//                           <div className="rotate-swap-header-cell set-1">
//                             <h3 className="heading-5">Browse</h3>
//                             <p className="body-b2 gray-3">
//                               Discover a wide range of real products from your favorite brands. Whether it&apos;s for someone else or just for you, find the perfect thing for any occasion or everyday moment.
//                             </p>
//                           </div>
//                           <div className="rotate-swap-header-cell set-2">
//                             <h3 className="heading-5">Send</h3>
//                             <p className="body-b2 gray-3">
//                               Choose a product, personalize it with a message and template if you like, and send it instantly through your favorite chat app — or simply keep it for yourself. Easy, fast, and fun.
//                             </p>
//                           </div>
//                           <div className="rotate-swap-header-cell set-3">
//                             <h3 className="heading-5">Redeem</h3>
//                             <p className="body-b2 gray-3">
//                               Products can be easily redeemed online or in-store. No hassle, no waiting — just instant access to what you want, when you want it
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div
//                     id="exercises"
//                     className="rotate-anchor"
//                   ></div>
//                 </div>
//                 <div
//                   data-w-id="380efe1b-0919-769f-b196-2b8173c9e797"
//                   className="color-anchor"
//                 ></div>
//               </div>
//             </section>
//             <section className="stats-sc">
//               <div className="container stats-s">
//                 <div
//                   data-w-id="3ddadffb-60d7-686f-c6b4-a50da303959f"
//                   style={{
//                     transform: 'translate3d(0, 0, 0) scale3d(0.7, 0.7, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                     opacity: 0,
//                   }}
//                   className="stats-card-wrapper"
//                 >
//                   <div className="stats-card">
//                     <img src="../images/b1.png" style={{ height: '320px', objectFit: 'contain' }} alt="" />
//                     <h2 className="heading-6 black card-s">
//                       Deal of the Day
//                     </h2>
//                     <p
//                       style={{
//                         color: '#000',
//                         textAlign: 'center',
//                         margin: '0 50px',
//                       }}
//                     >
//                     A new surprise every day!
//                     Check out today&apos;s top pick — fun, fresh, and perfect whether you&apos;re sending it or adding it to your own collection
//                     </p>
//                   </div>
//                   <div className="stats-card-gradient"></div>
//                 </div>
//                 <div
//                   data-w-id="e994acc4-ea73-3602-4087-206d2cc9a433"
//                   style={{
//                     transform: 'translate3d(0, 0, 0) scale3d(0.7, 0.7, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                     opacity: 0,
//                   }}
//                   className="stats-card-wrapper"
//                 >
//                   <div className="stats-card">
//                     <img src="../images/b2.png" style={{ height: '320px', objectFit: 'contain'}} alt="" />
//                     <h2 className="heading-6 black">
//                       Event Calendar
//                     </h2>
//                     <p
//                       style={{
//                         color: '#000',
//                         textAlign: 'center',
//                         margin: '0 50px',
//                       }}
//                     >
//                     Never miss a reason to celebrate.
//                     Keep track of all the big (and small) days that matter — and stay ready to shop, share, or connect with perfect timing.
//                     </p>
//                   </div>
//                   <div className="stats-card-gradient"></div>
//                 </div>
//               </div>
//             </section>
//             <section className="watch-sc">
//               <div
//                 data-w-id="717531ec-07ce-cbce-d2e2-0c9bd4bb0776"
//                 className="container watch-s"
//               >
//                 <div className="watch-header">
//                   <div className="watch-header-sticky">
//                     <div className="watches-gradient"></div>
//                     <div className="apple-watch-subheader">
//                       Make Every Occasion memorable with
//                     </div>
//                     <h2 className="apple-watch-header">HeyJinie</h2>
//                   </div>
//                 </div>
//                 <div className="overflow-container">
//                   <div className="watch-block watch-11">
//                     <img
//                       src="../images/NB.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 20vw"
//                       srcSet="
//                       ../images/NB.png 500w,
//                         ../images/NB.png 549w
//                       "
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-12">
//                     <img
//                       src="../images/Blue.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 20vw"
//                       srcSet="
//                       ../images/Blue.png 500w,
//                         ../images/Blue.png 549w
//                       "
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-1">
//                     <img
//                       src="../images/09.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 27vw"
//                       srcSet="
//                         ../images/09.png   500w,
//                         ../images/09.png       798w
//                       "
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-2">
//                     <img
//                       src="../images/01.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 20vw"
//                       srcSet="
//                       ../images/01.png 500w,
//                         ../images/01.png 549w
//                       "
//                       alt=""
//                       className="image-contain"
//                     />
                  
//                   </div>
//                   <div className="watch-block watch-3">
//                     <img
//                       src="../images/02.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 20vw"
//                       srcSet="
//                         ../images/02.png 500w,
//                         ../images/02.png       544w
//                       "
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-4">
//                     <img
//                       src="../images/03.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 20vw"
//                       srcSet="
//                         ../images/03.png 500w,
//                         ../images/03.png       798w
//                       "
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-5">
//                     <img
//                       src="../images/04.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 20vw"
//                       srcSet="
//                         ../images/04.png 500w,
//                         ../images/04.png       536w
//                       "
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-6">
//                     <img
//                       src="../images/05.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 20vw"
//                       srcSet="
//                         ../images/05.png 500w,
//                         ../images/05.png       549w
//                       "
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-7">
//                     <img
//                       src="../images/06.png"
//                       loading="lazy"
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-8">
//                     <img
//                       src="../images/07.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 20vw"
//                       srcSet="
//                         ../images/07.png 500w,
//                         ../images/07.png       549w
//                       "
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-9">
//                     <img
//                       src="../images/08.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 20vw"
//                       srcSet="
//                         ../images/08.png 500w,
//                         ../images/08.png       549w
//                       "
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </section>
//             <section className="cta-sc">
//               <div className="container cta-s">
//                 <div className="cta-wrapper">
//                   <div
//                     data-w-id="7986f103-d354-9b49-ce77-45db25e8c07d"
//                     style={{ opacity: 0 }}
//                     className="cta-block"
//                   >
//                     <div className="cta-header">
//                       <h1
//                         data-w-id="f8e1a0c3-7e72-9912-2eb3-a12d530ef0b4"
//                         style={{
//                           transform: 'translate3d(0, 5vh, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                           opacity: 0,
//                         }}
//                         className="heading-3 black"
//                       >
//                       Make Every 
//                       </h1> 
//                       <div className="cta-space"></div>
//                       <h1
//                         data-w-id="749cab70-5651-fbf3-9e17-38735a43ca2a"
//                         style={{
//                           opacity: 0,
//                           transform: 'translate3d(0, 10vh, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                         }}
//                         className="heading-3 black"
//                       >
//                       Moment Personalized
//                       </h1>
//                     </div>
//                     <div
//                       data-w-id="311d31de-3d49-372f-b7cd-f4752043fae7"
//                       style={{
//                         transform: 'translate3d(0, 5vh, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                         opacity: 0,
//                       }}
//                       className="cta-access-block"
//                     >
//                       <div className="body-b3 black">
//                         <span className="fire">🔥</span>Products that feel just right.
//                       </div>
//                       <div className="body-b3 black">
//                         <span className="fire">🔥</span>With Heyjinie, every gesture becomes meaningful — whether it&apos;s a thoughtful<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; message for someone else or a vibe that fits your own mood.
//                       </div>
//                       <div className="body-b3">
//                         <span className="fire">🔥</span>Personalized templates and designs make every interaction special.
//                       </div>
//                     </div>
//                     <div className="cta-buttons">
//                       <div className="download-buttons">
//                         <a
//                           href="https://apps.apple.com/us/app/fitonist-ai-gym-workout-plan/id6443644593"
//                           target="_blank"
//                           className="button-wrapper w-inline-block"
//                         ><span className="dot-span dot dot-1"></span>
//                         <span className="dot-span dot dot-2"></span>
//                         <span className="dot-span dot dot-3"></span>
//                         <span className="dot-span dot dot-4"></span>
//                         <span className="dot-span dot dot-5"></span>
//                         <span className="dot-span dot dot-6"></span>
//                         <span className="dot-span dot dot-7"></span>
//                         <span
//                             className="button app-store buton bg-yellow-500 px-16 py-4 rounded-full"
//                           ><div className="icon-app w-embed">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="100%"
//                                 height="100%"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                               >
//                                 <path
//                                   d="M14.7129 5.42285C15.3086 4.7002 15.7285 3.71387 15.7285 2.71777C15.7285 2.58105 15.7188 2.44434 15.6992 2.33691C14.7227 2.37598 13.5508 2.98145 12.8574 3.80176C12.3008 4.42676 11.793 5.42285 11.793 6.41895C11.793 6.5752 11.8223 6.72168 11.832 6.77051C11.8906 6.78027 11.9883 6.7998 12.0957 6.7998C12.9648 6.7998 14.0586 6.21387 14.7129 5.42285ZM15.3965 7.00488C13.9414 7.00488 12.75 7.89355 11.9883 7.89355C11.1777 7.89355 10.123 7.06348 8.85352 7.06348C6.44141 7.06348 4 9.05566 4 12.8057C4 15.1494 4.89844 17.6201 6.02148 19.2119C6.97852 20.5596 7.81836 21.6631 9.0293 21.6631C10.2207 21.6631 10.748 20.8721 12.2324 20.8721C13.7363 20.8721 14.0781 21.6436 15.3965 21.6436C16.7051 21.6436 17.5742 20.4424 18.4043 19.2607C19.3223 17.9033 19.7129 16.585 19.7227 16.5166C19.6445 16.4971 17.1445 15.4717 17.1445 12.6104C17.1445 10.1299 19.1074 9.0166 19.2246 8.92871C17.9258 7.06348 15.9434 7.00488 15.3965 7.00488Z"
//                                   fill="currentColor"
//                                 />
//                               </svg>
//                             </div>
//                             App Store</span></a>
//                         <a
//                           href="https://play.google.com/store/apps/details?id=com.fitonist&amp;pli=1"
//                           target="_blank"
//                           className="button-wrapper w-inline-block"
//                         ><span className="dot-span dot dot-1"></span>
//                         <span className="dot-span dot dot-2"></span>
//                         <span className="dot-span dot dot-3"></span>
//                         <span className="dot-span dot dot-4"></span>
//                         <span className="dot-span dot dot-5"></span>
//                         <span className="dot-span dot dot-6"></span>
//                         <span className="dot-span dot dot-7"></span>
//                         <span
//                             className="button buton bg-yellow-500 px-16 py-4 rounded-full"
//                           ><div className="icon-app w-embed">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="100%"
//                                 height="100%"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                               >
//                                 <path
//                                   fillRule="evenodd"
//                                   clipRule="evenodd"
//                                   d="M6 3.29877C6.70254 2.90598 7.5327 2.89682 8.23976 3.29305L17 8.19549L14.2339 11L6 3.29877ZM5 5.11054C5 4.70929 5.12092 4.33078 5.33193 4L14 11.667L5.3094 20C5.11025 19.676 5 19.3055 5 18.9167V5.11054ZM20.8208 10.3833L18.08 9L15 11.816L18.7746 15L20.822 13.9666C21.5588 13.5931 22 12.9234 22 12.1744C21.9988 11.4253 21.5588 10.7557 20.8208 10.3833ZM6 20.672L14.5204 12L18 15.2666L8.33671 20.6945C7.97392 20.8985 7.57751 21 7.18343 21C6.77543 21 6.36975 20.8867 6 20.672Z"
//                                   fill="currentColor"
//                                 />
//                               </svg>
//                             </div>
//                             Google Play</span></a>
//                       </div>
//                       <div
//                         data-w-id="4918fe23-928a-2a58-73ba-d86d355191d7"
//                         style={{
//                           opacity: 0,
//                           transform: 'translate3d(0, 5vh, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                         }}
//                         className="free-tag"
//                       >
//                         <div className="body-b2-bold">Available for free</div>
//                         <div className="hero-tag-line w-embed">
//                           <svg
//                             width="100%"
//                             height="100%"
//                             viewBox="0 0 143 5"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <path
//                               d="M1.5 2.20914C9.21186 3.45854 28.7881 4.76242 55.1123 3.45854C98.9368 1.28785 108.873 -0.769308 141.5 3.45854"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                               strokeLinecap="round"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="div-block-4">
//                       <img
//                         src="../images/phone.png"
//                         loading="lazy"
//                         sizes="100vw"
//                         srcSet="
//                           ../images/phone.png 500w,
//                           ../images/phone.png 800w,
//                           ../images/phone.png      954w
//                         "
//                         alt=""
//                         className="cta-image"
//                       />
//                       <div
//                         data-w-id="52a56000-33e1-bd8a-5669-fe1e1263859a"
//                         data-is-ix2-target="1"
//                         className="lottie-animation-6"
//                         data-animation-type="lottie"
//                         data-src="../json/waves-mob.json"
//                         data-loop="0"
//                         data-direction="1"
//                         data-autoplay="0"
//                         data-renderer="svg"
//                         data-duration="0"
//                       ></div>
//                       <img
//                         src="../images/phone.png"
//                         loading="lazy"
//                         sizes="100vw"
//                         srcSet="
//                         ../images/phone.png 500w,
//                           ../images/phone.png       954w
//                         "
//                         alt=""
//                         className="cta-image background"
//                       />
//                     </div>
//                   </div>
//                   <div
//                     style={{
//                       opacity: 0,
//                       transform: 'translate3d(0, 50%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//                     }}
//                     className="cta-card-gradient"
//                   ></div>
//                   <div className="code-embed-9 w-embed">
//                     <style jsx global>{`
//                       @media screen and (max-width: 479px) {
//                         .cta-wrapper {
//                           -webkit-border-radius: 2.2rem;
//                         }
//                       }
//                     `}</style>
//                   </div>
//                 </div>
//               </div>
//             </section>
//             <section className="footer-sc">
//               <div className="container footer-s">
//                 <div className="footer-left-content">
//                   <div className="app-card-wrapper">
//                     <div className="app-card">
//                       <div className="footer-logo">
//                         <div className="footer-logo-svg w-embed">
//                           <svg width="181" height="55" viewBox="0 0 181 55" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
//                             <rect width="181" height="55" fill="url(#pattern0_160_3459_footer)"/>
//                             <defs>
//                             <pattern id="pattern0_160_3459_footer" patternContentUnits="objectBoundingBox" width="1" height="1">
//                             <use xlinkHref="#image0_160_3459_logo" transform="matrix(0.000478779 0 0 0.00157562 -0.348066 -1.865)"/>
//                             </pattern>
//                              {/* image0_160_3459_logo is defined in the first header */}
//                             </defs>
//                             </svg>
//                         </div>
//                       </div>
//                       <div className="app-start">
//                         <a 
//                         id="w-node-fe3fc677-e301-f324-54b1-ebf73c1adecd-16bb975d"
//                         href="mailto:contact@heyjinie.com?subject=contact%40heyjinie.com"
//                         style={{textDecoration: 'none', color: '#000'}}
//                         className="body-b2 black footer"
//                         >
//                         <div className="flex-column">
//                         <div className="body-b2 black footer">
//                           Stay Connected 
//                         </div>
//                         <p>contact@heyjinie.com</p>
//                         </div>
//                         </a>
//                       </div>
//                       <div className="app-card-buttons">
//                         <a
//                           href="https://apps.apple.com/us/app/fitonist-ai-gym-workout-plan/id6443644593"
//                           target="_blank"
//                           className="button-wrapper w-inline-block"
//                         ><span className="dot-span dot dot-1"></span>
//                         <span className="dot-span dot dot-2"></span>
//                         <span className="dot-span dot dot-3"></span>
//                         <span className="dot-span dot dot-4"></span>
//                         <span className="dot-span dot dot-5"></span>
//                         <span className="dot-span dot dot-6"></span>
//                         <span className="dot-span dot dot-7"></span>
//                         <span
//                             className="button radial buton bg-yellow-500 px-16 py-4 rounded-full"
//                           ><div className="icon-app w-embed">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="100%"
//                                 height="100%"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                               >
//                                 <path
//                                   d="M14.7129 5.42285C15.3086 4.7002 15.7285 3.71387 15.7285 2.71777C15.7285 2.58105 15.7188 2.44434 15.6992 2.33691C14.7227 2.37598 13.5508 2.98145 12.8574 3.80176C12.3008 4.42676 11.793 5.42285 11.793 6.41895C11.793 6.5752 11.8223 6.72168 11.832 6.77051C11.8906 6.78027 11.9883 6.7998 12.0957 6.7998C12.9648 6.7998 14.0586 6.21387 14.7129 5.42285ZM15.3965 7.00488C13.9414 7.00488 12.75 7.89355 11.9883 7.89355C11.1777 7.89355 10.123 7.06348 8.85352 7.06348C6.44141 7.06348 4 9.05566 4 12.8057C4 15.1494 4.89844 17.6201 6.02148 19.2119C6.97852 20.5596 7.81836 21.6631 9.0293 21.6631C10.2207 21.6631 10.748 20.8721 12.2324 20.8721C13.7363 20.8721 14.0781 21.6436 15.3965 21.6436C16.7051 21.6436 17.5742 20.4424 18.4043 19.2607C19.3223 17.9033 19.7129 16.585 19.7227 16.5166C19.6445 16.4971 17.1445 15.4717 17.1445 12.6104C17.1445 10.1299 19.1074 9.0166 19.2246 8.92871C17.9258 7.06348 15.9434 7.00488 15.3965 7.00488Z"
//                                   fill="currentColor"
//                                 />
//                               </svg></div></span></a>
//                         <a
//                           href="https://play.google.com/store/apps/details?id=com.fitonist&amp;pli=1"
//                           target="_blank"
//                           className="button-wrapper w-inline-block"
//                         ><span className="dot-span dot dot-1"></span>
//                         <span className="dot-span dot dot-2"></span>
//                         <span className="dot-span dot dot-3"></span>
//                         <span className="dot-span dot dot-4"></span>
//                         <span className="dot-span dot dot-5"></span>
//                         <span className="dot-span dot dot-6"></span>
//                         <span className="dot-span dot dot-7"></span>
//                         <span
//                             className="button radial buton bg-yellow-500 px-16 py-4 rounded-full"
//                           ><div className="icon-app w-embed">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="100%"
//                                 height="100%"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                               >
//                                 <path
//                                   fillRule="evenodd"
//                                   clipRule="evenodd"
//                                   d="M6 3.29877C6.70254 2.90598 7.5327 2.89682 8.23976 3.29305L17 8.19549L14.2339 11L6 3.29877ZM5 5.11054C5 4.70929 5.12092 4.33078 5.33193 4L14 11.667L5.3094 20C5.11025 19.676 5 19.3055 5 18.9167V5.11054ZM20.8208 10.3833L18.08 9L15 11.816L18.7746 15L20.822 13.9666C21.5588 13.5931 22 12.9234 22 12.1744C21.9988 11.4253 21.5588 10.7557 20.8208 10.3833ZM6 20.672L14.5204 12L18 15.2666L8.33671 20.6945C7.97392 20.8985 7.57751 21 7.18343 21C6.77543 21 6.36975 20.8867 6 20.672Z"
//                                   fill="currentColor"
//                                 />
//                               </svg></div></span></a>
//                       </div>
//                     </div>
//                     <div className="app-card-gradient"></div>
//                   </div>
//                   <div className="copyright desktop">
//                     <div className="body-b3 color-grey">
//                       ©2024 HeyJinie. Created by Stack Studios
//                     </div>
//                   </div>
//                 </div>
//                 <div className="footer-right-content">
//                   <ul role="list" className="footer-list">
//                     <li className="footer-list-item">
//                       <div className="footer-ink-wrapper">
//                         <a href="#marketplace" className="footer-link">Marketplace</a>
//                         <a href="#" className="footer-link hover">Marketplace</a>
//                         <div className="hover-line-wrapper">
//                           <div className="footer-line set-1 w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 104 5"
//                               fill="none"
//                             >
//                               <path
//                                 d="M1 2.40328C6.61864 2.81974 21 4.5 40.0604 2.81974C71.8745 0.015184 79.2288 1.41048 103 2.81974"
//                                 stroke="#88C0FC"
//                                 strokeLinecap="round"
//                               />
//                             </svg>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                     <li className="footer-list-item">
//                       <div className="footer-ink-wrapper">
//                         <a href="#pricing" className="footer-link">Pricing</a>
//                         <a href="#" className="footer-link hover">Pricing</a>
//                         <div className="hover-line-wrapper">
//                           <div className="footer-line set-3 w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 54 3"
//                               fill="none"
//                             >
//                               <path
//                                 d="M1 1.57828C3.86441 1.93217 10 2.79189 20.9131 1.93217C37.2556 0.644736 40.8814 0.734631 53 1.93217"
//                                 stroke="#88C0FC"
//                                 strokeLinecap="round"
//                               />
//                             </svg>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                     <li className="footer-list-item">
//                       <div className="footer-ink-wrapper">
//                         <a href="#" className="footer-link hover">Contact us</a>
//                         <a
//                           data-stop-scroll
//                           data-w-id="b8aa7f2b-9100-7e3d-0fca-9107107155fb"
//                           href="#"
//                           className="footer-link"
//                         >Contact us</a>
//                         <div className="hover-line-wrapper">
//                           <div className="footer-line set-4 w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 83 4"
//                               fill="none"
//                             >
//                               <path
//                                 d="M1 2.32664C5.46186 2.6805 16.8824 4.1082 32.0185 2.6805C57.2827 0.297505 63.1229 1.48307 82 2.6805"
//                                 stroke="#88C0FC"
//                                 strokeLinecap="round"
//                               />
//                             </svg>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                   </ul>
//                   <ul role="list" className="footer-list">
//                     <li className="footer-list-item hidden">
//                       <div className="footer-ink-wrapper">
//                         <a href="#" className="footer-link hover">Blog</a>
//                         <a href="#" className="footer-link">Blog</a>
//                         <div className="hover-line-wrapper">
//                           <div className="footer-line set-5 w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 36 3"
//                               fill="none"
//                             >
//                               <path
//                                 d="M1 1.44403C2.87288 1.71577 6.88462 2.37591 14.0201 1.71577C24.7056 0.727209 27.0763 0.796235 35 1.71577"
//                                 stroke="#88C0FC"
//                                 strokeLinecap="round"
//                               />
//                             </svg>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                     <li className="footer-list-item">
//                       <div className="footer-ink-wrapper">
//                         <a href="#" className="footer-link hover">Privacy Policy</a>
//                         <a href="#" className="footer-link">Privacy Policy</a>
//                         <div className="hover-line-wrapper">
//                           <div className="footer-line set-6 w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 125 5"
//                               fill="none"
//                             >
//                               <path
//                                 d="M1 2.9509C7.77542 3.30479 25.2276 5.9661 48.1022 3.30479C87 -1.22072 95.3347 2.10725 124 3.30479"
//                                 stroke="#88C0FC"
//                                 strokeLinecap="round"
//                               />
//                             </svg>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                     <li className="footer-list-item">
//                       <div className="footer-ink-wrapper">
//                         <a href="#" className="footer-link hover">Return Policy</a>
//                         <a href="#" className="footer-link">Return Policy</a>
//                         <div className="hover-line-wrapper">
//                           <div className="footer-line set-7 w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 106 4"
//                               fill="none"
//                             >
//                               <path
//                                 d="M1 2.49851C6.72881 2.85237 21.3922 4.28007 40.8263 2.85238C73.2642 0.46938 80.7627 1.65494 105 2.85237"
//                                 stroke="#88C0FC"
//                                 strokeLinecap="round"
//                               />
//                             </svg>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                     <li className="footer-list-item">
//                       <div className="footer-ink-wrapper">
//                         <a href="#" className="footer-link hover">Refund Policy</a>
//                         <a href="#" className="footer-link">Refund Policy</a>
//                         <div className="hover-line-wrapper">
//                           <div className="footer-line set-7 w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 106 4"
//                               fill="none"
//                             >
//                               <path
//                                 d="M1 2.49851C6.72881 2.85237 21.3922 4.28007 40.8263 2.85238C73.2642 0.46938 80.7627 1.65494 105 2.85237"
//                                 stroke="#88C0FC"
//                                 strokeLinecap="round"
//                               />
//                             </svg>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                     <li className="footer-list-item">
//                       <div className="footer-ink-wrapper">
//                         <a href="#" className="footer-link hover">Terms & Conditions</a>
//                         <a href="#" className="footer-link">Terms & Conditions</a>
//                         <div className="hover-line-wrapper">
//                           <div className="footer-line set-7 w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 106 4"
//                               fill="none"
//                             >
//                               <path
//                                 d="M1 2.49851C6.72881 2.85237 21.3922 4.28007 40.8263 2.85238C73.2642 0.46938 80.7627 1.65494 105 2.85237"
//                                 stroke="#88C0FC"
//                                 strokeLinecap="round"
//                               />
//                             </svg>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                     <li className="footer-list-item socials">
//                       <div className="socials-icons footer">
//                         <a
//                           href="https://www.tiktok.com/@fitonistapp"
//                           target="_blank"
//                           className="button-wrapper w-inline-block"
//                         ><span className="dot-span dot dot-1"></span>
//                         <span className="dot-span dot dot-2"></span>
//                         <span className="dot-span dot dot-3"></span>
//                         <span className="dot-span dot dot-4"></span>
//                         <span className="dot-span dot dot-5"></span>
//                         <span className="dot-span dot dot-6"></span>
//                         <span className="dot-span dot dot-7"></span>
//                         <span
//                             className="button radial buton bg-yellow-500 px-16 py-4 rounded-full btnnewicon"
//                           ><div className="button-icon w-embed fillblack">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="100%"
//                                 height="100%"
//                                 viewBox="0 0 16 16"
//                                 fill="none"
//                               >
//                                 <path
//                                   d="M12.077 4.00588C11.3588 3.53759 10.8404 2.78833 10.6787 1.91489C10.6438 1.72618 10.6246 1.53197 10.6246 1.33325H8.33232L8.32865 10.5199C8.29011 11.5486 7.44341 12.3743 6.40544 12.3743C6.08283 12.3743 5.77907 12.2937 5.51161 12.1529C4.89828 11.8302 4.47855 11.1873 4.47855 10.4475C4.47855 9.38492 5.343 8.52048 6.40544 8.52048C6.60377 8.52048 6.79403 8.5532 6.97399 8.60957V6.26941C6.78775 6.24405 6.59852 6.2282 6.40544 6.2282C4.07894 6.2282 2.18628 8.12096 2.18628 10.4475C2.18628 11.8749 2.89945 13.1381 3.98747 13.9019C4.67279 14.383 5.5064 14.6666 6.40544 14.6666C8.73193 14.6666 10.6246 12.7739 10.6246 10.4475V5.78903C11.5237 6.43433 12.6251 6.81459 13.8137 6.81459V4.52232C13.1735 4.52232 12.5771 4.33197 12.077 4.00588Z"
//                                   fill="currentColor"
//                                 />
//                               </svg></div></span></a>
//                         <a
//                           href="https://www.youtube.com/channel/UC1v97SHDhSApVeJFEnN0onw"
//                           target="_blank"
//                           className="button-wrapper w-inline-block"
//                         ><span className="dot-span dot dot-1"></span>
//                         <span className="dot-span dot dot-2"></span>
//                         <span className="dot-span dot dot-3"></span>
//                         <span className="dot-span dot dot-4"></span>
//                         <span className="dot-span dot dot-5"></span>
//                         <span className="dot-span dot dot-6"></span>
//                         <span className="dot-span dot dot-7"></span>
//                         <span
//                             className="button radial buton bg-yellow-500 px-16 py-4 rounded-full btnnewicon"
//                           ><div className="button-icon w-embed fillblack">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="100%"
//                                 height="100%"
//                                 viewBox="0 0 16 16"
//                                 fill="none"
//                               >
//                                 <path
//                                   fillRule="evenodd"
//                                   clipRule="evenodd"
//                                   d="M13.1946 3.6098C13.768 3.76385 14.2216 4.21742 14.3756 4.7908C14.658 5.83488 14.6666 8.00005 14.6666 8.00005C14.6666 8.00005 14.6666 10.1738 14.3842 11.2093C14.2301 11.7827 13.7766 12.2362 13.2032 12.3903C12.1677 12.6727 7.99992 12.6727 7.99992 12.6727C7.99992 12.6727 3.83218 12.6727 2.79667 12.3903C2.22328 12.2362 1.76971 11.7827 1.61567 11.2093C1.33325 10.1652 1.33325 8.00005 1.33325 8.00005C1.33325 8.00005 1.33325 5.83488 1.60711 4.79937C1.76115 4.22598 2.21472 3.77241 2.78811 3.61837C3.82362 3.33595 7.99136 3.32739 7.99136 3.32739C7.99136 3.32739 12.1591 3.32739 13.1946 3.6098ZM10.1223 8.00005L6.66487 10.0026V5.99748L10.1223 8.00005Z"
//                                   fill="currentColor"
//                                 />
//                               </svg></div></span></a>
//                         <a
//                           href="https://www.instagram.com/fitonistapp/"
//                           target="_blank"
//                           className="button-wrapper w-inline-block"
//                         ><span className="dot-span dot dot-1"></span>
//                         <span className="dot-span dot dot-2"></span>
//                         <span className="dot-span dot dot-3"></span>
//                         <span className="dot-span dot dot-4"></span>
//                         <span className="dot-span dot dot-5"></span>
//                         <span className="dot-span dot dot-6"></span>
//                         <span className="dot-span dot dot-7"></span>
//                         <span
//                             className="button radial buton bg-yellow-500 px-16 py-4 rounded-full btnnewicon"
//                           ><div className="button-icon w-embed fillblack">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="100%"
//                                 height="100%"
//                                 viewBox="0 0 16 16"
//                                 fill="none"
//                               >
//                                 <path
//                                   d="M12.4273 4.34267C12.4273 4.50288 12.3798 4.65951 12.2908 4.79274C12.2018 4.92597 12.0753 5.02982 11.9273 5.09114C11.7793 5.15247 11.6164 5.16853 11.4593 5.13728C11.3021 5.10603 11.1578 5.02888 11.0445 4.91559C10.9312 4.8023 10.8541 4.65796 10.8228 4.50082C10.7916 4.34368 10.8076 4.1808 10.869 4.03278C10.9303 3.88477 11.0341 3.75826 11.1674 3.66927C11.3006 3.58028 11.4572 3.5328 11.6174 3.53283C11.8322 3.53288 12.0382 3.61821 12.19 3.77008C12.3419 3.92194 12.4272 4.1279 12.4273 4.34267ZM15 8L14.9998 8.0102L14.9538 10.947C14.9419 12.006 14.5159 13.0181 13.7671 13.767C13.0183 14.5158 12.0061 14.9417 10.9472 14.9537L8 15L7.9898 14.9998L5.05297 14.9539C3.99402 14.942 2.98182 14.516 2.23297 13.7672C1.48412 13.0184 1.0581 12.0062 1.0461 10.9473L1 8L1.0002 7.9898L1.04607 5.05287C1.05811 3.99393 1.48413 2.98177 2.23297 2.23297C2.98182 1.48416 3.994 1.05819 5.05293 1.0462L8 1L8.0102 1.0002L10.947 1.04607C12.0059 1.05805 13.0181 1.48403 13.7669 2.23284C14.5157 2.98166 14.9417 3.99382 14.9537 5.05273L15 8ZM13.6963 8L13.6505 5.07333C13.6423 4.35346 13.3528 3.66536 12.8437 3.1563C12.3346 2.64723 11.6465 2.35764 10.9267 2.3495L8 2.3038L5.07333 2.3495C4.35346 2.35766 3.66537 2.64725 3.1563 3.15631C2.64723 3.66537 2.35763 4.35346 2.34947 5.07333L2.30377 8L2.34947 10.9267C2.35761 11.6466 2.6472 12.3347 3.15627 12.8437C3.66534 13.3528 4.35345 13.6424 5.07333 13.6505L8 13.6962L10.9267 13.6505C11.6466 13.6424 12.3347 13.3528 12.8437 12.8437C13.3528 12.3347 13.6424 11.6466 13.6505 10.9267L13.6963 8ZM11.5947 8C11.5947 8.71097 11.3838 9.40597 10.9888 9.99711C10.5939 10.5883 10.0324 11.049 9.37559 11.3211C8.71874 11.5931 7.99597 11.6643 7.29866 11.5256C6.60136 11.3869 5.96084 11.0446 5.45812 10.5418C4.95539 10.0391 4.61303 9.39858 4.47433 8.70127C4.33564 8.00397 4.40683 7.28119 4.67891 6.62435C4.95099 5.9675 5.41173 5.40609 6.00288 5.0111C6.59403 4.61611 7.28903 4.40529 8 4.4053C8.95304 4.40638 9.86674 4.78545 10.5406 5.45935C11.2145 6.13326 11.5936 7.04696 11.5947 8ZM10.2911 8C10.2911 7.54686 10.1567 7.10389 9.90497 6.72711C9.65322 6.35034 9.29539 6.05668 8.87674 5.88327C8.45809 5.70986 7.99741 5.66449 7.55298 5.75289C7.10854 5.8413 6.7003 6.05951 6.37988 6.37994C6.05946 6.70036 5.84125 7.1086 5.75285 7.55304C5.66445 7.99748 5.70983 8.45815 5.88324 8.8768C6.05666 9.29545 6.35033 9.65328 6.72711 9.90502C7.10388 10.1568 7.54686 10.2911 8 10.2911C8.60742 10.2904 9.18977 10.0488 9.61927 9.61929C10.0488 9.18977 10.2904 8.60742 10.2911 8H10.2911Z"
//                                 fill="currentColor"
//                               />
//                             </svg></div></span></a>
//                       </div>
//                     </li>
//                   </ul>
//                 </div>
//                 <div className="copyright mobile">
//                   <div className="body-b3 white">
//                     ©2024 HeyJinie. Created by
//                     <a
//                       href="http://www.outcrowd.io/"
//                       target="_blank"
//                       className="outcrowd-link"
//                     >Stack Studios</a>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           </div>
//           <div
//             data-fs-scrolldisable-element="when-visible" // Renamed from fs-scrolldisable-element="when-visible"
//             style={{
//               display: 'none',
//               transform: 'translate3d(null, 100vh, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
//             }}
//             className="contact-us"
//           >
//             <div className="form-gradient"></div>
//             <div data-lenis-prevent="" className="container contact-s">
//               <div
//                 data-start-scroll // Renamed from start-scroll=""
//                 data-w-id="c0ef0ec8-3685-592b-535d-985f3b49daaf"
//                 className="close-contact"
//               >
//                 <div className="code-embed-6 w-embed">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="100%"
//                     height="100%"
//                     viewBox="0 0 18 18"
//                     fill="none"
//                   >
//                     <path
//                       d="M1 1L16.9999 16.9723"
//                       stroke="white"
//                       strokeWidth="1.5"
//                     />
//                     <path
//                       d="M1 17L16.9999 1.0277"
//                       stroke="white"
//                       strokeWidth="1.5"
//                     />
//                   </svg>
//                 </div>
//               </div>
//               <h1 className="heading-3 white contact">Let’s talk</h1>
//               <div id="fitoForm" className="form-block w-form">
//                 <form
//                   id="email-form"
//                   name="email-form"
//                   data-name="Email Form"
//                   method="get"
//                   className="form"
//                   data-wf-page-id="667fa6c733097c1516bb975d"
//                   data-wf-element-id="da935f8c-0dc0-3094-8f86-a0cab4ee581e"
//                 >
//                   <div className="form-frame">
//                     <div className="input-wrapper">
//                       <label htmlFor="name" className="lable">What’s your name?</label>
//                       <input
//                         className="text-field w-input"
//                         maxLength={256}
//                         name="name"
//                         data-name="Name"
//                         placeholder="Name"
//                         type="text"
//                         id="name"
//                         required
//                       />
//                     </div>
//                     <div style={{ height: '14rem' }} className="form-space"></div>
//                     <div className="input-wrapper">
//                       <label htmlFor="Email" className="lable">What’s your email?</label>
//                       <input
//                         className="text-field w-input"
//                         maxLength={256}
//                         name="Email"
//                         data-name="Email"
//                         placeholder="name@example.com"
//                         type="email"
//                         id="Email"
//                         required
//                       />
//                     </div>
//                     <div style={{ height: '14rem' }} className="form-space"></div>
//                     <div className="input-wrapper">
//                       <label htmlFor="autoExpand" className="lable">How we can help you?</label>
//                       <textarea
//                         placeholder="Example Text"
//                         maxLength={5000}
//                         id="autoExpand"
//                         name="field"
//                         data-name="Field"
//                         className="text-area w-input"
//                       ></textarea>
//                       <div className="area-js w-embed w-script">
//                         <Script id="auto-expand-textarea-script" strategy="lazyOnload">
//                           {`
//                             document.addEventListener('DOMContentLoaded', function () {
//                               const textarea = document.getElementById('autoExpand');
//                               if (!textarea) return;

//                               function adjustTextarea() {
//                                 if (window.innerWidth <= 479) {
//                                   textarea.style.height = 'auto';
//                                   textarea.style.width = '100%';
//                                   return;
//                                 }

//                                 textarea.style.height = 'auto';
//                                 textarea.style.height = textarea.scrollHeight + 'px';

//                                 const textLength = textarea.value.length;
//                                 if (textLength > 0) {
//                                   const newWidth = 38 + Math.min(textLength / 2, 42);
//                                   textarea.style.width = newWidth + 'rem';
//                                 } else {
//                                   textarea.style.width = '38rem';
//                                 }
//                               }

//                               textarea.addEventListener('input', adjustTextarea);
//                               window.addEventListener('resize', adjustTextarea);
//                               adjustTextarea();
//                             });
//                           `}
//                         </Script>
//                          <style jsx global>{`
//                           textarea {
//                             width: 80rem;
//                             overflow: hidden;
//                             resize: none;
//                             box-sizing: border-box;
//                             transition: width 0.2s ease;
//                           }
//                         `}</style>
//                       </div>
//                     </div>
//                     <div style={{ height: '14rem' }} className="form-space"></div>
//                     <input
//                       type="submit"
//                       data-wait="Please wait..."
//                       id="submitButton"
//                       className="submit-button w-button"
//                       value="Submit"
//                     />
//                     <div id="customSubmitButton" className="button-wrapper">
//                       <span className="dot-span dot dot-1"></span>
//                       <span className="dot-span dot dot-2"></span>
//                       <span className="dot-span dot dot-3"></span>
//                       <span className="dot-span dot dot-4"></span>
//                       <span className="dot-span dot dot-5"></span>
//                       <span className="dot-span dot dot-6"></span>
//                       <span className="dot-span dot dot-7"></span>
//                       <span
//                         className="button app-store buton bg-yellow-500 text-white px-16 py-4 rounded-full send-form"
//                       >Send</span>
//                       <div className="send-js w-embed w-script">
//                         <Script id="form-submit-script" strategy="lazyOnload">
//                           {`
//                             const fitoForm = document.getElementById('fitoForm');
//                             if (fitoForm) {
//                               fitoForm.addEventListener('submit', function (event) {
//                                 var sendButton = document.querySelector('.send-form');
//                                 if (sendButton) sendButton.textContent = 'Sending...';
//                               });
//                             }
//                             const customSubmitButton = document.getElementById('customSubmitButton');
//                             const submitButton = document.getElementById('submitButton');
//                             if (customSubmitButton && submitButton) {
//                                 customSubmitButton.addEventListener('click', () => {
//                                 submitButton.click();
//                                 });
//                             }
//                           `}
//                         </Script>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="form-contacts">
//                     <div className="w-layout-grid contacts-grid">
//                       <div
//                         id="w-node-fe3fc677-e301-f324-54b1-ebf73c1adecc-16bb975d"
//                         className="contact-icon w-embed"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="100%"
//                           height="100%"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             clipRule="evenodd"
//                             d="M15.3741 12.718L19.8801 9.663C20.5811 9.189 21.0001 8.398 21.0001 7.552V7.552C21.0001 6.142 19.8581 5 18.4491 5H5.56614C4.15714 5 3.01514 6.142 3.01514 7.551V7.551C3.01514 8.397 3.43414 9.188 4.13514 9.663L8.64114 12.718C10.6741 14.096 13.3411 14.096 15.3741 12.718V12.718Z"
//                             stroke="white"
//                             strokeWidth="1.5"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                           <path
//                             d="M3 7.55078V16.9998C3 18.6568 4.343 19.9998 6 19.9998H18C19.657 19.9998 21 18.6568 21 16.9998V7.55178"
//                             stroke="white"
//                             strokeWidth="1.5"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                         </svg>
//                       </div>
//                       <a
//                         id="w-node-fe3fc677-e301-f324-54b1-ebf73c1adecd-16bb975d"
//                         href="mailto:contact@heyjinie.com?subject=heyjinie%40heyjinie.com"
//                         className="contact-link"
//                       >contact@heyjinie.com</a>
//                     </div>
//                     <div className="socials-icons contact">
//                       <a
//                         href="https://www.tiktok.com/@fitonistapp"
//                         target="_blank"
//                         className="button-wrapper white-button w-inline-block"
//                       ><span className="dot-span dot dot-1 white-dot"></span>
//                       <span className="dot-span dot dot-2 white-dot"></span>
//                       <span className="dot-span dot dot-3 white-dot"></span>
//                       <span className="dot-span dot dot-4 white-dot"></span>
//                       <span className="dot-span dot dot-5 white-dot"></span>
//                       <span className="dot-span dot dot-6 white-dot"></span>
//                       <span className="dot-span dot dot-7 white-dot"></span>
//                       <span
//                           className="button radial buton bg-yellow-500 px-16 py-4 rounded-full btnnewicon"
//                         ><div className="button-icon w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 16 16"
//                               fill="none"
//                             >
//                               <path
//                                 d="M12.077 4.00588C11.3588 3.53759 10.8404 2.78833 10.6787 1.91489C10.6438 1.72618 10.6246 1.53197 10.6246 1.33325H8.33232L8.32865 10.5199C8.29011 11.5486 7.44341 12.3743 6.40544 12.3743C6.08283 12.3743 5.77907 12.2937 5.51161 12.1529C4.89828 11.8302 4.47855 11.1873 4.47855 10.4475C4.47855 9.38492 5.343 8.52048 6.40544 8.52048C6.60377 8.52048 6.79403 8.5532 6.97399 8.60957V6.26941C6.78775 6.24405 6.59852 6.2282 6.40544 6.2282C4.07894 6.2282 2.18628 8.12096 2.18628 10.4475C2.18628 11.8749 2.89945 13.1381 3.98747 13.9019C4.67279 14.383 5.5064 14.6666 6.40544 14.6666C8.73193 14.6666 10.6246 12.7739 10.6246 10.4475V5.78903C11.5237 6.43433 12.6251 6.81459 13.8137 6.81459V4.52232C13.1735 4.52232 12.5771 4.33197 12.077 4.00588Z"
//                                 fill="currentColor"
//                               />
//                             </svg></div></span></a>
//                       <a
//                         href="https://www.youtube.com/channel/UC1v97SHDhSApVeJFEnN0onw"
//                         target="_blank"
//                         className="button-wrapper white-button w-inline-block"
//                       ><span className="dot-span dot dot-1 white-dot"></span>
//                       <span className="dot-span dot dot-2 white-dot"></span>
//                       <span className="dot-span dot dot-3 white-dot"></span>
//                       <span className="dot-span dot dot-4 white-dot"></span>
//                       <span className="dot-span dot dot-5 white-dot"></span>
//                       <span className="dot-span dot dot-6 white-dot"></span>
//                       <span className="dot-span dot dot-7 white-dot"></span>
//                       <span
//                           className="button radial buton bg-yellow-500 px-16 py-4 rounded-full btnnewicon"
//                         ><div className="button-icon w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 16 16"
//                               fill="none"
//                             >
//                               <path
//                                 fillRule="evenodd"
//                                 clipRule="evenodd"
//                                 d="M13.1946 3.6098C13.768 3.76385 14.2216 4.21742 14.3756 4.7908C14.658 5.83488 14.6666 8.00005 14.6666 8.00005C14.6666 8.00005 14.6666 10.1738 14.3842 11.2093C14.2301 11.7827 13.7766 12.2362 13.2032 12.3903C12.1677 12.6727 7.99992 12.6727 7.99992 12.6727C7.99992 12.6727 3.83218 12.6727 2.79667 12.3903C2.22328 12.2362 1.76971 11.7827 1.61567 11.2093C1.33325 10.1652 1.33325 8.00005 1.33325 8.00005C1.33325 8.00005 1.33325 5.83488 1.60711 4.79937C1.76115 4.22598 2.21472 3.77241 2.78811 3.61837C3.82362 3.33595 7.99136 3.32739 7.99136 3.32739C7.99136 3.32739 12.1591 3.32739 13.1946 3.6098ZM10.1223 8.00005L6.66487 10.0026V5.99748L10.1223 8.00005Z"
//                                 fill="currentColor"
//                               />
//                             </svg></div></span></a>
//                       <a
//                         href="https://www.instagram.com/fitonistapp/"
//                         target="_blank"
//                         className="button-wrapper white-button w-inline-block"
//                       ><span className="dot-span dot dot-1 white-dot"></span>
//                       <span className="dot-span dot dot-2 white-dot"></span>
//                       <span className="dot-span dot dot-3 white-dot"></span>
//                       <span className="dot-span dot dot-4 white-dot"></span>
//                       <span className="dot-span dot dot-5 white-dot"></span>
//                       <span className="dot-span dot dot-6 white-dot"></span>
//                       <span className="dot-span dot dot-7 white-dot"></span>
//                       <span
//                           className="button radial buton bg-yellow-500 px-16 py-4 rounded-full btnnewicon"
//                         ><div className="button-icon w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 16 16"
//                               fill="none"
//                             >
//                               <path
//                                 d="M12.4273 4.34267C12.4273 4.50288 12.3798 4.65951 12.2908 4.79274C12.2018 4.92597 12.0753 5.02982 11.9273 5.09114C11.7793 5.15247 11.6164 5.16853 11.4593 5.13728C11.3021 5.10603 11.1578 5.02888 11.0445 4.91559C10.9312 4.8023 10.8541 4.65796 10.8228 4.50082C10.7916 4.34368 10.8076 4.1808 10.869 4.03278C10.9303 3.88477 11.0341 3.75826 11.1674 3.66927C11.3006 3.58028 11.4572 3.5328 11.6174 3.53283C11.8322 3.53288 12.0382 3.61821 12.19 3.77008C12.3419 3.92194 12.4272 4.1279 12.4273 4.34267ZM15 8L14.9998 8.0102L14.9538 10.947C14.9419 12.006 14.5159 13.0181 13.7671 13.767C13.0183 14.5158 12.0061 14.9417 10.9472 14.9537L8 15L7.9898 14.9998L5.05297 14.9539C3.99402 14.942 2.98182 14.516 2.23297 13.7672C1.48412 13.0184 1.0581 12.0062 1.0461 10.9473L1 8L1.0002 7.9898L1.04607 5.05287C1.05811 3.99393 1.48413 2.98177 2.23297 2.23297C2.98182 1.48416 3.994 1.05819 5.05293 1.0462L8 1L8.0102 1.0002L10.947 1.04607C12.0059 1.05805 13.0181 1.48403 13.7669 2.23284C14.5157 2.98166 14.9417 3.99382 14.9537 5.05273L15 8ZM13.6963 8L13.6505 5.07333C13.6423 4.35346 13.3528 3.66536 12.8437 3.1563C12.3346 2.64723 11.6465 2.35764 10.9267 2.3495L8 2.3038L5.07333 2.3495C4.35346 2.35766 3.66537 2.64725 3.1563 3.15631C2.64723 3.66537 2.35763 4.35346 2.34947 5.07333L2.30377 8L2.34947 10.9267C2.35761 11.6466 2.6472 12.3347 3.15627 12.8437C3.66534 13.3528 4.35345 13.6424 5.07333 13.6505L8 13.6962L10.9267 13.6505C11.6466 13.6424 12.3347 13.3528 12.8437 12.8437C13.3528 12.3347 13.6424 11.6466 13.6505 10.9267L13.6963 8ZM11.5947 8C11.5947 8.71097 11.3838 9.40597 10.9888 9.99711C10.5939 10.5883 10.0324 11.049 9.37559 11.3211C8.71874 11.5931 7.99597 11.6643 7.29866 11.5256C6.60136 11.3869 5.96084 11.0446 5.45812 10.5418C4.95539 10.0391 4.61303 9.39858 4.47433 8.70127C4.33564 8.00397 4.40683 7.28119 4.67891 6.62435C4.95099 5.9675 5.41173 5.40609 6.00288 5.0111C6.59403 4.61611 7.28903 4.40529 8 4.4053C8.95304 4.40638 9.86674 4.78545 10.5406 5.45935C11.2145 6.13326 11.5936 7.04696 11.5947 8ZM10.2911 8C10.2911 7.54686 10.1567 7.10389 9.90497 6.72711C9.65322 6.35034 9.29539 6.05668 8.87674 5.88327C8.45809 5.70986 7.99741 5.66449 7.55298 5.75289C7.10854 5.8413 6.7003 6.05951 6.37988 6.37994C6.05946 6.70036 5.84125 7.1086 5.75285 7.55304C5.66445 7.99748 5.70983 8.45815 5.88324 8.8768C6.05666 9.29545 6.35033 9.65328 6.72711 9.90502C7.10388 10.1568 7.54686 10.2911 8 10.2911C8.60742 10.2904 9.18977 10.0488 9.61927 9.61929C10.0488 9.18977 10.2904 8.60742 10.2911 8H10.2911Z"
//                                 fill="currentColor"
//                               />
//                             </svg></div></span></a>
//                     </div>
//                   </div>
//                 </form>
//                 <div className="success-message w-form-done">
//                   <div className="success-text-wrapper">
//                     <div className="lable">Thank you for submitting the form.</div>
//                     <div className="heading-6 white">We’ll talk to you soon!</div>
//                   </div>
//                 </div>
//                 <div className="w-form-fail">
//                   <div>Oops! Something went wrong while submitting the form.</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="css-js">
//             <div className="cursor--script hide w-embed w-script">
//               <Script src="" strategy="lazyOnload"></Script>
//               <Script id="kinet-init-script" strategy="lazyOnload">
//                 {`
//                   var kinet = new Kinet({
//                     acceleration: 0.02,
//                     friction: 0.25,
//                     names: ['x', 'y'],
//                   });

//                   var circle = document.getElementById('circle');
//                   if (circle) {
//                     kinet.on('tick', function (instances) {
//                       circle.style.transform = \`translate3d(\${instances.x.current}px, \${
//                         instances.y.current
//                       }px, 0) rotateX(\${instances.x.velocity / 2}deg) rotateY(\${
//                         instances.y.velocity / 2
//                       }deg)\`;
//                     });

//                     document.addEventListener('mousemove', function (event) {
//                       kinet.animate('x', event.clientX - window.innerWidth / 2);
//                       kinet.animate('y', event.clientY - window.innerHeight / 2);
//                     });
//                   }
//                 `}
//               </Script>
//             </div>
//             <div className="general-styles w-embed">
//               <style jsx global>{`
//                 html {
//                   font-size: 1rem;
//                 }
//                 @media screen and (min-width: 998px) and (max-width: 2800px) {
//                   html {
//                     font-size: 1vw;
//                   }
//                 }
//                 @media screen and (min-width: 2801px) {
//                   html {
//                     font-size: 0.8vw;
//                   }
//                 }
//                 @media screen and (max-width: 997px) and (min-width: 480px) {
//                   html {
//                     font-size: 1vw;
//                   }
//                 }
//                 @media screen and (min-width: 240px) and (max-width: 479px) {
//                   html {
//                     font-size: 4vw;
//                   }
//                 }
//               `}</style>
//             </div>
//             <div className="button-hover-cursor-styles w-embed">
//               <style jsx global>{`
//                 .circle {
//                   width: 0.55rem;
//                   height: 0.55rem;
//                   border-radius: 50%;
//                   position: absolute;
//                   top: 50%;
//                   left: 50%;
//                   margin: -0.2rem 0 0 -0.2rem;
//                   pointer-events: none;
//                   mix-blend-mode: screen;
//                   z-index: 10;
//                   box-shadow: 0rem 0rem 0.55rem 0rem #c8acf0 inset,
//                     0rem 0rem 1.6rem 0rem #c8acf0, 0rem 0rem 0.55rem 0rem #c8acf0;
//                 }
//                 .button-wrapper {
//                   position: relative;
//                 }
//                 .button {
//                   display: flex;
//                   width: 12rem;
//                   height: 4rem;
//                   z-index: 1;
//                   position: relative;
//                   text-decoration: none;
//                   text-align: center;
//                   appearance: none;
//                   transition: 0.6s;
//                   background-color: transparent;
//                   color: black;
//                 }
//                 .radial {
//                   width: 3.4rem;
//                   height: 3.4rem;
//                 }
//                 .app-store {
//                   width: 11rem;
//                 }
//                 .button::after {
//                   content: '';
//                   box-shadow: 0rem 0rem 2.0832rem 0.7rem rgba(255, 255, 255, 0.3)
//                       inset,
//                     0rem 0rem 1.4rem 0.3rem rgba(255, 255, 255, 0.3);
//                   transition: 0.6s;
//                   position: absolute;
//                   top: 0;
//                   right: 0;
//                   left: 0;
//                   bottom: 0;
//                   border-radius: 999px;
//                   opacity: 0;
//                 }
//                 .button-wrapper:hover .button::before,
//                 .button-wrapper:hover .button::after {
//                   opacity: 1;
//                 }
//                 .button-wrapper:hover .dot {
//                   transform: translate(0, 0) rotate(var(--rotatation));
//                 }
//                 .button-wrapper:hover .dot::after {
//                   animation-play-state: running;
//                 }
//                 .button-wrapper:hover .button {
//                   background-color: #c8acf0;
//                   color: #000;
//                 }
//                 .button-wrapper.white-button:hover .button {
//                   background-color: white;
//                   color: #000;
//                 }
//                 .dot {
//                   display: block;
//                   position: absolute;
//                   transition: transform calc(var(--speed) / 12) ease;
//                   width: var(--size);
//                   height: var(--size);
//                   transform: translate(var(--starting-x), var(--starting-y))
//                     rotate(var(--rotatation));
//                 }
//                 .dot::after {
//                   content: '';
//                   animation: hoverFirefly var(--speed) infinite,
//                     dimFirefly calc(var(--speed) / 2) infinite calc(var(--speed) / 3);
//                   animation-play-state: paused;
//                   display: block;
//                   border-radius: 100%;
//                   background: #c8acf0;
//                   width: 100%;
//                   height: 100%;
//                   box-shadow: 0rem 0rem 0.42rem 0rem #c8acf0,
//                     0rem 0rem 0.3rem 0rem #c8acf0 inset,
//                     0rem 0rem 0.14rem 0.069rem #c8acf0;
//                 }
//                 .dot.white-dot::after {
//                   background: white;
//                   box-shadow: 0rem 0rem 0.42rem 0rem white,
//                     0rem 0rem 0.3rem 0rem white inset,
//                     0rem 0rem 0.14rem 0.069rem white;
//                 }
//                 .dot-1 {
//                   --rotatation: 0deg;
//                   --speed: 14s;
//                   --size: 0.41rem;
//                   --starting-x: 2rem;
//                   --starting-y: 1.3rem;
//                   top: 0.13rem;
//                   left: -1.11rem;
//                   opacity: 0.7;
//                 }
//                 .dot-2 {
//                   --rotatation: 122deg;
//                   --speed: 16s;
//                   --size: 0.2rem;
//                   --starting-x: 2.7rem;
//                   --starting-y: 0.6rem;
//                   top: 0.06rem;
//                   left: 0rem;
//                   opacity: 0.7;
//                 }
//                 .dot-3 {
//                   --rotatation: 39deg;
//                   --speed: 20s;
//                   --size: 0.27rem;
//                   --starting-x: -0.7rem;
//                   --starting-y: 1.4rem;
//                   top: -0.55rem;
//                   right: 0.97rem;
//                 }
//                 .dot-4 {
//                   --rotatation: 220deg;
//                   --speed: 18s;
//                   --size: 0.13rem;
//                   --starting-x: -2rem;
//                   --starting-y: -0.34rem;
//                   bottom: 0.27rem;
//                   right: -0.97rem;
//                   opacity: 0.9;
//                 }
//                 .dot-5 {
//                   --rotatation: 190deg;
//                   --speed: 22s;
//                   --size: 0.34rem;
//                   --starting-x: -2.7rem;
//                   --starting-y: -1.4rem;
//                   bottom: -0.41rem;
//                   right: -0.2rem;
//                 }
//                 .dot-6 {
//                   --rotatation: 20deg;
//                   --speed: 15s;
//                   --size: 0.27rem;
//                   --starting-x: 0.83rem;
//                   --starting-y: -1.25rem;
//                   bottom: -0.83rem;
//                   left: 2rem;
//                   opacity: 0.7;
//                 }
//                 .radial-6 {
//                   left: 1.5rem;
//                 }
//                 .dot-7 {
//                   --rotatation: 300deg;
//                   --speed: 19s;
//                   --size: 0.2rem;
//                   --starting-x: 0.41rem;
//                   --starting-y: -1.38rem;
//                   bottom: -1.1rem;
//                   left: 3rem;
//                 }
//                 .radial-7 {
//                   left: 2rem;
//                 }
//                 @media (max-width: 768px) {
//                   .dot {
//                     display: none;
//                   }
//                 }
//                 @media (max-width: 479px) {
//                   .dot {
//                     display: none;
//                   }
//                   .button {
//                     width: 9.5rem;
//                     height: 3.4rem;
//                   }
//                   .radial {
//                     width: 2.4rem;
//                     height: 2.4rem;
//                   }
//                   .app-store {
//                     width: 9rem;
//                   }
//                 }
//                 @keyframes dimFirefly {
//                   0% { opacity: 1; }
//                   25% { opacity: 0.4; }
//                   50% { opacity: 0.8; }
//                   75% { opacity: 0.5; }
//                   100% { opacity: 1; }
//                 }
//                 @keyframes hoverFirefly {
//                   0% { transform: translate(0, 0); }
//                   12% { transform: translate(0.20832rem, 0.06944rem); }
//                   24% { transform: translate(-0.13888rem, 0.20832rem); }
//                   37% { transform: translate(0.13888rem, -0.13888rem); }
//                   55% { transform: translate(-0.06944rem, 0rem); }
//                   74% { transform: translate(0rem, 0.13888rem); }
//                   88% { transform: translate(-0.20832rem, -0.06944rem); }
//                   100% { transform: translate(0, 0); }
//                 }
//               `}</style>
//             </div>
//           </div>
        
        
//         <Script
//           src="../js/jquery-3.5.1.min.js?site=667fa6c733097c1516bb9760"
//           strategy="beforeInteractive"
//           integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
//           crossOrigin="anonymous"
//         />
//         <Script src="../js/webflow.js" strategy="lazyOnload" />
//         <Script src="../librararies/lottieLazyLoading.min.js" strategy="lazyOnload" />

//         {/* Lenis Smooth Scroll */}
//         <Script id="lenis-smooth-scroll-init" strategy="lazyOnload">
//           {`
//             document.addEventListener('DOMContentLoaded', function () {
//               var scriptLoaded = false;

//               function activateScript() {
//                 if (!scriptLoaded) {
//                   var scriptElement = document.createElement('script');
//                   scriptElement.id = 'lenisSmooth';
//                   scriptElement.dataset.idScroll = true;
//                   scriptElement.dataset.autoinit = true;
//                   scriptElement.dataset.duration = '1';
//                   scriptElement.dataset.orientation = 'vertical';
//                   scriptElement.dataset.smoothWheel = true;
//                   scriptElement.dataset.smoothTouch = false;
//                   scriptElement.dataset.touchMultiplier = '1.5';
//                   scriptElement.dataset.easing =
//                     '(t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))';
//                   scriptElement.dataset.useOverscroll = true;
//                   scriptElement.dataset.useControls = true;
//                   scriptElement.dataset.useAnchor = true;
//                   scriptElement.dataset.useRaf = true;
//                   scriptElement.dataset.infinite = false;
//                   scriptElement.defer = true;
//                   scriptElement.src =
//                     'https://assets-global.website-files.com/645e0e1ff7fdb6dc8c85f3a2/64a5544a813c7253b90f2f50_lenis-offbrand.txt';

//                   document.body.appendChild(scriptElement);

//                   scriptElement.onload = function () {
//                     scriptLoaded = true;
//                     document.body.style.overflow = 'visible';
//                   };
//                 }
//               }

//               var preloaderElement = document.querySelector('[data-preloader-element]'); // Changed selector
//               var observer = new IntersectionObserver(
//                 function (entries) {
//                   entries.forEach(function (entry) {
//                     if (!entry.isIntersecting && !scriptLoaded) {
//                       document.body.style.overflow = 'hidden';
//                       activateScript();
//                       observer.disconnect();
//                     }
//                   });
//                 },
//                 { threshold: 0 }
//               );

//               if (preloaderElement) {
//                 observer.observe(preloaderElement);
//               } else {
//                 activateScript();
//               }

//               var stopScrollElement = document.querySelector('[data-stop-scroll]'); // Changed selector
//               if (stopScrollElement) {
//                 stopScrollElement.addEventListener('click', function () {
//                   if (scriptLoaded) {
//                     var scriptToRemove = document.getElementById('lenisSmooth');
//                     if (scriptToRemove) {
//                       scriptToRemove.remove();
//                       scriptLoaded = false;
//                     }
//                     document.body.style.overflow = 'hidden';
//                   }
//                 });
//               }

//               var startScrollElement = document.querySelector('[data-start-scroll]'); // Changed selector
//               if (startScrollElement) {
//                 startScrollElement.addEventListener('click', function () {
//                   activateScript();
//                 });
//               }
//             });
//           `}
//         </Script>
//         {/* End Lenis Smooth Scroll */}

//         {/* Swiper Reviews */}
        
//         {/* End Swiper Reviews */}


//       </>
//     );
//   }


// export default HomePage;