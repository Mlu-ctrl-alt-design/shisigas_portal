import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { registerCustomer } from '@/services/crm';
import { useItemFilters } from '@/hooks/useCatalogue';

// UNTITLED UI: https://untitledui.com/components/authentication (split panel)
// TODO: Replace stub layout with <AuthPage> from @untitled-ui/react when installed.
// TODO: Replace <input> stubs with <Input> from @untitled-ui/react.
// TODO: Replace <select> stubs with <Select> (searchable) from @untitled-ui/react.
// TODO: Replace <button> stub with <Button> (primary, loading state) from @untitled-ui/react.

const schema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  mobile: z
    .string()
    .regex(/^\+?[0-9]{9,15}$/, 'Enter a valid mobile / WhatsApp number'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  preferred_cylinder_size: z.string().optional(),
  preferred_gas_type: z.string().optional(),
});

export default function RegisterView() {
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { data: filters } = useItemFilters();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);
    try {
      await registerCustomer(data);
      // Pass mobile via router state to OTP page
      navigate('/verify-otp', { state: { mobile: data.mobile } });
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          err.response?.data?._server_messages ||
          'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // UNTITLED UI: AuthPage split-panel stub
    <div className="flex min-h-screen">
      {/* Left: form panel */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-12 lg:px-16 overflow-y-auto">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              {/* UNTITLED UI: Input stub */}
              <input
                {...register('full_name')}
                type="text"
                placeholder="Jane Doe"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              {errors.full_name && (
                <p className="mt-1 text-xs text-red-600">{errors.full_name.message}</p>
              )}
            </div>

            {/* Mobile / WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile / WhatsApp number
              </label>
              {/* UNTITLED UI: Input (tel, +254 prefix) stub */}
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

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="jane@example.com"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              {/* UNTITLED UI: Input (password, show/hide toggle) stub */}
              <input
                {...register('password')}
                type="password"
                placeholder="Min. 8 characters"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Preferred cylinder size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred cylinder size <span className="text-gray-400">(optional)</span>
              </label>
              {/* UNTITLED UI: Select (searchable) stub — populated from useItemFilters() */}
              <select
                {...register('preferred_cylinder_size')}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="">Select size…</option>
                {filters?.cylinder_sizes?.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred gas type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred gas type <span className="text-gray-400">(optional)</span>
              </label>
              {/* UNTITLED UI: Select stub */}
              <select
                {...register('preferred_gas_type')}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="">Select type…</option>
                {filters?.gas_types?.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Server error */}
            {serverError && (
              // UNTITLED UI: Alert (danger) stub
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
              {loading ? 'Creating account…' : 'Create account'}
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
