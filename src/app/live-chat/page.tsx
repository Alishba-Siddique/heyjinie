// src/app/live-chat/page.tsx
'use client';

import withAuth from '@/hoc/withAuth';
import ChatPage from '@/components/page-ui/chat';

const ChatDetailPage = () => {
  return (
    <>
      <main>
        <div className="at-maincontentwrapper">
          <ChatPage />
        </div>
      </main>
    </>
  );
};

export default withAuth(ChatDetailPage);
