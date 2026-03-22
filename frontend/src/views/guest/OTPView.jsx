import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp } from '@/services/crm';
import useAuthStore from '@/store/authStore';

// UNTITLED UI: https://untitledui.com/components/authentication (split panel)
// TODO: Replace stub layout with <AuthPage> from @untitled-ui/react when installed.
// TODO: Replace 6-digit input with <OTPInput> (6 slots) from @untitled-ui/react.
// TODO: Replace <button> stubs with <Button> from @untitled-ui/react.
// TODO: Replace error div with <Alert variant="danger"> from @untitled-ui/react.

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function OTPView() {
  const location = useLocation();
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  // Mobile is passed from RegisterView via router state
  const mobile = location.state?.mobile ?? '';

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Redirect away if no mobile in state (direct navigation)
  useEffect(() => {
    if (!mobile) navigate('/register', { replace: true });
  }, [mobile, navigate]);

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const next = [...digits];
    next[index] = value.slice(-1); // keep last char
    setDigits(next);
    // Auto-advance focus
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const next = [...digits];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const otp = digits.join('');

  const handleVerify = async () => {
    if (otp.length < OTP_LENGTH) {
      setError('Please enter the full 6-digit code.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await verifyOtp(mobile, otp);
      setUser(result.user);
      navigate('/catalogue', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?._server_messages ||
          'Invalid or expired OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendOtp(mobile);
      setResendCooldown(RESEND_COOLDOWN);
      setError('');
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    // UNTITLED UI: AuthPage split-panel stub
    <div className="flex min-h-screen">
      {/* Left: form panel */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-3xl font-bold text-gray-900">Verify your number</h1>
          <p className="mt-2 text-sm text-gray-600">
            We sent a 6-digit code to{' '}
            <span className="font-medium text-gray-900">{mobile}</span>.
          </p>

          <div className="mt-8 space-y-6">
            {/* UNTITLED UI: OTP Input (6 slots) stub */}
            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 rounded-lg border border-gray-300 text-center text-2xl font-semibold text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 caret-transparent"
                  aria-label={`OTP digit ${i + 1}`}
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              // UNTITLED UI: Alert (danger) stub
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Verify button */}
            {/* UNTITLED UI: Button (primary, loading) stub */}
            <button
              onClick={handleVerify}
              disabled={loading || otp.length < OTP_LENGTH}
              className="w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying…' : 'Verify'}
            </button>

            {/* Resend link with countdown */}
            {/* UNTITLED UI: Button (link variant, countdown timer) stub */}
            <div className="text-center text-sm">
              {resendCooldown > 0 ? (
                <span className="text-gray-500">
                  Resend code in <span className="font-medium text-gray-700">{resendCooldown}s</span>
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="font-medium text-orange-600 hover:text-orange-500 disabled:opacity-50"
                >
                  {resendLoading ? 'Sending…' : "Didn't receive it? Resend"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right: brand panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-orange-600">
        <div className="text-center text-white px-8">
          <div className="text-6xl mb-4">🔥</div>
          <h2 className="text-3xl font-bold">Shisia Gas</h2>
          <p className="mt-2 text-orange-100">LPG delivered to your doorstep.</p>
        </div>
      </div>
    </div>
  );
}
