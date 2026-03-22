import { useState } from 'react';
import useCartStore from '@/store/cartStore';
import { useMatchedReseller, useCreateOrder } from '@/hooks/useCheckout';
import { saveDeliveryAddress } from '@/services/crm';
import AddressMap from './AddressMap';

// UNTITLED UI: https://untitledui.com/components/card
// UNTITLED UI: https://untitledui.com/components/alert
// UNTITLED UI: https://untitledui.com/components/input
// TODO: Replace card wrappers with <Card> from @untitled-ui/react.
// TODO: Replace info/warning alerts with <Alert> from @untitled-ui/react.
// TODO: Replace quantity input with <InputNumber> (stepper) from @untitled-ui/react.

export default function CheckoutView() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const totalAmount = useCartStore((s) => s.totalAmount);

  const [confirmedAddress, setConfirmedAddress] = useState(null);
  const [savedAddressName, setSavedAddressName] = useState(null);
  const [addressError, setAddressError] = useState('');

  // Reseller lookup — only fires after address is confirmed
  const { data: resellerData, isLoading: resellerLoading } = useMatchedReseller(
    confirmedAddress?.lat ?? null,
    confirmedAddress?.lng ?? null
  );

  const createOrder = useCreateOrder();

  const handleAddressSelect = async (addr) => {
    setAddressError('');
    try {
      const result = await saveDeliveryAddress(addr);
      setConfirmedAddress(addr);
      setSavedAddressName(result.address_name);
    } catch (err) {
      setAddressError(
        err.response?.data?.message || 'Failed to save address. Please try again.'
      );
    }
  };

  const handlePlaceOrder = () => {
    if (!savedAddressName || !resellerData?.reseller_zone) return;
    createOrder.mutate({
      items: items.map((i) => ({ item_code: i.item_code, qty: i.qty })),
      addressName: savedAddressName,
      resellerZone: resellerData.reseller_zone,
    });
  };

  const canOrder =
    items.length > 0 &&
    savedAddressName &&
    resellerData?.matched &&
    !createOrder.isPending;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-xl font-semibold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-sm text-gray-500">Add items from the catalogue to get started.</p>
        <a
          href="/catalogue"
          className="mt-4 inline-block rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500"
        >
          Browse Catalogue
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: order summary */}
        {/* UNTITLED UI: Card stub */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

          <ul className="divide-y divide-gray-100">
            {items.map((item) => (
              // UNTITLED UI: List Item (image + name + price) stub
              <li key={item.item_code} className="flex items-center gap-4 py-4">
                {/* Thumbnail */}
                <div className="h-14 w-14 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
                  {item.image ? (
                    <img
                      src={
                        item.image.startsWith('http')
                          ? item.image
                          : `${import.meta.env.VITE_API_BASE || ''}${item.image}`
                      }
                      alt={item.item_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-300 text-2xl">
                      🔥
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.item_name}</p>
                  <p className="text-xs text-gray-500">KES {item.rate?.toLocaleString('en-KE')}</p>
                </div>

                {/* Quantity stepper */}
                {/* UNTITLED UI: InputNumber (stepper) stub */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQty(item.item_code, item.qty - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.item_code, item.qty + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>

                {/* Line total */}
                <p className="w-20 text-right text-sm font-semibold text-gray-900">
                  KES {(item.qty * item.rate)?.toLocaleString('en-KE')}
                </p>

                <button
                  onClick={() => removeItem(item.item_code)}
                  className="text-gray-400 hover:text-red-500 text-lg"
                  aria-label="Remove"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          {/* Subtotal */}
          {/* UNTITLED UI: Metric Card (compact) stub */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <span className="text-sm font-medium text-gray-700">Subtotal</span>
            <span className="text-lg font-bold text-gray-900">
              KES {totalAmount?.toLocaleString('en-KE')}
            </span>
          </div>
        </div>

        {/* Right column: address + map */}
        {/* UNTITLED UI: Card stub */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          {/* UNTITLED UI: Divider with label stub */}
          <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>

          <AddressMap onAddressSelect={handleAddressSelect} />

          {addressError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {addressError}
            </div>
          )}

          {/* Reseller match result */}
          {resellerLoading && confirmedAddress && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700 animate-pulse">
              Finding nearest reseller…
            </div>
          )}

          {resellerData && confirmedAddress && (
            resellerData.matched ? (
              // UNTITLED UI: Alert (info) stub
              <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
                <p className="font-semibold">✅ Delivered by {resellerData.reseller_name}</p>
                {/* UNTITLED UI: Badge (neutral) stub */}
                <p className="mt-1 text-blue-600">
                  Est. {resellerData.estimated_delivery_hours} hrs
                </p>
              </div>
            ) : (
              // UNTITLED UI: Alert (warning) stub
              <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
                ⚠️ {resellerData.message || "We don't cover your area yet."}
              </div>
            )
          )}

          {/* Create order error */}
          {createOrder.isError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {createOrder.error?.response?.data?.message || 'Failed to place order. Please try again.'}
            </div>
          )}

          {/* Place Order */}
          {/* UNTITLED UI: Button (primary, full-width, loading) stub */}
          <button
            onClick={handlePlaceOrder}
            disabled={!canOrder}
            className="w-full rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {createOrder.isPending ? 'Placing order…' : 'Place Order'}
          </button>

          {!savedAddressName && (
            <p className="text-center text-xs text-gray-400">Confirm your delivery location above to continue.</p>
          )}
        </div>
      </div>
    </div>
  );
}
