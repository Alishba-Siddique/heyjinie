// src/app/subcategory/[subcategory]/page.tsx
import UnifiedPage from '@/components/Auth/UnifiedPage';
import SubCategoryPage from '@/components/Product/sub_category_page';

const SubCategory = () => {
  return (
    <UnifiedPage>
      <SubCategoryPage />
    </UnifiedPage>
  );
};

export default SubCategory;
