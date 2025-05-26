// src\app\personalize\page.tsx
'use client';
import UnifiedPage from '@/components/Auth/UnifiedPage';
import PersonalizedGiftDetailPage from '@/components/Product/personalize/personalized_gifts_detail_page';

const PersonalizedGiftsTemplatePage = () => {
  const giftType = localStorage.getItem('selectedGiftName');

  const slug = giftType ? giftType.toLowerCase().replace(/\s+/g, '-') : '';

  return (
    <UnifiedPage>
      <PersonalizedGiftDetailPage params={{ slug }} />
    </UnifiedPage>
  );
};

export default PersonalizedGiftsTemplatePage;
