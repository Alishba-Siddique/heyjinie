// src/app/events/page.tsx
'use client';

import withAuth from '@/hoc/withAuth';
import EventsPage from '@/components/page-ui/events_page/events_page';

const Events = () => {
  return (
    <>
      <main>
        <div className="at-maincontentwrapper">
          <EventsPage />
        </div>
      </main>
    </>
  );
};

export default withAuth(Events);
