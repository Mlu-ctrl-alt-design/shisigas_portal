import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/services/api';
import { verifyOtp } from '@/services/crm';
import useAuthStore from '@/store/authStore';

// UNTITLED UI: https://untitledui.com/components/authentication (split panel)
// TODO: Replace stub layout with <AuthPage> split-panel from @untitled-ui/react when installed.
// TODO: Replace <input> stubs with <Input> from @untitled-ui/react.
// TODO: Replace <button> stubs with <Button> from @untitled-ui/react.
// TODO: Replace error div with <Alert variant="danger"> from @untitled-ui/react.

const passwordSchema = z.object({
  mobile: z.string().min(9, 'Enter a valid mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const otpSchema = z.object({
  mobile: z.string().min(9, 'Enter a valid mobile number'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export default function LoginView() {
  const [mode, setMode] = useState('password'); // 'password' | 'otp'
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const schema = mode === 'password' ? passwordSchema : otpSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);
    try {
      if (mode === 'password') {
        // Frappe native login — issues session cookie
        await api.post('/api/method/login', {
          usr: data.mobile,
          pwd: data.password,
        });
        const meResp = await api.get('/api/method/frappe.auth.get_logged_user');
        setUser(meResp.data.message);
        navigate('/catalogue');
      } else {
        // OTP login flow
        const result = await verifyOtp(data.mobile, data.otp);
        setUser(result.user);
        navigate('/catalogue');
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          err.response?.data?._server_messages ||
          'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // UNTITLED UI: AuthPage split-panel stub
    <div className="flex min-h-screen">
      {/* Left: form panel */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-3xl font-bold text-gray-900">Sign in</h1>
          <p className="mt-2 text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
              Register
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {/* Mobile number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile number
              </label>
              {/* UNTITLED UI: Input stub */}
              <input
                {...register('mobile')}
                type="tel"
                placeholder="+254700000000"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              {errors.mobile && (
                <p className="mt-1 text-xs text-red-600">{errors.mobile.message}</p>
              )}
            </div>

            {mode === 'password' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                {/* UNTITLED UI: Input (password, show/hide toggle) stub */}
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OTP Code
                </label>
                <input
                  {...register('otp')}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 tracking-widest text-center text-lg"
                />
                {errors.otp && (
                  <p className="mt-1 text-xs text-red-600">{errors.otp.message}</p>
                )}
              </div>
            )}

            {/* Server error */}
            {serverError && (
              // UNTITLED UI: Alert (danger variant) stub
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            {/* Submit */}
            {/* UNTITLED UI: Button (primary, loading state) stub */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            {/* Toggle mode */}
            {/* UNTITLED UI: Button (link variant) stub */}
            <button
              type="button"
              onClick={() => setMode((m) => (m === 'password' ? 'otp' : 'password'))}
              className="w-full text-center text-sm text-orange-600 hover:text-orange-500 font-medium"
            >
              {mode === 'password' ? 'Use OTP instead' : 'Use password instead'}
            </button>
          </form>
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
