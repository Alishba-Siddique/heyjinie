// src/components/Auth/UnifiedAuthComponent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';

import Logo from '../../../public/images/logo.png';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';
import ResendOtp from '@/components/Auth/reset-otp';

type AuthMode = 'login' | 'signup' | 'reset' | 'verify-email';

interface AuthFormInputs {
  fullName?: string;
  email: string;
  password?: string;
  new_password?: string;
  confirm_password?: string;
  otp?: string;
}

const UnifiedAuthComponent: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const { setIsAuthenticated, setIsLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<AuthFormInputs>();

  useEffect(() => {
    // Reset form and states when mode changes
    reset();
    setApiError(null);
    setOtpSent(false);
    setEmail('');

    // If we have an email and we're switching to verify-email mode, set it in the form
    if (email && mode === 'verify-email') {
      setValue('email', email);
    }
  }, [mode, reset, setValue]);

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    if (newMode === 'reset') {
      // Ensure email field is reset when entering reset mode
      setValue('email', '');
    }
  };

  const handleAuthSubmit = async (data: AuthFormInputs) => {
    setLoading(true);
    setApiError(null);

    try {
      switch (mode) {
        case 'login':
          const loginResponse = await authService.login({
            email: data.email,
            password: data.password || '',
          });
          if (loginResponse?.api_key) {
            setIsAuthenticated(true);
            router.push('/homepage');
            toast.success('Login successful');
          }
          break;

        case 'signup':
          const signupResponse = await authService.register({
            full_name: data.fullName || '',
            email: data.email,
            password: data.password || '',
          });
          if (signupResponse && signupResponse.id) {
            setEmail(data.email);
            setMode('verify-email');
            setValue('email', data.email);
            setIsAuthenticated(true);
            toast.success('Signup successful. Please verify your email.');
          }
          break;

        case 'reset':
          if (!otpSent) {
            const emailValue = data.email;
            setEmail(emailValue);
            await authService.sendOneTimePassword({ email: emailValue });
            setOtpSent(true);
            setValue('email', emailValue); // Ensure email is set in form
            toast.success('OTP sent to your email');
            return;
          }

          if (data.new_password !== data.confirm_password) {
            setApiError('Passwords do not match');
            return;
          }

          await authService.resetPassword({
            email: email || data.email,
            otp: Number(data.otp || 0),
            new_password: data.new_password || '',
            confirm_password: data.confirm_password || '',
          });
          setMode('login');
          toast.success('Password reset successful');
          break;

        case 'verify-email':
          await authService.verifyEmail({
            email: email || data.email,
            otp: data.otp || '',
          });
          setIsAuthenticated(true);
          router.push('/homepage');
          toast.success('Email verified successfully');
          break;
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message;
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderAuthForm = () => {
    switch (mode) {
      case 'login':
        return (
          <div className="form-group flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              {...register('email', { required: 'Email is required' })}
              className="form-control"
            />
            <input
              type="password"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
              className="form-control"
            />
            <a
              className="flex justify-end cursor-pointer"
              onClick={() => handleModeChange('reset')}
            >
              Forgot Password?
            </a>
            <button
              type="submit"
              className="at-btn at-btn-lg"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <div className="text-center cursor-pointer">
              <a onClick={() => handleModeChange('signup')}>
                Don&#39;t have an account?<u className="ml-1"> Sign Up</u>
              </a>
            </div>
          </div>
        );

      case 'signup':
        return (
          <div className="form-group flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              {...register('fullName', { required: 'Full Name is required' })}
              className="form-control"
            />
            <input
              type="email"
              placeholder="Email"
              {...register('email', { required: 'Email is required' })}
              className="form-control"
            />
            <input
              type="password"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
              className="form-control"
            />
            <button
              type="submit"
              className="at-btn at-btn-lg"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            <div className="text-center cursor-pointer">
              <a onClick={() => handleModeChange('login')}>
                Already have an account?
              </a>
            </div>
          </div>
        );

      case 'reset':
        return (
          <div className="form-group flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              {...register('email', { required: 'Email is required' })}
              className="form-control"
              disabled={otpSent}
            />
            {otpSent && (
              <div className="form-group flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  {...register('otp', { required: 'OTP is required' })}
                  className="form-control"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  {...register('new_password', {
                    required: 'New password is required',
                  })}
                  className="form-control"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...register('confirm_password', {
                    required: 'Confirm password is required',
                    validate: (val) =>
                      watch('new_password') === val || 'Passwords do not match',
                  })}
                  className="form-control"
                />
                <button
                  type="submit"
                  className="at-btn at-btn-lg"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                <ResendOtp email={email} />
              </div>
            )}
            {!otpSent && (
              <button
                type="submit"
                className="at-btn at-btn-lg"
                disabled={loading}
              >
                Send OTP
              </button>
            )}
            <div className="text-center cursor-pointer">
              <a onClick={() => handleModeChange('login')}>Back to Login</a>
            </div>
          </div>
        );

      case 'verify-email':
        return (
          <div className="form-group flex flex-col gap-4">
            <input
              type="email"
              {...register('email')}
              defaultValue={email}
              disabled
              className="form-control"
            />
            <input
              type="text"
              placeholder="Enter OTP"
              {...register('otp', { required: 'OTP is required' })}
              className="form-control"
            />
            <button
              type="submit"
              className="at-btn at-btn-lg"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
            <ResendOtp email={email} />
          </div>
        );
    }
  };

  return (
    <div className="at-loginwrapper">
      <div className="at-login">
        <div className="at-loginform">
          <form onSubmit={handleSubmit(handleAuthSubmit)}>
            <fieldset>
              <legend className="flex justify-center">
                <Image src={Logo} alt="Logo" />
              </legend>
              {apiError && <p className="error">{apiError}</p>}
              {renderAuthForm()}
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAuthComponent;
