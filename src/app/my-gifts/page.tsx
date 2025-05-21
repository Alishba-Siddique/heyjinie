// src/app/my-gifts/page.tsx
'use client';
import MyGifts from '../../components/page-ui/my_gifts';

export default function MyGiftPage() {
  return (
    <>
      <main>
        <div className="at-maincontentwrapper">
          <MyGifts />
        </div>
      </main>
    </>
  );
}
