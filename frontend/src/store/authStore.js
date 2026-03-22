import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth store — tracks the current Frappe session user.
 *
 * NOTE: Frappe uses session cookies (withCredentials: true), so the actual
 * auth token lives in the cookie. This store only tracks identity for UI
 * purposes (routing, display). frappe-react-sdk is an alternative if more
 * rehydration features are needed.
 */
const useAuthStore = create(
  persist(
    (set) => ({
      /** Email of the logged-in user, or null */
      user: null,

      /** Derived from user presence */
      isAuthenticated: false,

      /**
       * Called after a successful login or OTP verification.
       * @param {string} email
       */
      setUser: (email) =>
        set({ user: email, isAuthenticated: true }),

      /**
       * Called on logout or session expiry.
       * Does NOT call the Frappe logout endpoint — do that separately if needed.
       */
      clearUser: () =>
        set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'shisigas-auth',
      // Only persist user email; isAuthenticated is derived
      partialize: (state) => ({ user: state.user }),
      // Rehydrate isAuthenticated from persisted user
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          state.isAuthenticated = true;
        }
      },
    }
  )
);

export default useAuthStore;
