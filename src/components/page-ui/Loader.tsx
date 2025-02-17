// src/components/Loader.tsx

'use client';

import Image from 'next/image';
import Logo from '../../../public/images/logoIcon.png'; // Your logo path

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative">
        <div className="animate-bounce flex justify-center items-center">
          <Image
            src={Logo}
            alt="Logo"
            width={150} // Adjust the size of the logo
            height={150}
            className="rounded-full"
          />
        </div>
        <p className="animate-pluse text-center text-xl  text-[#3E3E3E]">
          Packing....
        </p>
      </div>
    </div>
  );
}
