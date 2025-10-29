/**
 * RegisterPageOTP Component
 * 
 * Story 4.3: Member Registration with Email OTP Flow
 * Two-step registration: 1) Email + Full Name, 2) OTP Verification
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserIcon, MailIcon, CheckCircleIcon, ArrowLeftIcon } from 'lucide-react';
import { register, verifyOtp } from '../../services/authApi';
import { toast } from '../../utils/toast';

type RegistrationStep = 'form' | 'otp' | 'success';

export function RegisterPageOTP() {
  const navigate = useNavigate();
  
  // Form state
  const [step, setStep] = useState<RegistrationStep>('form');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });
  
  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);
  
  // UI state
  const [errors, setErrors] = useState<{
    fullName?: string;
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      const newErrors = { ...errors };
      delete newErrors[name as keyof typeof errors];
      setErrors(newErrors);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: typeof errors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit registration
    setIsSubmitting(true);
    try {
      await register({
        email: formData.email.trim(),
        fullName: formData.fullName.trim(),
      });

      toast.show('Verification code sent! Please check your email.', 'success');
      setStep('otp');
      setResendCooldown(60); // 60 second cooldown
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
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
        email: formData.email,
        otp: otpCode,
      });

      // Store session
      localStorage.setItem('accessToken', response.session.accessToken);
      localStorage.setItem('refreshToken', response.session.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      toast.show('Account created successfully!', 'success');
      setStep('success');
      
      // Redirect after showing success
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Verification failed';
      toast.show(errorMessage, 'error');
      setErrors({ otp: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setIsSubmitting(true);
    try {
      await register({
        email: formData.email,
        fullName: formData.fullName,
      });

      toast.show('New verification code sent!', 'success');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-8">
          
          {/* Step 1: Registration Form */}
          {step === 'form' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Create Account
                </h1>
                <p className="text-gray-600 mt-2">Join us to book your perfect spa day</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        errors.fullName ? 'border-red-300' : 'border-pink-100'
                      } rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white/50`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        errors.email ? 'border-red-300' : 'border-pink-100'
                      } rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white/50`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending Code...' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-pink-600 hover:text-pink-700 font-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <>
              <button
                onClick={() => setStep('form')}
                className="mb-6 flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back
              </button>

              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Verify Your Email
                </h1>
                <p className="text-gray-600 mt-2">
                  We've sent a 6-digit code to
                </p>
                <p className="text-gray-800 font-semibold">{formData.email}</p>
              </div>

              <div className="space-y-6">
                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Enter Verification Code
                  </label>
                  <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
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
                        className={`w-12 h-14 text-center text-2xl font-bold border ${
                          errors.otp ? 'border-red-300' : 'border-pink-100'
                        } rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white/50`}
                      />
                    ))}
                  </div>
                  {errors.otp && (
                    <p className="mt-2 text-sm text-red-600 text-center">{errors.otp}</p>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleVerifyOtp}
                  disabled={isSubmitting || otp.join('').length !== 6}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify Code'}
                </button>

                {/* Resend Code */}
                <div className="text-center">
                  <button
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0 || isSubmitting}
                    className="text-sm text-pink-600 hover:text-pink-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendCooldown > 0
                      ? `Resend Code (${resendCooldown}s)`
                      : 'Resend Code'}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
              >
                <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Account Created Successfully!
              </h1>
              <p className="text-gray-600">
                Redirecting to your dashboard...
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default RegisterPageOTP;
