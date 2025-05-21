// src/components/page-ui/password_change_form.tsx

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { toast } from 'react-toastify';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCookie } from '@/utils/cookieUtility';
import * as z from 'zod';

const passwordChangeSchema = z
  .object({
    otp: z.string().min(6, { message: 'OTP must be at least 6 characters.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    newPassword: z
      .string()
      .min(8, { message: 'New password must be at least 8 characters.' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm password must be at least 8 characters.' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Get the type from the schema
type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

export default function PasswordChangeForm() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);



  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
  });

  // Load user email from cookie on component mount
  useEffect(() => {
    const loadUserEmail = () => {
      try {
        const userDataCookie = getCookie('userData');
        if (userDataCookie) {
          const userData = JSON.parse(userDataCookie);
          setUserEmail(userData.email || '');
          setValue('email', userData.email || '');
        }
      } catch (error) {
        console.error('Error loading user email:', error);
      }
    };

    loadUserEmail();
  }, [setValue]);

  // OTP Request Handler
  const handleRequestOTP = async () => {
    if (!userEmail) {
      toast.error('No email found. Please log in again.');
      return;
    }

    setIsRequestingOTP(true);
    try {
      await authService.requestPasswordReset({ email: userEmail });
      
      toast.success('OTP has been sent to your email');
      setOtpSent(true);
      
      // Start countdown
      let countdown = 60;
      setOtpCountdown(countdown);
      const countdownInterval = setInterval(() => {
        countdown -= 1;
        setOtpCountdown(countdown);
        
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          setOtpSent(false);
        }
      }, 1000);

    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setIsRequestingOTP(false);
    }
  };

  const onSubmit: SubmitHandler<PasswordChangeFormValues> = async (data) => {
    setIsChangingPassword(true);
    try {
      await authService.resetPassword({
        otp: data.otp,
        email: data.email,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      });

      toast.success('Password changed successfully!');
      // Optionally reset form or redirect
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="w-full mx-auto">
      <h3 className="text-lg font-semibold mb-4">Reset Password</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="email"
              type="email"
              {...register('email')}

              disabled={true}
              className="flex-grow bg-gray-50"
            />
          </div>
          {errors.email && (
            <div className="text-red-500 text-sm flex items-center mt-1">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.email.message?.toString() ?? 'Error'}
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <div className="flex-grow">
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              type="text"
              {...register('otp')}
              disabled={isChangingPassword}
              className={`w-full ${errors.otp ? 'border-red-500' : ''}`}
            />
            {errors.otp && (
              <div className="text-red-500 text-sm flex items-center mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.otp.message?.toString() ?? 'Error'}
              </div>
            )}
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              onClick={handleRequestOTP}
              disabled={isRequestingOTP || otpSent}
              className="bg-[#42a674] text-white hover:bg-[#5a5a56] hover:text-white"
            >
              {isRequestingOTP ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : otpSent ? (
                `Resend in ${otpCountdown}s`
              ) : (
                'Send OTP'
              )}
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            
            type={showNewPassword ? 'text' : 'password'}
            {...register('newPassword')}
            disabled={isChangingPassword}
            className={errors.newPassword ? 'border-red-500' : ''}
          />
          {errors.newPassword && (
            <div className="text-red-500 text-sm flex items-center mt-1">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.newPassword.message?.toString() ?? 'Error'}
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            
            type={showNewPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            disabled={isChangingPassword}
            className={errors.confirmPassword ? 'border-red-500' : ''}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 text-sm flex items-center mt-1">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.confirmPassword.message?.toString() ?? 'Error'}
            </div>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={isChangingPassword}
          className="w-full bg-[#42a674] text-white hover:bg-[#5a5a56] hover:text-white"
        >
          {isChangingPassword ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Changing...
            </>
          ) : (
            'Change Password'
          )}
        </Button>
      </form>
    </div>
  );
}