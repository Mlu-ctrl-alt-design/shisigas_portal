import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Cart store — client-side only (Zustand + localStorage).
 * Cleared on successful order placement via clearCart().
 *
 * Item shape: { item_code, item_name, qty, rate, image }
 */
const useCartStore = create(
  persist(
    (set, get) => ({
      /** @type {Array<{ item_code: string, item_name: string, qty: number, rate: number, image: string }>} */
      items: [],

      /**
       * Add an item or increment qty if it already exists.
       * @param {{ item_code, item_name, qty, rate, image }} item
       */
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.item_code === item.item_code);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.item_code === item.item_code
                  ? { ...i, qty: i.qty + (item.qty || 1) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, qty: item.qty || 1 }] };
        }),

      /**
       * Remove an item completely from the cart.
       * @param {string} itemCode
       */
      removeItem: (itemCode) =>
        set((state) => ({
          items: state.items.filter((i) => i.item_code !== itemCode),
        })),

      /**
       * Set exact quantity for an item. Removes it if qty <= 0.
       * @param {string} itemCode
       * @param {number} qty
       */
      updateQty: (itemCode, qty) =>
        set((state) => {
          if (qty <= 0) {
            return { items: state.items.filter((i) => i.item_code !== itemCode) };
          }
          return {
            items: state.items.map((i) =>
              i.item_code === itemCode ? { ...i, qty } : i
            ),
          };
        }),

      /** Clear all items — call after successful order placement. */
      clearCart: () => set({ items: [] }),

      /** Computed total order value. */
      get totalAmount() {
        return get().items.reduce((sum, i) => sum + i.qty * i.rate, 0);
      },
    }),
    {
      name: 'shisigas-cart',
    }
  )
);

export default useCartStore;
