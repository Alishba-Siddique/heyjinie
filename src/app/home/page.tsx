// // src/app/home/page.tsx

// 'use client';
// import UnifiedPage from '@/components/Auth/UnifiedPage';
// import HomeCategories from '@/components/Product/home_categories';
// import TopPicksProducts from '@/components/page-ui/top_rated_products';
// import BrandList from '@/components/Product/brands_list';
// import PersonalizedGifts from '@/components/Product/personalize/personalized_gifts';
// import UpcomingEvents from '@/components/page-ui/events_page/upcoming_events';
// import withAuth from '@/hoc/withAuth';
// import { Button } from '@/components/ui/button';
// import { ChevronRight } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import PersonalizedGiftsCategoryList from '@/components/Product/personalize/personalized_gifts';

// const Homepage = () => {
//   const router = useRouter();
//   const handleViewAll = () => {
//     router.push('/personalize');
//   };
//   return (
//     <UnifiedPage>
//       <div className="at-categoriesslider mb-20">
//         <HomeCategories />
//       </div>
//       <div className="upcoming-events mt-4 w-full float-left">
//         <UpcomingEvents />
//       </div>
//       <div className="top-picks">
//         <TopPicksProducts />
//       </div>
//       <div className="at-pagesectiontitle">
//         <h2>
//           <br />
//           Shop by Brands
//         </h2>
//       </div>
//       <BrandList />
//       <div className="flex items-center justify-between mb-4 at-eventsgrid">
//         <h2 className="text-lg md:text-xl font-semibold mt-10 text-gray-800">
//           Personalize Your Gifts
//         </h2>
//         <Button
//           onClick={handleViewAll}
//           variant="outline"
//           size="sm"
//           className="flex items-center gap-2 text-sm bg-[#40A574] hover:bg-[#399368] text-white hover:text-white  rounded-full px-3 py-1.5" // Adjusted hover and padding
//         >
//           View All
//           <ChevronRight className="w-4 h-4" />
//         </Button>
//       </div>
//       <div className="personalized-gifts">
//         {/* <PersonalizedGifts /> */}
//         <PersonalizedGiftsCategoryList />
//       </div>
//     </UnifiedPage>
//   );
// };

// export default withAuth(Homepage);

// src/app/home/page.tsx
'use client';
import { useState } from 'react'; // Import useState
import UnifiedPage from '@/components/Auth/UnifiedPage';
import HomeCategories from '@/components/Product/home_categories';
import TopPicksProducts from '@/components/page-ui/trending_products';
import BrandList from '@/components/Product/brands_list';
import UpcomingEvents from '@/components/page-ui/events_page/upcoming_events';
import withAuth from '@/hoc/withAuth';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PersonalizedGiftsCategoryList from '@/components/Product/personalize/personalized_gifts';

// Import the new filter components
import PriceFilter from '@/components/Filters/PriceFilter';
import RecipientFilter from '@/components/Filters/RecipientFilter';
import OccasionFilter from '@/components/Filters/OccasionFilter';

// Define Tab Types
type FilterTab = 'Category' | 'Price' | 'Recipient' | 'Occasion';

const Homepage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>('Category'); // Default tab

  const handleViewAll = () => {
    router.push('/personalize');
  };

   const handleBrandsViewAll = () => {
    router.push('/brands');
  };

  const renderFilterComponent = () => {
    switch (activeTab) {
      case 'Category':
        return <HomeCategories />;
      case 'Price':
        return <PriceFilter />;
      case 'Recipient':
        return <RecipientFilter />;
      case 'Occasion':
        return <OccasionFilter />;
      default:
        return <HomeCategories />; // Fallback
    }
  };

  return (
    <UnifiedPage>
      {/* --- Filter Tabs --- */}
      <div className="flex items-center justify-around bg-[#D6DADA] px-2 py-2 rounded-full mx-4 mb-1 shadow-inner">
        {(['Category', 'Price', 'Recipient', 'Occasion'] as FilterTab[]).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex-1 text-center whitespace-nowrap
              ${
                activeTab === tab
                  ? 'bg-[#3A3A3A] text-white shadow-md' // Dark background for active tab
                  : 'bg-transparent font-bold hover:bg-[#b7baba] ' // Lighter background for inactive
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* --- Conditionally Rendered Filter Component --- */}
      <div className="filter-content-area mx-4">
        {' '}
        {/* Added margin */}
        {renderFilterComponent()}
      </div>

      {/* --- Rest of the page content (UNCHANGED) --- */}
      <div className="upcoming-events mt-6 w-full float-left px-4">
        {' '}
        {/* Added padding */}
        <UpcomingEvents />
      </div>
      <div className="top-picks mt-6 px-4">
        {' '}
        {/* Added padding */}
        <TopPicksProducts />
      </div>
      <div className="flex items-center justify-between mb-4 mt-6 at-eventsgrid px-4">
        <div className="at-pagesectiontitle mt-6 px-4">
          {' '}
          {/* Added padding */}
          <h2>Shop by Brands</h2>
        </div>
        <Button
          onClick={handleBrandsViewAll}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-sm bg-[#40A574] hover:bg-[#399368] text-white hover:text-white rounded-full px-3 py-1.5"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="px-4">
        {' '}
        {/* Added padding */}
        <BrandList />
      </div>
      <div className="flex items-center justify-between mb-4 mt-6 at-eventsgrid px-4">
        {' '}
        {/* Added padding */}
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          Personalize Your Gifts
        </h2>
        <Button
          onClick={handleViewAll}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-sm bg-[#40A574] hover:bg-[#399368] text-white hover:text-white rounded-full px-3 py-1.5"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="personalized-gifts pb-20 px-4">
        {' '}
        {/* Added padding and bottom padding */}
        <PersonalizedGiftsCategoryList />
      </div>
    </UnifiedPage>
  );
};

export default withAuth(Homepage);
