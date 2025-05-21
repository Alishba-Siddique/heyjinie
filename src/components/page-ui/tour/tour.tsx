// // src/components/page-ui/tour/tour.tsx
// import { useState } from 'react';
// import PropTypes from 'prop-types';
// import { useRouter } from 'next/navigation';  // Import useRouter
// const PlatformIntro = ({ onFinish }: { onFinish: () => void }) => {
//   const [screen, setScreen] = useState(0);
//   const router = useRouter();

//   const handleNext = () => {
//     if (screen < 3) {
//       setScreen(screen + 1);
//     } else {
//       localStorage.setItem("tourCompleted", "true");
//       router.push("/home");
//     }
//   };

//   const handleSkip = () => {
//     localStorage.setItem("tourCompleted", "true");
//     router.push("/home");
//   };

//   return (
//     <div className="at-toursscreens relative">
//       {[0, 1, 2, 3].map((index) => (
//         <div
//           key={index}
//           className={`absolute inset-0 transition-opacity duration-500 ${
//             screen === index ? "opacity-100" : "opacity-0 pointer-events-none"
//           }`}
//         >
//           {index === 0 && (
//             <div className="at-tour">
//               <div className="at-tourfirst">
//                 <strong className="at-tourlogo">
//                   <span>
//                     <img src="/images/tour/logo.png" alt="Logo" />
//                   </span>
//                 </strong>
//                 <div className="at-tourtitle">
//                   <h2>WELCOME</h2>
//                 </div>
//                 <div className="at-tourdescription">
//                   <p>
//                     Welcome to Heyjinie! Discover a world of effortless
//                     <br />
//                     gifting—personalized, instant, and meaningful. Send gifts across
//                     <br />
//                     borders in just a few taps!
//                   </p>
//                 </div>
//               </div>
//               <ul className="at-toursdot">
//                 <li className="at-active"></li>
//                 <li></li>
//                 <li></li>
//                 <li></li>
//               </ul>
//             </div>
//           )}

//           {index === 1 && (
//             <div className="at-tour at-tourscreentwo">
//               <div className="at-tourfirst at-toursecond">
//                 <div className="at-tourtitle">
//                   <h2>BROWSE</h2>
//                 </div>
//                 <div className="at-tourdescription">
//                   <p>
//                     Find the perfect gift! <br />
//                     Explore top brands and trending picks.
//                   </p>
//                 </div>
//               </div>
//               <ul className="at-toursdot">
//                 <li></li>
//                 <li className="at-active"></li>
//                 <li></li>
//                 <li></li>
//               </ul>
//             </div>
//           )}

//           {index === 2 && (
//             <div className="at-tour at-tourscreenthree">
//               <div className="at-tourfirst at-tourthree">
//                 <div className="at-tourtitle">
//                   <h2>SEND</h2>
//                 </div>
//                 <div className="at-tourdescription">
//                   <p>
//                     Send instant, personalized gifts via your favorite messenger
//                     <br />
//                     by enabling the HeyJinie keyboard.
//                     <br />
//                     <br />
//                     Start gifting effortlessly!
//                   </p>
//                 </div>
//               </div>
//               <ul className="at-toursdot">
//                 <li></li>
//                 <li></li>
//                 <li className="at-active"></li>
//                 <li></li>
//               </ul>
//             </div>
//           )}

//           {index === 3 && (
//             <div className="at-tour at-tourscreenfour">
//               <div className="at-tourfirst at-toursecond">
//                 <div className="at-tourtitle">
//                   <h2>REDEEM</h2>
//                 </div>
//                 <div className="at-tourdescription">
//                   <p>
//                     Enjoy your gift! Redeem your gift with ease at your
//                     <br />
//                     favorite brands.
//                     <br />
//                     <br />
//                     No hassle, no delays—just a<br />
//                     seamless experience.
//                   </p>
//                 </div>
//               </div>
//               <ul className="at-toursdot">
//                 <li></li>
//                 <li></li>
//                 <li></li>
//                 <li className="at-active"></li>
//               </ul>
//             </div>
//           )}
//         </div>
//       ))}

//       <div className="at-tourbtnholder">
//         <button onClick={handleSkip} className="at-tourbtn at-btnskiptour">
//           Skip
//         </button>
//         <button onClick={handleNext} className="at-tourbtn">
//           {screen === 3 ? "Finish" : "Next"}
//         </button>
//       </div>
//     </div>
//   );
// };

// PlatformIntro.propTypes = {
//   onFinish: PropTypes.func.isRequired,
// };

// export default function Tour({ onFinish }: { onFinish: () => void }) {
//   return <PlatformIntro onFinish={onFinish} />;
// }

// src/components/page-ui/tour/tour.tsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';

const PlatformIntro = ({ onFinish }: { onFinish: () => void }) => {
  const [screen, setScreen] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  // Add entrance animation effect
  useEffect(() => {
    // Small delay before showing the tour for better entrance effect
    // const timer = setTimeout(() => {
      setIsVisible(true);
    // }, 100);
    
    // return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (screen < 3) {
      setScreen(screen + 1);
    } else {
      localStorage.setItem("tourCompleted", "true");
      router.push("/home");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("tourCompleted", "true");
    router.push("/home");
  };

  return (
    <div 
      className={`at-toursscreens relative transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            screen === index ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {index === 0 && (
            <div className="at-tour">
              <div className="at-tourfirst">
                <strong className="at-tourlogo">
                  <span>
                    <img src="/images/tour/logo.png" alt="Logo" />
                  </span>
                </strong>
                <div className="at-tourtitle">
                  <h2>WELCOME</h2>
                </div>
                <div className="at-tourdescription">
                  <p>
                    Welcome to Heyjinie! Discover a world of effortless
                    <br />
                    gifting—personalized, instant, and meaningful. Send gifts across
                    <br />
                    borders in just a few taps!
                  </p>
                </div>
              </div>
              <ul className="at-toursdot">
                <li className="at-active"></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
          )}

          {index === 1 && (
            <div className="at-tour at-tourscreentwo">
              <div className="at-tourfirst at-toursecond">
                <div className="at-tourtitle">
                  <h2>BROWSE</h2>
                </div>
                <div className="at-tourdescription">
                  <p>
                    Find the perfect gift! <br />
                    Explore top brands and trending picks.
                  </p>
                </div>
              </div>
              <ul className="at-toursdot">
                <li></li>
                <li className="at-active"></li>
                <li></li>
                <li></li>
              </ul>
            </div>
          )}

          {index === 2 && (
            <div className="at-tour at-tourscreenthree">
              <div className="at-tourfirst at-tourthree">
                <div className="at-tourtitle">
                  <h2>SEND</h2>
                </div>
                <div className="at-tourdescription">
                  <p>
                    Send instant, personalized gifts via your favorite messenger
                    <br />
                    by enabling the HeyJinie keyboard.
                    <br />
                    <br />
                    Start gifting effortlessly!
                  </p>
                </div>
              </div>
              <ul className="at-toursdot">
                <li></li>
                <li></li>
                <li className="at-active"></li>
                <li></li>
              </ul>
            </div>
          )}

          {index === 3 && (
            <div className="at-tour at-tourscreenfour">
              <div className="at-tourfirst at-toursecond">
                <div className="at-tourtitle">
                  <h2>REDEEM</h2>
                </div>
                <div className="at-tourdescription">
                  <p>
                    Enjoy your gift! Redeem your gift with ease at your
                    <br />
                    favorite brands.
                    <br />
                    <br />
                    No hassle, no delays—just a<br />
                    seamless experience.
                  </p>
                </div>
              </div>
              <ul className="at-toursdot">
                <li></li>
                <li></li>
                <li></li>
                <li className="at-active"></li>
              </ul>
            </div>
          )}
        </div>
      ))}

      <div className="at-tourbtnholder">
        <button onClick={handleSkip} className="at-tourbtn at-btnskiptour">
          Skip
        </button>
        <button onClick={handleNext} className="at-tourbtn">
          {screen === 3 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

PlatformIntro.propTypes = {
  onFinish: PropTypes.func.isRequired,
};

export default function Tour({ onFinish }: { onFinish: () => void }) {
  return <PlatformIntro onFinish={onFinish} />;
}