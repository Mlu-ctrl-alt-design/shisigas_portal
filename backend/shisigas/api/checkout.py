import frappe


# ─── Private helper ─────────────────────────────────────────────────────────

def _get_session_customer():
    customer = frappe.db.get_value(
        "Customer", {"email_id": frappe.session.user}, "name"
    )
    if not customer:
        frappe.throw("No customer record linked to this account.", frappe.PermissionError)
    return customer


# ─── Endpoints ──────────────────────────────────────────────────────────────

@frappe.whitelist()
def save_delivery_address(address_line1, city, latitude, longitude,
                           google_place_id, formatted_address):
    """
    Called by: Checkout view (after Maps pin confirmation)
    Creates or updates Address linked to the session Customer

    Custom fields required on Address doctype:
      latitude (Float), longitude (Float),
      google_place_id (Data), formatted_address (Small Text)
    """
    customer = _get_session_customer()

    # Upsert: one default delivery address per customer
    existing = frappe.db.get_value(
        "Address",
        {"address_title": customer, "address_type": "Delivery"},
        "name"
    )

    if existing:
        addr = frappe.get_doc("Address", existing)
    else:
        addr = frappe.get_doc({
            "doctype": "Address",
            "address_title": customer,
            "address_type": "Delivery",
            "links": [{"link_doctype": "Customer", "link_name": customer}]
        })

    addr.address_line1 = address_line1
    addr.city = city
    addr.latitude = float(latitude)        # Custom field on Address
    addr.longitude = float(longitude)     # Custom field on Address
    addr.google_place_id = google_place_id # Custom field on Address
    addr.formatted_address = formatted_address  # Custom field
    addr.save(ignore_permissions=True)
    frappe.db.commit()

    return {"address_name": addr.name}


@frappe.whitelist()
def get_matched_reseller(latitude, longitude):
    """
    Called by: Checkout view after address selection
    Returns: nearest active reseller + estimated delivery window
    Uses: Custom 'Reseller Zone' doctype with lat/lng centre + radius_km

    Custom doctype required:
      Reseller Zone (reseller_name, latitude, longitude, radius_km Float,
                     estimated_delivery_hours Int, enabled Check)
    """
    lat, lng = float(latitude), float(longitude)

    # Haversine-approximated match via SQL (fast enough for <500 zones)
    result = frappe.db.sql("""
        SELECT
            name, reseller_name, estimated_delivery_hours,
            (6371 * ACOS(
                COS(RADIANS(%s)) * COS(RADIANS(latitude)) *
                COS(RADIANS(longitude) - RADIANS(%s)) +
                SIN(RADIANS(%s)) * SIN(RADIANS(latitude))
            )) AS distance_km
        FROM `tabReseller Zone`
        WHERE enabled = 1
        HAVING distance_km <= radius_km
        ORDER BY distance_km ASC
        LIMIT 1
    """, (lat, lng, lat), as_dict=True)

    if not result:
        return {"matched": False, "message": "No reseller covers your area yet."}

    zone = result[0]
    return {
        "matched": True,
        "reseller_name": zone.reseller_name,
        "estimated_delivery_hours": zone.estimated_delivery_hours,
        "reseller_zone": zone.name
    }


@frappe.whitelist()
def create_sales_order(items, address_name, reseller_zone):
    """
    Called by: Checkout view (Place Order button)
    items: [{"item_code": "...", "qty": 1}, ...]
    Creates a Sales Order against the session Customer

    Custom field required on Sales Order: reseller_zone (Link → Reseller Zone)
    """
    customer = _get_session_customer()

    if not items or not isinstance(items, list):
        frappe.throw("Order must contain at least one item.")

    so = frappe.get_doc({
        "doctype": "Sales Order",
        "customer": customer,
        "delivery_date": frappe.utils.add_days(frappe.utils.today(), 1),
        "order_type": "Sales",
        "customer_address": address_name,
        "reseller_zone": reseller_zone,  # Custom field
        "items": [
            {
                "item_code": i["item_code"],
                "qty": int(i["qty"]),
                "delivery_date": frappe.utils.add_days(frappe.utils.today(), 1)
            }
            for i in items
        ]
    })
    so.insert(ignore_permissions=True)
    so.submit()
    frappe.db.commit()

    return {
        "order_id": so.name,
        "status": so.status,
        "grand_total": so.grand_total
    }


@frappe.whitelist()
def get_order_detail(order_id):
    """
    Called by: OrderConfirmation view
    Returns: Sales Order detail for the session customer only
    """
    customer = _get_session_customer()

    so = frappe.get_doc("Sales Order", order_id)
    if so.customer != customer:
        frappe.throw("Access denied.", frappe.PermissionError)

    return {
        "name": so.name,
        "status": so.status,
        "grand_total": so.grand_total,
        "delivery_date": so.delivery_date,
        "customer_address": so.customer_address,
        "reseller_zone": so.get("reseller_zone"),
        "items": [
            {
                "item_code": i.item_code,
                "item_name": i.item_name,
                "qty": i.qty,
                "rate": i.rate,
                "amount": i.amount
            }
            for i in so.items
        ]
    }
