/**
 * LoginPageOTP Component
 * 
 * Story 4.4: Login with Email OTP Flow
 * Two-step login: 1) Email, 2) OTP Verification
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MailIcon, CheckCircleIcon, ArrowLeftIcon } from 'lucide-react';
import { login, verifyOtp } from '../../services/authApi';
import { toast } from '../../utils/toast';

type LoginStep = 'email' | 'otp' | 'success';

export function LoginPageOTP() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  // Form state
  const [step, setStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState('');

  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // UI state
  const [errors, setErrors] = useState<{
    email?: string;
    otp?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-focus first OTP input when entering OTP step
  useEffect(() => {
    if (step === 'otp' && otpInputs.current[0]) {
      otpInputs.current[0].focus();
    }
  }, [step]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    
    // Clear error when user starts typing
    if (errors.email) {
      const newErrors = { ...errors };
      delete newErrors.email;
      setErrors(newErrors);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit login request
    setIsSubmitting(true);
    try {
      await login({ email: email.trim() });

      toast.show('Login code sent! Please check your email.', 'success');
      setStep('otp');
      setResendCooldown(60); // 60 second cooldown
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.show(errorMessage, 'error');
      setErrors({ email: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear OTP error
    if (errors.otp) {
      const newErrors = { ...errors };
      delete newErrors.otp;
      setErrors(newErrors);
    }

    // Auto-tab to next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Only accept 6-digit codes
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      otpInputs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setErrors({ otp: 'Please enter the 6-digit code' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await verifyOtp({
        email: email,
        otp: otpCode,
      });

      // Store session
      localStorage.setItem('accessToken', response.session.accessToken);
      localStorage.setItem('refreshToken', response.session.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      toast.show('Login successful!', 'success');
      setStep('success');
      
      // Redirect after showing success
      setTimeout(() => {
        navigate(returnUrl, { replace: true });
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Verification failed';
      toast.show(errorMessage, 'error');
      setErrors({ otp: errorMessage });
      // Reset OTP on error
      setOtp(['', '', '', '', '', '']);
      otpInputs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setIsSubmitting(true);
    try {
      await login({ email: email });
      
      toast.show('Code resent! Please check your email.', 'success');
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      otpInputs.current[0]?.focus();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend code';
      toast.show(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp(['', '', '', '', '', '']);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Email Step */}
        {step === 'email' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full mb-4">
                <MailIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Login Code'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
                Create Account
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Back to Home
              </Link>
            </div>
          </motion.div>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full mb-4">
                <MailIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Check Your Email
              </h2>
              <p className="text-gray-600">
                We sent a 6-digit code to<br />
                <span className="font-semibold text-gray-900">{email}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Enter Verification Code
                </label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      className={`w-12 h-14 text-center text-xl font-bold border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                        errors.otp ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    />
                  ))}
                </div>
                {errors.otp && (
                  <p className="mt-3 text-sm text-red-600 text-center">{errors.otp}</p>
                )}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isSubmitting || otp.join('').length !== 6}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Verifying...' : 'Verify & Sign In'}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
              <button
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || isSubmitting}
                className="text-sm text-purple-600 hover:text-purple-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={handleBackToEmail}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Change Email
              </button>
            </div>
          </motion.div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
            >
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-600">Redirecting you now...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default LoginPageOTP;