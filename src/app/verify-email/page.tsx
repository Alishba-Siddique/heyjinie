// src/app/verify-email/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Logo from '../../../public/images/logo.png';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';
import ResendOtp from '@/components/Auth/reset-otp';

interface VerifyEmailFormInputs {
  email: string;
  otp: string;
}

const VerifyEmail = () => {
  const { isLoading, setIsAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null); // Store email here
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyEmailFormInputs>();

  useEffect(() => {
    const userData = authService.getUserData();
    if (userData?.email) {
      setValue('email', userData.email); // Set the form email value
      setEmail(userData.email); // Save email in state
    }
  }, [setValue]);

  const onSubmit = async (data: VerifyEmailFormInputs) => {
    setApiError(null); // Clear previous errors
    setLoading(true); // Start loading spinner

    try {
      const response = await authService.verifyEmail({
        email: data.email,
        otp: data.otp,
      });

      // Check if the response indicates success
      if (response && typeof response === 'object') {
        toast.success(response.data.message || 'Email verified successfully!');
        setIsAuthenticated(true);
        setLoading(false); // Stop loading spinner
        router.push('/home');
      }
    } catch (error: any) {
      // Log and display error messages
      console.error('Verification Error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        'An unexpected error occurred during verification.';
      setApiError(errorMessage); // Set the error message
      toast.error(errorMessage); // Show toast notification
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="at-loginwrapper">
      <div className="at-login">
        <div className="at-loginform">
          <form className="at-formtheme" onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <legend>
                <span>
                  <Image src={Logo} alt="Logo" priority />
                </span>
              </legend>
              <div className="at-logintitle">
                <h2>Enter OTP</h2>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email format',
                    },
                  })}
                  className="form-control"
                  disabled={true}
                />
                {errors.email && (
                  <p className="error">{errors.email.message}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter the OTP"
                  {...register('otp', {
                    required: 'OTP is required',
                    minLength: {
                      value: 6,
                      message: 'OTP must be at least 6 characters long',
                    },
                  })}
                  className="form-control"
                  disabled={loading}
                />
                {errors.otp && <p className="error">{errors.otp.message}</p>}
              </div>
              {apiError && <p className="error">{apiError}</p>}
              <div className="form-group">
                <button
                  type="submit"
                  className="at-btn at-btn-lg"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify Email'}
                </button>
              </div>
            </fieldset>
          </form>
          {email && <ResendOtp email={email} />} {/* Pass dynamic email */}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
