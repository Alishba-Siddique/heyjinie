// src/app/reviews/[id]/page.tsx

'use client';

import ReviewsPage from '@/components/page-ui/reviews_page';
import withAuth from '@/hoc/withAuth';
import { useParams } from 'next/navigation';

const Reviews = () => {
  const params = useParams();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  if (!productId) {
    return (
      <main>
        <div className="at-maincontentwrapper">
          <div className="at-pagesectiontitle">
            <h2>No product ID provided</h2>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="at-maincontentwrapper">
        <ReviewsPage productId={productId} />
      </div>
    </main>
  );
};

export default withAuth(Reviews);
