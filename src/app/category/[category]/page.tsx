// src/app/category/[category]/page.tsx
'use client';
import UnifiedPage from '@/components/Auth/UnifiedPage';
import CategoryPage from '@/components/Product/category_page';

const Category = () => {
  return (
    <UnifiedPage>
      <CategoryPage />
    </UnifiedPage>
  );
};

export default Category;
