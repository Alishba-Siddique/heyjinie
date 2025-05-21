// src/components/Filters/OccasionFilter.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { applyRecOccFilter } from '@/services/api.service';
import { Occasion, RecOccApiResponse } from '@/types/api'; // Adjust path if needed
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-toastify';
import { useSearch } from '@/context/SearchContext';

const OccasionFilter: React.FC = () => {
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { triggerSearch } = useSearch();

  useEffect(() => {
    const fetchOccasions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = (await applyRecOccFilter()) as RecOccApiResponse; // Cast the type
        if (response.success && response.data?.occasion) {
          setOccasions(response.data.occasion);
        } else {
          setError(response.message || 'Failed to fetch occasions');
          toast.error(response.message || 'Failed to fetch occasions');
        }
      } catch (err: any) {
        const errorMessage =
          err.message || 'An error occurred fetching occasions.';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Occasion Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOccasions();
  }, []);

  const handleSelect = (occasionTag: string) => {
    console.log(`OccasionFilter: Setting search term to "${occasionTag}"`);
    triggerSearch(occasionTag); // Use the context function
    // Optional: Scroll to top or give visual feedback
    window.scrollTo({ top: 0, behavior: 'smooth' });
    //  toast.info(`Searching for ${occasionTag} gifts...`);
  };
  const backgroundColors = ['#FFD05E', '#88C1FD', '#FD9399', '#FF834B'];

  return (
    <div className="at-categories mt-5">
      <div className="at-categoriesgrid overflow-x-auto horizontal-scroll snap-x snap-mandatory flex gap-4">
        {' '}
        {/* Adjust spacing */}
        {loading && (
          <div className="at-categoryitem flex gap-4 items-center">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <Skeleton className="h-24 w-24 rounded-full bg-[#d6dadb]" />
                <Skeleton className="h-4 w-20 mt-2 bg-[#d6dadb]" />
              </div>
            ))}
          </div>
        )}
        {error && !loading && <p className="text-red-500 text-sm">{error}</p>}
        {!loading &&
          !error &&
          occasions.map((occasion, index) => (
            <div
              key={occasion._id}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => handleSelect(occasion.tag)}
            >
              <div
                className="w-20 h-20 rounded-full overflow-hidden mb-2 border border-gray-200 group-hover:border-[#D6DADA] transition-colors flex items-center justify-center"
                style={{
                  backgroundColor:
                    backgroundColors[index % backgroundColors.length],
                }}
              >
                <img
                  src={occasion.image_path || '/images/placeholder.png'}
                  alt={occasion.name}
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder.png';
                  }}
                />
              </div>
              {/* <span className="text-sm font-medium text-gray-700 group-hover:text-[#40A574] transition-colors"> */}
              <span className="text-sm font-bold group-hover: transition-all">
                {occasion.name}
              </span>
            </div>
          ))}
        {!loading && !error && occasions.length === 0 && (
          <p className="text-gray-500 text-sm">No occasions found.</p>
        )}
      </div>
    </div>
  );
};

export default OccasionFilter;
