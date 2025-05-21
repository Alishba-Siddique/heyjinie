// // src/app/signup/page.tsx

// 'use client';

// import { useForm } from 'react-hook-form';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import Logo from '../../../public/images/logo.png'
// import Image from 'next/image';
// import { toast } from 'react-toastify';
// import { setCookie } from '../../utils/cookieUtility';
// import { authService } from '../../services/auth.service';
// import { useAuth } from '@/context/AuthContext';
// import Link from 'next/link';

// interface SignupFormInputs {
//   fullName: string;
//   email: string;
//   password: string;
// }

// const SignupPage = () => {
//   const { setIsAuthenticated } = useAuth();
//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<SignupFormInputs>();

//   const [apiError, setApiError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   const onSubmit = async (data: SignupFormInputs) => {
//     setApiError(null);
//     setLoading(true);
//     try {
//       const response = await authService.register({
//         full_name: data.fullName,
//         email: data.email,
//         password: data.password,
//       });

//       // console.log('Signup response:', response);

//       // The response comes directly with the user data, not nested under response.data
//       if (response && response.id) {
//         // console.log('User Data Signup:', response);
//         setCookie('userData', JSON.stringify(response));
//         setIsAuthenticated(true);
//         // console.log('Authentication state updated');

//         toast.success(
//           response.message ||
//             'Signup Successful! Please check your email for verification.'
//         );

//         setLoading(false);
//         setTimeout(() => {
//           router.push('/verify-email');
//         }, 500);
//       } else {
//         // Handle the case where response doesn't have expected user data
//         toast.error(
//           response.message || 'Signup Failed: Invalid response format'
//         );
//         setApiError(response.message || 'Invalid response format');
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         'Something went wrong!';
//       toast.error(`Signup Failed: ${errorMessage}`);
//       setApiError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="at-loginwrapper at-signupwrapper">
//       <div className="at-login">
//         <div className="at-loginform">
//           <form className="at-formtheme" onSubmit={handleSubmit(onSubmit)}>
//             <fieldset>
//               <legend>
//                 <span>
//                   <Image src={Logo} alt="Logo" />
//                 </span>
//               </legend>
//               <div className="form-group">
//                 <input
//                   type="text"
//                   placeholder="Enter your full name"
//                   {...register('fullName', {
//                     required: 'Full Name is required',
//                   })}
//                   className="form-control"
//                 />
//                 {errors.fullName && (
//                   <p className="error">{errors.fullName.message}</p>
//                 )}
//               </div>
//               <div className="form-group">
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   {...register('email', { required: 'Email is required' })}
//                   className="form-control"
//                 />
//                 {errors.email && (
//                   <p className="error">{errors.email.message}</p>
//                 )}
//               </div>
//               <div className="form-group">
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   {...register('password', {
//                     required: 'Password is required',
//                   })}
//                   className="form-control"
//                 />
//                 {errors.password && (
//                   <p className="error">{errors.password.message}</p>
//                 )}
//               </div>
//               {apiError && <p className="error">{apiError}</p>}
//               <div className="form-group">
//                 <button
//                   type="submit"
//                   className="at-btn at-btn-lg"
//                   disabled={loading}
//                 >
//                   {loading ? 'Signing up...' : 'Sign up'}
//                 </button>
//               </div>
//               <div className="at-haveaccount">
//                 <p>
//                   Already have an account?{' '}
//                   <Link
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       router.push('/auth');
//                     }}
//                   >
//                     Sign in
//                   </Link>
//                 </p>
//               </div>
//             </fieldset>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;

// {
//   /* <div className="at-googlesignin">
//                 <a href="javascript: void(0);" className="at-btngoogle">
//                   <em>
//                     <svg
//                       width="20"
//                       height="20"
//                       viewBox="0 0 20 20"
//                       fill="none"
//                       xmlns="http:www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M19.8055 8.0415H19V8H10V12H15.6515C14.827 14.3285 12.6115 16 10 16C6.6865 16 4 13.3135 4 10C4 6.6865 6.6865 4 10 4C11.5295 4 12.921 4.577 13.9805 5.5195L16.809 2.691C15.023 1.0265 12.634 0 10 0C4.4775 0 0 4.4775 0 10C0 15.5225 4.4775 20 10 20C15.5225 20 20 15.5225 20 10C20 9.3295 19.931 8.675 19.8055 8.0415Z"
//                         fill="#FFC107"
//                       />
//                       <path
//                         d="M1.15625 5.3455L4.44175 7.755C5.33075 5.554 7.48375 4 10.0033 4C11.5328 4 12.9243 4.577 13.9838 5.5195L16.8123 2.691C15.0263 1.0265 12.6373 0 10.0033 0C6.16225 0 2.83125 2.1685 1.15625 5.3455Z"
//                         fill="#FF3D00"
//                       />
//                       <path
//                         d="M9.99625 20.0003C12.5793 20.0003 14.9263 19.0118 16.7008 17.4043L13.6058 14.7853C12.5682 15.5749 11.3 16.0017 9.99625 16.0003C7.39525 16.0003 5.18675 14.3418 4.35475 12.0273L1.09375 14.5398C2.74875 17.7783 6.10975 20.0003 9.99625 20.0003Z"
//                         fill="#4CAF50"
//                       />
//                       <path
//                         d="M19.8055 8.0415H19V8H10V12H15.6515C15.2571 13.1082 14.5467 14.0766 13.608 14.7855L13.6095 14.7845L16.7045 17.4035C16.4855 17.6025 20 15 20 10C20 9.3295 19.931 8.675 19.8055 8.0415Z"
//                         fill="#1976D2"
//                       />
//                     </svg>
//                   </em>
//                   <span>Sign up with Google</span>
//                 </a>
//               </div> */
// }

// src/app/signup/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Logo from '../../../public/images/logo.png'
import Image from 'next/image';
import { toast } from 'react-toastify';
import { setCookie } from '../../utils/cookieUtility';
import { authService } from '../../services/auth.service';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface SignupFormInputs {
  fullName: string;
  email: string;
  password: string;
}



const SignupPage = () => {
  const { setIsAuthenticated } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>();

  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: SignupFormInputs) => {
    setApiError(null);
    setLoading(true);
    try {
      const response = await authService.register({
        full_name: data.fullName,
        email: data.email,
        password: data.password,
      });

      if (response && response.id) {
        setCookie('userData', JSON.stringify(response));
        setIsAuthenticated(true);

        toast.success(
          response.message ||
            'Signup Successful! Please check your email for verification.'
        );

        setLoading(false);
        // setTimeout(() => {
          router.push('/verify-email');
        // }, 500);
      } else {
        toast.error(
          response.message || 'Signup Failed: Invalid response format'
        );
        setApiError(response.message || 'Invalid response format');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong!';
      toast.error(`Signup Failed: ${errorMessage}`);
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="at-loginwrapper at-signupwrapper">
      <div className="at-login">
        <div className="at-loginform">
          <form className="at-formtheme" onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <legend>
                <span>
                  <Image src={Logo} alt="Logo" />
                </span>
              </legend>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  {...register('fullName', {
                    required: 'Full Name is required',
                  })}
                  className="form-control"
                />
                {errors.fullName && (
                  <p className="error">{errors.fullName.message}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register('email', { required: 'Email is required' })}
                  className="form-control"
                />
                {errors.email && (
                  <p className="error">{errors.email.message}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  className="form-control"
                />
                {errors.password && (
                  <p className="error">{errors.password.message}</p>
                )}
              </div>
              {apiError && <p className="error">{apiError}</p>}
              <div className="form-group">
                <button
                  type="submit"
                  className="at-btn at-btn-lg"
                  disabled={loading}
                >
                  {loading ? 'Signing up...' : 'Sign up'}
                </button>
              </div>
              <div className="at-haveaccount">
                <p>
                  Already have an account?{' '}
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push('/auth');
                    }}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
