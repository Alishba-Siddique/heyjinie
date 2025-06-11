// // // //src/app/page.tsx
// // // 'use client';

// // // import { useEffect } from 'react';
// // // import { useRouter } from 'next/navigation';

// // // export default function Home() {
// // //   const router = useRouter();

// // //   useEffect(() => {
// // //     router.push('/auth');
// // //   }, [router]);

// // //   return null;
// // // }

// //src/app/page.tsx
// 'use client';

// import React, { useEffect, useState, useRef } from 'react';
// import Script from 'next/script';
// import Head from 'next/head';
// import Lenis from 'lenis'; // Import Lenis from the NPM package
// import Image from 'next/image'; // For optimized images if you choose to use it later
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { contactUs } from '@/services/api.service'; // Adjust path if needed
// import { toast } from 'react-toastify';
// import '../../public/css/style.css';

// // Zod Schema for Contact Form Validation
// const contactFormSchema = z.object({
//   name: z.string().min(1, 'Name is required'),
//   Email: z.string().email('Invalid email address').min(1, 'Email is required'), // Matches 'Email' in HTML
//   field: z.string().min(1, 'Message is required'), // 'field' is the name of the textarea in HTML
// });

// type ContactFormInputs = z.infer<typeof contactFormSchema>;

// const HomePage: React.FC = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<ContactFormInputs>({
//     resolver: zodResolver(contactFormSchema),
//   });

//   const [isFormLoading, setIsFormLoading] = useState(false);
//   const [formSubmitSuccess, setFormSubmitSuccess] = useState(false);
//   const [formSubmitError, setFormSubmitError] = useState<string | null>(null);

//   const contactFormRef = useRef<HTMLFormElement>(null);
//   const contactFormBlockRef = useRef<HTMLDivElement>(null);

//   const onSubmitContact: SubmitHandler<ContactFormInputs> = async (data) => {
//     setIsFormLoading(true);
//     setFormSubmitSuccess(false);
//     setFormSubmitError(null);

//     const sendButton = contactFormBlockRef.current?.querySelector('.send-form');
//     if (sendButton) sendButton.textContent = 'Sending...';

//     try {
//       await contactUs(data);
//       setFormSubmitSuccess(true);
//       toast.success("Message sent successfully! We'll talk to you soon.");
//       reset(); // Reset form fields
//       if (contactFormRef.current && contactFormBlockRef.current) {
//         contactFormRef.current.style.display = 'none';
//         const successMessageDiv =
//           contactFormBlockRef.current.querySelector<HTMLElement>(
//             '.success-message.w-form-done'
//           );
//         if (successMessageDiv) successMessageDiv.style.display = 'block';
//       }
//     } catch (error: any) {
//       const message =
//         error.message ||
//         'Oops! Something went wrong while submitting the form.';
//       setFormSubmitError(message);
//       toast.error(message);
//       if (contactFormBlockRef.current) {
//         const failMessageDiv =
//           contactFormBlockRef.current.querySelector<HTMLElement>(
//             '.w-form-fail'
//           );
//         if (failMessageDiv) {
//           failMessageDiv.style.display = 'block';
//           const errorTextDiv = failMessageDiv.querySelector('div');
//           if (errorTextDiv) errorTextDiv.textContent = message;
//         }
//       }
//     } finally {
//       setIsFormLoading(false);
//       if (sendButton) sendButton.textContent = 'Send';
//     }
//   };

//   // Webflow Initialization & Cleanup
//   useEffect(() => {
//     if ((window as any).Webflow) {
//       (window as any).Webflow.destroy();
//       (window as any).Webflow.ready();
//       (window as any).Webflow.ix2?.init();
//     }
//   }, []);

//   // Kinet Custom Cursor
//   useEffect(() => {
//     const kinetScript = document.getElementById('kinet-script');
//     const initKinet = () => {
//       if (typeof (window as any).Kinet === 'function') {
//         const kinetInstance = new (window as any).Kinet({
//           acceleration: 0.02,
//           friction: 0.25,
//           names: ['x', 'y'],
//         });

//         const circle = document.getElementById('circle');
//         if (circle) {
//           kinetInstance.on('tick', function (instances: any) {
//             circle.style.transform = `translate3d(${instances.x.current}px, ${
//               instances.y.current
//             }px, 0) rotateX(${instances.x.velocity / 2}deg) rotateY(${
//               instances.y.velocity / 2
//             }deg)`;
//           });

//           const handleMouseMove = (event: MouseEvent) => {
//             kinetInstance.animate('x', event.clientX - window.innerWidth / 2);
//             kinetInstance.animate('y', event.clientY - window.innerHeight / 2);
//           };

//           document.addEventListener('mousemove', handleMouseMove);
//           return () =>
//             document.removeEventListener('mousemove', handleMouseMove);
//         }
//       }
//     };

//     if (kinetScript && (kinetScript as any).loaded) {
//       initKinet();
//     } else if (kinetScript) {
//       kinetScript.addEventListener('load', initKinet);
//     } else {
//       // If script is loaded directly, try to init
//       initKinet();
//     }

//     // Cleanup if Kinet was initialized
//     return () => {
//       // Kinet doesn't provide a destroy method in this snippet.
//       // If it did, we would call it here.
//       // Removing the mousemove listener is the main cleanup.
//     };
//   }, []);

//   // Swiper Initialization
//   useEffect(() => {
//     const swiperScript = document.getElementById('swiper-script');
//     let swiperInstance: any = null; // To store the Swiper instance
//     const initSwiper = () => {
//       if (typeof (window as any).Swiper === 'function') {
//         new (window as any).Swiper('.swiper', {
//           // Assuming '.swiper' is the selector for your Swiper container
//           effect: 'cards',
//           grabCursor: true,
//           loop: true,
//           cardsEffect: {
//             slideShadows: false,
//           },
//           navigation: {
//             nextEl: '.swiper-button-next',
//             prevEl: '.swiper-button-prev',
//           },
//           initialSlide: 2,
//         });
//       }
//     };

//     if (swiperScript && (swiperScript as any).loaded) {
//       initSwiper();
//     } else if (swiperScript) {
//       swiperScript.addEventListener('load', initSwiper);
//     } else {
//       // If script is loaded directly (e.g. via <Script strategy="lazyOnload"> and already present)
//       initSwiper();
//     }

//     return () => {
//       // Cleanup Swiper instance
//       if (swiperInstance && typeof swiperInstance.destroy === 'function') {
//         swiperInstance.destroy(true, true); // Parameters: deleteInstance, cleanStyles
//       }
//       if (swiperScript) {
//         swiperScript.removeEventListener('load', initSwiper); // Remove listener if added
//       }
//     };
//   }, []);

//   // Moving Text Background Scroll Effect
//   useEffect(() => {
//     const handleScrollMovingText = () => {
//       const section = document.getElementById('categoriesSection');
//       const textElements =
//         document.querySelectorAll<HTMLElement>('[moving-text]');
//       if (!section || textElements.length === 0) return;

//       const sectionTop = section.offsetTop;
//       const sectionHeight = section.offsetHeight;
//       const scrollPosition = window.scrollY;
//       const scrollStart = sectionTop + sectionHeight * 0.0;
//       const scrollEnd = sectionTop + sectionHeight * 0.25;

//       if (scrollPosition >= scrollStart && scrollPosition <= scrollEnd) {
//         const scrollProgress =
//           (scrollPosition - scrollStart) / (scrollEnd - scrollStart);
//         const backgroundPosition = -500 + scrollProgress * 1000;
//         textElements.forEach((textEl) => {
//           textEl.style.backgroundPosition = `${backgroundPosition}% 0`;
//         });
//       } else if (scrollPosition < scrollStart) {
//         textElements.forEach((textEl) => {
//           textEl.style.backgroundPosition = `-500% 0`;
//         });
//       } else {
//         textElements.forEach((textEl) => {
//           textEl.style.backgroundPosition = `500% 0`;
//         });
//       }
//     };

//     document.addEventListener('scroll', handleScrollMovingText);
//     return () => document.removeEventListener('scroll', handleScrollMovingText);
//   }, []);

//   // Textarea Auto-Expand
//   useEffect(() => {
//     const textarea = document.getElementById(
//       'autoExpand'
//     ) as HTMLTextAreaElement | null;
//     if (!textarea) return;

//     const adjustTextarea = () => {
//       if (window.innerWidth <= 479) {
//         textarea.style.height = 'auto';
//         textarea.style.width = '100%';
//         return;
//       }
//       textarea.style.height = 'auto';
//       textarea.style.height = textarea.scrollHeight + 'px';
//       const textLength = textarea.value.length;
//       if (textLength > 0) {
//         const newWidth = 38 + Math.min(textLength / 2, 42);
//         textarea.style.width = newWidth + 'rem';
//       } else {
//         textarea.style.width = '38rem';
//       }
//     };

//     textarea.addEventListener('input', adjustTextarea);
//     window.addEventListener('resize', adjustTextarea);
//     adjustTextarea(); // Initial call

//     return () => {
//       textarea.removeEventListener('input', adjustTextarea);
//       window.removeEventListener('resize', adjustTextarea);
//     };
//   }, []);

//   // Categories Widget Removal on Mobile
//   useEffect(() => {
//     const removeCategoriesWidget = () => {
//       const element = document.querySelector('.categories-widget');
//       if (window.innerWidth <= 479 && element) {
//         element.remove();
//       }
//     };
//     window.addEventListener('load', removeCategoriesWidget);
//     window.addEventListener('resize', removeCategoriesWidget);
//     removeCategoriesWidget(); // Initial call

//     return () => {
//       window.removeEventListener('load', removeCategoriesWidget);
//       window.removeEventListener('resize', removeCategoriesWidget);
//     };
//   }, []);

// // Add this useEffect to your existing HomePage component
// // Place it with your other useEffect hooks
// // Using the Lenis NPM package you already imported

// useEffect(() => {
//   let lenis: Lenis | null = null;
//   let observerRef: IntersectionObserver | null = null;
//   let rafId: number | null = null;
//   let originalBodyOverflow: string | null = null; // To store the initial body overflow style

//   const initLenis = () => {
//     if (!lenis) {
//       lenis = new Lenis({
//         duration: 1,
//         easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
//         orientation: 'vertical',
//         gestureOrientation: 'vertical',
//         smoothWheel: true,
//         // smoothTouch: false,
//         touchMultiplier: 1.5,
//         infinite: false,
//         autoResize: true,
//         syncTouch: false,
//         syncTouchLerp: 0.075,
//         touchInertiaMultiplier: 35,
//       });

//       const raf = (time:any) => {
//         lenis!.raf(time);
//         rafId = requestAnimationFrame(raf);
//       };
//       rafId = requestAnimationFrame(raf);
//       document.body.style.overflow = 'visible'; // Lenis needs the body to be scrollable
//       // console.log('Lenis initialized, body.style.overflow = visible');
//     }
//   };

//   // Enhanced destroyLenis to give more control over overflow management
//   const destroyLenis = (options: { restoreOriginalOverflow?: boolean, setHidden?: boolean } = {}): void => {
//     if (lenis) {
//       lenis.destroy();
//       lenis = null;
//       // console.log('Lenis instance destroyed');
//     }
//     if (rafId) {
//       cancelAnimationFrame(rafId);
//       rafId = null;
//     }
//     if (options.restoreOriginalOverflow && typeof originalBodyOverflow === 'string') {
//       document.body.style.overflow = originalBodyOverflow;
//       // console.log('Lenis cleanup: body.style.overflow restored to original:', originalBodyOverflow);
//     } else if (options.setHidden) {
//       document.body.style.overflow = 'hidden'; // Explicitly hide scroll
//       // console.log('Lenis cleanup: body.style.overflow set to hidden');
//     }
//     // If no option is provided, overflow is left as is, assuming subsequent calls or unmount will handle it.
//   };

//   const handleStopScroll = (): void => {
//     destroyLenis({ setHidden: true }); // Destroy Lenis and hide scrollbar
//     // console.log('handleStopScroll: body.style.overflow set to hidden');
//   };

//   const handleStartScroll = (): void => {
//     // initLenis will set overflow to 'visible'
//     initLenis();
//     // console.log('handleStartScroll: initLenis called');
//   };

//   const preloaderElement = document.querySelector('[preloader-element]');

//   // Capture original body overflow at the start of the effect
//   originalBodyOverflow = document.body.style.overflow;

//   if (preloaderElement) {
//     document.body.style.overflow = 'hidden'; // Lock scroll while preloader is active
//     // console.log('Preloader found, body.style.overflow set to hidden');
//     observerRef = new IntersectionObserver(
//       (entries: IntersectionObserverEntry[]) => {
//         entries.forEach((entry: IntersectionObserverEntry) => {
//           if (!entry.isIntersecting && !lenis) {
//             // console.log('Preloader no longer intersecting, initializing Lenis.');
//             initLenis();
//             if (observerRef) {
//               observerRef.unobserve(entry.target); 
//               observerRef.disconnect(); // Disconnect observer as its job is done for the preloader
//               observerRef = null; // Nullify the ref
//             }
//           }
//         });
//       },
//       { threshold: 0 }
//     );

//     observerRef.observe(preloaderElement);
//   } else {
//     initLenis();
//     // console.log('No preloader, initLenis called directly.');
//   }

//   // Handle stop/start scroll elements
//   const stopScrollElement = document.querySelector('[stop-scroll]') as HTMLElement | null;
//   const startScrollElement = document.querySelector('[start-scroll]') as HTMLElement | null;

//   if (stopScrollElement) {
//     stopScrollElement.addEventListener('click', handleStopScroll);
//   }

//   if (startScrollElement) {
//     startScrollElement.addEventListener('click', handleStartScroll);
//   }

//   return () => {
//     if (observerRef) {
//       observerRef.disconnect(); // Ensure disconnection on unmount if not already done
//     }

//     if (stopScrollElement) {
//       stopScrollElement.removeEventListener('click', handleStopScroll);
//     }

//     if (startScrollElement) {
//       startScrollElement.removeEventListener('click', handleStartScroll);
//     }

//     const lenisWasActive = !!lenis;
//     // Destroy Lenis instance without immediately changing overflow, as unmount restoration will handle it.
//     destroyLenis({ restoreOriginalOverflow: false }); 

//     // Restore original body overflow only if this effect was managing it (either via Lenis or preloader)
//     if (lenisWasActive || preloaderElement) {
//         if (typeof originalBodyOverflow === 'string') {
//             document.body.style.overflow = originalBodyOverflow;
//             // console.log('Component unmount: body.style.overflow restored to original:', originalBodyOverflow);
//         }
//     }
//   };
// }, []);

//   return (
//     <>
//       <Head>
//         <title>HeyJinie</title>
//         <meta content="HeyJinie" property="og:title" />
//         <meta content="HeyJinie" property="twitter:title" />
//         <meta
//           content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
//           name="viewport"
//         />
//         <link href="/css/style.css" rel="stylesheet" type="text/css" />{' '}
//         {/* Already in layout, but good to have for clarity */}
//         <link
//           href="/images/favicon.ico"
//           rel="shortcut icon"
//           type="image/x-icon"
//         />
//         <link href="/images/apple-touch-icon.png" rel="apple-touch-icon" />
//         <link rel="stylesheet" href="/librararies/swiper-bundle.min.css" />
//       </Head>

//       {/* Body Content */}
//       <main className="page-body">
//         {' '}
//         {/* Changed from body to main for semantics */}
//         <div className="page-wrapper">
//           <div className="custom-cursor-wrapper">
//             <div id="circle" className="circle "></div>
//           </div>
//           <header className="header top">
//             <div
//               data-animation="default"
//               className="navbar w-nav"
//               data-easing2="ease-out-expo"
//               fs-scrolldisable-element="smart-nav"
//               data-easing="ease-out-expo"
//               data-collapse="tiny"
//               style={{
//                 transform:
//                   'translate3d(0px, 0vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                 display: 'none',
//                 opacity: 0,
//               }}
//               data-w-id="f23fd689-580c-ef40-2b14-6c6fa58c66c5"
//               role="banner"
//               data-duration="2000"
//             >
//               <address className="nav-container">
//                 <div
//                   data-w-id="03253246-1992-659c-e393-912827b915ad"
//                   className="logo"
//                 >
//                   <div className="logo-svg w-embed">
//                     <svg
//                       width="181"
//                       height="55"
//                       viewBox="0 0 181 55"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       xmlnsXlink="http://www.w3.org/1999/xlink"
//                     >
                      
//                     </svg>
//                   </div>
//                   <div
//                     data-w-id="437c74fd-02ab-1a96-f011-4dc23ee11d78"
//                     className="logo-svg hover w-embed"
//                   >
//                     <svg
//                       width="181"
//                       height="55"
//                       viewBox="0 0 181 55"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       xmlnsXlink="http://www.w3.org/1999/xlink"
//                     >
//                      ]
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
//                       <a href="#marketplace" className="nav-link w-nav-link">
//                         Marketplace
//                       </a>
//                       <a href="#" className="nav-link hover w-nav-link">
//                         Marketplace
//                       </a>
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
//                               stroke="#41A574"
//                               strokeLinecap="round"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="nav-space"></div>
//                     <div className="nav-link-wrapper">
//                       <a href="#pricing" className="nav-link w-nav-link">
//                         Pricing
//                       </a>
//                       <a href="#" className="nav-link hover w-nav-link">
//                         Pricing
//                       </a>
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
//                               stroke="#41A574"
//                               strokeLinecap="round"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="nav-space"></div>
//                     <div className="nav-link-wrapper">
//                       <a
//                         data-w-id="3eec7af4-0276-6645-7224-400000252098"
//                         href="#"
//                         className="nav-link w-nav-link"
//                       >
//                         Contact us
//                       </a>
//                       <a href="#" className="nav-link hover w-nav-link">
//                         Contact us
//                       </a>
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
//                               stroke="#41A574"
//                               strokeLinecap="round"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="menu-buttons">
//                       <div className="download-buttons">
//                         <a
//                           href="https://apps.apple.com/us/app/heyjinie/id6443644593"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="button-wrapper w-inline-block"
//                         >
//                           <span className="dot-span dot dot-1"></span>
//                           <span className="dot-span dot dot-2"></span>
//                           <span className="dot-span dot dot-3"></span>
//                           <span className="dot-span dot dot-4"></span>
//                           <span className="dot-span dot dot-5"></span>
//                           <span className="dot-span dot dot-6"></span>
//                           <span className="dot-span dot dot-7"></span>
//                           <span className="button app-store px-16 py-4 rounded-full">
//                             <div className="icon-app w-embed">
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
//                             App Store
//                           </span>
//                         </a>
//                         <a
//                           href="https://play.google.com/store/apps/details?id=com.heyjinie&amp;pli=1"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="button-wrapper w-inline-block"
//                         >
//                           <span className="dot-span dot dot-1"></span>
//                           <span className="dot-span dot dot-2"></span>
//                           <span className="dot-span dot dot-3"></span>
//                           <span className="dot-span dot dot-4"></span>
//                           <span className="dot-span dot dot-5"></span>
//                           <span className="dot-span dot dot-6"></span>
//                           <span className="dot-span dot dot-7"></span>
//                           <span className="button px-16 py-4 rounded-full">
//                             <div className="icon-app w-embed">
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
//                             Google Play
//                           </span>
//                         </a>
//                       </div>
//                       <div className="free-tag">
//                         <div className="body-b2-bold blue">
//                           Available for free
//                         </div>
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
//                 </nav>
//                 <div
//                   className="menu-button w-nav-button"
//                   role="button"
//                   tabIndex={0}
//                   aria-label="menu"
//                   aria-controls={undefined /* Needs ID of menu */}
//                   aria-haspopup="menu"
//                   aria-expanded="false"
//                 >
//                   <div className="menu-button-lines">
//                     <div className="menu-line line-1"></div>
//                     <div className="menu-line line-2"></div>
//                   </div>
//                 </div>
//                 <div className="nav-buttons navbar-set">
//                   <div className="download-buttons">
//                     <a
//                       href="https://apps.apple.com/us/app/heyjinie"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="button-wrapper w-inline-block"
//                     >
//                       <span className="dot-span dot dot-1"></span>
//                       <span className="dot-span dot dot-2"></span>
//                       <span className="dot-span dot dot-3"></span>
//                       <span className="dot-span dot dot-4"></span>
//                       <span className="dot-span dot dot-5"></span>
//                       <span className="dot-span dot dot-6"></span>
//                       <span className="dot-span dot dot-7"></span>
//                       <span className="button radial px-16 py-4 rounded-full">
//                         <div className="icon-app w-embed">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="100%"
//                             height="100%"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                           >
//                             <path
//                               d="M14.7129 5.42285C15.3086 4.7002 15.7285 3.71387 15.7285 2.71777C15.7285 2.58105 15.7188 2.44434 15.6992 2.33691C14.7227 2.37598 13.5508 2.98145 12.8574 3.80176C12.3008 4.42676 11.793 5.42285 11.793 6.41895C11.793 6.5752 11.8223 6.72168 11.832 6.77051C11.8906 6.78027 11.9883 6.7998 12.0957 6.7998C12.9648 6.7998 14.0586 6.21387 14.7129 5.42285ZM15.3965 7.00488C13.9414 7.00488 12.75 7.89355 11.9883 7.89355C11.1777 7.89355 10.123 7.06348 8.85352 7.06348C6.44141 7.06348 4 9.05566 4 12.8057C4 15.1494 4.89844 17.6201 6.02148 19.2119C6.97852 20.5596 7.81836 21.6631 9.0293 21.6631C10.2207 21.6631 10.748 20.8721 12.2324 20.8721C13.7363 20.8721 14.0781 21.6436 15.3965 21.6436C16.7051 21.6436 17.5742 20.4424 18.4043 19.2607C19.3223 17.9033 19.7129 16.585 19.7227 16.5166C19.6445 16.4971 17.1445 15.4717 17.1445 12.6104C17.1445 10.1299 19.1074 9.0166 19.2246 8.92871C17.9258 7.06348 15.9434 7.00488 15.3965 7.00488Z"
//                               fill="currentColor"
//                             />
//                           </svg>
//                         </div>
//                       </span>
//                     </a>
//                     <a
//                       href="https://play.google.com/store/apps/heyjinie"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="button-wrapper w-inline-block"
//                     >
//                       <span className="dot-span dot dot-1"></span>
//                       <span className="dot-span dot dot-2"></span>
//                       <span className="dot-span dot dot-3"></span>
//                       <span className="dot-span dot dot-4"></span>
//                       <span className="dot-span dot dot-5"></span>
//                       <span className="dot-span dot dot-6"></span>
//                       <span className="dot-span dot dot-7"></span>
//                       <span className="button radial px-16 py-4 rounded-full">
//                         <div className="icon-app w-embed">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="100%"
//                             height="100%"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                           >
//                             {/* Google Play Icon */}
//                           </svg>
//                         </div>
//                       </span>
//                     </a>
//                   </div>
//                   <div className="download-buttons">
//                     <a
//                       href="https://heyjinie.vercel.app/"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="button-wrapper w-inline-block"
//                     >
//                       <span className=" dot dot-1"></span>
//                       <span className=" dot dot-2"></span>
//                       <span className=" dot dot-3"></span>
//                       <span className=" dot dot-4"></span>
//                       <span className=" dot dot-5"></span>
//                       <span className=" dot dot-6"></span>
//                       <span className=" dot dot-7"></span>
//                       <span className="button app-store px-16 py-4 rounded-full">
//                         <div className="icon-app w-embed">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="100%"
//                             height="100%"
//                             viewBox="0 0 20 20"
//                             fill="none"
//                           >
//                             <path
//                               d="M16.6663 10.0001V15.0001C16.6663 16.8417 15.1747 18.3334 13.333 18.3334H6.66634C4.82467 18.3334 3.33301 16.8417 3.33301 15.0001V10.0001C3.33301 9.54175 3.70801 9.16675 4.16634 9.16675H5.80801C6.26634 9.16675 6.64134 9.54175 6.64134 10.0001V12.6167C6.64134 13.2334 6.98301 13.8001 7.52467 14.0917C7.76634 14.2251 8.03301 14.2917 8.30801 14.2917C8.62467 14.2917 8.94134 14.2001 9.21634 14.0167L10.008 13.5001L10.7413 13.9917C11.2497 14.3334 11.8997 14.3751 12.4413 14.0834C12.9913 13.7917 13.333 13.2334 13.333 12.6084V10.0001C13.333 9.54175 13.708 9.16675 14.1663 9.16675H15.833C16.2913 9.16675 16.6663 9.54175 16.6663 10.0001Z"
//                               fill="#434343"
//                             />
//                             <path
//                               d="M17.9163 5.83341V6.66675C17.9163 7.58341 17.4747 8.33341 16.2497 8.33341H3.74967C2.47467 8.33341 2.08301 7.58341 2.08301 6.66675V5.83341C2.08301 4.91675 2.47467 4.16675 3.74967 4.16675H16.2497C17.4747 4.16675 17.9163 4.91675 17.9163 5.83341Z"
//                               fill="#434343"
//                             />
//                             <path
//                               d="M9.69998 4.16662H5.09998C4.81665 3.85828 4.82498 3.38328 5.12498 3.08328L6.30832 1.89995C6.61665 1.59162 7.12498 1.59162 7.43332 1.89995L9.69998 4.16662Z"
//                               fill="#434343"
//                             />
//                             <path
//                               d="M14.8915 4.16662H10.2915L12.5582 1.89995C12.8665 1.59162 13.3748 1.59162 13.6832 1.89995L14.8665 3.08328C15.1665 3.38328 15.1748 3.85828 14.8915 4.16662Z"
//                               fill="#434343"
//                             />
//                             <path
//                               d="M11.6414 9.16675C12.0997 9.16675 12.4747 9.54175 12.4747 10.0001V12.6084C12.4747 13.2751 11.733 13.6751 11.183 13.3001L10.433 12.8001C10.158 12.6167 9.79971 12.6167 9.51637 12.8001L8.73304 13.3167C8.18304 13.6834 7.44971 13.2834 7.44971 12.6251V10.0001C7.44971 9.54175 7.82471 9.16675 8.28304 9.16675H11.6414Z"
//                               fill="#434343"
//                             />
//                           </svg>
//                         </div>
//                         <span style={{ fontStyle: 'normal' }}>
//                           Start Gifting
//                         </span>
//                       </span>
//                     </a>
//                   </div>
//                 </div>
//               </address>
//             </div>
//           </header>
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
//               <address className="nav-container down">
//                 {/* <div
//                   data-w-id="b32d4afb-1ba7-572e-01ab-ab75fd6e1731"
//                   className="logo down"
//                 >
//                   <div className="logo-svg w-embed">
//                     <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="100%"
//                   height="100%"
//                   viewBox="0 0 100 28"
//                   fill="none"
//                 >
//                   <path
//                     d="M14.1139 9.71678V27.1182H10.5402V13.1037H3.57372V27.1182H0V7.73138C0 5.22043 0.642335 3.28759 1.91533 1.99124C3.21168 0.671535 5.02774 0 7.31679 0C10.1139 0 12.2686 0.969339 13.7168 2.87883L13.8861 3.10657L11.2642 5.23211L11.0832 4.98685C10.2832 3.9124 9.21461 3.38685 7.80147 3.38685C4.95767 3.38685 3.57372 4.91679 3.57372 8.06423V9.71678H14.1139Z"
//                     fill="white"
//                   />
//                   <path
//                     d="M27.3752 25.8041L27.2059 25.9384C25.9855 26.9252 24.4789 27.4216 22.7271 27.4216C20.8176 27.4216 19.3986 26.8318 18.4935 25.6639C17.6117 24.5194 17.1621 22.7617 17.1621 20.4435V5.05078H20.7358V9.72231H26.9023V13.1092H20.7358V20.1398C20.7358 22.7617 21.6176 24.0347 23.4336 24.0347C24.3387 24.0347 25.1679 23.7427 25.9095 23.1646L26.2132 22.9252L27.3752 25.8041Z"
//                     fill="white"
//                   />
//                   <path
//                     d="M43.5854 11.9355C41.892 10.2128 39.6438 9.34277 36.911 9.34277C34.1781 9.34277 31.9183 10.2128 30.2015 11.9355C28.508 13.6231 27.6497 15.807 27.6497 18.4172C27.6497 20.9982 28.508 23.1939 30.2015 24.934L30.2073 24.9457C31.9475 26.6333 34.2015 27.4917 36.911 27.4917C39.6438 27.4917 41.892 26.6333 43.5854 24.9398C45.3022 23.2231 46.1723 21.0274 46.1723 18.4172C46.1723 15.807 45.3022 13.6231 43.5854 11.9355ZM40.8526 22.5515C39.8424 23.5851 38.5168 24.1106 36.911 24.1106C35.3051 24.1106 33.9679 23.5734 32.9343 22.5165C31.9241 21.4829 31.4102 20.1048 31.4102 18.4231C31.4102 16.7413 31.9358 15.369 32.9694 14.3296H32.9752C33.9854 13.2727 35.311 12.7355 36.911 12.7355C38.5168 12.7355 39.8365 13.2727 40.8467 14.3296C41.8862 15.4099 42.4117 16.788 42.4117 18.4231C42.4117 20.1048 41.8862 21.4946 40.8526 22.5515Z"
//                     fill="white"
//                   />
//                   <path
//                     d="M71.4802 3.69014C71.4802 4.33832 71.2817 4.88722 70.8788 5.3135C70.47 5.72226 69.962 5.92663 69.3605 5.92663C68.7357 5.92663 68.2043 5.72809 67.778 5.32517C67.3401 4.89306 67.124 4.34416 67.124 3.69014C67.124 3.08285 67.3459 2.58064 67.7839 2.20108C68.2043 1.80984 68.7357 1.60547 69.3605 1.60547C69.962 1.60547 70.47 1.80984 70.8729 2.2186C71.2758 2.59232 71.4802 3.09452 71.4802 3.69014Z"
//                     fill="white"
//                   />
//                   <path
//                     d="M71.0715 9.7168H67.4978V27.1183H71.0715V9.7168Z"
//                     fill="white"
//                   />
//                   <path
//                     d="M87.6731 22.1194C87.6731 23.8829 87.0015 25.2435 85.6818 26.1661C84.4147 27.0479 82.7972 27.4917 80.876 27.4917C79.5213 27.4917 78.2132 27.2055 76.9811 26.645C75.6965 26.0377 74.8614 25.4187 74.4293 24.7413L74.3184 24.5661L76.3446 21.9968L76.5782 22.2596C77.0454 22.8026 77.7402 23.2756 78.6454 23.6844C80.6074 24.5194 82.2191 24.4435 83.1709 23.7486C83.6672 23.3807 83.9125 22.8961 83.9125 22.2654C83.9125 21.7691 83.6497 21.3603 83.1125 21.0158C82.5169 20.6362 81.7811 20.3209 80.911 20.0814C80.0293 19.807 79.13 19.4858 78.2308 19.1355C77.2906 18.7734 76.4848 18.1895 75.8307 17.407C75.1651 16.5836 74.8322 15.5676 74.8322 14.3822C74.8322 12.8756 75.3928 11.6435 76.5081 10.7209C77.6001 9.80408 79.06 9.34277 80.841 9.34277C83.3753 9.34277 85.3899 10.0377 86.8322 11.4041L87.0074 11.5676L85.279 14.3413L85.022 14.1136C83.8366 13.0741 82.4819 12.5428 80.9928 12.5428C80.2629 12.5428 79.6731 12.7238 79.2293 13.08C78.803 13.4187 78.5928 13.8333 78.5928 14.3413C78.5928 14.8961 78.8556 15.3398 79.3987 15.7077C79.9884 16.0873 80.7183 16.4143 81.5651 16.6829C82.4527 16.9282 83.3694 17.2318 84.2746 17.5822C85.2089 17.9209 86.0147 18.4815 86.6687 19.2347C87.3344 20.0172 87.6731 20.9866 87.6731 22.1194Z"
//                     fill="white"
//                   />
//                   <path
//                     d="M100 25.8041L99.8365 25.9384C98.6161 26.9252 97.1095 27.4216 95.3519 27.4216C93.4482 27.4216 92.0234 26.8318 91.1241 25.6639C90.2423 24.5194 89.7927 22.7617 89.7927 20.4435V5.05078H93.3664V9.72231H99.5329V13.1092H93.3664V20.1398C93.3664 22.7617 94.2482 24.0347 96.0643 24.0347C96.9635 24.0347 97.7986 23.7427 98.5343 23.1646L98.8438 22.9252L100 25.8041Z"
//                     fill="white"
//                   />
//                   <path
//                     d="M64.0877 17.1156V27.1244H60.514V17.6762C60.514 14.5638 59.2001 12.9696 56.4906 12.8236C53.7811 12.9696 52.4673 14.5638 52.4673 17.6762V27.1244H48.8936V17.1156C48.8936 14.0032 49.8045 11.8251 51.6089 10.6047C52.7592 9.82218 54.5812 9.2207 56.4906 9.2207C58.4001 9.2207 60.222 9.82218 61.3724 10.6047C63.1768 11.8251 64.0877 14.0032 64.0877 17.1156Z"
//                     fill="white"
//                   />
//                 </svg>
//                   </div>
//                   <div
//                     data-w-id="b32d4afb-1ba7-572e-01ab-ab75fd6e1733"
//                     className="logo-svg hover w-embed"
//                   >
//                     <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="100%"
//                   height="100%"
//                   viewBox="0 0 100 28"
//                   fill="none"
//                 >
//                   <path
//                     d="M14.1139 9.71678V27.1182H10.5402V13.1037H3.57372V27.1182H0V7.73138C0 5.22043 0.642335 3.28759 1.91533 1.99124C3.21168 0.671535 5.02774 0 7.31679 0C10.1139 0 12.2686 0.969339 13.7168 2.87883L13.8861 3.10657L11.2642 5.23211L11.0832 4.98685C10.2832 3.9124 9.21461 3.38685 7.80147 3.38685C4.95767 3.38685 3.57372 4.91679 3.57372 8.06423V9.71678H14.1139Z"
//                     fill="url(#paint0_radial_3546_14390)"
//                   />
//                   <path
//                     d="M27.3752 25.8041L27.2059 25.9384C25.9855 26.9252 24.4789 27.4216 22.7271 27.4216C20.8176 27.4216 19.3986 26.8318 18.4935 25.6639C17.6117 24.5194 17.1621 22.7617 17.1621 20.4435V5.05078H20.7358V9.72231H26.9023V13.1092H20.7358V20.1398C20.7358 22.7617 21.6176 24.0347 23.4336 24.0347C24.3387 24.0347 25.1679 23.7427 25.9095 23.1646L26.2132 22.9252L27.3752 25.8041Z"
//                     fill="url(#paint1_radial_3546_14390)"
//                   />
//                   <path
//                     d="M43.5854 11.9355C41.892 10.2128 39.6438 9.34277 36.911 9.34277C34.1781 9.34277 31.9183 10.2128 30.2015 11.9355C28.508 13.6231 27.6497 15.807 27.6497 18.4172C27.6497 20.9982 28.508 23.1939 30.2015 24.934L30.2073 24.9457C31.9475 26.6333 34.2015 27.4917 36.911 27.4917C39.6438 27.4917 41.892 26.6333 43.5854 24.9398C45.3022 23.2231 46.1723 21.0274 46.1723 18.4172C46.1723 15.807 45.3022 13.6231 43.5854 11.9355ZM40.8526 22.5515C39.8424 23.5851 38.5168 24.1106 36.911 24.1106C35.3051 24.1106 33.9679 23.5734 32.9343 22.5165C31.9241 21.4829 31.4102 20.1048 31.4102 18.4231C31.4102 16.7413 31.9358 15.369 32.9694 14.3296H32.9752C33.9854 13.2727 35.311 12.7355 36.911 12.7355C38.5168 12.7355 39.8365 13.2727 40.8467 14.3296C41.8862 15.4099 42.4117 16.788 42.4117 18.4231C42.4117 20.1048 41.8862 21.4946 40.8526 22.5515Z"
//                     fill="url(#paint2_radial_3546_14390)"
//                   />
//                   <path
//                     d="M71.4802 3.69014C71.4802 4.33832 71.2817 4.88722 70.8788 5.3135C70.47 5.72226 69.962 5.92663 69.3605 5.92663C68.7357 5.92663 68.2043 5.72809 67.778 5.32517C67.3401 4.89306 67.124 4.34416 67.124 3.69014C67.124 3.08285 67.3459 2.58064 67.7839 2.20108C68.2043 1.80984 68.7357 1.60547 69.3605 1.60547C69.962 1.60547 70.47 1.80984 70.8729 2.2186C71.2758 2.59232 71.4802 3.09452 71.4802 3.69014Z"
//                     fill="url(#paint3_radial_3546_14390)"
//                   />
//                   <path
//                     d="M71.0715 9.7168H67.4978V27.1183H71.0715V9.7168Z"
//                     fill="url(#paint4_radial_3546_14390)"
//                   />
//                   <path
//                     d="M87.6731 22.1194C87.6731 23.8829 87.0015 25.2435 85.6818 26.1661C84.4147 27.0479 82.7972 27.4917 80.876 27.4917C79.5213 27.4917 78.2132 27.2055 76.9811 26.645C75.6965 26.0377 74.8614 25.4187 74.4293 24.7413L74.3184 24.5661L76.3446 21.9968L76.5782 22.2596C77.0454 22.8026 77.7402 23.2756 78.6454 23.6844C80.6074 24.5194 82.2191 24.4435 83.1709 23.7486C83.6672 23.3807 83.9125 22.8961 83.9125 22.2654C83.9125 21.7691 83.6497 21.3603 83.1125 21.0158C82.5169 20.6362 81.7811 20.3209 80.911 20.0814C80.0293 19.807 79.13 19.4858 78.2308 19.1355C77.2906 18.7734 76.4848 18.1895 75.8307 17.407C75.1651 16.5836 74.8322 15.5676 74.8322 14.3822C74.8322 12.8756 75.3928 11.6435 76.5081 10.7209C77.6001 9.80408 79.06 9.34277 80.841 9.34277C83.3753 9.34277 85.3899 10.0377 86.8322 11.4041L87.0074 11.5676L85.279 14.3413L85.022 14.1136C83.8366 13.0741 82.4819 12.5428 80.9928 12.5428C80.2629 12.5428 79.6731 12.7238 79.2293 13.08C78.803 13.4187 78.5928 13.8333 78.5928 14.3413C78.5928 14.8961 78.8556 15.3398 79.3987 15.7077C79.9884 16.0873 80.7183 16.4143 81.5651 16.6829C82.4527 16.9282 83.3694 17.2318 84.2746 17.5822C85.2089 17.9209 86.0147 18.4815 86.6687 19.2347C87.3344 20.0172 87.6731 20.9866 87.6731 22.1194Z"
//                     fill="url(#paint5_radial_3546_14390)"
//                   />
//                   <path
//                     d="M100 25.8041L99.8365 25.9384C98.6161 26.9252 97.1095 27.4216 95.3519 27.4216C93.4482 27.4216 92.0234 26.8318 91.1241 25.6639C90.2423 24.5194 89.7927 22.7617 89.7927 20.4435V5.05078H93.3664V9.72231H99.5329V13.1092H93.3664V20.1398C93.3664 22.7617 94.2482 24.0347 96.0643 24.0347C96.9635 24.0347 97.7986 23.7427 98.5343 23.1646L98.8438 22.9252L100 25.8041Z"
//                     fill="url(#paint6_radial_3546_14390)"
//                   />
//                   <path
//                     d="M64.0877 17.1156V27.1244H60.514V17.6762C60.514 14.5638 59.2001 12.9696 56.4906 12.8236C53.7811 12.9696 52.4673 14.5638 52.4673 17.6762V27.1244H48.8936V17.1156C48.8936 14.0032 49.8045 11.8251 51.6089 10.6047C52.7592 9.82218 54.5812 9.2207 56.4906 9.2207C58.4001 9.2207 60.222 9.82218 61.3724 10.6047C63.1768 11.8251 64.0877 14.0032 64.0877 17.1156Z"
//                     fill="url(#paint7_radial_3546_14390)"
//                   />
//                   <defs>
//                     <radialGradient
//                       id="paint0_radial_3546_14390"
//                       cx="0"
//                       cy="0"
//                       r="1"
//                       gradientUnits="userSpaceOnUse"
//                       gradientTransform="translate(72.8334 27.4917) rotate(-160.644) scale(82.9454 55.0158)"
//                     >
//                       <stop stopColor="#FFB8E0" />
//                       <stop offset="0.38895" stopColor="#BE9EFF" />
//                       <stop offset="0.673962" stopColor="#88C0FC" />
//                       <stop offset="1" stopColor="#86FF99" />
//                     </radialGradient>
//                     <radialGradient
//                       id="paint1_radial_3546_14390"
//                       cx="0"
//                       cy="0"
//                       r="1"
//                       gradientUnits="userSpaceOnUse"
//                       gradientTransform="translate(72.8334 27.4917) rotate(-160.644) scale(82.9454 55.0158)"
//                     >
//                       <stop stopColor="#FFB8E0" />
//                       <stop offset="0.38895" stopColor="#BE9EFF" />
//                       <stop offset="0.673962" stopColor="#88C0FC" />
//                       <stop offset="1" stopColor="#86FF99" />
//                     </radialGradient>
//                     <radialGradient
//                       id="paint2_radial_3546_14390"
//                       cx="0"
//                       cy="0"
//                       r="1"
//                       gradientUnits="userSpaceOnUse"
//                       gradientTransform="translate(72.8334 27.4917) rotate(-160.644) scale(82.9454 55.0158)"
//                     >
//                       <stop stopColor="#FFB8E0" />
//                       <stop offset="0.38895" stopColor="#BE9EFF" />
//                       <stop offset="0.673962" stopColor="#88C0FC" />
//                       <stop offset="1" stopColor="#86FF99" />
//                     </radialGradient>
//                     <radialGradient
//                       id="paint3_radial_3546_14390"
//                       cx="0"
//                       cy="0"
//                       r="1"
//                       gradientUnits="userSpaceOnUse"
//                       gradientTransform="translate(72.8334 27.4917) rotate(-160.644) scale(82.9454 55.0158)"
//                     >
//                       <stop stopColor="#FFB8E0" />
//                       <stop offset="0.38895" stopColor="#BE9EFF" />
//                       <stop offset="0.673962" stopColor="#88C0FC" />
//                       <stop offset="1" stopColor="#86FF99" />
//                     </radialGradient>
//                     <radialGradient
//                       id="paint4_radial_3546_14390"
//                       cx="0"
//                       cy="0"
//                       r="1"
//                       gradientUnits="userSpaceOnUse"
//                       gradientTransform="translate(72.8334 27.4917) rotate(-160.644) scale(82.9454 55.0158)"
//                     >
//                       <stop stopColor="#FFB8E0" />
//                       <stop offset="0.38895" stopColor="#BE9EFF" />
//                       <stop offset="0.673962" stopColor="#88C0FC" />
//                       <stop offset="1" stopColor="#86FF99" />
//                     </radialGradient>
//                     <radialGradient
//                       id="paint5_radial_3546_14390"
//                       cx="0"
//                       cy="0"
//                       r="1"
//                       gradientUnits="userSpaceOnUse"
//                       gradientTransform="translate(72.8334 27.4917) rotate(-160.644) scale(82.9454 55.0158)"
//                     >
//                       <stop stopColor="#FFB8E0" />
//                       <stop offset="0.38895" stopColor="#BE9EFF" />
//                       <stop offset="0.673962" stopColor="#88C0FC" />
//                       <stop offset="1" stopColor="#86FF99" />
//                     </radialGradient>
//                     <radialGradient
//                       id="paint6_radial_3546_14390"
//                       cx="0"
//                       cy="0"
//                       r="1"
//                       gradientUnits="userSpaceOnUse"
//                       gradientTransform="translate(72.8334 27.4917) rotate(-160.644) scale(82.9454 55.0158)"
//                     >
//                       <stop stopColor="#FFB8E0" />
//                       <stop offset="0.38895" stopColor="#BE9EFF" />
//                       <stop offset="0.673962" stopColor="#88C0FC" />
//                       <stop offset="1" stopColor="#86FF99" />
//                     </radialGradient>
//                     <radialGradient
//                       id="paint7_radial_3546_14390"
//                       cx="0"
//                       cy="0"
//                       r="1"
//                       gradientUnits="userSpaceOnUse"
//                       gradientTransform="translate(72.8334 27.4917) rotate(-160.644) scale(82.9454 55.0158)"
//                     >
//                       <stop stopColor="#FFB8E0" />
//                       <stop offset="0.38895" stopColor="#BE9EFF" />
//                       <stop offset="0.673962" stopColor="#88C0FC" />
//                       <stop offset="1" stopColor="#86FF99" />
//                     </radialGradient>
//                   </defs>
//                 </svg>
//                   </div>
//                 </div> */}
//                 <nav
//                   role="navigation"
//                   data-lenis-prevent=""
//                   className="nav-menu-wrapper w-nav-menu"
//                 >
//                   <div className="nav-menu">
//                     <div className="nav-link-wrapper">
//                       <a href="#marketplace" className="nav-link w-nav-link">
//                         Marketplace
//                       </a>
//                       <a href="#" className="nav-link hover w-nav-link">
//                         Marketplace
//                       </a>
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
//                               stroke="#41A574"
//                               strokeLinecap="round"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="nav-space"></div>
//                     <div className="nav-link-wrapper">
//                       <a href="#pricing" className="nav-link w-nav-link">
//                         Pricing
//                       </a>
//                       <a href="#" className="nav-link hover w-nav-link">
//                         Pricing
//                       </a>
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
//                               stroke="#41A574"
//                               strokeLinecap="round"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="nav-space"></div>
//                     <div className="nav-link-wrapper">
//                       <a
//                         data-w-id="b32d4afb-1ba7-572e-01ab-ab75fd6e174e"
//                         href="#"
//                         className="nav-link w-nav-link"
//                       >
//                         Contact us
//                       </a>
//                       <a href="#" className="nav-link hover w-nav-link">
//                         Contact us
//                       </a>
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
//                               stroke="#41A574"
//                               strokeLinecap="round"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="menu-buttons">
//                       <div className="download-buttons">
//                         <a
//                           href="https://apps.apple.com/us/app/heyjinie"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="button-wrapper w-inline-block"
//                         >
//                           <span className="dot-span dot dot-1"></span>
//                           <span className="dot-span dot dot-2"></span>
//                           <span className="dot-span dot dot-3"></span>
//                           <span className="dot-span dot dot-4"></span>
//                           <span className="dot-span dot dot-5"></span>
//                           <span className="dot-span dot dot-6"></span>
//                           <span className="dot-span dot dot-7"></span>
//                           <span className="button app-store  px-16 py-4 rounded-full">
//                             <div className="icon-app w-embed">
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
//                             App Store
//                           </span>
//                         </a>
//                         <a
//                           href="https://play.google.com/store/apps/heyjinie"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="button-wrapper w-inline-block"
//                         >
//                           <span className="dot-span dot dot-1"></span>
//                           <span className="dot-span dot dot-2"></span>
//                           <span className="dot-span dot dot-3"></span>
//                           <span className="dot-span dot dot-4"></span>
//                           <span className="dot-span dot dot-5"></span>
//                           <span className="dot-span dot dot-6"></span>
//                           <span className="dot-span dot dot-7"></span>
//                           <span className="button px-16 py-4 rounded-full">
//                             <div className="icon-app w-embed">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="100%"
//                                 height="100%"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                               ></svg>
//                             </div>
//                             Google Play
//                           </span>
//                         </a>
//                       </div>
//                       <div className="free-tag">
//                         <div className="body-b2-bold">Available for free</div>
//                         <div className="hero-tag-line w-embed">
//                           <svg
//                             width="100%"
//                             height="100%"
//                             viewBox="0 0 143 5"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                           ></svg>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </nav>
//                 <div className="menu-button w-nav-button">
//                   <div className="menu-button-lines">
//                     <div className="menu-line line-1"></div>
//                     <div className="menu-line line-2"></div>
//                   </div>
//                 </div>
//                 <div className="nav-buttons navbar-set">
//                   <a
//                     href="https://apps.apple.com/us/app/heyjinie"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="button-wrapper white-button w-inline-block"
//                   >
//                     <span className="dot-span dot dot-1 white-dot"></span>
//                     <span className="dot-span dot dot-2 white-dot"></span>
//                     <span className="dot-span dot dot-3 white-dot"></span>
//                     <span className="dot-span dot dot-4 white-dot"></span>
//                     <span className="dot-span dot dot-5 white-dot"></span>
//                     <span className="dot-span dot dot-6 white-dot"></span>
//                     <span className="dot-span dot dot-7 white-dot"></span>
//                     <span className="button radial px-16 py-4 rounded-full">
//                       <div className="icon-app w-embed">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="100%"
//                           height="100%"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                         ></svg>
//                       </div>
//                     </span>
//                   </a>
//                   <a
//                     href="https://play.google.com/store/apps/heyjinie"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="button-wrapper white-button w-inline-block"
//                   >
//                     <span className="dot-span dot dot-1 white-dot"></span>
//                     <span className="dot-span dot dot-2 white-dot"></span>
//                     <span className="dot-span dot dot-3 white-dot"></span>
//                     <span className="dot-span dot dot-4 white-dot"></span>
//                     <span className="dot-span dot dot-5 white-dot"></span>
//                     <span className="dot-span dot dot-6 white-dot"></span>
//                     <span className="dot-span dot dot-7 white-dot"></span>
//                     <span className="button radial px-16 py-4 rounded-full">
//                       <div className="icon-app w-embed">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="100%"
//                           height="100%"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                         ></svg>
//                       </div>
//                     </span>
//                   </a>
//                 </div>
//               </address>
//             </div>
//           </header>

//           {/* Sections */}
//           <div
//             id="hero"
//             data-scroll-time="0"
//             style={{
//               transform:
//                 'translate3d(0px, 0vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//             }}
//             className="sections"
//           >
//             {/* Hero Section */}
//             <section id="hero-3" data-scroll-time="0.3" className="hero-sc">
//               {/* ... content of hero-sc ... */}
//               <div
//                 data-w-id="83f81923-1b75-c8dc-d4eb-6d2d733b9ce9"
//                 className="hero-height"
//               >
//                 <div className="hero-sticky">
//                   <div className="container hero-s">
//                     <div className="hero-background-wrapper">
//                       <div className="hero-mobiles-frame">
//                         <div
//                           data-w-id="0d266ba2-097f-e8bc-8721-e41ab0acc793"
//                           style={{
//                             transform:
//                               'translate3d(0px, 60vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                           }}
//                           className="lotties-frame"
//                         >
//                           <div className="div-block-6">
//                             <img
//                               src="/images/phone-1.png"
//                               loading="lazy"
//                               sizes="(max-width: 479px) 100vw, 24vw"
//                               srcSet="/images/phone-1.png 500w, /images/phone-1.png 720w"
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
//                               src="/images/Blue.png"
//                               loading="lazy"
//                               style={{
//                                 transform:
//                                   'translate3d(0px, 150vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                               }}
//                               sizes="(max-width: 479px) 100vw, 22vw"
//                               alt=""
//                               srcSet="/images/Blue.png 500w, /images/Blue.png 532w"
//                               className="image-contain hero"
//                             />
//                           </div>
//                         </div>
//                         <div className="load-block">
//                           <div className="hero-image-frame blue">
//                             <img
//                               src="/images/Headphones.png"
//                               loading="lazy"
//                               style={{
//                                 transform:
//                                   'translate3d(0px, 150vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                               }}
//                               sizes="(max-width: 479px) 100vw, 22vw"
//                               alt=""
//                               srcSet="/images/Headphones.png 500w, /images/Headphones.png 532w"
//                               className="image-contain hero"
//                             />
//                           </div>
//                         </div>
//                         <div className="load-block">
//                           <div className="hero-image-frame watch">
//                             <img
//                               src="/images/Chocolates.png"
//                               loading="lazy"
//                               style={{
//                                 transform:
//                                   'translate3d(0px, 150vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                               }}
//                               sizes="(max-width: 479px) 100vw, 19vw"
//                               alt=""
//                               srcSet="/images/Chocolates.png 500w, /images/Chocolates.png 516w"
//                               className="image-contain hero"
//                             />
//                           </div>
//                         </div>
//                         <div className="load-block">
//                           <div className="hero-image-frame green">
//                             <img
//                               src="/images/Green.png"
//                               loading="lazy"
//                               style={{
//                                 transform:
//                                   'translate3d(0px, 150vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                               }}
//                               sizes="(max-width: 479px) 100vw, 22vw"
//                               alt=""
//                               srcSet="/images/Green.png 500w, /images/Green.png 678w"
//                               className="image-contain hero"
//                             />
//                           </div>
//                         </div>
//                         <div className="load-block">
//                           <div className="hero-image-frame pink">
//                             <img
//                               src="/images/Cupcake.png"
//                               loading="lazy"
//                               style={{
//                                 transform:
//                                   'translate3d(0px, 150vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                               }}
//                               sizes="(max-width: 479px) 100vw, 22vw"
//                               alt=""
//                               srcSet="/images/Cupcake.png 500w, /images/Cupcake.png 678w"
//                               className="image-contain hero"
//                             />
//                           </div>
//                         </div>
//                         <div className="load-block">
//                           <div className="hero-image-frame stats">
//                             <img
//                               src="/images/Sambas.png"
//                               loading="lazy"
//                               style={{
//                                 transform:
//                                   'translate3d(0px, 150vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                               }}
//                               alt=""
//                               className="image-contain hero"
//                             />
//                           </div>
//                         </div>
//                         {/* Duplicate Sambas image block - kept as is */}
//                         <div className="load-block">
//                           <div className="hero-image-frame stats">
//                             <img
//                               src="/images/Sambas.png"
//                               loading="lazy"
//                               style={{
//                                 transform:
//                                   'translate3d(0px, 150vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
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
//                                   <img src="/images/001.png" alt="icon" />
//                                 </span>
//                               </div>
//                               <div className="mobiles-icon">
//                                 <span>
//                                   <img src="/images/002.png" alt="icon" />
//                                 </span>
//                               </div>
//                               <div className="mobiles-icon">
//                                 <span>
//                                   <img src="/images/003.png" alt="icon" />
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
//                               style={{
//                                 textAlign: 'center',
//                                 marginBottom: '30px !important',
//                               }}
//                             >
//                               These aren&apos;t just cute stickers.
//                               <br />
//                               They come with real products you or your friends
//                               can tap and claim instantly — whether you&apos;re
//                               sharing a moment or treating yourself.
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
//                               transform:
//                                 'translate3d(0px, 10rem, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                             }}
//                             className="heading-3"
//                           >
//                             Effortless Gifting,
//                             <br />
//                             Endless Possibilities...
//                           </h2>
//                           <p className="body-b2 gray-3">
//                             With Heyjinie, you can send real, fun gifts from
//                             your chat — anytime, anywhere.
//                           </p>
//                         </div>
//                         <div
//                           data-w-id="77a7cfba-bf1e-d301-bca9-d53c83f21e07"
//                           style={{
//                             opacity: 0,
//                             transform:
//                               'translate3d(0px, 20rem, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                           }}
//                           className="download-buttons"
//                         >
//                           <a
//                             href="https://apps.apple.com/us/app/heyjinie"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="button-wrapper w-inline-block"
//                           >
//                             <span className="dot-span dot dot-1"></span>
//                             <span className="dot-span dot dot-2"></span>
//                             <span className="dot-span dot dot-3"></span>
//                             <span className="dot-span dot dot-4"></span>
//                             <span className="dot-span dot dot-5"></span>
//                             <span className="dot-span dot dot-6"></span>
//                             <span className="dot-span dot dot-7"></span>
//                             <span className="button app-store px-16 py-4 rounded-full">
//                               <div className="icon-app w-embed">
//                                 <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   width="100%"
//                                   height="100%"
//                                   viewBox="0 0 24 24"
//                                   fill="none"
//                                 ></svg>
//                               </div>
//                               App Store
//                             </span>
//                           </a>
//                           <a
//                             href="https://play.google.com/store/apps/heyjinie"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="button-wrapper w-inline-block"
//                           >
//                             <span className="dot-span dot dot-1"></span>
//                             <span className="dot-span dot dot-2"></span>
//                             <span className="dot-span dot dot-3"></span>
//                             <span className="dot-span dot dot-4"></span>
//                             <span className="dot-span dot dot-5"></span>
//                             <span className="dot-span dot dot-6"></span>
//                             <span className="dot-span dot dot-7"></span>
//                             <span className="button px-16 py-4 rounded-full">
//                               <div className="icon-app w-embed">
//                                 <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   width="100%"
//                                   height="100%"
//                                   viewBox="0 0 24 24"
//                                   fill="none"
//                                 ></svg>
//                               </div>
//                               Google Play
//                             </span>
//                           </a>
//                         </div>
//                       </div>
//                       <div
//                         data-w-id="3a9e7d67-d644-0c9d-bfe2-4ae01364b680"
//                         className="hero-background-card"
//                       ></div>
//                       <div
//                         data-w-id="3a9e7d67-d644-0c9d-bfe2-4ae01364b680"
//                         className="hero-background-card bg-card-css w-embed"
//                       ></div>

//                       <div
//                         data-w-id="43f2b9ae-e245-b884-bb82-f10012d757fd"
//                         style={{
//                           transform:
//                             'translate3d(0px, 0px, 0px) scale3d(2, 2, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                           opacity: 1,
//                         }}
//                         className="hero-background-card preloader"
//                       ></div>
//                       <div
//                         preloader-element=""
//                         data-w-id="beabe77a-f0fe-e95a-e72f-9551ddb53804"
//                         style={{ display: 'flex' }}
//                         className="preloader-lottie-wrapper"
//                       >
//                         <div className="preloader-element">
//                           <img
//                             src="/images/logoicons.png"
//                             alt="HeyJinie Preloader Logo"
//                           />
//                         </div>
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
//             {/* Marketplace Section */}
//             <section className="marketplace-sc">
//               <div className="marketplace-height">
//                 <div
//                   data-w-id="439ace2f-163b-ba6d-dd45-89037edc1b74"
//                   className="marketplace-subheight"
//                 >
//                   <div id="marketplace" className="marketplace-anchor"></div>
//                   <div className="marketplace-sticky">
//                     <div className="container marketplace-sc">
//                       <div className="marketplace-text-column">
//                         <div className="marketplace-text-block set-1">
//                           <div className="marketplace-header-block">
//                             <div
//                               className="marketplace-header-cell"
//                               style={{ marginTop: '80px' }}
//                             >
//                               <h2 className="heading-5 black">
//                                 Gifts for Every Occasion
//                               </h2>
//                             </div>
//                           </div>
//                           <div className="marketplace-mobile-header">
//                             <h2 className="heading-5 black">
//                               Gifts for Every Occasion
//                             </h2>
//                           </div>
//                           <div className="body-b2 black">
//                             From birthdays to “just because” — or even a little
//                             something for yourself. Explore our huge collection
//                             of fun and useful products ready to send, share, or
//                             shop in seconds.
//                           </div>
//                         </div>
//                       </div>
//                       <div className="lottie-animation">
//                         <img src="/images/work-s.png" alt="Work Setup" />
//                       </div>
//                       <div className="gradient-marketplace"></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* Categories Desktop Section */}
//             <section style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
//               <div className="categories-height">
//                 <div
//                   id="categoriesSection"
//                   data-w-id="a4173fd1-d22c-cfe1-4a50-7064c0dfc847"
//                   className="categories-subheight"
//                 >
//                   <div className="categories-sticky">
//                     <div className="container categories-sc">
//                       <div className="stickers-second-header">
//                         <div className="flex-row">
//                           <h1
//                             moving-text=""
//                             className="heading-3 white fade"
//                             style={{ textAlign: 'center' }}
//                           >
//                             Celebrate, No Matter the Distance
//                           </h1>
//                           <p
//                             moving-text=""
//                             className="body-b2 white fade"
//                             style={{ textAlign: 'center' }}
//                           >
//                             Near or far, you can still make someone smile — or
//                             lift your own mood.
//                           </p>
//                         </div>
//                       </div>
//                       <div className="categories-content-wrapper">
//                         <div className="categories-headers-wrapper">
//                           <div className="categories-header-cell cell-1">
//                             <div className="categories-color-header">
//                               <div
//                                 style={{ color: 'rgb(0, 0, 0)' }}
//                                 className="heading-3 height size-set"
//                               >
//                                 Send
//                               </div>
//                               <div className="heading-3 gradient">Send</div>
//                             </div>
//                             <div
//                               style={{ color: 'rgb(0, 0, 0)' }}
//                               className="heading-3 height size-set"
//                             >
//                               real product
//                             </div>
//                           </div>
//                           <div className="categories-header-cell cell-2">
//                             <div className="categories-color-header">
//                               <div
//                                 style={{ color: 'rgb(0, 0, 0)' }}
//                                 className="heading-3 height size-set"
//                               >
//                                 stickers instantly
//                               </div>
//                               <div
//                                 data-w-id="45b34588-bc97-25cd-4d6b-2bc55c7ac845"
//                                 className="heading-3 gradient"
//                               >
//                                 instantly
//                               </div>
//                             </div>
//                           </div>
//                           <div className="categories-header-cell cell-3">
//                             <div className="categories-color-header">
//                               <div
//                                 style={{ color: 'rgb(0, 0, 0)' }}
//                                 className="heading-3 height size-set"
//                               >
//                                 right from your keyboard
//                               </div>
//                               <div
//                                 data-w-id="13144530-df0e-8854-608c-bf17bf76eca3"
//                                 className="heading-3 gradient"
//                               >
//                                 your keyboard
//                               </div>
//                             </div>
//                           </div>
//                           <div className="categories-header-cell cell-4">
//                             <div className="categories-color-header">
//                               <div
//                                 style={{ color: 'rgb(0, 0, 0)' }}
//                                 className="heading-3 height size-set"
//                               >
//                                 inside your favorite
//                               </div>
//                               <div
//                                 data-w-id="41eba5c2-58e7-5b1a-c5b5-04aa06ef355d"
//                                 className="heading-3 gradient"
//                               >
//                                 favorite
//                               </div>
//                             </div>
//                           </div>
//                           <div className="categories-header-cell cell-5">
//                             <div className="categories-color-header">
//                               <div
//                                 style={{ color: 'rgb(0, 0, 0)' }}
//                                 className="heading-3 height size-set"
//                               >
//                                 messenger
//                               </div>
//                               <div
//                                 data-w-id="41eba5c2-58e7-5b1a-c5b5-04aa06ef355d"
//                                 className="heading-3 gradient"
//                               >
//                                 messenger
//                               </div>
//                             </div>
//                             <div
//                               style={{ color: 'rgb(0, 0, 0)' }}
//                               className="heading-3 height size-set"
//                             >
//                               app
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>
//             {/* Categories Mobile Section */}
//             <section
//               style={{ backgroundColor: 'rgb(255, 255, 255)' }}
//               className="categories-mobile-sc"
//             >
//               <div className="container categories-mobile-sc">
//                 <div className="categories-wrapper">
//                   <div className="category-block">
//                     <div className="category-icon-wrapper">
//                       <img
//                         src="/images/0004.png"
//                         loading="lazy"
//                         alt=""
//                         className="image-contain"
//                       />
//                     </div>
//                     <div className="category-text-wrapper">
//                       <div className="category-first-header">
//                         <h2
//                           style={{ color: 'rgb(0, 0, 0)' }}
//                           className="heading-3 height size-set"
//                         >
//                           Send
//                         </h2>
//                         <h2 className="heading-3 gradient">Send</h2>
//                       </div>
//                       <h2
//                         style={{ color: 'rgb(0, 0, 0)' }}
//                         className="heading-3 height size-set"
//                       >
//                         real product
//                       </h2>
//                     </div>
//                   </div>
//                   <div className="category-block">
//                     <div className="category-icon-wrapper">
//                       <img src="/images/0002.png" loading="lazy" alt="" />
//                     </div>
//                     <div className="category-text-wrapper">
//                       <h2
//                         style={{ color: 'rgb(0, 0, 0)' }}
//                         className="heading-3 height size-set"
//                       >
//                         stickers
//                       </h2>
//                       <div className="category-first-header">
//                         <h2
//                           style={{ color: 'rgb(0, 0, 0)' }}
//                           className="heading-3 height size-set"
//                         >
//                           instantly
//                         </h2>
//                         <h2 className="heading-3 gradient">instantly</h2>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="category-block">
//                     <div className="category-icon-wrapper">
//                       <img
//                         src="/images/0003.png"
//                         loading="lazy"
//                         alt=""
//                         className="image-contain"
//                       />
//                     </div>
//                     <div className="category-text-wrapper">
//                       <div
//                         style={{ color: 'rgb(0, 0, 0)' }}
//                         className="heading-3 height size-set"
//                       >
//                         right from
//                       </div>
//                       <div className="category-first-header">
//                         <div
//                           style={{ color: 'rgb(0, 0, 0)' }}
//                           className="heading-3 height size-set"
//                         >
//                           your keyboard
//                         </div>
//                         <h2 className="heading-3 gradient">your keyboard</h2>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="category-block">
//                     <div className="category-icon-wrapper">
//                       <img
//                         src="/images/0001.png"
//                         loading="lazy"
//                         alt=""
//                         className="image-contain"
//                       />
//                     </div>
//                     <div className="category-text-wrapper">
//                       <h2
//                         style={{ color: 'rgb(0, 0, 0)' }}
//                         className="heading-3 height size-set"
//                       >
//                         inside your
//                       </h2>
//                       <div className="category-first-header">
//                         <h2
//                           style={{ color: 'rgb(0, 0, 0)' }}
//                           className="heading-3 height size-set"
//                         >
//                           favorite messenger
//                         </h2>
//                         <h2 className="heading-3 gradient">
//                           favorite messenger
//                         </h2>
//                       </div>
//                       <h2
//                         style={{ color: 'rgb(0, 0, 0)' }}
//                         className="heading-3 height size-set"
//                       >
//                         app
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
//                       <div className="stickers-second-header">
//                         <div className="category-mask-wrapper">
//                           <div className="flex-row">
//                             <h1
//                               className="heading-3 fade"
//                               style={{ textAlign: 'center' }}
//                             >
//                               Celebrate, No Matter the Distance
//                             </h1>
//                             <p className="fade" style={{ textAlign: 'center' }}>
//                               Near or far, you can still make someone smile — or
//                               lift your own mood.
//                             </p>
//                           </div>
//                           <div className="category-mask"></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>
//             {/* Rotate Section */}
//             <section
//               style={{ backgroundColor: 'rgb(255, 255, 255)' }}
//               className="rotate-sc"
//             >
//               {/* ... content of rotate-sc ... */}
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
//                           <h2 className="heading-2">you gift</h2>
//                         </div>
//                         <div className="rotate-header-block-mobile">
//                           <h2
//                             data-w-id="03db594e-16d3-a3fe-aa76-3ea06efa052a"
//                             style={{ color: 'rgb(0, 0, 0)' }}
//                             className="heading-3"
//                           >
//                             Choose How you gift
//                             <br />
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
//                                 >
//                                   <source
//                                     src="/video/Discover.mov"
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
//                                 >
//                                   <source
//                                     src="/video/Send.mov"
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
//                                 >
//                                   <source
//                                     src="/video/Redeem.mov"
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
//                                 src="/images/Discover.png"
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
//                                 src="/images/Send.png"
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
//                                 src="/images/Redeem.png"
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
//                               Discover a wide range of real products from your
//                               favorite brands. Whether it&apos;s for someone
//                               else or just for you, find the perfect thing for
//                               any occasion or everyday moment.
//                             </p>
//                           </div>
//                           <div className="rotate-swap-header-cell set-2">
//                             <h3 className="heading-5">Send</h3>
//                             <p className="body-b2 gray-3">
//                               Choose a product, personalize it with a message
//                               and template if you like, and send it instantly
//                               through your favorite chat app — or simply keep it
//                               for yourself. Easy, fast, and fun.
//                             </p>
//                           </div>
//                           <div className="rotate-swap-header-cell set-3">
//                             <h3 className="heading-5">Redeem</h3>
//                             <p className="body-b2 gray-3">
//                               Products can be easily redeemed online or
//                               in-store. No hassle, no waiting — just instant
//                               access to what you want, when you want it
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div
//                   data-w-id="380efe1b-0919-769f-b196-2b8173c9e797"
//                   className="color-anchor"
//                 ></div>
//               </div>
//             </section>
//             {/* Stats Section */}
//             <section className="stats-sc">
//               {/* ... content of stats-sc ... */}
//               <div className="container stats-s">
//                 <div
//                   data-w-id="3ddadffb-60d7-686f-c6b4-a50da303959f"
//                   style={{
//                     transform:
//                       'translate3d(0px, 0px, 0px) scale3d(0.7, 0.7, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                     opacity: 0,
//                   }}
//                   className="stats-card-wrapper"
//                 >
//                   <div className="stats-card">
//                     <img
//                       src="/images/b1.png"
//                       style={{ height: '320px', objectFit: 'contain' }}
//                       alt="Deal of the Day"
//                     />
//                     <h2 className="heading-6 black card-s">Deal of the Day</h2>
//                     <p
//                       style={{
//                         color: '#000',
//                         textAlign: 'center',
//                         margin: '0 50px',
//                       }}
//                     >
//                       A new surprise every day! Check out today&apos;s top pick
//                       — fun, fresh, and perfect whether you&apos;re sending it
//                       or adding it to your own collection
//                     </p>
//                   </div>
//                   <div className="stats-card-gradient"></div>
//                 </div>
//                 <div
//                   data-w-id="e994acc4-ea73-3602-4087-206d2cc9a433"
//                   style={{
//                     transform:
//                       'translate3d(0px, 0px, 0px) scale3d(0.7, 0.7, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                     opacity: 0,
//                   }}
//                   className="stats-card-wrapper"
//                 >
//                   <div className="stats-card">
//                     <img
//                       src="/images/b2.png"
//                       style={{ height: '320px', objectFit: 'contain' }}
//                       alt="Event Calendar"
//                     />
//                     <h2 className="heading-6 black">Event Calendar</h2>
//                     <p
//                       style={{
//                         color: '#000',
//                         textAlign: 'center',
//                         margin: '0 50px',
//                       }}
//                     >
//                       Never miss a reason to celebrate. Keep track of all the
//                       big (and small) days that matter — and stay ready to shop,
//                       share, or connect with perfect timing.
//                     </p>
//                   </div>
//                   <div className="stats-card-gradient"></div>
//                 </div>
//               </div>
//             </section>
//             {/* Watch Section */}
//             <section className="watch-sc">
//               {/* ... content of watch-sc ... */}
//               <div
//                 data-w-id="717531ec-07ce-cbce-d2e2-0c9bd4bb0776"
//                 className="container watch-s"
//               >
//                 <div className="watch-header">
//                   <div className="watch-header-sticky">
//                     <div className="apple-watch-subheader">
//                       Make Every Occasion memorable with
//                     </div>
//                     <div className="sticker-logo-text">
//                       <img
//                         src="/images/logoicons.png"
//                         alt="HeyJinie Logo Large"
//                         className="logo-large"
//                       />
//                       <h2 className="apple-watch-header">HeyJinie</h2>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="overflow-container">
//                   <div className="watch-block watch-11 shadow-lg">
//                     <img
//                       src="/images/NB.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 20vw"
//                       srcSet="/images/NB.png 500w, /images/NB.png 549w"
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-12">
//                     <img
//                       src="/images/Blue.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 20vw"
//                       srcSet="/images/Blue.png 500w, /images/Blue.png 549w"
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-1">
//                     <img
//                       src="/images/09.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 27vw"
//                       srcSet="/images/09.png 500w, /images/09.png 798w"
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-2">
//                     <img
//                       src="/images/01.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 20vw"
//                       srcSet="/images/01.png 500w, /images/01.png 549w"
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div
//                     className="watch-block watch-3"
//                     style={{
//                       willChange: 'transform',
//                       transform:
//                         'translate3d(0px, -3.43232%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                     }}
//                   >
//                     <img
//                       src="/images/02.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 10vw"
//                       srcSet="/images/02.png 500w, /images/02.png 544w"
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-4">
//                     <img
//                       src="/images/03.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 20vw"
//                       srcSet="/images/03.png 500w, /images/03.png 798w"
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-5">
//                     <img
//                       src="/images/04.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 20vw"
//                       srcSet="/images/04.png 500w, /images/04.png 536w"
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-6">
//                     <img
//                       src="/images/05.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 20vw"
//                       srcSet="/images/05.png 500w, /images/05.png 549w"
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-7">
//                     <img
//                       src="/images/06.png"
//                       loading="lazy"
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-8">
//                     <img
//                       src="/images/07.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 20vw"
//                       srcSet="/images/07.png 500w, /images/07.png 549w"
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                   <div className="watch-block watch-9">
//                     <img
//                       src="/images/08.png"
//                       loading="lazy"
//                       sizes="(max-width: 479px) 100vw, 20vw"
//                       srcSet="/images/08.png 500w, /images/08.png 549w"
//                       alt=""
//                       className="image-contain"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </section>
//             {/* CTA Section */}
//             <section className="cta-sc">
//               {/* ... content of cta-sc ... */}
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
//                           transform:
//                             'translate3d(0px, 5vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                           opacity: 0,
//                         }}
//                         className="heading-3 black"
//                       >
//                         Make Every
//                       </h1>
//                       <div className="cta-space"></div>
//                       <h1
//                         data-w-id="749cab70-5651-fbf3-9e17-38735a43ca2a"
//                         style={{
//                           opacity: 0,
//                           transform:
//                             'translate3d(0px, 10vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                         }}
//                         className="heading-3 black"
//                       >
//                         Moment Personalized
//                       </h1>
//                     </div>
//                     <div
//                       data-w-id="311d31de-3d49-372f-b7cd-f4752043fae7"
//                       style={{
//                         transform:
//                           'translate3d(0px, 5vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                         opacity: 0,
//                       }}
//                       className="cta-access-block"
//                     >
//                       <div className="body-b3 black">
//                         <span className="fire">🔥</span>Products that feel just
//                         right.
//                       </div>
//                       <div className="body-b3 black">
//                         <span className="fire">🔥</span>With Heyjinie, every
//                         gesture becomes meaningful — whether it&apos;s a
//                         thoughtful
//                         <br />
//                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; message for
//                         someone else or a vibe that fits your own mood.
//                       </div>
//                       <div className="body-b3">
//                         <span className="fire">🔥</span>Personalized templates
//                         and designs make every interaction special.
//                       </div>
//                     </div>
//                     <div className="cta-buttons">
//                       <div className="download-buttons">
//                         <a
//                           href="https://apps.apple.com/us/app/heyjinie"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="button-wrapper w-inline-block"
//                         >
//                           <span className="dot-span dot dot-1"></span>
//                           <span className="dot-span dot dot-2"></span>
//                           <span className="dot-span dot dot-3"></span>
//                           <span className="dot-span dot dot-4"></span>
//                           <span className="dot-span dot dot-5"></span>
//                           <span className="dot-span dot dot-6"></span>
//                           <span className="dot-span dot dot-7"></span>
//                           <span className="button app-store px-16 py-4 rounded-full">
//                             <div className="icon-app w-embed">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="100%"
//                                 height="100%"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                               ></svg>
//                             </div>
//                             App Store
//                           </span>
//                         </a>
//                         <a
//                           href="https://play.google.com/store/apps/heyjinie"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="button-wrapper w-inline-block"
//                         >
//                           <span className="dot-span dot dot-1"></span>
//                           <span className="dot-span dot dot-2"></span>
//                           <span className="dot-span dot dot-3"></span>
//                           <span className="dot-span dot dot-4"></span>
//                           <span className="dot-span dot dot-5"></span>
//                           <span className="dot-span dot dot-6"></span>
//                           <span className="dot-span dot dot-7"></span>
//                           <span className="button px-16 py-4 rounded-full">
//                             <div className="icon-app w-embed">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="100%"
//                                 height="100%"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                               ></svg>
//                             </div>
//                             Google Play
//                           </span>
//                         </a>
//                       </div>
//                       <div
//                         data-w-id="4918fe23-928a-2a58-73ba-d86d355191d7"
//                         style={{
//                           opacity: 0,
//                           transform:
//                             'translate3d(0px, 5vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
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
//                           ></svg>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="div-block-4">
//                       <img
//                         src="/images/phone-1.png"
//                         loading="lazy"
//                         sizes="100vw"
//                         srcSet="/images/phone-1.png 500w, /images/phone-1.png 800w, /images/phone-1.png 954w"
//                         alt=""
//                         className="cta-image"
//                       />
//                       <div
//                         data-w-id="52a56000-33e1-bd8a-5669-fe1e1263859a"
//                         data-is-ix2-target="1"
//                         className="lottie-animation-6"
//                         data-animation-type="lottie"
//                         data-src="/json/waves-mob.json"
//                         data-loop="0"
//                         data-direction="1"
//                         data-autoplay="0"
//                         data-renderer="svg"
//                         data-duration="0"
//                       ></div>
//                       <img
//                         src="/images/phone-1.png"
//                         loading="lazy"
//                         sizes="100vw"
//                         srcSet="/images/phone-1.png 500w, /images/phone-1.png 954w"
//                         alt=""
//                         className="cta-image background"
//                       />
//                     </div>
//                   </div>
//                   <div
//                     style={{
//                       opacity: 0,
//                       transform:
//                         'translate3d(0px, 50%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//                     }}
//                     className="cta-card-gradient"
//                   ></div>
//                 </div>
//               </div>
//             </section>
//             {/* Footer Section */}
//             <footer className="footer-sc">
//               {' '}
//               {/* Changed from section to footer */}
//               {/* ... content of footer-sc ... */}
//               <div className="container footer-s">
//                 <div className="footer-left-content">
//                   <div className="app-card-wrapper">
//                     <div className="app-card">
//                       <div className="footer-logo">
//                         <div className="footer-logo-svg w-embed">
//                           <svg
//                             width="181"
//                             height="55"
//                             viewBox="0 0 181 55"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                             xmlnsXlink="http://www.w3.org/1999/xlink"
//                           >
//                             <rect
//                               width="181"
//                               height="55"
//                               fill="url(#pattern0_160_3459)"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                       <div className="app-start">
//                         <a
//                           href="mailto:contact@heyjinie.com?subject=contact%40heyjinie.com"
//                           style={{ textDecoration: 'none', color: '#000' }}
//                           className="body-b2 black footer"
//                         >
//                           <div className="flex-column">
//                             <div className="body-b2 black footer">
//                               Stay Connected
//                             </div>
//                             <p>contact@heyjinie.com</p>
//                           </div>
//                         </a>
//                       </div>
//                       <div className="app-card-buttons">
//                         <a
//                           href="https://apps.apple.com/us/app/heyjinie"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="button-wrapper w-inline-block"
//                         >
//                           <span className="dot-span dot dot-1"></span>
//                           <span className="dot-span dot dot-2"></span>
//                           <span className="dot-span dot dot-3"></span>
//                           <span className="dot-span dot dot-4"></span>
//                           <span className="dot-span dot dot-5"></span>
//                           <span className="dot-span dot dot-6"></span>
//                           <span className="dot-span dot dot-7"></span>
//                           <span className="button radial px-16 py-4 rounded-full">
//                             <div className="icon-app w-embed">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="100%"
//                                 height="100%"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                               ></svg>
//                             </div>
//                           </span>
//                         </a>
//                         <a
//                           href="https://play.google.com/store/apps/heyjinie"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="button-wrapper w-inline-block"
//                         >
//                           <span className="dot-span dot dot-1"></span>
//                           <span className="dot-span dot dot-2"></span>
//                           <span className="dot-span dot dot-3"></span>
//                           <span className="dot-span dot dot-4"></span>
//                           <span className="dot-span dot dot-5"></span>
//                           <span className="dot-span dot dot-6"></span>
//                           <span className="dot-span dot dot-7"></span>
//                           <span className="button radial px-16 py-4 rounded-full">
//                             <div className="icon-app w-embed">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="100%"
//                                 height="100%"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                               ></svg>
//                             </div>
//                           </span>
//                         </a>
//                       </div>
//                     </div>
//                     <div className="app-card-gradient"></div>
//                   </div>
//                   <div className="copyright desktop">
//                     <div
//                       className="body-b3"
//                       style={{ color: 'rgb(255, 255, 255)' }}
//                     >
//                       ©2024 HeyJinie. Created by{' '}
//                       <a
//                         href="https://thestackstudios.com"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="stack-studios-link"
//                       >
//                         Stack Studios
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="footer-right-content">
//                   <ul role="list" className="footer-list">
//                     <li className="footer-list-item">
//                       <div className="footer-ink-wrapper">
//                         <a href="#marketplace" className="footer-link">
//                           Marketplace
//                         </a>
//                         <a href="#" className="footer-link hover">
//                           Marketplace
//                         </a>
//                         <div className="hover-line-wrapper">
//                           <div className="footer-line set-1 w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 104 5"
//                               fill="none"
//                             ></svg>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                     <li className="footer-list-item">
//                       <div className="footer-ink-wrapper">
//                         <a href="#pricing" className="footer-link">
//                           Pricing
//                         </a>
//                         <a href="#" className="footer-link hover">
//                           Pricing
//                         </a>
//                         <div className="hover-line-wrapper">
//                           <div className="footer-line set-1 w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 104 5"
//                               fill="none"
//                             ></svg>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                     <li className="footer-list-item">
//                       <div className="footer-ink-wrapper">
//                         <a href="#" className="footer-link hover">
//                           Contact us
//                         </a>
//                         <a
//                           data-w-id="b8aa7f2b-9100-7e3d-0fca-9107107155fb"
//                           href="#"
//                           className="footer-link"
//                         >
//                           Contact us
//                         </a>
//                         <div className="hover-line-wrapper">
//                           <div className="footer-line set-1 w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 104 5"
//                               fill="none"
//                             ></svg>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                   </ul>
//                   <ul role="list" className="footer-list">
//                     <li className="footer-list-item">
//                       <div className="footer-ink-wrapper">
//                         <a href="#" className="footer-link hover">
//                           Privacy Policy
//                         </a>
//                         <a href="#" className="footer-link">
//                           Privacy Policy
//                         </a>
//                         <div className="hover-line-wrapper">
//                           <div className="footer-line set-1 w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 104 5"
//                               fill="none"
//                             ></svg>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                     <li className="footer-list-item">
//                       <div className="footer-ink-wrapper">
//                         <a href="#" className="footer-link hover">
//                           Return Policy
//                         </a>
//                         <a href="#" className="footer-link">
//                           Return Policy
//                         </a>
//                         <div className="hover-line-wrapper">
//                           <div className="footer-line set-1 w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 104 5"
//                               fill="none"
//                             ></svg>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                     <li className="footer-list-item">
//                       <div className="footer-ink-wrapper">
//                         <a href="#" className="footer-link hover">
//                           Refund Policy
//                         </a>
//                         <a href="#" className="footer-link">
//                           Refund Policy
//                         </a>
//                         <div className="hover-line-wrapper">
//                           <div className="footer-line set-1 w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 104 5"
//                               fill="none"
//                             ></svg>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                     <li className="footer-list-item">
//                       <div className="footer-ink-wrapper">
//                         <a href="#" className="footer-link hover">
//                           Terms & Conditions
//                         </a>
//                         <a href="#" className="footer-link">
//                           Terms & Conditions
//                         </a>
//                         <div className="hover-line-wrapper">
//                           <div className="footer-line set-1 w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 104 5"
//                               fill="none"
//                             ></svg>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                     <li className="footer-list-item socials">
//                       <div className="socials-icons footer">
//                         <a
//                           href="https://www.facebook.com/@heyjinie"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="button-wrapper w-inline-block"
//                         >
//                           <span className="dot-span dot dot-1"></span>
//                           <span className="dot-span dot dot-2"></span>
//                           <span className="dot-span dot dot-3"></span>
//                           <span className="dot-span dot dot-4"></span>
//                           <span className="dot-span dot dot-5"></span>
//                           <span className="dot-span dot dot-6"></span>
//                           <span className="dot-span dot dot-7"></span>
//                           <span className="button radial px-16 py-4 rounded-full btnnewicon">
//                             <div className="button-icon w-embed fillblack">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 viewBox="0 0 30 30"
//                                 width="100%"
//                                 height="100%"
//                               ></svg>
//                             </div>
//                           </span>
//                         </a>
//                         <a
//                           href="https://www.linkedIn.com/heyjinie"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="button-wrapper w-inline-block"
//                         >
//                           <span className="dot-span dot dot-1"></span>
//                           <span className="dot-span dot dot-2"></span>
//                           <span className="dot-span dot dot-3"></span>
//                           <span className="dot-span dot dot-4"></span>
//                           <span className="dot-span dot dot-5"></span>
//                           <span className="dot-span dot dot-6"></span>
//                           <span className="dot-span dot dot-7"></span>
//                           <span className="button radial px-16 py-4 rounded-full btnnewicon">
//                             <div className="button-icon w-embed fillblack">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 viewBox="0 0 30 30"
//                                 width="100%"
//                                 height="100%"
//                               ></svg>
//                             </div>
//                           </span>
//                         </a>
//                         <a
//                           href="https://www.instagram.com/heyjinie/"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="button-wrapper w-inline-block"
//                         >
//                           <span className="dot-span dot dot-1"></span>
//                           <span className="dot-span dot dot-2"></span>
//                           <span className="dot-span dot dot-3"></span>
//                           <span className="dot-span dot dot-4"></span>
//                           <span className="dot-span dot dot-5"></span>
//                           <span className="dot-span dot dot-6"></span>
//                           <span className="dot-span dot dot-7"></span>
//                           <span className="button radial px-16 py-4 rounded-full btnnewicon">
//                             <div className="button-icon w-embed fillblack">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="100%"
//                                 height="100%"
//                                 viewBox="0 0 16 16"
//                                 fill="none"
//                               ></svg>
//                             </div>
//                           </span>
//                         </a>
//                         <a
//                           href="https://www.tiktok.com/heyjinie"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="button-wrapper w-inline-block"
//                         >
//                           <span className="dot-span dot dot-1"></span>
//                           <span className="dot-span dot dot-2"></span>
//                           <span className="dot-span dot dot-3"></span>
//                           <span className="dot-span dot dot-4"></span>
//                           <span className="dot-span dot dot-5"></span>
//                           <span className="dot-span dot dot-6"></span>
//                           <span className="dot-span dot dot-7"></span>
//                           <span className="button radial px-16 py-4 rounded-full btnnewicon">
//                             <div className="button-icon w-embed fillblack">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="100%"
//                                 height="100%"
//                                 viewBox="0 0 16 16"
//                                 fill="none"
//                               ></svg>
//                             </div>
//                           </span>
//                         </a>
//                         <a
//                           href="https://www.youtube.com/heyjinie/"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="button-wrapper w-inline-block"
//                         >
//                           <span className="dot-span dot dot-1"></span>
//                           <span className="dot-span dot dot-2"></span>
//                           <span className="dot-span dot dot-3"></span>
//                           <span className="dot-span dot dot-4"></span>
//                           <span className="dot-span dot dot-5"></span>
//                           <span className="dot-span dot dot-6"></span>
//                           <span className="dot-span dot dot-7"></span>
//                           <span className="button radial px-16 py-4 rounded-full btnnewicon">
//                             <div className="button-icon w-embed fillblack">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="100%"
//                                 height="100%"
//                                 viewBox="0 0 16 16"
//                                 fill="none"
//                               ></svg>
//                             </div>
//                           </span>
//                         </a>
//                       </div>
//                     </li>
//                   </ul>
//                 </div>
//                 <div className="copyright mobile">
//                   <div
//                     className="body-b3"
//                     style={{ color: 'rgb(255, 255, 255)' }}
//                   >
//                     ©2024 HeyJinie. Created by{' '}
//                     <a
//                       href="https://thestackstudios.com/"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="stack-studios-link"
//                     >
//                       The Stack Studios
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </footer>
//           </div>

//           {/* Contact Us Form - This will be shown/hidden by Webflow IX2 */}
//           <div
//             fs-scrolldisable-element="when-visible"
//             style={{
//               display: 'none', // Initial state controlled by Webflow
//               transform:
//                 'translate3d(0px, 100vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
//             }}
//             className="contact-us"
//             ref={contactFormBlockRef}
//           >
//             <div className="form-gradient"></div>
//             <div data-lenis-prevent="" className="container contact-s">
//               <div
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
//                     {/* Close icon SVG */}
//                   </svg>
//                 </div>
//               </div>
//               <h1 className="heading-3 white contact">Let’s talk</h1>
//               <div id="heyJinieForm" className="form-block">
//                 <form
//                   id="email-form"
//                   name="email-form"
//                   data-name="Email Form"
//                   className="form"
//                   onSubmit={handleSubmit(onSubmitContact)}
//                   ref={contactFormRef}
//                   style={{ display: formSubmitSuccess ? 'none' : 'block' }}
//                 >
//                   <div className="form-frame">
//                     <div className="input-wrapper">
//                       <label htmlFor="name" className="lable">
//                         What’s your name?
//                       </label>
//                       <input
//                         className="text-field w-input"
//                         maxLength={256}
//                         placeholder="Name"
//                         type="text"
//                         id="name"
//                         {...register('name')}
//                       />
//                       {errors.name && (
//                         <p className="error-message">{errors.name.message}</p>
//                       )}
//                     </div>
//                     <div
//                       style={{ height: '14rem' }}
//                       className="form-space"
//                     ></div>
//                     <div className="input-wrapper">
//                       <label htmlFor="Email" className="lable">
//                         What’s your email?
//                       </label>
//                       <input
//                         className="text-field w-input"
//                         maxLength={256}
//                         placeholder="name@example.com"
//                         type="email"
//                         id="Email"
//                         {...register('Email')}
//                       />
//                       {errors.Email && (
//                         <p className="error-message">{errors.Email.message}</p>
//                       )}
//                     </div>
//                     <div
//                       style={{ height: '14rem' }}
//                       className="form-space"
//                     ></div>
//                     <div className="input-wrapper">
//                       <label htmlFor="autoExpand" className="lable">
//                         How we can help you?
//                       </label>
//                       <textarea
//                         placeholder="Example Text"
//                         maxLength={5000}
//                         id="autoExpand"
//                         className="text-area w-input"
//                         {...register('field')}
//                       ></textarea>
//                       {errors.field && (
//                         <p className="error-message">{errors.field.message}</p>
//                       )}
//                     </div>
//                     <div
//                       style={{ height: '14rem' }}
//                       className="form-space"
//                     ></div>

//                     <button
//                       type="submit"
//                       id="customSubmitButton"
//                       className="button-wrapper-contact"
//                       disabled={isFormLoading}
//                     >
//                       <span className="dot-span dot-contact dot-1"></span>
//                       <span className="dot-span dot-contact dot-2"></span>
//                       <span className="dot-span dot-contact dot-3"></span>
//                       <span className="dot-span dot-contact dot-4"></span>
//                       <span className="dot-span dot-contact dot-5"></span>
//                       <span className="dot-span dot-contact dot-6"></span>
//                       <span className="dot-span dot-contact dot-7"></span>
//                       <span className="button-contact app-store fw-bolder px-16 py-4 rounded-full send-form">
//                         {isFormLoading ? 'Sending...' : 'Send'}
//                       </span>
//                     </button>
//                   </div>

//                   <div className="form-contacts">
//                     <div className="w-layout-grid contacts-grid">
//                       <div className="contact-icon w-embed">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="100%"
//                           height="100%"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                         ></svg>
//                       </div>
//                       <a
//                         href="mailto:contact@heyjinie.com?subject=heyjinie%40heyjinie.com"
//                         className="contact-link"
//                       >
//                         contact@heyjinie.com
//                       </a>
//                     </div>
//                     <div className="socials-icons contact">
//                       <a
//                         href="https://www.facebook.com/heyjinie/"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="button-wrapper white-button w-inline-block"
//                       >
//                         <span className="dot-span dot dot-1 white-dot"></span>
//                         <span className="dot-span dot dot-2 white-dot"></span>
//                         <span className="dot-span dot dot-3 white-dot"></span>
//                         <span className="dot-span dot dot-4 white-dot"></span>
//                         <span className="dot-span dot dot-5 white-dot"></span>
//                         <span className="dot-span dot dot-6 white-dot"></span>
//                         <span className="dot-span dot dot-7 white-dot"></span>
//                         <span className="button radial px-16 py-4 rounded-full btnnewicon">
//                           <div className="button-icon w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               viewBox="0 0 30 30"
//                               width="100%"
//                               height="100%"
//                             ></svg>
//                           </div>
//                         </span>
//                       </a>
//                       <a
//                         href="https://www.linkedIn.com/heyjinie"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="button-wrapper white-button w-inline-block"
//                       >
//                         <span className="dot-span dot dot-1 white-dot"></span>
//                         <span className="dot-span dot dot-2 white-dot"></span>
//                         <span className="dot-span dot dot-3 white-dot"></span>
//                         <span className="dot-span dot dot-4 white-dot"></span>
//                         <span className="dot-span dot dot-5 white-dot"></span>
//                         <span className="dot-span dot dot-6 white-dot"></span>
//                         <span className="dot-span dot dot-7 white-dot"></span>
//                         <span className="button radial px-16 py-4 rounded-full btnnewicon">
//                           <div className="button-icon w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               viewBox="0 0 30 30"
//                               width="100%"
//                               height="100%"
//                             ></svg>
//                           </div>
//                         </span>
//                       </a>
//                       <a
//                         href="https://www.instagram.com/heyjinie/"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="button-wrapper white-button w-inline-block"
//                       >
//                         <span className="dot-span dot dot-1 white-dot"></span>
//                         <span className="dot-span dot dot-2 white-dot"></span>
//                         <span className="dot-span dot dot-3 white-dot"></span>
//                         <span className="dot-span dot dot-4 white-dot"></span>
//                         <span className="dot-span dot dot-5 white-dot"></span>
//                         <span className="dot-span dot dot-6 white-dot"></span>
//                         <span className="dot-span dot dot-7 white-dot"></span>
//                         <span className="button radial px-16 py-4 rounded-full btnnewicon">
//                           <div className="button-icon w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 16 16"
//                               fill="none"
//                             ></svg>
//                           </div>
//                         </span>
//                       </a>
//                       <a
//                         href="https://www.tiktok.com/heyjinie/"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="button-wrapper white-button w-inline-block"
//                       >
//                         <span className="dot-span dot dot-1 white-dot"></span>
//                         <span className="dot-span dot dot-2 white-dot"></span>
//                         <span className="dot-span dot dot-3 white-dot"></span>
//                         <span className="dot-span dot dot-4 white-dot"></span>
//                         <span className="dot-span dot dot-5 white-dot"></span>
//                         <span className="dot-span dot dot-6 white-dot"></span>
//                         <span className="dot-span dot dot-7 white-dot"></span>
//                         <span className="button radial px-16 py-4 rounded-full btnnewicon">
//                           <div className="button-icon w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               viewBox="0 0 30 30"
//                               width="100%"
//                               height="100%"
//                             ></svg>
//                           </div>
//                         </span>
//                       </a>
//                       <a
//                         href="https://www.youtube.com/heyjinie/"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="button-wrapper white-button w-inline-block"
//                       >
//                         <span className="dot-span dot dot-1 white-dot"></span>
//                         <span className="dot-span dot dot-2 white-dot"></span>
//                         <span className="dot-span dot dot-3 white-dot"></span>
//                         <span className="dot-span dot dot-4 white-dot"></span>
//                         <span className="dot-span dot dot-5 white-dot"></span>
//                         <span className="dot-span dot dot-6 white-dot"></span>
//                         <span className="dot-span dot dot-7 white-dot"></span>
//                         <span className="button radial px-16 py-4 rounded-full btnnewicon">
//                           <div className="button-icon w-embed">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               width="100%"
//                               height="100%"
//                               viewBox="0 0 16 16"
//                               fill="none"
//                             ></svg>
//                           </div>
//                         </span>
//                       </a>
//                     </div>
//                   </div>
//                 </form>
//                 <div
//                   className="success-message w-form-done"
//                   style={{ display: formSubmitSuccess ? 'block' : 'none' }}
//                 >
//                   <div className="success-text-wrapper">
//                     <div className="lable">
//                       Thank you for submitting the form.
//                     </div>
//                     <div className="heading-6 white">
//                       We’ll talk to you soon!
//                     </div>
//                   </div>
//                 </div>
//                 <div
//                   className="w-form-fail"
//                   style={{ display: formSubmitError ? 'block' : 'none' }}
//                 >
//                   <div>
//                     {formSubmitError ||
//                       'Oops! Something went wrong while submitting the form.'}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Script Loading */}
//         <Script
//           src="/js/jquery-3.5.1.min.js?site=667fa6c733097c1516bb9760"
//           strategy="beforeInteractive"
//         />
//         <Script src="/js/webflow.js" strategy="lazyOnload" />
//         <Script
//           src="/librararies/lottieLazyLoading.min.js"
//           strategy="lazyOnload"
//         />
//         <Script
//           src="/librararies/swiper-bundle.min.js"
//           strategy="lazyOnload"
//           id="swiper-script"
//         />
//         <Script src="/librararies/scrolldisable.js" strategy="lazyOnload" />
//         <Script
//           src="/librararies/kinet.min.js"
//           strategy="lazyOnload"
//           id="kinet-script"
//         />
//       </main>
//     </>
//   );
// };

// export default HomePage;

//src/app/page.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import Head from 'next/head';
import Lenis from 'lenis'; // Import Lenis from the NPM package
import Image from 'next/image'; // For optimized images if you choose to use it later
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { contactUs } from '@/services/api.service'; // Adjust path if needed
import { toast } from 'react-toastify';
import '../../public/css/style.css'; // Your main CSS file

// Declare global Webflow, Swiper, and Kinet objects for TypeScript
declare global {
  interface Window {
    Webflow: any;
    Swiper: any;
    Kinet: any;
  }
}

// Zod Schema for Contact Form Validation
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  Email: z.string().email('Invalid email address').min(1, 'Email is required'), // Matches 'Email' in HTML
  field: z.string().min(1, 'Message is required'), // 'field' is the name of the textarea in HTML
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

const HomePage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactFormSchema),
  });

  // --- State for the contact form ---
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formErrorMessage, setFormErrorMessage] = useState('');

  const onSubmitContact: SubmitHandler<ContactFormInputs> = async (data) => {
    setFormStatus('loading');
    
    try {
      await contactUs(data);
      setFormStatus('success');
      toast.success("Message sent successfully! We'll talk to you soon.");
      reset(); // Reset form fields
    } catch (error: any) {
      const message = error.message || 'Oops! Something went wrong while submitting the form.';
      setFormErrorMessage(message);
      setFormStatus('error');
      toast.error(message);
    }
  };


  // --- All Side Effects (useEffect hooks) ---

  // 1. Lenis Smooth Scrolling Initialization (Handles preloader and scroll locking)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false,
      autoResize: true,
      syncTouch: false,
      syncTouchLerp: 0.075,
      touchInertiaMultiplier: 35,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const preloaderElement = document.querySelector('[preloader-element]');
    const stopScrollElements = document.querySelectorAll('[stop-scroll]');
    const startScrollElements = document.querySelectorAll('[start-scroll]');

    // Stop scrolling initially if preloader exists
    if (preloaderElement) {
        lenis.stop(); // Stop Lenis scrolling
        const observer = new IntersectionObserver((entries) => {
            // Check if preloader is not intersecting (i.e., out of view)
            if (!entries[0].isIntersecting) {
                lenis.start(); // Start Lenis scrolling
                observer.disconnect(); // Disconnect observer
            }
        }, { threshold: 0 }); // Observe when 0% of the preloader is visible
        observer.observe(preloaderElement);
    } else {
        lenis.start(); // If no preloader, start Lenis immediately
    }
    
    // Add event listeners for manual scroll stopping/starting
    stopScrollElements.forEach(el => el.addEventListener('click', () => lenis.stop()));
    startScrollElements.forEach(el => el.addEventListener('click', () => lenis.start()));

    // Start the animation frame loop
    requestAnimationFrame(raf);

    // Cleanup: Destroy Lenis instance and remove event listeners on component unmount
    return () => {
      lenis.destroy();
      stopScrollElements.forEach(el => el.removeEventListener('click', () => lenis.stop()));
      startScrollElements.forEach(el => el.removeEventListener('click', () => lenis.start()));
    };
  }, []); // Empty dependency array means this runs once on mount


  // 2. Kinet Custom Cursor Initialization
  useEffect(() => {
    let kinetInstance: any = null;
    let handleMouseMove: ((event: MouseEvent) => void) | null = null;
    
    const initKinet = () => {
      if (typeof window.Kinet === 'function') {
        kinetInstance = new window.Kinet({
          acceleration: 0.02,
          friction: 0.25,
          names: ['x', 'y'],
        });

        const circle = document.getElementById('circle');
        if (circle) {
          kinetInstance.on('tick', (instances: any) => {
            circle.style.transform = `translate3d(${instances.x.current}px, ${
              instances.y.current
            }px, 0) rotateX(${instances.x.velocity / 2}deg) rotateY(${
              instances.y.velocity / 2
            }deg)`;
          });

          handleMouseMove = (event: MouseEvent) => {
            kinetInstance.animate('x', event.clientX - window.innerWidth / 2);
            kinetInstance.animate('y', event.clientY - window.innerHeight / 2);
          };

          document.addEventListener('mousemove', handleMouseMove);
        }
      }
    };
    
    // Check if Kinet is already loaded (e.g., if the script strategy is 'beforeInteractive' or it was already present)
    if (typeof window.Kinet === 'function') {
        initKinet();
    } else {
        // Otherwise, wait for the script to load
        const kinetScript = document.getElementById('kinet-script');
        kinetScript?.addEventListener('load', initKinet);
    }

    return () => {
      if (handleMouseMove) {
        document.removeEventListener('mousemove', handleMouseMove);
      }
      // Kinet doesn't provide a destroy method in this snippet, so listener removal is key.
    };
  }, []); // Empty dependency array means this runs once on mount

  // 3. Swiper Initialization
  useEffect(() => {
    let swiperInstance: any = null;
    const initSwiper = () => {
      if (typeof window.Swiper === 'function') {
        swiperInstance = new window.Swiper('.swiper', {
          effect: 'cards',
          grabCursor: true,
          loop: true,
          cardsEffect: {
            slideShadows: false,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          initialSlide: 2,
        });
      }
    };

    // Check if Swiper is already loaded
    if (typeof window.Swiper === 'function') {
        initSwiper();
    } else {
        // Otherwise, wait for the script to load
        const swiperScript = document.getElementById('swiper-script');
        swiperScript?.addEventListener('load', initSwiper);
    }

    // Cleanup Swiper instance
    return () => {
      if (swiperInstance && typeof swiperInstance.destroy === 'function') {
        swiperInstance.destroy(true, true); // Parameters: deleteInstance, cleanStyles
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // 4. Miscellaneous DOM Effects (Moving Text Background Scroll, Textarea Auto-Expand, Categories Widget Removal)
  useEffect(() => {
    const handleScrollMovingText = () => {
      const section = document.getElementById('categoriesSection');
      const textElements = document.querySelectorAll<HTMLElement>('[moving-text]');
      if (!section || textElements.length === 0) return;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = window.scrollY;
      const scrollStart = sectionTop + sectionHeight * 0.0;
      const scrollEnd = sectionTop + sectionHeight * 0.25;

      if (scrollPosition >= scrollStart && scrollPosition <= scrollEnd) {
        const scrollProgress = (scrollPosition - scrollStart) / (scrollEnd - scrollStart);
        const backgroundPosition = -500 + scrollProgress * 1000;
        textElements.forEach((textEl) => {
          textEl.style.backgroundPosition = `${backgroundPosition}% 0`;
        });
      } else if (scrollPosition < scrollStart) {
        textElements.forEach((textEl) => {
          textEl.style.backgroundPosition = `-500% 0`;
        });
      } else {
        textElements.forEach((textEl) => {
          textEl.style.backgroundPosition = `500% 0`;
        });
      }
    };

    const textarea = document.getElementById('autoExpand') as HTMLTextAreaElement | null;
    const adjustTextarea = () => {
      if (!textarea) return; // Ensure textarea exists

      textarea.style.height = 'auto'; // Reset height to recalculate scrollHeight
      textarea.style.height = textarea.scrollHeight + 'px'; // Set height based on content

      const textLength = textarea.value.length;
      if (textLength > 0) {
        const newWidth = 38 + Math.min(textLength / 2, 42); // Adjust width dynamically
        textarea.style.width = newWidth + 'rem';
      } else {
        textarea.style.width = '38rem'; // Default width for empty textarea
      }
    };

    const removeCategoriesWidget = () => {
      const element = document.querySelector('.categories-widget');
      if (window.innerWidth <= 479 && element) {
        element.remove();
      }
    };
    
    // Add event listeners
    document.addEventListener('scroll', handleScrollMovingText);
    if(textarea) textarea.addEventListener('input', adjustTextarea); // Only add if textarea exists
    window.addEventListener('resize', adjustTextarea);
    window.addEventListener('resize', removeCategoriesWidget);
    
    // Initial calls
    adjustTextarea();
    removeCategoriesWidget();

    // Cleanup function for these effects
    return () => {
      document.removeEventListener('scroll', handleScrollMovingText);
      if(textarea) textarea.removeEventListener('input', adjustTextarea);
      window.removeEventListener('resize', adjustTextarea);
      window.removeEventListener('resize', removeCategoriesWidget);
    };
  }, []); // Empty dependency array: runs once on mount

  // 5. Webflow Initialization (CRUCIAL - MUST BE THE LAST EFFECT)
  // This hook ensures that Webflow's JavaScript is re-initialized after every render
  // and component mount, allowing its DOM manipulations and IX2 animations to
  // correctly attach to the React-rendered DOM.
  useEffect(() => {
    if (window.Webflow) {
      window.Webflow.destroy(); // Clean up any previously attached Webflow elements/listeners
      window.Webflow.ready();   // Re-scan the DOM for Webflow data attributes and initialize components
      // window.Webflow.ix2.init(); // Re-initialize Webflow Interactions (IX2)
    }
  }); // NO DEPENDENCY ARRAY: This effect runs after every render to ensure Webflow always targets the latest DOM.


  return (
    <>
      <Head>
        <title>HeyJinie</title>
        <meta content="HeyJinie" property="og:title" />
        <meta content="HeyJinie" property="twitter:title" />
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
          name="viewport"
        />
        <link href="/css/style.css" rel="stylesheet" type="text/css" />
        <link
          href="/images/favicon.ico"
          rel="shortcut icon"
          type="image/x-icon"
        />
        <link href="/images/apple-touch-icon.png" rel="apple-touch-icon" />
        <link rel="stylesheet" href="/librararies/swiper-bundle.min.css" />
      </Head>

      <main className="page-body">
        <div className="custom-cursor-wrapper">
          <div id="circle" className="circle"></div>
        </div>
        {/*
          CRITICAL: This script must run BEFORE webflow.js to monkey-patch XMLHttpRequest.
          It ensures responseText is always accessible even when responseType is 'json'.
        */}
        <Script id="xhr-webflow-patch" strategy="beforeInteractive">
          {`
            (function() {
              const originalSetResponseType = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseType')?.set;
              const originalGetResponse = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response')?.get;

              if (originalSetResponseType && originalGetResponse) {
                // Use a non-enumerable, non-writable property to store the intended responseType
                Object.defineProperty(XMLHttpRequest.prototype, '_webflow_intendedResponseType', {
                  writable: true,
                  value: undefined,
                  configurable: true // Important for clean up or re-patching
                });

                // Override the responseType setter
                Object.defineProperty(XMLHttpRequest.prototype, 'responseType', {
                  set: function(value) {
                    if (value === 'json') {
                      // If Webflow tries to set 'json', store this intent
                      this._webflow_intendedResponseType = value;
                      // And actually set it to 'text' so responseText is always available
                      originalSetResponseType.call(this, 'text');
                    } else {
                      // For other types, reset the flag and call the original setter
                      this._webflow_intendedResponseType = undefined;
                      originalSetResponseType.call(this, value);
                    }
                  },
                  get: function() {
                    // Return the actual responseType. Webflow's internal logic often checks this.
                    return originalSetResponseType.call(this);
                  },
                  configurable: true
                });

                // Override the response getter
                Object.defineProperty(XMLHttpRequest.prototype, 'response', {
                  get: function() {
                    // If Webflow intended 'json' and we set 'text', manually parse responseText
                    if (this._webflow_intendedResponseType === 'json') {
                      try {
                        return JSON.parse(this.responseText);
                      } catch (e) {
                        // If parsing fails (e.g., non-JSON response), return null
                        // This mimics XHR's behavior for invalid JSON when responseType is 'json'
                        return null; 
                      }
                    }
                    // Otherwise, call the original getter
                    return originalGetResponse.call(this);
                  },
                  configurable: true
                });
              } else {
                console.warn('Webflow XHR patch failed: original descriptors not found.');
              }
            })();
          `}
        </Script>

        {/* Your header and other sections */}
        <div className="page-wrapper">
          <header className="header top">
            <div
              data-animation="default"
              className="navbar w-nav"
              data-easing2="ease-out-expo"
              fs-scrolldisable-element="smart-nav"
              data-easing="ease-out-expo"
              data-collapse="tiny"
              style={{
                transform:
                  'translate3d(0px, 0vh, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
                display: 'none',
                opacity: 0,
              }}
              data-w-id="f23fd689-580c-ef40-2b14-6c6fa58c66c5"
              role="banner"
              data-duration="2000"
            >
              <address className="nav-container">
                <div
                  data-w-id="03253246-1992-659c-e393-912827b915ad"
                  className="logo"
                >
                  <div className="logo-svg w-embed">
                    <svg
                      width="181"
                      height="55"
                      viewBox="0 0 181 55"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                    </svg>
                  </div>
                  <div
                    data-w-id="437c74fd-02ab-1a96-f011-4dc23ee11d78"
                    className="logo-svg hover w-embed"
                  >
                    <svg
                      width="181"
                      height="55"
                      viewBox="0 0 181 55"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                    </svg>
                  </div>
                </div>
                <nav
                  role="navigation"
                  data-lenis-prevent=""
                  className="nav-menu-wrapper w-nav-menu"
                >
                  <div className="nav-menu">
                    <div className="nav-link-wrapper">
                      <a href="#marketplace" className="nav-link w-nav-link">
                        Marketplace
                      </a>
                      <a href="#" className="nav-link hover w-nav-link">
                        Marketplace
                      </a>
                      <div className="hover-line-wrapper">
                        <div className="hover-line-svg set-1 w-embed">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 104 5"
                            fill="none"
                          >
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="nav-space"></div>
                    <div className="nav-link-wrapper">
                      <a href="#pricing" className="nav-link w-nav-link">
                        Pricing
                      </a>
                      <a href="#" className="nav-link hover w-nav-link">
                        Pricing
                      </a>
                      <div className="hover-line-wrapper">
                        <div className="hover-line-svg set-2 w-embed">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 50 3"
                            fill="none"
                          >
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="nav-space"></div>
                    <div className="nav-link-wrapper">
                      <a
                        data-w-id="3eec7af4-0276-6645-7224-400000252098"
                        href="#"
                        className="nav-link w-nav-link"
                      >
                        Contact us
                      </a>
                      <a href="#" className="nav-link hover w-nav-link">
                        Contact us
                      </a>
                      <div className="hover-line-wrapper">
                        <div className="hover-line-svg set-4 w-embed">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 83 3"
                            fill="none"
                          >
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="menu-buttons">
                      <div className="download-buttons">
                        <a
                          href="https://apps.apple.com/us/app/heyjinie/id6443644593"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="button-wrapper w-inline-block"
                        >
                          <span className="dot-span dot dot-1"></span>
                          <span className="dot-span dot dot-2"></span>
                          <span className="dot-span dot dot-3"></span>
                          <span className="dot-span dot dot-4"></span>
                          <span className="dot-span dot dot-5"></span>
                          <span className="dot-span dot dot-6"></span>
                          <span className="dot-span dot dot-7"></span>
                          <span className="button app-store px-16 py-4 rounded-full">
                            <div className="icon-app w-embed">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                                viewBox="0 0 24 24"
                                fill="none"
                              ></svg>
                            </div>
                            App Store
                          </span>
                        </a>
                        <a
                          href="https://play.google.com/store/apps/details?id=com.heyjinie&amp;pli=1"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="button-wrapper w-inline-block"
                        >
                          <span className="dot-span dot dot-1"></span>
                          <span className="dot-span dot dot-2"></span>
                          <span className="dot-span dot dot-3"></span>
                          <span className="dot-span dot dot-4"></span>
                          <span className="dot-span dot dot-5"></span>
                          <span className="dot-span dot dot-6"></span>
                          <span className="dot-span dot dot-7"></span>
                          <span className="button px-16 py-4 rounded-full">
                            <div className="icon-app w-embed">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                                viewBox="0 0 24 24"
                                fill="none"
                              ></svg>
                            </div>
                            Google Play
                          </span>
                        </a>
                      </div>
                      <div className="free-tag">
                        <div className="body-b2-bold blue">
                          Available for free
                        </div>
                        <div className="hero-tag-line blue w-embed">
                          <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 143 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          ></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>
                <div
                  className="menu-button w-nav-button"
                  role="button"
                  tabIndex={0}
                  aria-label="menu"
                  aria-controls={undefined}
                  aria-haspopup="menu"
                  aria-expanded="false"
                >
                  <div className="menu-button-lines">
                    <div className="menu-line line-1"></div>
                    <div className="menu-line line-2"></div>
                  </div>
                </div>
                <div className="nav-buttons navbar-set">
                  <div className="download-buttons">
                    <a
                      href="https://apps.apple.com/us/app/heyjinie"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-wrapper w-inline-block"
                    >
                      <span className="dot-span dot dot-1"></span>
                      <span className="dot-span dot dot-2"></span>
                      <span className="dot-span dot dot-3"></span>
                      <span className="dot-span dot dot-4"></span>
                      <span className="dot-span dot dot-5"></span>
                      <span className="dot-span dot dot-6"></span>
                      <span className="dot-span dot dot-7"></span>
                      <span className="button radial px-16 py-4 rounded-full">
                        <div className="icon-app w-embed">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="none"
                          ></svg>
                        </div>
                      </span>
                    </a>
                    <a
                      href="https://play.google.com/store/apps/heyjinie"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-wrapper w-inline-block"
                    >
                      <span className="dot-span dot dot-1"></span>
                      <span className="dot-span dot dot-2"></span>
                      <span className="dot-span dot dot-3"></span>
                      <span className="dot-span dot dot-4"></span>
                      <span className="dot-span dot dot-5"></span>
                      <span className="dot-span dot dot-6"></span>
                      <span className="dot-span dot dot-7"></span>
                      <span className="button radial px-16 py-4 rounded-full">
                        <div className="icon-app w-embed">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="none"
                          ></svg>
                        </div>
                      </span>
                    </a>
                  </div>
                  <div className="download-buttons">
                    <a
                      href="https://heyjinie.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button-wrapper w-inline-block"
                    >
                      <span className=" dot dot-1"></span>
                      <span className=" dot dot-2"></span>
                      <span className=" dot dot-3"></span>
                      <span className=" dot dot-4"></span>
                      <span className=" dot dot-5"></span>
                      <span className=" dot dot-6"></span>
                      <span className=" dot dot-7"></span>
                      <span className="button app-store fw-bolder px-16 py-4 rounded-full">
                        <div className="icon-app w-embed">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 20 20"
                            fill="none"
                          ></svg>
                        </div>
                        <span style={{ fontStyle: 'normal' }}>
                          Start Gifting
                        </span>
                      </span>
                    </a>
                  </div>
                </div>
              </address>
            </div>
          </header>
          <header
            data-w-id="b32d4afb-1ba7-572e-01ab-ab75fd6e172e"
            className="header down"
          >
            <div
              data-w-id="b32d4afb-1ba7-572e-01ab-ab75fd6e172f"
              data-animation="default"
              data-collapse="tiny"
              data-duration="2000"
              data-easing="ease-out-expo"
              data-easing2="ease-out-expo"
              role="banner"
              className="navbar down w-nav"
            >
              <div className="open-sticker-wrapper">
                <div
                  data-w-id="295811e4-e926-3268-dc1a-251440935b01"
                  className="open-sticker"
                ></div>
              </div>
              <address className="nav-container down">
                <nav
                  role="navigation"
                  data-lenis-prevent=""
                  className="nav-menu-wrapper w-nav-menu"
                >
                  <div className="nav-menu">
                    <div className="nav-link-wrapper">
                      <a href="#marketplace" className="nav-link w-nav-link">
                        Marketplace
                      </a>
                      <a href="#" className="nav-link hover w-nav-link">
                        Marketplace
                      </a>
                      <div className="hover-line-wrapper">
                        <div className="hover-line-svg set-1 w-embed">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 104 5"
                            fill="none"
                          ></svg>
                        </div>
                      </div>
                    </div>
                    <div className="nav-space"></div>
                    <div className="nav-link-wrapper">
                      <a href="#pricing" className="nav-link w-nav-link">
                        Pricing
                      </a>
                      <a href="#" className="nav-link hover w-nav-link">
                        Pricing
                      </a>
                      <div className="hover-line-wrapper">
                        <div className="hover-line-svg set-2 w-embed">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 50 3"
                            fill="none"
                          ></svg>
                        </div>
                      </div>
                    </div>
                    <div className="nav-space"></div>
                    <div className="nav-link-wrapper">
                      <a
                        data-w-id="b32d4afb-1ba7-572e-01ab-ab75fd6e174e"
                        href="#"
                        className="nav-link w-nav-link"
                      >
                        Contact us
                      </a>
                      <a href="#" className="nav-link hover w-nav-link">
                        Contact us
                      </a>
                      <div className="hover-line-wrapper">
                        <div className="hover-line-svg set-4 w-embed">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 83 3"
                            fill="none"
                          ></svg>
                        </div>
                      </div>
                    </div>
                    <div className="menu-buttons">
                      <div className="download-buttons">
                        <a
                          href="https://apps.apple.com/us/app/heyjinie"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="button-wrapper w-inline-block"
                        >
                          <span className="dot-span dot dot-1"></span>
                          <span className="dot-span dot dot-2"></span>
                          <span className="dot-span dot dot-3"></span>
                          <span className="dot-span dot dot-4"></span>
                          <span className="dot-span dot dot-5"></span>
                          <span className="dot-span dot dot-6"></span>
                          <span className="dot-span dot dot-7"></span>
                          <span className="button app-store  px-16 py-4 rounded-full">
                            <div className="icon-app w-embed">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                                viewBox="0 0 24 24"
                                fill="none"
                              ></svg>
                            </div>
                            App Store
                          </span>
                        </a>
                        <a
                          href="https://play.google.com/store/apps/heyjinie"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="button-wrapper w-inline-block"
                        >
                          <span className="dot-span dot dot-1"></span>
                          <span className="dot-span dot dot-2"></span>
                          <span className="dot-span dot dot-3"></span>
                          <span className="dot-span dot dot-4"></span>
                          <span className="dot-span dot dot-5"></span>
                          <span className="dot-span dot dot-6"></span>
                          <span className="dot-span dot dot-7"></span>
                          <span className="button radial px-16 py-4 rounded-full">
                            <div className="icon-app w-embed">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                                viewBox="0 0 24 24"
                                fill="none"
                              ></svg>
                            </div>
                            Google Play
                          </span>
                        </a>
                      </div>
                      <div className="free-tag">
                        <div className="body-b2-bold">Available for free</div>
                        <div className="hero-tag-line w-embed">
                          <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 143 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          ></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>
                <div className="menu-button w-nav-button">
                  <div className="menu-button-lines">
                    <div className="menu-line line-1"></div>
                    <div className="menu-line line-2"></div>
                  </div>
                </div>
                <div className="nav-buttons navbar-set">
                  <a
                    href="https://apps.apple.com/us/app/heyjinie"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button-wrapper white-button w-inline-block"
                  >
                    <span className="dot-span dot dot-1 white-dot"></span>
                    <span className="dot-span dot dot-2 white-dot"></span>
                    <span className="dot-span dot dot-3 white-dot"></span>
                    <span className="dot-span dot dot-4 white-dot"></span>
                    <span className="dot-span dot dot-5 white-dot"></span>
                    <span className="dot-span dot dot-6 white-dot"></span>
                    <span className="dot-span dot dot-7 white-dot"></span>
                    <span className="button radial px-16 py-4 rounded-full">
                      <div className="icon-app w-embed">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          viewBox="0 0 24 24"
                          fill="none"
                        ></svg>
                      </div>
                    </span>
                  </a>
                  <a
                    href="https://play.google.com/store/apps/heyjinie"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button-wrapper white-button w-inline-block"
                  >
                    <span className="dot-span dot dot-1 white-dot"></span>
                    <span className="dot-span dot dot-2 white-dot"></span>
                    <span className="dot-span dot dot-3 white-dot"></span>
                    <span className="dot-span dot dot-4 white-dot"></span>
                    <span className="dot-span dot dot-5 white-dot"></span>
                    <span className="dot-span dot dot-6 white-dot"></span>
                    <span className="dot-span dot dot-7 white-dot"></span>
                    <span className="button radial px-16 py-4 rounded-full">
                      <div className="icon-app w-embed">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          viewBox="0 0 24 24"
                          fill="none"
                        ></svg>
                      </div>
                    </span>
                  </a>
                </div>
              </address>
            </div>
          </header>

          <div className="page-wrapper">
            {/* The rest of your content (sections) goes here,
                it's quite long, so I've omitted it for brevity in this response.
                Make sure to copy paste your entire JSX for the sections from your file.
            */}
            <div
            id="hero"
            data-scroll-time="0"
            className="sections"
            >
            <section id="hero-3" data-scroll-time="0.3" className="hero-sc">
                <div
                    data-w-id="83f81923-1b75-c8dc-d4eb-6d2d733b9ce9"
                    className="hero-height"
                >
                    <div className="hero-sticky">
                    <div className="container hero-s">
                        <div className="hero-background-wrapper">
                        <div className="hero-mobiles-frame">
                            <div
                            data-w-id="0d266ba2-097f-e8bc-8721-e41ab0acc793"
                            className="lotties-frame"
                            >
                            <div className="div-block-6">
                                <img
                                src="/images/phone-1.png"
                                loading="lazy"
                                sizes="(max-width: 479px) 100vw, 24vw"
                                srcSet="/images/phone-1.png 500w, /images/phone-1.png 720w"
                                alt=""
                                className="image-contain index"
                                />
                                <div className="ellipses-frame">
                                <div
                                    data-is-ix2-target="1"
                                    className="lottie-animation-2"
                                    data-w-id="8baac767-853b-391c-0c9f-bdcf2c265242"
                                    data-animation-type="lottie"
                                    data-src="/json/waves-v3.json"
                                    data-loop="0"
                                    data-direction="1"
                                    data-autoplay="0"
                                    data-renderer="svg"
                                    data-duration="0"
                                ></div>
                                </div>
                            </div>
                            </div>
                            <div className="load-block">
                            <div className="hero-image-frame blue bluetwo">
                                <img
                                src="/images/Blue.png"
                                loading="lazy"
                                sizes="(max-width: 479px) 100vw, 22vw"
                                srcSet="/images/Blue.png 500w, /images/Blue.png 532w"
                                alt=""
                                className="image-contain hero"
                                />
                            </div>
                            </div>
                            <div className="load-block">
                            <div className="hero-image-frame blue">
                                <img
                                src="/images/Headphones.png"
                                loading="lazy"
                                sizes="(max-width: 479px) 100vw, 22vw"
                                srcSet="/images/Headphones.png 500w, /images/Headphones.png 532w"
                                alt=""
                                className="image-contain hero"
                                />
                            </div>
                            </div>
                            <div className="load-block">
                            <div className="hero-image-frame watch">
                                <img
                                src="/images/Chocolates.png"
                                loading="lazy"
                                sizes="(max-width: 479px) 100vw, 19vw"
                                srcSet="/images/Chocolates.png 500w, /images/Chocolates.png 516w"
                                alt=""
                                className="image-contain hero"
                                />
                            </div>
                            </div>
                            <div className="load-block">
                            <div className="hero-image-frame green">
                                <img
                                src="/images/Green.png"
                                loading="lazy"
                                sizes="(max-width: 479px) 100vw, 22vw"
                                srcSet="/images/Green.png 500w, /images/Green.png 678w"
                                alt=""
                                className="image-contain hero"
                                />
                            </div>
                            </div>
                            <div className="load-block">
                            <div className="hero-image-frame pink">
                                <img
                                src="/images/Cupcake.png"
                                loading="lazy"
                                sizes="(max-width: 479px) 100vw, 22vw"
                                srcSet="/images/Cupcake.png 500w, /images/Cupcake.png 678w"
                                alt=""
                                className="image-contain hero"
                                />
                            </div>
                            </div>
                            <div className="load-block">
                            <div className="hero-image-frame stats">
                                <img
                                src="/images/Sambas.png"
                                loading="lazy"
                                alt=""
                                className="image-contain hero"
                                />
                            </div>
                            </div>
                            <div className="load-block">
                            <div className="hero-image-frame stats">
                                <img
                                src="/images/Sambas.png"
                                loading="lazy"
                                alt=""
                                className="image-contain hero"
                                />
                            </div>
                            </div>
                            <div
                            data-w-id="7d98cfe2-d593-e33a-1a6b-4612262cc9ec"
                            className="mobiles-header-position"
                            >
                            <div className="mobiles-header">
                                <div className="at-mobileiconcolors">
                                <div className="mobiles-icon">
                                    <span>
                                    <img src="/images/001.png" alt="icon" />
                                    </span>
                                </div>
                                <div className="mobiles-icon">
                                    <span>
                                    <img src="/images/002.png" alt="icon" />
                                    </span>
                                </div>
                                <div className="mobiles-icon">
                                    <span>
                                    <img src="/images/003.png" alt="icon" />
                                    </span>
                                </div>
                                </div>
                                <div className="text-block mobiles-s">
                                <h1
                                    data-w-id="d02a23e5-7a0a-ef8d-d454-ce45c63f9cd0"
                                    className="heading-5 black"
                                >
                                    Heyjinie Stickers = Real Surprises
                                </h1>
                                </div>
                                <div
                                data-w-id="252731c4-ead5-c060-902b-2f34848445c7"
                                className="body-b2 black hero-s"
                                >
                                These aren&apos;t just cute stickers.
                                <br />
                                They come with real products you or your friends
                                can tap and claim instantly — whether you&apos;re
                                sharing a moment or treating yourself.
                                </div>
                            </div>
                            </div>
                        </div>
                        <div
                        data-w-id="ec5e3b76-083e-51ce-6c1b-3b204fa6cb37"
                        className="hero-top-block"
                        >
                        <div className="text-block hero-s">
                            <h2
                            data-w-id="2dd29685-6e5b-9788-94cb-31867e0dac0f"
                            className="heading-3"
                            >
                            Effortless Gifting,
                            <br />
                            Endless Possibilities...
                            </h2>
                            <p className="body-b2 gray-3">
                            With Heyjinie, you can send real, fun gifts from your
                            chat — anytime, anywhere.
                            </p>
                        </div>
                        <div
                            data-w-id="77a7cfba-bf1e-d301-bca9-d53c83f21e07"
                            className="download-buttons"
                        >
                            <a
                            href="https://apps.apple.com/us/app/heyjinie/id6443644593"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-wrapper w-inline-block"
                            >
                            <span className="dot-span dot dot-1"></span>
                            <span className="dot-span dot dot-2"></span>
                            <span className="dot-span dot dot-3"></span>
                            <span className="dot-span dot dot-4"></span>
                            <span className="dot-span dot dot-5"></span>
                            <span className="dot-span dot dot-6"></span>
                            <span className="dot-span dot dot-7"></span>
                            <span className="button app-store px-16 py-4 rounded-full">
                                <div className="icon-app w-embed">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                ></svg>
                                </div>
                                App Store
                            </span>
                            </a>
                            <a
                            href="https://play.google.com/store/apps/details?id=com.heyjinie&amp;pli=1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-wrapper w-inline-block"
                            >
                            <span className="dot-span dot dot-1"></span>
                            <span className="dot-span dot dot-2"></span>
                            <span className="dot-span dot dot-3"></span>
                            <span className="dot-span dot dot-4"></span>
                            <span className="dot-span dot dot-5"></span>
                            <span className="dot-span dot dot-6"></span>
                            <span className="dot-span dot dot-7"></span>
                            <span className="button px-16 py-4 rounded-full">
                                <div className="icon-app w-embed">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                ></svg>
                                </div>
                                Google Play
                            </span>
                            </a>
                        </div>
                        </div>
                        <div
                        data-w-id="43f2b9ae-e245-b884-bb82-f10012d757fd"
                        className="hero-background-card preloader"
                        ></div>
                        <div
                        preloader-element=""
                        data-w-id="beabe77a-f0fe-e95a-e72f-9551ddb53804"
                        className="preloader-lottie-wrapper"
                        >
                        <div className="preloader-element">
                            <Image
                            src="/images/logoicons.png"
                            alt="HeyJinie Preloader Logo"
                            width={200} // Example width
                            height={200} // Example height
                            priority // Load immediately
                            />
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div
                    data-w-id="b5bf6b45-92cc-1e99-761d-44890f674486"
                    className="down-navbar-anchor"
                ></div>
            </div>
            </section>
            <section className="marketplace-sc">
            <div className="marketplace-height">
                <div
                data-w-id="439ace2f-163b-ba6d-dd45-89037edc1b74"
                className="marketplace-subheight"
                >
                <div id="marketplace" className="marketplace-anchor"></div>
                <div className="marketplace-sticky">
                    <div className="container marketplace-sc">
                    <div className="marketplace-text-column">
                        <div className="marketplace-text-block set-1">
                        <div className="marketplace-header-block">
                            <div
                            className="marketplace-header-cell"
                            style={{ marginTop: '80px' }}
                            >
                            <h2 className="heading-5 black">
                                Gifts for Every Occasion
                            </h2>
                            </div>
                        </div>
                        <div className="marketplace-mobile-header">
                            <h2 className="heading-5 black">
                            Gifts for Every Occasion
                            </h2>
                        </div>
                        <div className="body-b2 black">
                            From birthdays to “just because” — or even a little
                            something for yourself. Explore our huge collection of
                            fun and useful products ready to send, share, or shop
                            in seconds.
                        </div>
                        </div>
                    </div>
                    <div className="lottie-animation">
                        <Image src="/images/work-s.png" alt="Work Setup" width={500} height={300} />
                    </div>
                    <div className="gradient-marketplace"></div>
                    </div>
                </div>
                </div>
            </div>
            </section>

            <section style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
            <div className="categories-height">
                <div
                id="categoriesSection"
                data-w-id="a4173fd1-d22c-cfe1-4a50-7064c0dfc847"
                className="categories-subheight"
                >
                <div className="categories-sticky">
                    <div className="container categories-sc">
                    <div className="stickers-second-header">
                        <div className="flex-row">
                        <h1
                            data-w-id="91605213-01c0-65b5-9335-a538af67d29e"
                            moving-text=""
                            className="heading-3 white fade"
                        >
                            Celebrate, No Matter the Distance
                        </h1>
                        <p
                            data-w-id="91605213-01c0-65b5-9335-a538af67d29e"
                            moving-text=""
                            className="body-b2 white fade"
                        >
                            Near or far, you can still make someone smile — or
                            lift your own mood.
                        </p>
                        </div>
                    </div>
                    <div className="categories-content-wrapper">
                        <div className="categories-headers-wrapper">
                        <div className="categories-header-cell cell-1">
                            <div className="categories-color-header">
                            <div
                                data-w-id="b4af43bc-86b5-979e-8947-e58141e5189c"
                                className="heading-3 height size-set"
                            >
                                Send
                            </div>
                            <div className="heading-3 gradient">Send</div>
                            </div>
                            <div
                            data-w-id="b4af43bc-86b5-979e-8947-e58141e5189c"
                            className="heading-3 height size-set"
                            >
                            real product
                            </div>
                        </div>
                        <div className="categories-header-cell cell-2">
                            <div className="categories-color-header">
                            <div
                                data-w-id="cd13d8a0-e0d8-5343-e81d-3b4fb6ee3f06"
                                className="heading-3 height size-set"
                            >
                                stickers instantly
                            </div>
                            <div
                                data-w-id="45b34588-bc97-25cd-4d6b-2bc55c7ac845"
                                className="heading-3 gradient"
                            >
                                instantly
                            </div>
                            </div>
                        </div>
                        <div className="categories-header-cell cell-3">
                            <div className="categories-color-header">
                            <div
                                data-w-id="a0758e6e-3efa-dfae-95af-542c0a20c14e"
                                className="heading-3 height size-set"
                            >
                                right from your keyboard
                            </div>
                            <div
                                data-w-id="13144530-df0e-8854-608c-bf17bf76eca3"
                                className="heading-3 gradient"
                            >
                                your keyboard
                            </div>
                            </div>
                        </div>
                        <div className="categories-header-cell cell-4">
                            <div className="categories-color-header">
                            <div
                                data-w-id="c24a7958-f4cd-a4ba-a929-436b98789120"
                                className="heading-3 height size-set"
                            >
                                inside your favorite
                            </div>
                            <div
                                data-w-id="41eba5c2-58e7-5b1a-c5b5-04aa06ef355d"
                                className="heading-3 gradient"
                            >
                                favorite
                            </div>
                            </div>
                        </div>
                        <div className="categories-header-cell cell-5">
                            <div className="categories-color-header">
                            <div
                                data-w-id="a77075ed-f1bf-7294-8ad5-21aa1b7a1896"
                                className="heading-3 height size-set"
                            >
                                messenger
                            </div>
                            <div
                                data-w-id="a77075ed-f1bf-7294-8ad5-21aa1b7a1896"
                                className="heading-3 gradient"
                            >
                                messenger
                            </div>
                            </div>
                            <div
                            data-w-id="a77075ed-f1bf-7294-8ad5-21aa1b7a1896"
                            className="heading-3 height size-set"
                            >
                            app
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>
            <section className="categories-mobile-sc">
                <div className="container categories-mobile-sc">
                    <div className="categories-wrapper">
                    <div className="category-block">
                        <div className="category-icon-wrapper">
                        <Image
                            src="/images/0004.png"
                            loading="lazy"
                            alt=""
                            className="image-contain"
                            width={100}
                            height={100}
                        />
                        </div>
                        <div className="category-text-wrapper">
                        <div className="category-first-header">
                            <h2 className="heading-3 height size-set">Send</h2>
                            <h2 className="heading-3 gradient">Send</h2>
                        </div>
                        <h2 className="heading-3 height size-set">real product</h2>
                        </div>
                    </div>
                    <div className="category-block">
                        <div className="category-icon-wrapper">
                        <Image
                            src="/images/0002.png"
                            loading="lazy"
                            alt=""
                            width={100}
                            height={100}
                        />
                        </div>
                        <div className="category-text-wrapper">
                        <h2 className="heading-3 height size-set">stickers</h2>
                        <div className="category-first-header">
                            <h2 className="heading-3 height size-set">instantly</h2>
                            <h2 className="heading-3 gradient">instantly</h2>
                        </div>
                        </div>
                    </div>
                    <div className="category-block">
                        <div className="category-icon-wrapper">
                        <Image
                            src="/images/0003.png"
                            loading="lazy"
                            alt=""
                            className="image-contain"
                            width={100}
                            height={100}
                        />
                        </div>
                        <div className="category-text-wrapper">
                        <div className="heading-3 height size-set">right from</div>
                        <div className="category-first-header">
                            <h2 className="heading-3 height size-set">your keyboard</h2>
                            <h2 className="heading-3 gradient">your keyboard</h2>
                        </div>
                        </div>
                    </div>
                    <div className="category-block">
                        <div className="category-icon-wrapper">
                        <Image
                            src="/images/0001.png"
                            loading="lazy"
                            alt=""
                            className="image-contain"
                            width={100}
                            height={100}
                        />
                        </div>
                        <div className="category-text-wrapper">
                        <h2 className="heading-3 height size-set">inside your</h2>
                        <div className="category-first-header">
                            <h2 className="heading-3 height size-set">
                            favorite messenger
                            </h2>
                            <h2 className="heading-3 gradient">favorite messenger</h2>
                        </div>
                        <h2 className="heading-3 height size-set">app</h2>
                        </div>
                    </div>
                    </div>
                    <div className="category-fade-area">
                    <div
                        id="categoriesSectionMobile"
                        data-w-id="8bea9967-8f83-9106-87d3-8c937e1ea6fe"
                        className="category-fade-height"
                    >
                        <div className="categody-fade-sticky">
                        <div className="stickers-second-header">
                            <div className="category-mask-wrapper">
                            <div className="flex-row">
                                <h1 className="heading-3 fade">
                                Celebrate, No Matter the Distance
                                </h1>
                                <p className="fade">
                                Near or far, you can still make someone smile — or
                                lift your own mood.
                                </p>
                            </div>
                            <div className="category-mask"></div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </section>
                <section className="rotate-sc">
                <div className="rotate-height">
                    <div
                    data-w-id="9daae68c-791a-b52b-db16-559b608e3973"
                    className="rotate-subheight"
                    >
                    <div className="rotate-sticky">
                        <div className="container rotate-s">
                        <div className="rotate-first-header">
                            <p className="body-b2 black">How it works</p>
                            <div className="rotate-header-block-desktop">
                            <h2 className="heading-2">Choose How</h2>
                            <div className="header-space"></div>
                            <h2 className="heading-2">you gift</h2>
                            </div>
                            <div className="rotate-header-block-mobile">
                            <h2 className="heading-3">Choose How you gift<br /></h2>
                            </div>
                        </div>
                        <div className="rotate-cards-flexbox">
                            <div className="rotate-ellipse">
                            <div className="rotate-card card-1">
                                <div className="video-cover set-1 w-embed">
                                <div
                                    style={{ width: '100%', height: '100%' }}
                                    className="w-background-video w-background-video-atom"
                                >
                                    <video className="card-video" autoPlay muted loop playsInline>
                                    <source src="/video/Discover.mov" data-wf-ignore="true" />
                                    </video>
                                </div>
                                </div>
                            </div>
                            <div className="rotate-card card-2">
                                <div className="video-cover set-2 w-embed">
                                <div
                                    style={{ width: '100%', height: '100%' }}
                                    className="w-background-video w-background-video-atom"
                                >
                                    <video className="card-video" autoPlay muted loop playsInline>
                                    <source src="/video/Send.mov" data-wf-ignore="true" />
                                    </video>
                                </div>
                                </div>
                            </div>
                            <div className="rotate-card card-3">
                                <div className="video-cover set-3 w-embed">
                                <div
                                    style={{ width: '100%', height: '100%' }}
                                    className="w-background-video w-background-video-atom"
                                >
                                    <video className="card-video" autoPlay muted loop playsInline>
                                    <source src="/video/Redeem.mov" data-wf-ignore="true" />
                                    </video>
                                </div>
                                </div>
                            </div>
                            <div className="rotate-card card-5"></div>
                            </div>
                        </div>
                        <div className="rotate-swap-headers-wrapper">
                        <div className="rotate-swap-icons">
                            <div
                            data-w-id="8e411552-adb0-16bd-82e7-3a5c5b06588d"
                            className="rotate-swap-icon"
                            >
                            <div className="swap-iocn">
                                <Image
                                src="/images/Discover.png"
                                loading="lazy"
                                alt=""
                                className="image-contain"
                                width={100}
                                height={100}
                                />
                            </div>
                            </div>
                            <div
                            data-w-id="379bbc29-f9ea-385d-47af-e46ddc422dad"
                            className="rotate-swap-icon"
                            >
                            <div className="swap-iocn">
                                <Image
                                src="/images/Send.png"
                                loading="lazy"
                                alt=""
                                className="image-contain"
                                width={100}
                                height={100}
                                />
                            </div>
                            </div>
                            <div
                            data-w-id="6fe3ae2b-1889-f5c0-4131-58531a49c9de"
                            className="rotate-swap-icon"
                            >
                            <div className="swap-iocn">
                                <Image
                                src="/images/Redeem.png"
                                loading="lazy"
                                alt=""
                                className="image-contain"
                                width={100}
                                height={100}
                                />
                            </div>
                            </div>
                        </div>
                        <div className="rotate-swap-headers-frame">
                            <div className="rotate-swap-header-cell set-1">
                            <h3 className="heading-5">Browse</h3>
                            <p className="body-b2 gray-3">
                                Discover a wide range of real products from your
                                favorite brands. Whether it&apos;s for someone
                                else or just for you, find the perfect thing for
                                any occasion or everyday moment.
                            </p>
                            </div>
                            <div className="rotate-swap-header-cell set-2">
                            <h3 className="heading-5">Send</h3>
                            <p className="body-b2 gray-3">
                                Choose a product, personalize it with a message
                                and template if you like, and send it instantly
                                through your favorite chat app — or simply keep it
                                for yourself. Easy, fast, and fun.
                            </p>
                            </div>
                            <div className="rotate-swap-header-cell set-3">
                            <h3 className="heading-5">Redeem</h3>
                            <p className="body-b2 gray-3">
                                Products can be easily redeemed online or
                                in-store. No hassle, no waiting — just instant
                                access to what you want, when you want it
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div
                    data-w-id="380efe1b-0919-769f-b196-2b8173c9e797"
                    className="color-anchor"
                ></div>
                </div>
            </section>
            <section className="stats-sc">
                <div className="container stats-s">
                    <div
                    data-w-id="3ddadffb-60d7-686f-c6b4-a50da303959f"
                    className="stats-card-wrapper"
                    >
                    <div className="stats-card">
                        <Image
                        src="/images/b1.png"
                        loading="lazy"
                        style={{ height: '320px', objectFit: 'contain' }}
                        alt="Deal of the Day"
                        width={300}
                        height={320}
                        />
                        <h2 className="heading-6 black card-s">Deal of the Day</h2>
                        <p>
                        A new surprise every day! Check out today&apos;s top pick
                        — fun, fresh, and perfect whether you&apos;re sending it
                        or adding it to your own collection
                        </p>
                    </div>
                    <div className="stats-card-gradient"></div>
                    </div>
                    <div
                    data-w-id="e994acc4-ea73-3602-4087-206d2cc9a433"
                    className="stats-card-wrapper"
                    >
                    <div className="stats-card">
                        <Image
                        src="/images/b2.png"
                        loading="lazy"
                        style={{ height: '320px', objectFit: 'contain' }}
                        alt="Event Calendar"
                        width={300}
                        height={320}
                        />
                        <h2 className="heading-6 black">Event Calendar</h2>
                        <p>
                        Never miss a reason to celebrate. Keep track of all the
                        big (and small) days that matter — and stay ready to shop,
                        share, or connect with perfect timing.
                        </p>
                    </div>
                    <div className="stats-card-gradient"></div>
                    </div>
                </div>
                </section>
                <section className="watch-sc">
                <div
                    data-w-id="717531ec-07ce-cbce-d2e2-0c9bd4bb0776"
                    className="container watch-s"
                >
                    <div className="watch-header">
                    <div className="watch-header-sticky">
                        <div className="apple-watch-subheader">
                        Make Every Occasion memorable with
                        </div>
                        <div className="sticker-logo-text">
                        <Image
                            src="/images/logoicons.png"
                            alt="HeyJinie Logo Large"
                            className="logo-large"
                            width={100}
                            height={30}
                        />
                        <h2 className="apple-watch-header">HeyJinie</h2>
                        </div>
                    </div>
                    </div>
                    <div className="overflow-container">
                    <div className="watch-block watch-11 shadow-lg">
                        <Image
                        src="/images/NB.png"
                        loading="lazy"
                        sizes="(max-width: 479px) 100vw, 20vw"
                        // srcSet="/images/NB.png 500w, /images/NB.png 549w"
                        alt=""
                        className="image-contain"
                        width={200}
                        height={200}
                        />
                    </div>
                    <div className="watch-block watch-12">
                        <Image
                        src="/images/Blue.png"
                        loading="lazy"
                        sizes="(max-width: 479px) 100vw, 20vw"
                        // srcSet="/images/Blue.png 500w, /images/Blue.png 549w"
                        alt=""
                        className="image-contain"
                        width={200}
                        height={200}
                        />
                    </div>
                    <div className="watch-block watch-1">
                        <Image
                        src="/images/09.png"
                        loading="lazy"
                        sizes="(max-width: 479px) 100vw, 27vw"
                        // srcSet="/images/09.png 500w, /images/09.png 798w"
                        alt=""
                        className="image-contain"
                        width={200}
                        height={200}
                        />
                    </div>
                    <div className="watch-block watch-2">
                        <Image
                        src="/images/01.png"
                        loading="lazy"
                        sizes="(max-width: 479px) 100vw, 20vw"
                        // srcSet="/images/01.png 500w, /images/01.png 549w"
                        alt=""
                        className="image-contain"
                        width={200}
                        height={200}
                        />
                    </div>
                    <div className="watch-block watch-3">
                        <Image
                        src="/images/02.png"
                        loading="lazy"
                        sizes="(max-width: 479px) 100vw, 10vw"
                        // srcSet="/images/02.png 500w, /images/02.png 544w"
                        alt=""
                        className="image-contain"
                        width={200}
                        height={200}
                        />
                    </div>
                    <div className="watch-block watch-4">
                        <Image
                        src="/images/03.png"
                        loading="lazy"
                        sizes="(max-width: 479px) 100vw, 20vw"
                        // srcSet="/images/03.png 500w, /images/03.png 798w"
                        alt=""
                        className="image-contain"
                        width={200}
                        height={200}
                        />
                    </div>
                    <div className="watch-block watch-5">
                        <Image
                        src="/images/04.png"
                        loading="lazy"
                        sizes="(max-width: 479px) 100vw, 20vw"
                        // srcSet="/images/04.png 500w, /images/04.png 536w"
                        alt=""
                        className="image-contain"
                        width={200}
                        height={200}
                        />
                    </div>
                    <div className="watch-block watch-6">
                        <Image
                        src="/images/05.png"
                        loading="lazy"
                        sizes="(max-width: 479px) 100vw, 20vw"
                        // srcSet="/images/05.png 500w, /images/05.png 549w"
                        alt=""
                        className="image-contain"
                        width={200}
                        height={200}
                        />
                    </div>
                    <div className="watch-block watch-7">
                        <Image
                        src="/images/06.png"
                        loading="lazy"
                        alt=""
                        className="image-contain"
                        width={200}
                        height={200}
                        />
                    </div>
                    <div className="watch-block watch-8">
                        <Image
                        src="/images/07.png"
                        loading="lazy"
                        sizes="(max-width: 479px) 100vw, 20vw"
                        // srcSet="/images/07.png 500w, /images/07.png 549w"
                        alt=""
                        className="image-contain"
                        width={200}
                        height={200}
                        />
                    </div>
                    <div className="watch-block watch-9">
                        <Image
                        src="/images/08.png"
                        loading="lazy"
                        sizes="(max-width: 479px) 100vw, 20vw"
                        // srcSet="/images/08.png 500w, /images/08.png 549w"
                        alt=""
                        className="image-contain"
                        width={200}
                        height={200}
                        />
                    </div>
                    </div>
                </div>
                </section>
                <section className="cta-sc">
                <div className="container cta-s">
                    <div className="cta-wrapper">
                    <div
                        data-w-id="7986f103-d354-9b49-ce77-45db25e8c07d"
                        className="cta-block"
                    >
                        <div className="cta-header">
                        <h1
                            data-w-id="f8e1a0c3-7e72-9912-2eb3-a12d530ef0b4"
                            className="heading-3 black"
                        >
                            Make Every
                        </h1>
                        <div className="cta-space"></div>
                        <h1
                            data-w-id="749cab70-5651-fbf3-9e17-38735a43ca2a"
                            className="heading-3 black"
                        >
                            Moment Personalized
                        </h1>
                        </div>
                        <div
                        data-w-id="311d31de-3d49-372f-b7cd-f4752043fae7"
                        className="cta-access-block"
                        >
                        <div className="body-b3 black">
                            <span className="fire">🔥</span>Products that feel just
                            right.
                        </div>
                        <div className="body-b3 black">
                            <span className="fire">🔥</span>With Heyjinie, every
                            gesture becomes meaningful — whether it&apos;s a
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; thoughtful
                            message for someone else or a vibe that fits your own
                            mood.
                        </div>
                        <div className="body-b3">
                            <span className="fire">🔥</span>Personalized templates
                            and designs make every interaction special.
                        </div>
                        </div>
                        <div className="cta-buttons">
                        <div className="download-buttons">
                            <a
                            href="https://apps.apple.com/us/app/heyjinie"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-wrapper w-inline-block"
                            >
                            <span className="dot-span dot dot-1"></span>
                            <span className="dot-span dot dot-2"></span>
                            <span className="dot-span dot dot-3"></span>
                            <span className="dot-span dot dot-4"></span>
                            <span className="dot-span dot dot-5"></span>
                            <span className="dot-span dot dot-6"></span>
                            <span className="dot-span dot dot-7"></span>
                            <span className="button app-store px-16 py-4 rounded-full">
                                <div className="icon-app w-embed">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                ></svg>
                                </div>
                                App Store
                            </span>
                            </a>
                            <a
                            href="https://play.google.com/store/apps/heyjinie"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-wrapper w-inline-block"
                            >
                            <span className="dot-span dot dot-1"></span>
                            <span className="dot-span dot dot-2"></span>
                            <span className="dot-span dot dot-3"></span>
                            <span className="dot-span dot dot-4"></span>
                            <span className="dot-span dot dot-5"></span>
                            <span className="dot-span dot dot-6"></span>
                            <span className="dot-span dot dot-7"></span>
                            <span className="button px-16 py-4 rounded-full">
                                <div className="icon-app w-embed">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                ></svg>
                                </div>
                                Google Play
                            </span>
                            </a>
                        </div>
                        <div className="free-tag">
                        <div className="body-b2-bold">Available for free</div>
                        <div className="hero-tag-line w-embed">
                            <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 143 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            ></svg>
                        </div>
                        </div>
                        </div>
                        <div className="div-block-4">
                        <Image
                            src="/images/phone-1.png"
                            loading="lazy"
                            sizes="100vw"
                            // srcSet="/images/phone-1.png 500w, /images/phone-1.png 800w, /images/phone-1.png 954w"
                            alt=""
                            className="cta-image"
                            width={954}
                            height={954}
                        />
                        <div
                            data-w-id="52a56000-33e1-bd8a-5669-fe1e1263859a"
                            data-is-ix2-target="1"
                            className="lottie-animation-6"
                            data-animation-type="lottie"
                            data-src="/json/waves-mob.json"
                            data-loop="0"
                            data-direction="1"
                            data-autoplay="0"
                            data-renderer="svg"
                            data-duration="0"
                        ></div>
                        <Image
                            src="/images/phone-1.png"
                            loading="lazy"
                            sizes="100vw"
                            // srcSet="/images/phone-1.png 500w, /images/phone-1.png 954w"
                            alt=""
                            className="cta-image background"
                            width={954}
                            height={954}
                        />
                        </div>
                    </div>
                    <div className="cta-card-gradient"></div>
                    </div>
                </div>
                </section>
                <footer className="footer-sc">
                <div className="container footer-s">
                    <div className="footer-left-content">
                    <div className="app-card-wrapper">
                        <div className="app-card">
                        <div className="footer-logo">
                            <div className="footer-logo-svg w-embed">
                            <svg
                                width="181"
                                height="55"
                                viewBox="0 0 181 55"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                            ></svg>
                            </div>
                        </div>
                        <div className="app-start">
                            <a
                            href="mailto:contact@heyjinie.com?subject=contact%40heyjinie.com"
                            style={{ textDecoration: 'none', color: '#000' }}
                            className="body-b2 black footer"
                            >
                            <div className="flex-column">
                                <div className="body-b2 black footer">Stay Connected</div>
                                <p>contact@heyjinie.com</p>
                            </div>
                            </a>
                        </div>
                        <div className="app-card-buttons">
                            <a
                            href="https://apps.apple.com/us/app/heyjinie"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-wrapper w-inline-block"
                            >
                            <span className="dot-span dot dot-1"></span>
                            <span className="dot-span dot dot-2"></span>
                            <span className="dot-span dot dot-3"></span>
                            <span className="dot-span dot dot-4"></span>
                            <span className="dot-span dot dot-5"></span>
                            <span className="dot-span dot dot-6"></span>
                            <span className="dot-span dot dot-7"></span>
                            <span className="button radial px-16 py-4 rounded-full">
                                <div className="icon-app w-embed">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                ></svg>
                                </div>
                                App Store
                            </span>
                            </a>
                            <a
                            href="https://play.google.com/store/apps/heyjinie"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-wrapper w-inline-block"
                            >
                            <span className="dot-span dot dot-1"></span>
                            <span className="dot-span dot dot-2"></span>
                            <span className="dot-span dot dot-3"></span>
                            <span className="dot-span dot dot-4"></span>
                            <span className="dot-span dot dot-5"></span>
                            <span className="dot-span dot dot-6"></span>
                            <span className="dot-span dot dot-7"></span>
                            <span className="button radial px-16 py-4 rounded-full">
                                <div className="icon-app w-embed">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                ></svg>
                                </div>
                                Google Play
                            </span>
                            </a>
                        </div>
                        </div>
                        <div className="app-card-gradient"></div>
                    </div>
                    <div className="copyright desktop">
                        <div className="body-b3">
                        ©2024 HeyJinie. Created by{' '}
                        <a
                            href="https://thestackstudios.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="stack-studios-link"
                        >
                            Stack Studios
                        </a>
                        </div>
                    </div>
                    </div>
                    <div className="footer-right-content">
                    <ul role="list" className="footer-list">
                        <li className="footer-list-item">
                        <div className="footer-ink-wrapper">
                            <a href="#marketplace" className="footer-link">
                            Marketplace
                            </a>
                            <a href="#" className="footer-link hover">
                            Marketplace
                            </a>
                            <div className="hover-line-wrapper">
                            <div className="footer-line set-1 w-embed">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                                viewBox="0 0 104 5"
                                fill="none"
                                ></svg>
                            </div>
                            </div>
                            </div>
                        </li>
                        <li className="footer-list-item">
                        <div className="footer-ink-wrapper">
                            <a href="#pricing" className="footer-link">
                            Pricing
                            </a>
                            <a href="#" className="footer-link hover">
                            Pricing
                            </a>
                            <div className="hover-line-wrapper">
                            <div className="footer-line set-1 w-embed">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                                viewBox="0 0 104 5"
                                fill="none"
                                ></svg>
                            </div>
                            </div>
                            </div>
                        </li>
                        <li className="footer-list-item">
                        <div className="footer-ink-wrapper">
                            <a href="#" className="footer-link hover">
                            Contact us
                            </a>
                            <a
                            data-w-id="b8aa7f2b-9100-7e3d-0fca-9107107155fb"
                            href="#"
                            className="footer-link"
                            >
                            Contact us
                            </a>
                            <div className="hover-line-wrapper">
                            <div className="footer-line set-1 w-embed">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                                viewBox="0 0 104 5"
                                fill="none"
                                ></svg>
                            </div>
                            </div>
                            </div>
                        </li>
                    </ul>
                    <ul role="list" className="footer-list">
                        <li className="footer-list-item">
                        <div className="footer-ink-wrapper">
                            <a href="#" className="footer-link hover">
                            Privacy Policy
                            </a>
                            <a href="#" className="footer-link">
                            Privacy Policy
                            </a>
                            <div className="hover-line-wrapper">
                            <div className="footer-line set-1 w-embed">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                                viewBox="0 0 104 5"
                                fill="none"
                                ></svg>
                            </div>
                            </div>
                            </div>
                        </li>
                        <li className="footer-list-item">
                        <div className="footer-ink-wrapper">
                            <a href="#" className="footer-link hover">
                            Return Policy
                            </a>
                            <a href="#" className="footer-link">
                            Return Policy
                            </a>
                            <div className="hover-line-wrapper">
                            <div className="footer-line set-1 w-embed">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                                viewBox="0 0 104 5"
                                fill="none"
                                ></svg>
                            </div>
                            </div>
                            </div>
                        </li>
                        <li className="footer-list-item">
                        <div className="footer-ink-wrapper">
                            <a href="#" className="footer-link hover">
                            Refund Policy
                            </a>
                            <a href="#" className="footer-link">
                            Refund Policy
                            </a>
                            <div className="hover-line-wrapper">
                            <div className="footer-line set-1 w-embed">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                                viewBox="0 0 104 5"
                                fill="none"
                                ></svg>
                            </div>
                            </div>
                            </div>
                        </li>
                        <li className="footer-list-item">
                        <div className="footer-ink-wrapper">
                            <a href="#" className="footer-link hover">
                            Terms & Conditions
                            </a>
                            <a href="#" className="footer-link">
                            Terms & Conditions
                            </a>
                            <div className="hover-line-wrapper">
                            <div className="footer-line set-1 w-embed">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100%"
                                height="100%"
                                viewBox="0 0 104 5"
                                fill="none"
                                ></svg>
                            </div>
                            </div>
                            </div>
                        </li>
                        <li className="footer-list-item socials">
                        <div className="socials-icons footer">
                            <a
                            href="https://www.facebook.com/@heyjinie"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-wrapper w-inline-block"
                            >
                            <span className="dot-span dot dot-1"></span>
                            <span className="dot-span dot dot-2"></span>
                            <span className="dot-span dot dot-3"></span>
                            <span className="dot-span dot dot-4"></span>
                            <span className="dot-span dot dot-5"></span>
                            <span className="dot-span dot dot-6"></span>
                            <span className="dot-span dot dot-7"></span>
                            <span className="button radial px-16 py-4 rounded-full btnnewicon">
                                <div className="button-icon w-embed fillblack">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 30 30"
                                    width="100%"
                                    height="100%"
                                ></svg>
                                </div>
                            </span>
                            </a>
                            <a
                            href="https://www.linkedIn.com/heyjinie"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-wrapper w-inline-block"
                            >
                            <span className="dot-span dot dot-1"></span>
                            <span className="dot-span dot dot-2"></span>
                            <span className="dot-span dot dot-3"></span>
                            <span className="dot-span dot dot-4"></span>
                            <span className="dot-span dot dot-5"></span>
                            <span className="dot-span dot dot-6"></span>
                            <span className="dot-span dot dot-7"></span>
                            <span className="button radial px-16 py-4 rounded-full btnnewicon">
                                <div className="button-icon w-embed fillblack">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 30 30"
                                    width="100%"
                                    height="100%"
                                ></svg>
                                </div>
                            </span>
                            </a>
                            <a
                            href="https://www.instagram.com/heyjinie/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-wrapper w-inline-block"
                            >
                            <span className="dot-span dot dot-1"></span>
                            <span className="dot-span dot dot-2"></span>
                            <span className="dot-span dot dot-3"></span>
                            <span className="dot-span dot dot-4"></span>
                            <span className="dot-span dot dot-5"></span>
                            <span className="dot-span dot dot-6"></span>
                            <span className="dot-span dot dot-7"></span>
                            <span className="button radial px-16 py-4 rounded-full btnnewicon">
                                <div className="button-icon w-embed fillblack">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                ></svg>
                                </div>
                            </span>
                            </a>
                            <a
                            href="https://www.tiktok.com/heyjinie"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-wrapper w-inline-block"
                            >
                            <span className="dot-span dot dot-1"></span>
                            <span className="dot-span dot dot-2"></span>
                            <span className="dot-span dot dot-3"></span>
                            <span className="dot-span dot dot-4"></span>
                            <span className="dot-span dot dot-5"></span>
                            <span className="dot-span dot dot-6"></span>
                            <span className="dot-span dot dot-7"></span>
                            <span className="button radial px-16 py-4 rounded-full btnnewicon">
                                <div className="button-icon w-embed fillblack">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 30 30"
                                    width="100%"
                                    height="100%"
                                ></svg>
                                </div>
                            </span>
                            </a>
                            <a
                            href="https://www.youtube.com/heyjinie/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-wrapper w-inline-block"
                            >
                            <span className="dot-span dot dot-1"></span>
                            <span className="dot-span dot dot-2"></span>
                            <span className="dot-span dot dot-3"></span>
                            <span className="dot-span dot dot-4"></span>
                            <span className="dot-span dot dot-5"></span>
                            <span className="dot-span dot dot-6"></span>
                            <span className="dot-span dot dot-7"></span>
                            <span className="button radial px-16 py-4 rounded-full btnnewicon">
                                <div className="button-icon w-embed fillblack">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                ></svg>
                                </div>
                            </span>
                            </a>
                        </div>
                        </li>
                    </ul>
                    </div>
                    <div className="copyright mobile">
                    <div className="body-b3">
                        ©2024 HeyJinie. Created by{' '}
                        <a
                        href="https://thestackstudios.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="stack-studios-link"
                        >
                        The Stack Studios
                        </a>
                    </div>
                    </div>
                </div>
                </footer>
            </div>
            {/* Contact Us Form - This will be shown/hidden by Webflow IX2 */}
            <div
            fs-scrolldisable-element="when-visible"
            className="contact-us"
            >
            <div className="form-gradient"></div>
            <div data-lenis-prevent="" className="container contact-s">
                <div
                data-w-id="c0ef0ec8-3685-592b-535d-985f3b49daaf"
                className="close-contact"
                >
                <div className="code-embed-6 w-embed">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 0 18 18"
                    fill="none"
                    ></svg>
                </div>
                </div>
                <h1 className="heading-3 white contact">Let’s talk</h1>
                <div id="heyJinieForm" className="form-block">
                {/* Conditional Rendering for the form */}
                {formStatus !== 'success' && (
                    <form
                    id="email-form"
                    name="email-form"
                    data-name="Email Form"
                    className="form"
                    onSubmit={handleSubmit(onSubmitContact)}
                    >
                    <div className="form-frame">
                        <div className="input-wrapper">
                        <label htmlFor="name" className="lable">
                            What’s your name?
                        </label>
                        <input
                            className="text-field w-input"
                            maxLength={256}
                            placeholder="Name"
                            type="text"
                            id="name"
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="error-message">{errors.name.message}</p>
                        )}
                        </div>
                        <div className="form-space"></div>
                        <div className="input-wrapper">
                        <label htmlFor="Email" className="lable">
                            What’s your email?
                        </label>
                        <input
                            className="text-field w-input"
                            maxLength={256}
                            placeholder="name@example.com"
                            type="email"
                            id="Email"
                            {...register('Email')}
                        />
                        {errors.Email && (
                            <p className="error-message">{errors.Email.message}</p>
                        )}
                        </div>
                        <div className="form-space"></div>
                        <div className="input-wrapper">
                        <label htmlFor="autoExpand" className="lable">
                            How we can help you?
                        </label>
                        <textarea
                            placeholder="Example Text"
                            maxLength={5000}
                            id="autoExpand"
                            className="text-area w-input"
                            {...register('field')}
                        ></textarea>
                        {errors.field && (
                            <p className="error-message">{errors.field.message}</p>
                        )}
                        </div>
                        <div className="form-space"></div>

                        <button
                        type="submit"
                        id="customSubmitButton"
                        className="button-wrapper-contact"
                        disabled={formStatus === 'loading'}
                        >
                        <span className="dot-span dot-contact dot-1"></span>
                        <span className="dot-span dot-contact dot-2"></span>
                        <span className="dot-span dot-contact dot-3"></span>
                        <span className="dot-span dot-contact dot-4"></span>
                        <span className="dot-span dot-contact dot-5"></span>
                        <span className="dot-span dot-contact dot-6"></span>
                        <span className="dot-span dot-contact dot-7"></span>
                        <span className="button-contact app-store fw-bolder px-16 py-4 rounded-full send-form">
                            {formStatus === 'loading' ? 'Sending...' : 'Send'}
                        </span>
                        </button>
                    </div>

                    <div className="form-contacts">
                        <div className="w-layout-grid contacts-grid">
                        <div className="contact-icon w-embed">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="none"
                            ></svg>
                        </div>
                        <a
                            href="mailto:contact@heyjinie.com?subject=heyjinie%40heyjinie.com"
                            className="contact-link"
                        >
                            contact@heyjinie.com
                        </a>
                        </div>
                        <div className="socials-icons contact">
                        <a
                            href="https://www.facebook.com/heyjinie/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-wrapper white-button w-inline-block"
                        >
                            <span className="dot-span dot dot-1 white-dot"></span>
                            <span className="dot-span dot dot-2 white-dot"></span>
                            <span className="dot-span dot dot-3 white-dot"></span>
                            <span className="dot-span dot dot-4 white-dot"></span>
                            <span className="dot-span dot dot-5 white-dot"></span>
                            <span className="dot-span dot dot-6 white-dot"></span>
                            <span className="dot-span dot dot-7 white-dot"></span>
                            <span className="button radial px-16 py-4 rounded-full btnnewicon">
                            <div className="button-icon w-embed">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 30 30"
                                width="100%"
                                height="100%"
                                ></svg>
                            </div>
                            </span>
                        </a>
                        <a
                            href="https://www.linkedIn.com/heyjinie"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-wrapper white-button w-inline-block"
                        >
                            <span className="dot-span dot dot-1 white-dot"></span>
                            <span className="dot-span dot dot-2 white-dot"></span>
                            <span className="dot-span dot dot-3 white-dot"></span>
                            <span className="dot-span dot dot-4 white-dot"></span>
                            <span className="dot-span dot dot-5 white-dot"></span>
                            <span className="dot-span dot dot-6 white-dot"></span>
                            <span className="dot-span dot dot-7 white-dot"></span>
                            <span className="button radial px-16 py-4 rounded-full btnnewicon">
                                <div className="button-icon w-embed">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 30 30"
                                    width="100%"
                                    height="100%"
                                ></svg>
                                </div>
                            </span>
                            </a>
                            <a
                            href="https://www.instagram.com/heyjinie/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-wrapper white-button w-inline-block"
                            >
                            <span className="dot-span dot dot-1 white-dot"></span>
                            <span className="dot-span dot dot-2 white-dot"></span>
                            <span className="dot-span dot dot-3 white-dot"></span>
                            <span className="dot-span dot dot-4 white-dot"></span>
                            <span className="dot-span dot dot-5 white-dot"></span>
                            <span className="dot-span dot dot-6 white-dot"></span>
                            <span className="dot-span dot dot-7 white-dot"></span>
                            <span className="button radial px-16 py-4 rounded-full btnnewicon">
                                <div className="button-icon w-embed">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                ></svg>
                                </div>
                            </span>
                            </a>
                            <a
                            href="https://www.tiktok.com/heyjinie/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-wrapper white-button w-inline-block"
                            >
                            <span className="dot-span dot dot-1 white-dot"></span>
                            <span className="dot-span dot dot-2 white-dot"></span>
                            <span className="dot-span dot dot-3 white-dot"></span>
                            <span className="dot-span dot dot-4 white-dot"></span>
                            <span className="dot-span dot dot-5 white-dot"></span>
                            <span className="dot-span dot dot-6 white-dot"></span>
                            <span className="dot-span dot dot-7 white-dot"></span>
                            <span className="button radial px-16 py-4 rounded-full btnnewicon">
                                <div className="button-icon w-embed">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 30 30"
                                    width="100%"
                                    height="100%"
                                ></svg>
                                </div>
                            </span>
                            </a>
                            <a
                            href="https://www.youtube.com/heyjinie/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-wrapper white-button w-inline-block"
                            >
                            <span className="dot-span dot dot-1 white-dot"></span>
                            <span className="dot-span dot dot-2 white-dot"></span>
                            <span className="dot-span dot dot-3 white-dot"></span>
                            <span className="dot-span dot dot-4 white-dot"></span>
                            <span className="dot-span dot dot-5 white-dot"></span>
                            <span className="dot-span dot dot-6 white-dot"></span>
                            <span className="dot-span dot dot-7 white-dot"></span>
                            <span className="button radial px-16 py-4 rounded-full btnnewicon">
                                <div className="button-icon w-embed">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                ></svg>
                                </div>
                            </span>
                            </a>
                        </div>
                        </div>
                    </form>
                )}
                
                {formStatus === 'success' && (
                    <div className="success-message w-form-done">
                    <div className="success-text-wrapper">
                        <div className="lable">
                        Thank you for submitting the form.
                        </div>
                        <div className="heading-6 white">We’ll talk to you soon!</div>
                    </div>
                    </div>
                )}
                
                {formStatus === 'error' && (
                    <div className="w-form-fail">
                    <div>{formErrorMessage || 'Oops! Something went wrong.'}</div>
                    </div>
                )}
                </div>
            </div>
            </div>
          </div>
        </div>
        {/*
          CRITICAL: These scripts must load last or lazy,
          and webflow.js needs to be able to re-initialize.
        */}
        <Script
          src="/js/jquery-3.5.1.min.js?site=667fa6c733097c1516bb9760"
          strategy="beforeInteractive"
        />
        <Script src="/js/webflow.js" strategy="lazyOnload" />
        <Script
          src="/librararies/lottieLazyLoading.min.js"
          strategy="lazyOnload"
        />
        <Script
          src="/librararies/swiper-bundle.min.js"
          strategy="lazyOnload"
          id="swiper-script"
        />
        <Script src="/librararies/scrolldisable.js" strategy="lazyOnload" />
        <Script
          src="/librararies/kinet.min.js"
          strategy="lazyOnload"
          id="kinet-script"
        />
      </main>
    </>
  );
};

export default HomePage;