import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import AppShell from '@/components/AppShell';

// ─── Route guards ─────────────────────────────────────────────────────────────

/**
 * GuestRoute — wraps pages that should only be accessible when NOT logged in.
 * If authenticated, redirects to /catalogue.
 */
export function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/catalogue" replace />;
  return <Outlet />;
}

/**
 * ProtectedRoute — wraps pages that require authentication.
 * If not authenticated, redirects to /login.
 * Wraps the page in AppShell (sidebar + topbar).
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
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
