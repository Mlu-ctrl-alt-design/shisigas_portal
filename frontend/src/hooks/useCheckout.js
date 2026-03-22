import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getMatchedReseller, createSalesOrder, getOrderDetail } from '@/services/crm';
import useCartStore from '@/store/cartStore';

/**
 * Fetches the nearest reseller that covers the given coordinates.
 * Only runs when both lat and lng are provided.
 *
 * @param {number|null} lat
 * @param {number|null} lng
 */
export function useMatchedReseller(lat, lng) {
  return useQuery({
    queryKey: ['reseller', lat, lng],
    queryFn: () => getMatchedReseller(lat, lng),
    enabled: !!lat && !!lng,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Mutation: place a sales order.
 * On success: clears cart and navigates to /order/:id
 */
export function useCreateOrder() {
  const navigate = useNavigate();
  const clearCart = useCartStore((s) => s.clearCart);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ items, addressName, resellerZone }) =>
      createSalesOrder(items, addressName, resellerZone),
    onSuccess: (data) => {
      clearCart();
      // Prefetch order detail so confirmation page loads instantly
      queryClient.setQueryData(['order', data.order_id], data);
      navigate(`/order/${data.order_id}`);
    },
  });
}

/**
 * Fetches Sales Order detail for the confirmation / tracking page.
 *
 * @param {string|null} orderId
 */
export function useOrderDetail(orderId) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderDetail(orderId),
    enabled: !!orderId,
  });
}
