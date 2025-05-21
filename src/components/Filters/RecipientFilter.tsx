// src/components/Filters/RecipientFilter.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { applyRecOccFilter } from '@/services/api.service';
import { Recipient, RecOccApiResponse } from '@/types/api'; // Adjust path if needed
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-toastify';
import { useSearch } from '@/context/SearchContext';

const RecipientFilter: React.FC = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { triggerSearch } = useSearch();

  useEffect(() => {
    const fetchRecipients = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = (await applyRecOccFilter()) as RecOccApiResponse; // Cast the type
        if (response.success && response.data?.recipient) {
          setRecipients(response.data.recipient);
        } else {
          setError(response.message || 'Failed to fetch recipients');
          toast.error(response.message || 'Failed to fetch recipients');
        }
      } catch (err: any) {
        const errorMessage =
          err.message || 'An error occurred fetching recipients.';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Recipient Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipients();
  }, []);

  const handleSelect = (recipientTag: string) => {
    console.log(`RecipientFilter: Setting search term to "${recipientTag}"`);
    triggerSearch(recipientTag); // Use the context function
    // Optional: Scroll to top or give visual feedback
    window.scrollTo({ top: 0, behavior: 'smooth' });
    //  toast.info(`Searching for gifts for ${recipientTag}...`);
  };
  const backgroundColors = ['#FFD05E', '#88C1FD', '#FD9399', '#FF834B'];

  return (
    <div className="at-categories mt-5">
      <div className="at-categoriesgrid overflow-x-auto horizontal-scroll snap-x snap-mandatory flex gap-4 ">
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
          recipients.map((recipient, index) => (
            <div
              key={recipient._id}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => handleSelect(recipient.tag)}
            >
              <div
                className="w-20 h-20 rounded-full overflow-hidden mb-2 border border-gray-200 group-hover:border-[#D6DADA] transition-colors flex items-center justify-center"
                style={{
                  backgroundColor:
                    backgroundColors[index % backgroundColors.length],
                }}
              >
                <img
                  src={recipient.image_path || '/images/placeholder.png'} // Add a placeholder
                  alt={recipient.name}
                  className="w-16 h-16 object-contain" // Adjust size as needed
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder.png';
                  }} // Fallback image
                />
              </div>
              <span className="text-sm font-bold ">
                {recipient.tag} {/* Displaying tag 'him'/'Her' as per image */}
              </span>
            </div>
          ))}
        {!loading && !error && recipients.length === 0 && (
          <p className="text-gray-500 text-sm">No recipients found.</p>
        )}
      </div>
    </div>
  );
};

export default RecipientFilter;
