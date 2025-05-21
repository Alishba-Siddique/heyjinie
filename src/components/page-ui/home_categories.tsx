// src/app/components/page-ui/home_categories.tsx

import { useEffect, useState } from 'react';
import { fetchCategoryList } from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link'; // Import Link from next/link

// Define Category interface matching the response structure
interface Category {
  _id: string;
  name: string;
  description: string;
  search_type: string;
  image_path: string;
  is_active: boolean;
  created_at: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Category[];
  status: number;
  statusText: string;
}

export default function HomeCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const response: ApiResponse = await fetchCategoryList();
        if (response && response.success) {
          setCategories(response.data || []); // Safeguard against undefined
        } else {
          setError(response.message || 'Failed to fetch categories.');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('An error occurred while fetching categories.');
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  return (
    <div className="at-categories">
      <div className="at-pagesectiontitle">
        <h2>Browse by Category</h2>
      </div>
      <div className="at-categoriesgrid">
        {loading && (
          <div className="at-categoryitem flex gap-4 items-center">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <Skeleton className="h-24 w-24 rounded-full bg-[#d6dadb]" />
              </div>
            ))}
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
        {!loading && categories?.length === 0 && !error && (
          <p>No categories available.</p>
        )}
        {!loading &&
          categories?.length > 0 &&
          categories?.map((category) => {
            const categorySlug = category.name
              .toLowerCase()
              .replace(/\s+/g, '');
            return (
              <Link href={`/category/${categorySlug}`} key={category._id}>
                <div className="at-categoryitem cursor-pointer">
                  <figure>
                    <span className="at-imageparent">
                      <img src={category.image_path} alt={category.name} />
                    </span>
                    <figcaption className="at-categorycontent text-center">
                      <h3 className="at-categorytitle font-bold text-[14px]">
                        {category.name}
                      </h3>
                    </figcaption>
                  </figure>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
