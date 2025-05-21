// src/app/login/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../../public/images/logo-1.svg';
import { authService } from '@/services/auth.service';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

interface LoginFormInputs {
  email: string;
  password: string;
}

function LoginPage() {
  const { setIsAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shouldShowUnauthorized = sessionStorage.getItem('showUnauthorized');
      if (shouldShowUnauthorized === 'true') {
        toast.error('Unauthorized access. Please login to continue.');
        sessionStorage.removeItem('showUnauthorized');
      }
    }
  }, []);

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);

    try {
      const response = await authService.login({
        ...data,
        password: String(data.password),
      });

      if (response?.api_key) {
        setIsAuthenticated(true);
        router.push('/home');
        toast.success(response.message || 'Login successful. Welcome back!');
      } else {
        // Handle cases where api_key is not present (e.g., incorrect credentials)
        toast.error('Login failed: Invalid credentials.');
      }
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred during login.';

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(`Login failed: ${errorMessage}`);

    } finally {
      setIsLoading(false);
    }
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
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email format',
                    },
                  })}
                  className="form-control"
                  autoComplete="email"
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
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className="form-control"
                  autoComplete="current-password"
                />
                <div className="form-group">
                  <Link
                    href="/reset"
                    className="at-forgotpassword cursor-pointer"
                  >
                    Forgot password?
                  </Link>
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
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
              <div className="at-haveaccount">
                <p>
                  Don't have an account? <Link href="/signup">Sign up</Link>
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