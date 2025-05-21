// src/components/Product/personalize/personalized_gifts_icons.tsx

'use client';

import { useEffect, useState } from 'react';
import { fetchPersonalizedGifts } from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import MostPersonalizedGifts from './most_personalized_gifts_design';

interface PersonalizedGiftsIcon {
  _id: string;
  name: string;
  icon_path: string;
  images: { image_id: string; image_path: string }[];
  created_at: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: PersonalizedGiftsIcon[];
}

export default function PersonalizedGiftsIcon() {
  const [personalizedGiftsIcons, setPersonalizedGiftsIcon] = useState<
    PersonalizedGiftsIcon[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getPersonalizedGiftsIcon = async () => {
      setLoading(true);
      try {
        const response: ApiResponse = await fetchPersonalizedGifts();
        if (response && response.success) {
          setPersonalizedGiftsIcon(response.data || []);
        } else {
          throw new Error(
            response.message || 'Failed to fetch personalized gifts.'
          );
        }
      } catch (err: any) {
        console.error('Error fetching personalized gifts:', err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'An error occurred while fetching personalized gifts.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    getPersonalizedGiftsIcon();
  }, []);

  const handleIconClick = (icon: PersonalizedGiftsIcon) => {
    try {
      if (!icon || !icon.images || !icon.name || !icon._id) {
        throw new Error('Invalid gift icon data.');
      }

      localStorage.setItem('selectedGiftImages', JSON.stringify(icon.images));
      localStorage.setItem('selectedGiftName', icon.name);
      localStorage.setItem('selectedProductId', icon._id);

      const slug = icon.name.toLowerCase().replace(/\s+/g, '-');
      router.push(`/personalize/${slug}`);
    } catch (error) {
      console.error('Error storing gift data or navigating:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while processing your request.'
      );
    }
  };

  return (
    <>
      <div className="at-shopcategories">
        <div className="at-pagesectiontitle">
          <h2>Personalized Icons</h2>
        </div>
        <div className="at-shopcategoriesgrid image-paths-scroll horizontal-scroll">
          {loading &&
            Array.from({ length: 6 }).map((_, index) => (
              <div className="at-shopcategorieitems" key={index}>
                <Skeleton className="h-40 w-full bg-[#d6dadb]" />
              </div>
            ))}
          {error && <p className="error-message">{error}</p>}
          {!loading &&
            personalizedGiftsIcons.length > 0 &&
            personalizedGiftsIcons.map((icon) => (
              <div
                className="at-shopcategoriesgriditem cursor-pointer flex flex-col items-center image-path-item"
                key={icon._id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleIconClick(icon);
                }}
              >
                <figure>
                  <img
                    src={icon.icon_path}
                    alt={icon.name}
                    className="w-full h-auto"
                  />
                </figure>
                <div className="at-shopcategoryname">
                  <h3>{icon.name}</h3>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="at-pagesectiontitle mt-6">
        <h2>Most Used Designs</h2>
      </div>
      <MostPersonalizedGifts />
    </>
  );
}

