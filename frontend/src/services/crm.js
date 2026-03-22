import api from './api';

/**
 * Core helper: POST to a whitelisted Frappe method.
 * All shisigas API endpoints live under shisigas.api.<module>.<function>.
 * Frappe wraps all return values in { message: <your_return> }.
 */
const call = (method, params = {}) =>
  api
    .post(`/api/method/shisigas.api.${method}`, params)
    .then((r) => r.data.message);

// ─── Catalogue ───────────────────────────────────────────────────────────────

/**
 * @param {string} itemGroup  e.g. "LPG"
 * @param {string|null} cylinderSize  e.g. "6kg"
 * @param {number} page  1-based
 * @returns {{ items: Item[], total: number, page: number, page_size: number }}
 */
export const getItems = (itemGroup = 'LPG', cylinderSize = null, page = 1) =>
  call('catalogue.get_items', {
    item_group: itemGroup,
    cylinder_size: cylinderSize,
    page,
  });

/**
 * @returns {{ gas_types: string[], cylinder_sizes: string[] }}
 */
export const getItemFilters = () => call('catalogue.get_item_filters');

// ─── Auth ────────────────────────────────────────────────────────────────────

/**
 * @param {{ full_name, mobile, email, password, preferred_cylinder_size?, preferred_gas_type? }} data
 * @returns {{ status: "otp_sent", mobile: string }}
 */
export const registerCustomer = (data) =>
  call('auth.register_customer', data);

/**
 * @param {string} mobile
 * @param {string} otp
 * @returns {{ status: "verified", user: string }}
 */
export const verifyOtp = (mobile, otp) =>
  call('auth.verify_otp', { mobile, otp });

/**
 * @param {string} mobile
 * @returns {{ status: "resent" }}
 */
export const resendOtp = (mobile) =>
  call('auth.resend_otp', { mobile });

// ─── Checkout ────────────────────────────────────────────────────────────────

/**
 * @param {{ address_line1, city, latitude, longitude, google_place_id, formatted_address }} data
 * @returns {{ address_name: string }}
 */
export const saveDeliveryAddress = (data) =>
  call('checkout.save_delivery_address', data);

/**
 * @param {number} latitude
 * @param {number} longitude
 * @returns {{ matched: boolean, reseller_name?: string, estimated_delivery_hours?: number, reseller_zone?: string }}
 */
export const getMatchedReseller = (latitude, longitude) =>
  call('checkout.get_matched_reseller', { latitude, longitude });

/**
 * @param {Array<{ item_code: string, qty: number }>} items  Must be JSON-serialisable
 * @param {string} addressName
 * @param {string} resellerZone
 * @returns {{ order_id: string, status: string, grand_total: number }}
 */
export const createSalesOrder = (items, addressName, resellerZone) =>
  call('checkout.create_sales_order', {
    // Frappe expects JSON string for list args when called via POST body
    items: JSON.stringify(items),
    address_name: addressName,
    reseller_zone: resellerZone,
  });

/**
 * @param {string} orderId
 * @returns {SalesOrderDetail}
 */
export const getOrderDetail = (orderId) =>
  call('checkout.get_order_detail', { order_id: orderId });
