//src/app/brands/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCompanyList } from '@/services/api.service';
import { ChevronLeft } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';

const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

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

export default function BrandsPage() {
  const [brandsList, setBrandsList] = useState<Company[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Use search context from the global header
  const { searchTerm } = useSearch();

  // Fetch the brands list
  useEffect(() => {
    const getBrandsList = async () => {
      setLoading(true);
      try {
        const response: ApiResponse = await fetchCompanyList();
        if (response && response.success) {
          const brands = response.data || [];
          setBrandsList(brands);
          setFilteredBrands(brands);
        } else {
          setError(response.message || 'Failed to fetch brands.');
        }
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('An error occurred while fetching brands.');
      } finally {
        setLoading(false);
      }
    };

    getBrandsList();
  }, []);

  // Filter brands when the global searchTerm changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBrands(brandsList);
    } else {
      const filtered = brandsList.filter(brand => 
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBrands(filtered);
    }
  }, [searchTerm, brandsList]);

  const handleBrandClick = (
    brandName: string,
    brandLogo: string,
    brandId: string
  ) => {
    const slug = brandName.toLowerCase().replace(/\s+/g, '');
    sessionStorage.setItem('brandLogo', brandLogo);
    router.prefetch(`/${slug}/${brandId}`);
    router.push(`/${slug}/${brandId}`);
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 at-maincontentwrapper">
      {/* Back button and title */}
      <div className="flex items-center p-4">
        <button 
          className="mr-2 focus:outline-none align-middle"
          onClick={handleBackClick}
          aria-label="Go back"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold">Brands</h1>
      </div>

      {/* Main Content */}
      <main className="flex-grow p-4">
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="h-40 bg-white rounded-lg animate-pulse"></div>
            ))}
          </div>
        )}

        {error && <p className="text-red-500 text-center p-4">{error}</p>}

        {!loading && filteredBrands.length === 0 && !error && (
          <p className="text-center p-8 text-gray-500">No brands found matching your search.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {!loading &&
            filteredBrands.map((brand) => (
              <div
                className="flex flex-col items-center justify-center h-40 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 bg-white"
                key={brand._id}
                onClick={() => handleBrandClick(brand.name, brand.company_logo, brand._id)}
              >
                <div className="flex items-center justify-center h-28">
                  <img
                    src={brand.company_logo || PRODUCT_PLACEHOLDER}
                    alt={brand.name || 'Brand Logo'}
                    className="max-h-20 max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PRODUCT_PLACEHOLDER;
                    }}
                  />
                </div>
                {/* <div className="p-2 text-center w-full border-t border-gray-100">
                  <h3 className="text-sm font-medium truncate">
                    {brand.name}
                  </h3>
                </div> */}
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}