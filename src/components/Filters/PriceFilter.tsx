// src/components/Filters/PriceFilter.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

const PriceFilter: React.FC = () => {
  const [minPrice, setMinPrice] = useState<string>('10');
  const [maxPrice, setMaxPrice] = useState<string>('1000');
  const router = useRouter();

  const handleApplyFilter = () => {
    const min = parseInt(minPrice, 10);
    const max = parseInt(maxPrice, 10);

    if (isNaN(min) || isNaN(max) || min < 0 || max < 0) {
      toast.error('Please enter valid positive price values.');
      return;
    }
    if (min > max) {
      toast.error('Minimum price cannot be greater than maximum price.');
      return;
    }

    // Navigate to a results page with price range as query parameters
    router.push(`/products/filter/price?min=${min}&max=${max}`);
  };

  return (
    <div className="p-4  rounded-b-lg -mt-1">
      {' '}
      {/* Added padding and background */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        {/* Min Price */}
        <div className="flex flex-col items-start">
          <label htmlFor="minPrice" className="text-sm text-gray-600 mb-1">
            Min Price
          </label>
          <div className="relative w-64">
            <span className="absolute left-36 top-1/2 transform -translate-y-1/2 text-gray-500">
             PKR
            </span>
            <Input
              id="minPrice"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="10"
              min="0"
              className="w-full pl-12 h-12 text-center border-gray-600 rounded-lg focus:ring-[#40A574] focus:border-[#40A574]"
            />
          </div>
        </div>

        {/* Max Price */}
        <div className="flex flex-col items-start">
          <label htmlFor="maxPrice" className="text-sm text-gray-600 mb-1">
            Max Price
          </label>
          <div className="relative w-64">
            <span className="absolute left-36 top-1/2 transform -translate-y-1/2 text-gray-500">
              PKR
            </span>
            <Input
              id="maxPrice"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="1000"
              min="0"
              className="w-full pl-12 h-12 text-center border-gray-600 rounded-lg bg-gray-700 focus:ring-[#40A574] focus:border-[#40A574]"
            />
          </div>
        </div>
      </div>
      <Button
        onClick={handleApplyFilter}
        className="w-1/3 bg-[#40A574] hover:bg-[#399368] text-white font-semibold rounded-lg py-3 mx-auto flex justify-center align-middle" // Style matching image
      >
        Apply Filter
      </Button>
    </div>
  );
};

export default PriceFilter;
