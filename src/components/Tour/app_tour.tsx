// src/components/Tour/app_tour.tsx

'use client';

import { useState, useEffect } from 'react';

interface TourStep {
  element: string;
  title: string;
  content: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  offsetX?: number; // Custom horizontal offset
  offsetY?: number; // Custom vertical offset
}

interface AppTourProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const AppTour: React.FC<AppTourProps> = ({ isActive, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  const tourSteps: TourStep[] = [
    {
      element: '.at-categoriesslider',
      title: 'Product Categories',
      content:
        'Browse through our various product categories to find the perfect gift.',
      position: 'bottom',
      offsetY: 40, // Increased vertical offset for Product Categories
    },
    {
      element: '.upcoming-events',
      title: 'Upcoming Events',
      content:
        'Keep track of important dates and events so you never miss an occasion.',
      position: 'top',
      offsetY: -460, // Increased vertical offset for Upcoming Events
    },
    {
      element: '.top-picks',
      title: 'Top Picks',
      content: 'Discover our bestselling products and customer favorites.',
      position: 'bottom',
      offsetY: 15, // Custom offset for Top Picks
    },
    {
      element: '.personalized-gifts',
      title: 'Personalized Gifts',
      content:
        'Create custom gifts for your loved ones with our personalization options.',
      position: 'top',
      offsetY: -30, // Custom offset for Personalized Gifts
    },
  ];

  useEffect(() => {
    if (!isActive) return;

    // Find the target element for the current step
    const element = document.querySelector(tourSteps[currentStep].element);
    if (element) {
      setTargetElement(element as HTMLElement);
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, isActive, tourSteps]);

  if (!isActive || !targetElement) return null;

  const {
    title,
    content,
    position,
    offsetX = 0,
    offsetY = 10,
  } = tourSteps[currentStep];

  // Calculate tooltip position with custom offsets for each step
  const targetRect = targetElement.getBoundingClientRect();
  const tooltipStyle: React.CSSProperties = {};

  switch (position) {
    case 'top':
      tooltipStyle.top = `${targetRect.top - offsetY}px`;
      tooltipStyle.left = `${
        targetRect.left + targetRect.width / 2 + (offsetX || 0)
      }px`;
      tooltipStyle.transform = 'translate(-50%, -100%)';
      break;
    case 'right':
      tooltipStyle.top = `${
        targetRect.top + targetRect.height / 2 + (offsetY || 0)
      }px`;
      tooltipStyle.left = `${targetRect.right + offsetX}px`;
      tooltipStyle.transform = 'translate(0, -50%)';
      break;
    case 'bottom':
      tooltipStyle.top = `${targetRect.bottom + offsetY}px`;
      tooltipStyle.left = `${
        targetRect.left + targetRect.width / 2 + (offsetX || 0)
      }px`;
      tooltipStyle.transform = 'translate(-50%, 0)';
      break;
    case 'left':
      tooltipStyle.top = `${
        targetRect.top + targetRect.height / 2 + (offsetY || 0)
      }px`;
      tooltipStyle.left = `${targetRect.left - offsetX}px`;
      tooltipStyle.transform = 'translate(-100%, -50%)';
      break;
  }

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40 pointer-events-none at-maincontentwrapper" />
      <div
        className="fixed z-50 bg-white rounded-lg shadow-lg p-4 w-64"
        style={tooltipStyle}
      >
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="mb-4">{content}</p>
        <div className="flex justify-between">
          <button
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-700"
          >
            Skip
          </button>
          <div className="flex items-center">
            <span className="mr-3 text-sm text-gray-500">
              {currentStep + 1}/{tourSteps.length}
            </span>
            <button onClick={handleNext} className="at-btn at-btn-sm">
              {currentStep < tourSteps.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppTour;
