// src/app/category/[category]/[brandname]/[brandId]/page.tsx
import UnifiedPage from '@/components/Auth/UnifiedPage';
import BrandShop from '@/components/Product/brand_shop';

const BrandDetailPage = () => {
  return (
    <UnifiedPage>
      <BrandShop />
    </UnifiedPage>
  );
};

export default BrandDetailPage;
