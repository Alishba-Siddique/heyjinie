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
