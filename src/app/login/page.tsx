// src/app/login/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from '../../../public/images/logo-1.svg';
import { authService } from '@/services/auth.service';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
// import withAuth from '@/hoc/withAuth';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

interface LoginFormInputs {
  email: string;
  password: string;
}

function LoginPage() {
  const { setIsAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useAuthRedirect();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shouldShowUnauthorized = sessionStorage.getItem('showUnauthorized');

      if (shouldShowUnauthorized === 'true') {
        toast.error('Unauthorized access. Please login to continue.');
        // Clear the flag after showing the toast
        sessionStorage.removeItem('showUnauthorized');
      }
    }
  }, []);
  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    setApiError(null);
    const sanitizedData = {
      ...data,
      password: String(data.password), // Ensure password is a string
    };

    try {
      const response = await authService.login(sanitizedData);
      if (response?.api_key) {
        setIsAuthenticated(true);
        router.push('/homepage');
        toast.success(response.message || 'Login successful. Welcome back!');
      }
      setIsLoading(false);
    } catch (error: any) {
      console.error('Login Failed:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        'An unexpected error occurred during login.';
      setApiError(errorMessage); // Set the error message
      toast.error(`Login Failed: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.prefetch('/reset');
    router.push('/reset');
  };

  return (
    <div className="at-loginwrapper">
      <div className="at-login">
        <div className="at-loginform">
          <form className="at-formtheme" onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <legend>
                <Image src={Logo} alt="Logo" />
              </legend>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  {...register('email', { required: 'Email is required' })}
                  className="form-control"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="error">{errors.email.message}</p>
                )}
              </div>
              {apiError && <p className="error">{apiError}</p>}
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  className="form-control"
                  name="password"
                  autoComplete="current-password"
                />

                <div className="form-group">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleForgotPassword();
                    }}
                    className="at-forgotpassword cursor-pointer"
                  >
                    Forgot password?
                  </a>
                </div>
                {errors.password && (
                  <p className="error">{errors.password.message}</p>
                )}
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="at-btn at-btn-lg"
                  disabled={isLoading}
                >
                  {isLoading ? ' Signing in...' : ' Sign in'}
                </button>
              </div>
              <div className="at-haveaccount">
                <p>
                  Don't have an account?{' '}
                  <a
                    href="/signup"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.prefetch('/signup');
                      router.push('/signup');
                    }}
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
// export default withAuth(LoginPage);
