import { Link, NavLink, useNavigate } from 'react-router-dom';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';

// UNTITLED UI: https://untitledui.com/components/shell
// UNTITLED UI: https://untitledui.com/components/side-nav
// TODO: Replace stub layout with <Shell>, <SideNav>, <TopBar> from @untitled-ui/react when installed.

const navLinks = [
  { to: '/catalogue', label: 'Catalogue', icon: '🛒' },
  { to: '/orders', label: 'My Orders', icon: '📦' },
  { to: '/account', label: 'Account', icon: '👤' },
];

/**
 * Application shell with side navigation and top bar.
 * Wraps all authenticated views.
 *
 * @param {{ children: React.ReactNode }} props
 */
export default function AppShell({ children }) {
  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Clear local state; Frappe session cookie is cleared server-side
    clearUser();
    navigate('/login');
  };

  return (
    // UNTITLED UI: Shell stub
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* UNTITLED UI: SideNav stub */}
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-white">
        {/* Logo */}
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <Link to="/catalogue" className="text-xl font-bold text-orange-600">
            Shisia Gas
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navLinks.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3">
            {/* UNTITLED UI: Avatar stub */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
              {user?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* UNTITLED UI: TopBar stub */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          {/* Mobile logo */}
          <Link to="/catalogue" className="md:hidden text-lg font-bold text-orange-600">
            Shisia Gas
          </Link>
          <div className="hidden md:block" />

          {/* Right side: cart + avatar */}
          <div className="flex items-center gap-4">
            {/* Cart icon with badge */}
            <Link
              to="/checkout"
              className="relative flex items-center gap-1 text-gray-600 hover:text-gray-900"
            >
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* UNTITLED UI: Avatar stub */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
              {user?.[0]?.toUpperCase() ?? '?'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
