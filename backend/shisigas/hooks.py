app_name = "shisigas"
app_title = "Shisia Gas Portal"
app_publisher = "Shisia Gas"
app_description = "Customer portal for ordering LPG and gas cylinders"
app_email = "dev@shisiagas.co.ke"
app_license = "MIT"
app_version = "0.0.1"

# NOTE: CORS is configured in common_site_config.json, NOT here.
# Example common_site_config.json entry:
# {
#   "allow_cors": "http://localhost:5173",
#   "cors_headers": "Authorization,Content-Type,X-Frappe-CSRF-Token"
# }

# Whitelisted API methods are auto-registered via @frappe.whitelist() decorator.
# No explicit declaration needed here for:
#   shisigas.api.catalogue.get_items
#   shisigas.api.catalogue.get_item_filters
#   shisigas.api.auth.register_customer
#   shisigas.api.auth.verify_otp
#   shisigas.api.auth.resend_otp
#   shisigas.api.checkout.save_delivery_address
#   shisigas.api.checkout.get_matched_reseller
#   shisigas.api.checkout.create_sales_order
#   shisigas.api.checkout.get_order_detail
