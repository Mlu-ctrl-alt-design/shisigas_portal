import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import AppShell from '@/components/AppShell';

// ─── Route guards ─────────────────────────────────────────────────────────────

/**
 * GuestRoute — wraps pages that should only be accessible when NOT logged in.
 * If authenticated, redirects to /catalogue.
 * Waits for Zustand hydration to avoid flash redirect on page refresh.
 */
export function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  if (!hasHydrated) {
    // Still reading from localStorage — don't redirect yet
    return null;
  }
  if (isAuthenticated) return <Navigate to="/catalogue" replace />;
  return <Outlet />;
}

/**
 * ProtectedRoute — wraps pages that require authentication.
 * If not authenticated, redirects to /login.
 * Wraps the page in AppShell (sidebar + topbar).
 * Waits for Zustand hydration to avoid flash redirect to /login on page refresh.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  if (!hasHydrated) {
    // Show a minimal loading state while localStorage is being read
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-orange-600 border-t-transparent" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

// ─── Route definitions ────────────────────────────────────────────────────────
// Used in App.jsx with <Routes> from react-router-dom.
//
// Layout:
//   /                         → redirect to /catalogue
//   GuestRoute:
//     /login                  → LoginView
//     /register               → RegisterView
//     /verify-otp             → OTPView
//   ProtectedRoute (AppShell):
//     /catalogue              → CatalogueView
//     /checkout               → CheckoutView
//     /order/:id              → OrderConfirmationView
