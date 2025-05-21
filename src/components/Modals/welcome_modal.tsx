// src/components/Modals/welcome_modal.tsx
'use client';
import Image from 'next/image';
import Logo from '../../../public/images/logo.png';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  showTourButton?: boolean;
  onStartTour?: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  showTourButton = false,
  onStartTour,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center at-maincontentwrapper">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        
        <div className="flex justify-center mb-4">
          <Image src={Logo} alt="Logo" width={100} height={100} />
        </div>
        
        <div className="welcome-message text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Our App!</h2>
          <p className="mb-4">
            We're thrilled to have you join our community. Here's what you can do with our app:
          </p>
          <ul className="text-left mb-6 space-y-2">
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span><strong>Browse Products:</strong> Explore our wide range of gifts and items</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span><strong>Personalize Gifts:</strong> Create custom items for your loved ones</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span><strong>Track Events:</strong> Never miss an important date again</span>
            </li>
          </ul>
          <p className="mb-6">If you need any help along the way, just click the help icon.</p>
          
          <div className="flex justify-center space-x-4">
            {showTourButton && onStartTour && (
              <button
                onClick={onStartTour}
                className="at-btn at-btn-sm bg-green-600 hover:bg-green-700"
              >
                Start Quick Tour
              </button>
            )}
            <button
              onClick={onClose}
              className="at-btn at-btn-sm"
            >
              {showTourButton ? 'Skip Tour' : 'Get Started'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;