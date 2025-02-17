// src/app/components/brands_list/brands_list.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCompanyList } from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';

interface Company {
  _id: string;
  name: string;
  company_logo: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Company[];
  status: number;
  statusText: string;
}

export default function BrandList() {
  const [brandsList, setBrandsList] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getBrandsList = async () => {
      setLoading(true);
      try {
        const response: ApiResponse = await fetchCompanyList();
        if (response && response.success) {
          setBrandsList(response.data || []);
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

    getBrandsList();
  }, []);

  const handleBrandClick = (
    brandName: string,
    brandLogo: string,
    brandId: string
  ) => {
    const slug = brandName.toLowerCase().replace(/\s+/g, '');
    sessionStorage.setItem('brandLogo', brandLogo); // Store logo in sessionStorage
    router.prefetch(`/${slug}/${brandId}`); // Prefetch the page

    router.push(`/${slug}/${brandId}`); // Navigate to the shop page
  };

  return (
    <div className="at-categoriesgrid ">
      {loading && (
        <>
          {[...Array(13)].map((_, index) => (
            <div className="at-categoryitem " key={index}>
              <Skeleton className="h-24 w-24 px-8 bg-[#d6dadb] gap-4" />
            </div>
          ))}
        </>
      )}
      {error && <p className="error-message">{error}</p>}
      {!loading && brandsList.length === 0 && !error && (
        <p>No brands available.</p>
      )}
      {!loading &&
        brandsList.length > 0 &&
        brandsList.map((brand) => (
          <div
            className="at-branditem cursor-pointer"
            key={brand._id}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleBrandClick(brand.name, brand.company_logo, brand._id);
            }}
          >
            <figure>
              <img
                src={brand.company_logo}
                alt={brand.name}
              />
              <figcaption className="at-categorycontent text-center">
                <h3 className="at-categorytitle font-bold text-[14px]">
                  {brand.name}
                </h3>
              </figcaption>
            </figure>
          </div>
        ))}
    </div>
  );
}
