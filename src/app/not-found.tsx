 import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../public/images/logoIcon.png';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-100 to-gray-300">
      <div className="flex flex-col items-center text-center px-6 py-12 bg-white rounded-lg shadow-lg">
        <Image src={Logo} alt="logo" width={200} height={200} />
        <h1 className="text-6xl font-extrabold text-[#42a674] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, the page you’re looking for doesn’t seem to exist.
        </p>
        <Link
          href="/home"
          className="inline-block px-8 py-3 bg-[#FE9399] text-white font-medium text-lg rounded-lg shadow-md hover:bg-[#FE9399] transition transform hover:scale-105 focus:ring-4 focus:ring-[#FE9399] focus:outline-none"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
