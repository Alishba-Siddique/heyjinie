// src/components/page-ui/Loader.tsx

'use client';

import Image from 'next/image';
import Logo from '../../../public/images/logoIcon.png'; 

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative">
        <div className="animate-bounce flex justify-center items-center">
          <Image
            src={Logo}
            alt="Logo"
            width={150}
            height={150}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
