// src/components/page-ui/home_slider.tsx
import { useEffect, useState } from 'react';

interface HomeSliderProps {
  images: string[];
  autoplayInterval?: number;
}

function HomeSlider({ images, autoplayInterval = 3000 }: HomeSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [images.length, autoplayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-1000"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="min-w-full">
            <img
              src={image}
              alt={`Slide ${index}`}
              className="object-cover w-full"
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index
                ? 'bg-white opacity-100'
                : 'bg-white opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default HomeSlider;
