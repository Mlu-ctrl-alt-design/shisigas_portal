import { Routes, Route, Navigate } from 'react-router-dom';
import { GuestRoute, ProtectedRoute } from '@/routes/index';

// Guest views
import LoginView from '@/views/guest/LoginView';
import RegisterView from '@/views/guest/RegisterView';
import OTPView from '@/views/guest/OTPView';

// End-user views
import CatalogueView from '@/views/end_user/catalogue/CatalogueView';
import CheckoutView from '@/views/end_user/checkout/CheckoutView';
import OrderConfirmationView from '@/views/end_user/checkout/OrderConfirmationView';

export default function App() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/catalogue" replace />} />

      {/* Guest-only routes — redirect to /catalogue if already authenticated */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/verify-otp" element={<OTPView />} />
      </Route>

      {/* Protected routes — redirect to /login if not authenticated */}
      {/* Wrapped in AppShell (sidebar + topbar) by ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        <Route path="/catalogue" element={<CatalogueView />} />
        <Route path="/checkout" element={<CheckoutView />} />
        <Route path="/order/:id" element={<OrderConfirmationView />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/catalogue" replace />} />
    </Routes>
  );
}
