import { useParams, Link } from 'react-router-dom';
import { useOrderDetail } from '@/hooks/useCheckout';
import StatusBadge from '@/components/StatusBadge';

// UNTITLED UI: https://untitledui.com/components/featured-icon
// UNTITLED UI: https://untitledui.com/components/card
// UNTITLED UI: https://untitledui.com/components/feed
// TODO: Replace success icon with <FeaturedIcon size="xl" color="success"> from @untitled-ui/react.
// TODO: Replace order card with <Card> from @untitled-ui/react.
// TODO: Replace activity timeline with <Feed> from @untitled-ui/react.
// TODO: Replace back button with <Button variant="secondary"> from @untitled-ui/react.

export default function OrderConfirmationView() {
  const { id } = useParams();
  const { data: order, isLoading, isError } = useOrderDetail(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-orange-600 border-t-transparent" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-red-600 font-medium">Could not load order details.</p>
        <Link to="/catalogue" className="mt-4 text-sm text-orange-600 hover:underline">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      {/* Success hero */}
      <div className="text-center space-y-4">
        {/* UNTITLED UI: FeaturedIcon (success, xl) stub */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Order Placed!</h1>
        <div className="flex items-center justify-center gap-3">
          <p className="text-lg font-semibold text-gray-700">{order.name}</p>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-sm text-gray-500">
          Delivery expected by{' '}
          <span className="font-medium text-gray-700">
            {new Date(order.delivery_date).toLocaleDateString('en-KE', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </p>
      </div>

      {/* Order summary card */}
      {/* UNTITLED UI: Card stub */}
      <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
        <div className="px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Items</h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {order.items?.map((item) => (
            <li key={item.item_code} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.item_name}</p>
                <p className="text-xs text-gray-500">×{item.qty}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                KES {item.amount?.toLocaleString('en-KE')}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-sm font-medium text-gray-700">Total</span>
          <span className="text-lg font-bold text-gray-900">
            KES {order.grand_total?.toLocaleString('en-KE')}
          </span>
        </div>
      </div>

      {/* Delivery info card */}
      {/* UNTITLED UI: Card stub */}
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-5 space-y-2">
        <h2 className="text-base font-semibold text-gray-900">Delivery details</h2>
        {order.customer_address && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Address:</span> {order.customer_address}
          </p>
        )}
        {order.reseller_zone && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Reseller zone:</span> {order.reseller_zone}
          </p>
        )}
      </div>

      {/* Activity Feed placeholder */}
      {/* UNTITLED UI: Feed stub — status change log */}
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Activity</h2>
        <ol className="relative border-l border-gray-200 space-y-4 ml-3">
          <li className="ml-6">
            <span className="absolute -left-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-green-400 ring-4 ring-white" />
            <p className="text-sm font-medium text-gray-900">Order placed</p>
            <p className="text-xs text-gray-500">Status: {order.status}</p>
          </li>
          {/* TODO: Map status_log from API when available */}
        </ol>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {/* UNTITLED UI: Button (secondary) stub */}
        <Link
          to="/catalogue"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back to Catalogue
        </Link>
        <Link
          to={`/orders/${id}`}
          className="flex-1 rounded-lg border border-orange-300 bg-orange-50 px-4 py-2.5 text-center text-sm font-semibold text-orange-700 hover:bg-orange-100"
        >
          Track Order
        </Link>
      </div>
    </div>
  );
}
