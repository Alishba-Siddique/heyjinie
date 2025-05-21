import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { toast } from 'react-toastify';

interface ResendOtpProps {
  email: string;
}

const ResendOtp: React.FC<ResendOtpProps> = ({ email }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleResendOtp = async () => {
    setIsLoading(true);

    try {
      const response = await authService.resendOtp({ email });
      toast.success(response?.data?.message || 'OTP sent successfully!');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to resend OTP.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="at-haveaccount">
      <p>
        Have not received the OTP?{' '}
        <button onClick={handleResendOtp} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Resend OTP'}
        </button>
      </p>
    </div>
  );
};

export default ResendOtp;
