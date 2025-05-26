import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { clearSession } from '@/utils/sessionUtility';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const LogoutButton = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const router = useRouter();

  const handleLogoutClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    clearSession();
    toast.success('Logged out successfully!');
    router.push('/auth');
    setIsLogoutDialogOpen(false);
  };

  const handleCancelLogout = () => {
    setIsLogoutDialogOpen(false);
  };

  return (
    <>
      <figure className="at-sidebargiftimg relative flex flex-col items-center sm:items-start">
        <button
          onClick={handleLogoutClick}
          className="at-btnlogoutholder at-btnsidebarlogout at-headerbtn flex items-center justify-center gap-2 px-4 py-2 sm:py-3 sm:px-6 w-full sm:w-4/6 rounded-lg border border-gray-700 bg-gray-50 hover:bg-gray-200 transition-opacity duration-300"
          style={{
            opacity: '1',
            position: 'relative',
            top: '74px',
            border: '1px solid #434343',
            left: '17px',
          }}
        >
          <span className="flex items-center gap-2">Logout</span>
          <svg
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.2334 12.1834L13.3667 10.0501L11.2334 7.91675"
              stroke="#434343"
              strokeWidth="1.4"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.83325 10.05H13.3083"
              stroke="#434343"
              strokeWidth="1.4"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.5 3.33325C15.1833 3.33325 18.1667 5.83325 18.1667 9.99992C18.1667 14.1666 15.1833 16.6666 11.5 16.6666"
              stroke="#434343"
              strokeWidth="1.4"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <img
          src="../../../images/sidebargift.png"
          alt=""
          className="mt-4 sm:mt-6 w-24 sm:w-32"
        />
      </figure>

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="flex-column justify-center ">
          <DialogHeader>
            <DialogTitle className="shadow-lg">
              <Image
                src="/images/logoIcons.png"
                alt="logo"
                width={70}
                height={70}
                className="mx-auto -mt-14"
              />
            </DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <div className='at-termsandcondition'>
          <div className="at-btnsubmit at-btnhtermsandcondition at-btnorder">
            <button
              type="button"
              onClick={handleCancelLogout}
              className="at-btn at-btncancel"
            >
              No
            </button>
            <button
              type="button"
              className="at-btn"
              onClick={handleConfirmLogout}
            >
              Yes
            </button>
          </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoutButton;
