// src/app/reset/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import Logo from '../../../public/images/logo.png';
import Image from 'next/image';
import { toast } from 'react-toastify';
import ResendOtp from '@/components/Auth/reset-otp';

interface ResetPasswordFormInputs {
  email: string;
  new_password: string;
  confirm_password: string;
}

function ResetPassword() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>();
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const requestPasswordReset = async () => {
    try {
      const response = await authService.requestPasswordReset({ email });
      setOtpSent(true);
      toast.success('OTP has been sent to your email.');
    } catch (error: any) {
      toast.error(`Failed to send OTP. ${error.message}`);
      setApiError(error?.message || 'Failed to send OTP. Please try again.');
    }
  };

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    setApiError(null);
    if (data.new_password !== data.confirm_password) {
      setApiError('Passwords do not match.');
      return;
    }

    if (!email || !otp) {
      setApiError('Email and OTP are required.');
      return;
    }

    try {
      const response = await authService.resetPassword({
        email,
        otp: Number(otp),
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });
      toast.success('Password updated successfully! Redirecting...');
      router.prefetch('/login');
      router.push('/login');
    } catch (error: any) {
      console.error('Password Reset Failed:', error);
      toast.error(`Password Reset Failed: ${error.message}`);
      setApiError(error?.message || 'Reset failed!');
    }
  };

  return (
    <div className="at-loginwrapper at-resetpasswordwrapper">
      <div className="at-login">
        <div className="at-loginform">
          <form className="at-formtheme" onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <legend>
                <span>
                  <Image src={Logo} alt="Logo" />
                </span>
              </legend>
              <div className="at-logintitle">
                <h2>Reset Password</h2>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email || ''}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  disabled={otpSent}
                  required
                />
                {errors.email && (
                  <p className="error">{errors.email.message}</p>
                )}
              </div>
              {!otpSent && (
                <div className="form-group">
                  <button
                    type="button"
                    onClick={requestPasswordReset}
                    className="at-btn at-btn-lg"
                  >
                    Send OTP
                  </button>
                </div>
              )}
              {otpSent && (
                <>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Enter your OTP"
                      value={otp || ''}
                      onChange={(e) => setOtp(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <div className="at-inputwithicon">
                      <input
                        type="password"
                        placeholder="New Password"
                        {...register('new_password', {
                          required: 'New password is required',
                          minLength: {
                            value: 8,
                            message:
                              'Password must be at least 8 characters long',
                          },
                        })}
                        className="form-control"
                      />
                    </div>
                    {errors.new_password && (
                      <p className="error">{errors.new_password.message}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <div className="at-inputwithicon">
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        {...register('confirm_password', {
                          required: 'Confirm password is required',
                        })}
                        className="form-control"
                      />
                    </div>
                    {errors.confirm_password && (
                      <p className="error">{errors.confirm_password.message}</p>
                    )}
                  </div>
                  {email && <ResendOtp email={email} />}
                </>
              )}
              {apiError && <p className="error">{apiError}</p>}
              {otpSent && (
                <div className="form-group">
                  <button type="submit" className="at-btn at-btn-lg">
                    Reset Password
                  </button>
                </div>
              )}
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
// export default withAuth(ResetPassword);
