// src/components/Auth/UnifiedAuthComponent.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

import Logo from '../../../public/images/logo.png';
import { authService } from '@/services/auth.service';
import ResendOtp from '@/components/Auth/reset-otp';

interface GoogleTokenPayload {
  email: string;
  name: string;
  picture?: string;
  // Add other relevant fields from Google token if needed
}

type AuthMode = 'login' | 'signup' | 'reset' | 'verify-email';

interface AuthFormInputs {
  fullName?: string;
  email: string;
  password?: string;
  new_password?: string;
  confirm_password?: string;
  otp?: string;
  rememberMe?: boolean;
}

// Define necessary Google Sign-In types
interface IdConfiguration {
  client_id: string;
  callback: (response: any) => void;
  ux_mode?: 'popup' | 'redirect';
  scope?: string;
}

interface GsiButtonConfiguration {
  theme: string;
  size: string;
  width?: string;
  text?: string;
  logo_alignment?: string;
}

const UnifiedAuthComponent: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [googleInitialized, setGoogleInitialized] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const googleButtonDiv = useRef<HTMLDivElement>(null);
  const googleSignUpButtonDiv = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AuthFormInputs>();

  // Function to initialize Google Sign-In
  const initializeGoogleSignIn = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!googleClientId || !window.google?.accounts?.id) {
      return false;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleSignIn,
        ux_mode: 'popup',
        // Reducing CORS issues by limiting to necessary scopes
        // scope: 'email profile',
      });

      // Render login button
      if (googleButtonDiv.current) {
        window.google.accounts.id.renderButton(googleButtonDiv.current, {
          theme: 'outline',
          size: 'large',
          width: '300',
          text: 'continue_with',
          logo_alignment: 'center',
        });
      }

      // Render signup button
      if (googleSignUpButtonDiv.current) {
        window.google.accounts.id.renderButton(googleSignUpButtonDiv.current, {
          theme: 'outline',
          size: 'large',
          width: '300',
          text: 'signup_with',
          logo_alignment: 'center',
        });
      }

      return true;
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      return false;
    }
  };

  // Load Google Sign-In script
  useEffect(() => {
    if (googleInitialized) return;

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      console.error(
        'Google Client ID is not defined in environment variables.'
      );
      return;
    }

    // Check if script is already loaded
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existingScript) {
      // If script already exists, try to initialize
      if (initializeGoogleSignIn()) {
        setGoogleInitialized(true);
      }
      return;
    }

    // Load script if not loaded
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.id = 'google-gsi-script';

    script.onload = () => {
      // Add a slight delay to ensure the Google API is fully loaded
      // setTimeout(() => {
      if (initializeGoogleSignIn()) {
        setGoogleInitialized(true);
      }
      // }, 100);
    };

    script.onerror = () => {
      console.error('Failed to load Google GSI script.');
      toast.error('Failed to load Google Sign-In. Please try another method.');
    };

    document.body.appendChild(script);

    // Cleanup function
    return () => {
      // We don't remove the script on unmount to prevent multiple loads
      // Just cleanup any listeners if needed
    };
  }, [googleInitialized]);

  // Re-initialize Google button when div reference changes or when switching modes
  useEffect(() => {
    if (googleInitialized && (mode === 'login' || mode === 'signup')) {
      initializeGoogleSignIn();
    }
  }, [
    mode,
    googleInitialized,
    googleButtonDiv.current,
    googleSignUpButtonDiv.current,
  ]);

  // Reset form when changing modes
  useEffect(() => {
    reset();
    setOtpSent(false);
    setShowPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    if (email && mode === 'verify-email') {
      setValue('email', email, { shouldValidate: false });
    } else if (mode !== 'verify-email') {
      if (mode !== 'reset') {
        setEmail('');
      }
    }
  }, [mode, reset, setValue, email]);

  const handleModeChange = (newMode: AuthMode) => {
    const currentEmail = watch('email');
    setMode(newMode);
    if (newMode === 'reset' && currentEmail) {
      setValue('email', currentEmail);
      setEmail(currentEmail);
    } else if (newMode !== 'reset') {
      setValue('email', '');
      setEmail('');
    }
  };

  const loginPasswordValidation = {
    required: 'Password is required',
  };

  const handleAuthSubmit = async (data: AuthFormInputs) => {
    setLoading(true);

    try {
      switch (mode) {
        case 'login':
          const loginData = await authService.login({
            email: data.email,
            password: data.password || '',
            remember: data.rememberMe || false,
          });
          // Set auth state before navigation
          setIsAuthenticated(true);
          router.replace('/home');
          toast.success('Login successful');
          break;

        case 'signup':
          const signupData = await authService.register({
            full_name: data.fullName || '',
            email: data.email,
            password: data.password || '',
          });
          setEmail(data.email);
          setMode('verify-email');
          toast.success('Signup successful. Please verify your email.');
          break;

        case 'reset':
          if (!otpSent) {
            const emailValue = data.email;
            setEmail(emailValue);
            try {
              await authService.requestPasswordReset({ email: emailValue });
              setOtpSent(true);
              setValue('email', emailValue, { shouldValidate: false });
              toast.success('OTP sent to your email');
            } catch (error: any) {
              toast.error(
                error.response?.data?.message ||
                  error.message ||
                  'Failed to send OTP'
              );
              return;
            }
          } else {
            if (data.new_password !== data.confirm_password) {
              toast.error('Passwords do not match');
              return;
            }
            try {
              await authService.resetPassword({
                email: email,
                otp: Number(data.otp || 0),
                new_password: data.new_password || '',
                confirm_password: data.confirm_password || '',
              });
              setMode('login');
              toast.success('Password reset successful. Please login.');
            } catch (error: any) {
              toast.error(
                error.response?.data?.message ||
                  error.message ||
                  'Password reset failed'
              );
              return;
            }
          }
          break;

        case 'verify-email':
          try {
            await authService.verifyEmail({
              email: email || data.email,
              otp: data.otp || '',
            });
            localStorage.setItem('showTourAfterSignup', 'true');
            // Set auth state before navigation
            setIsAuthenticated(true);
            router.replace('/tour');
            toast.success('Email verified successfully. Redirecting...');
          } catch (error: any) {
            toast.error(
              error.response?.data?.message ||
                error.message ||
                'Email verification failed'
            );
            return;
          }
          break;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Modified Google Sign-In handler
  const handleGoogleSignIn = async (response: any) => {
    setGoogleLoading(true);

    if (!response.credential) {
      console.error('Google Sign-In failed: No credential received.');
      toast.error('Google Sign-In failed. Please try again.');
      setGoogleLoading(false);
      return;
    }

    const idToken = response.credential;

    try {
      const decodedToken = jwtDecode<GoogleTokenPayload>(idToken);
      const { email, name } = decodedToken;

      if (!email || !name) {
        throw new Error('Email or name missing from Google token.');
      }

      const fcmToken = localStorage.getItem('fcm_token') || null;

      const payload = {
        idToken,
        email,
        full_name: name,
        fcm_token: fcmToken,
        isNewUser: mode === 'signup', // Indicate to backend if this is a signup or login
      };

      await authService.googleLogin(payload);

      // If this is a signup, you might want to set a flag for the tour
      if (mode === 'signup') {
        localStorage.setItem('showTourAfterSignup', 'true');
        router.push('/tour');
      } else {
        router.push('/home');
      }

      toast.success(
        `Google ${mode === 'login' ? 'Sign-In' : 'Sign-Up'} Successful!`
      );
    } catch (error: any) {
      console.error('Error during Google authentication:', error);
      toast.error(`Google authentication failed: ${error.message}`);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (
    field: 'password' | 'new_password' | 'confirm_password'
  ) => {
    switch (field) {
      case 'password':
        setShowPassword(!showPassword);
        break;
      case 'new_password':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm_password':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  // In your component:
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // In your useEffect:
  useEffect(() => {
    if (
      googleInitialized &&
      googleButtonRef.current &&
      (mode === 'login' || mode === 'signup')
    ) {
      window?.google?.accounts?.id?.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: '300',
        text: mode === 'login' ? 'continue_with' : 'signup_with',
        logo_alignment: 'center',
      });
    }
  }, [mode, googleInitialized, googleButtonRef.current]);

  const renderAuthForm = () => {
    const emailValidation = {
      required: 'Email is required',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Invalid email format',
      },
    };

    // Enhanced password validation with uppercase and special character requirements
    const passwordValidation = {
      required: 'Password is required',
      minLength: {
        value: 8,
        message: 'Password must be at least 8 characters',
      },
      pattern: {
        value: /^(?=.*[A-Z])(?=.*[!@#$%^&*/.,';:+_-~`{}])/,
        message:
          'Password must contain at least one uppercase letter and one special character',
      },
    };

    const fullNameValidation = {
      required: 'Full Name is required',
      minLength: {
        value: 2,
        message: 'Full name must be at least 2 characters',
      },
    };

    // Password field with show/hide toggle
    const renderPasswordField = (
      name: 'password' | 'new_password' | 'confirm_password',
      placeholder: string,
      validation: any,
      showState: boolean
    ) => {
      return (
        <div className="relative">
          <input
            type={showState ? 'text' : 'password'}
            placeholder={placeholder}
            {...register(name, validation)}
            className="form-control pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => togglePasswordVisibility(name)}
          >
            {showState ? (
              // Eye closed icon (hide password)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              // Eye open icon (show password)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>
      );
    };

    switch (mode) {
      case 'login':
        return (
          <div className="form-group flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              {...register('email', emailValidation)}
              className="form-control"
            />
            {errors.email && (
              <p className="error text-red-500 text-xs">
                {errors.email.message}
              </p>
            )}

            {renderPasswordField(
              'password',
              'Password',
              loginPasswordValidation,
              showPassword
            )}
            {errors.password && (
              <p className="error text-red-500 text-xs">
                {errors.password.message}
              </p>
            )}

            <div className="flex items-center gap-10 text-[#42a674]">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  {...register('rememberMe')}
                  className="w-4 h-4  accent-[#42a674] cursor-pointer"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm text-[#42a674] align-middle mt-2"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="#"
                className="flex ml-2 justify-end cursor-pointer"
                onClick={() => handleModeChange('reset')}
              >
                Forgot Password?
              </Link>
            </div>
            <div className="text-center text-xs text-gray-600">
              By continuing you agree to our{' '}
              <Link
                href="/terms-conditions"
                className="text-[#42a674] hover:underline"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy-policy"
                className="text-[#42a674] hover:underline"
              >
                Privacy Policy
              </Link>
            </div>
            <button
              type="submit"
              className="at-btn at-btn-lg"
              disabled={loading || googleLoading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <div className="text-center cursor-pointer">
              <Link href="#" onClick={() => handleModeChange('signup')}>
                Don't have an account?<u className="ml-1"> Sign Up</u>
              </Link>
            </div>

            <div className=" flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 dark:before:border-neutral-500 dark:after:border-neutral-500">
              <p className="mx-4 mb-0 text-center font-semibold text-slate-500">
                OR
              </p>
            </div>

            {/* Google Sign-In Button Container */}
            <div className="flex justify-center">
              <div
                ref={googleButtonDiv}
                id="googleButton"
                className="flex justify-center w-full"
              ></div>
            </div>
            {googleLoading && (
              <p className="text-center text-sm text-gray-600 mt-2">
                Processing Google Sign-In...
              </p>
            )}
          </div>
        );

      case 'signup':
        return (
          <div className="form-group flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              {...register('fullName', fullNameValidation)}
              className="form-control"
            />
            {errors.fullName && (
              <p className="error text-red-500 text-xs">
                {errors.fullName.message}
              </p>
            )}
            <input
              type="email"
              placeholder="Email"
              {...register('email', emailValidation)}
              className="form-control"
            />
            {errors.email && (
              <p className="error text-red-500 text-xs">
                {errors.email.message}
              </p>
            )}

            {renderPasswordField(
              'password',
              'Password',
              passwordValidation,
              showPassword
            )}
            {errors.password && (
              <p className="error text-red-500 text-xs">
                {errors.password.message}
              </p>
            )}

            <div className="text-center text-xs text-gray-600">
              By continuing you agree to our{' '}
              <Link
                href="/terms-conditions"
                className="text-[#42a674] hover:underline"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy-policy"
                className="text-[#42a674] hover:underline"
              >
                Privacy Policy
              </Link>
            </div>

            <button
              type="submit"
              className="at-btn at-btn-lg"
              disabled={loading || googleLoading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            <div className="text-center cursor-pointer">
              <Link href="#" onClick={() => handleModeChange('login')}>
                Already have an account? <u className="ml-1">Sign In</u>
              </Link>
            </div>

            <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 dark:before:border-neutral-500 dark:after:border-neutral-500">
              <p className="mx-4 mb-0 text-center font-semibold text-slate-500">
                OR
              </p>
            </div>

            {/* Google Sign-Up Button Container */}
            {/* <div className="flex justify-center">
              <div
                ref={googleSignUpButtonDiv}
                id="googleSignUpButton"
                className="flex justify-center w-full"
              ></div>
            </div> */}
            <div className="flex justify-center">
              <div
                ref={googleButtonRef}
                id="googleButton"
                className="flex justify-center w-full"
              ></div>
            </div>
            {googleLoading && (
              <p className="text-center text-sm text-gray-600 mt-2">
                Processing Google Sign-Up...
              </p>
            )}
          </div>
        );

      case 'reset':
        return (
          <div className="form-group flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              {...register('email', emailValidation)}
              className="form-control"
              disabled={otpSent}
            />
            {errors.email && (
              <p className="error text-red-500 text-xs">
                {errors.email.message}
              </p>
            )}
            {otpSent && (
              <div className="form-group flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  {...register('otp', { required: 'OTP is required' })}
                  className="form-control"
                />
                {errors.otp && (
                  <p className="error text-red-500 text-xs">
                    {errors.otp.message}
                  </p>
                )}

                {renderPasswordField(
                  'new_password',
                  'New Password',
                  passwordValidation,
                  showNewPassword
                )}
                {errors.new_password && (
                  <p className="error text-red-500 text-xs">
                    {errors.new_password.message}
                  </p>
                )}

                {renderPasswordField(
                  'confirm_password',
                  'Confirm Password',
                  {
                    required: 'Confirm password is required',
                    validate: (val: string) =>
                      watch('new_password') === val || 'Passwords do not match',
                  },
                  showConfirmPassword
                )}
                {errors.confirm_password && (
                  <p className="error text-red-500 text-xs">
                    {errors.confirm_password.message}
                  </p>
                )}

                <button
                  type="submit"
                  className="at-btn at-btn-lg"
                  disabled={loading || googleLoading}
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
                disabled={loading || googleLoading}
              >
                Send OTP
              </button>
            )}
            <div className="text-center cursor-pointer">
              <Link href="#" onClick={() => handleModeChange('login')}>
                Back to Login
              </Link>
            </div>
          </div>
        );

      case 'verify-email':
        return (
          <div className="form-group flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              {...register('email', {
                ...emailValidation,
                value: email,
              })}
              className="form-control"
              readOnly
            />
            {errors.email && (
              <p className="error text-red-500 text-xs">
                {errors.email.message}
              </p>
            )}
            <input
              type="text"
              placeholder="Enter OTP"
              {...register('otp', { required: 'OTP is required' })}
              className="form-control"
            />
            {errors.otp && (
              <p className="error text-red-500 text-xs">{errors.otp.message}</p>
            )}
            <button
              type="submit"
              className="at-btn at-btn-lg"
              disabled={loading || googleLoading}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
            <ResendOtp email={email} />
          </div>
        );
    }
  };

  return (
    <div className="at-loginwrapper z-50">
      <div className="at-login">
        <div className="at-loginform">
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevent default form submission
              handleSubmit(handleAuthSubmit)(e);
            }}
            className="space-y-6"
          >
            <fieldset className="flex flex-col">
              <legend className="flex justify-center mb-6">
                <Image
                  src={Logo}
                  alt="Logo"
                  width={150}
                  height={50}
                  priority={true}
                />
              </legend>

              {renderAuthForm()}
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAuthComponent;
