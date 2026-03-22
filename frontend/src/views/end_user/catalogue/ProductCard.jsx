import { useNavigate } from 'react-router-dom';
import useCartStore from '@/store/cartStore';

// UNTITLED UI: https://untitledui.com/components/card
// UNTITLED UI: https://untitledui.com/components/badge
// UNTITLED UI: https://untitledui.com/components/button
// TODO: Replace stub layout with <Card> from @untitled-ui/react.
// TODO: Replace availability span with <Badge> (green/red) from @untitled-ui/react.
// TODO: Replace button with <Button> (primary, full-width) from @untitled-ui/react.

const API_BASE = import.meta.env.VITE_API_BASE || '';

/**
 * Displays a single catalogue item.
 *
 * @param {{ item: {
 *   name: string,
 *   item_name: string,
 *   item_code: string,
 *   image: string|null,
 *   cylinder_size: string,
 *   standard_rate: number,
 *   availability_flag: 0|1,
 *   description: string
 * }}} props
 */
export default function ProductCard({ item }) {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const isAvailable = Boolean(item.availability_flag);

  // Prepend API base for Frappe file URLs (e.g. /files/image.png)
  const imageUrl = item.image
    ? item.image.startsWith('http')
      ? item.image
      : `${API_BASE}${item.image}`
    : null;

  const handleOrderNow = () => {
    addItem({
      item_code: item.item_code,
      item_name: item.item_name,
      qty: 1,
      rate: item.standard_rate,
      image: item.image,
    });
    navigate('/checkout');
  };

  return (
    // UNTITLED UI: Card stub
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Image / avatar */}
      {/* UNTITLED UI: Avatar (square, lg) stub */}
      <div className="flex items-center justify-center bg-gray-50 h-44">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.item_name}
            className="h-full w-full object-cover"
          />
        ) : (
          // Fallback: cylinder SVG icon
          <svg
            className="h-20 w-20 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 3h6a2 2 0 012 2v14a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 7h6M9 11h6M9 15h4"
            />
          </svg>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
          {item.item_name}
        </h3>

        {/* Size + availability row */}
        <div className="flex items-center gap-2 flex-wrap">
          {item.cylinder_size && (
            // UNTITLED UI: Badge (neutral) stub
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {item.cylinder_size}
            </span>
          )}
          {/* UNTITLED UI: Badge (green = In Stock / red = Out of Stock) stub */}
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isAvailable
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {isAvailable ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Price */}
        {/* UNTITLED UI: Metric Card (compact) stub */}
        <p className="text-lg font-bold text-gray-900">
          KES {item.standard_rate?.toLocaleString('en-KE') ?? '—'}
        </p>

        {/* CTA */}
        {/* UNTITLED UI: Button (primary, full-width) stub */}
        <button
          onClick={handleOrderNow}
          disabled={!isAvailable}
          className="mt-auto w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Order Now
        </button>
      </div>
    </div>
  );
}
