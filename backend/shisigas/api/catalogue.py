import frappe


# ─── Private helpers ────────────────────────────────────────────────────────

def _get_session_customer():
    """Resolve the Customer linked to the current session user."""
    customer = frappe.db.get_value(
        "Customer", {"email_id": frappe.session.user}, "name"
    )
    if not customer:
        frappe.throw("No customer record found.", frappe.PermissionError)
    return customer


# ─── Public (guest-accessible) endpoints ────────────────────────────────────

@frappe.whitelist(allow_guest=True)
def get_items(item_group="LPG", cylinder_size=None, page=1, page_size=12):
    """
    Called by: ProductListing view
    Returns: paginated list of Items with display fields
    """
    filters = [["item_group", "in", [item_group]], ["disabled", "=", 0]]
    if cylinder_size:
        filters.append(["cylinder_size", "=", cylinder_size])

    items = frappe.get_all(
        "Item",
        filters=filters,
        fields=[
            "name", "item_name", "item_code", "image",
            "cylinder_size", "gas_type", "standard_rate",
            "availability_flag", "description"
        ],
        order_by="item_name asc",
        start=(int(page) - 1) * int(page_size),
        page_length=int(page_size)
    )

    total = frappe.db.count("Item", filters=filters)

    return {"items": items, "total": total, "page": int(page), "page_size": int(page_size)}


@frappe.whitelist(allow_guest=True)
def get_item_filters():
    """
    Called by: Filter tabs + cylinder size ButtonGroup
    Returns: distinct gas_type and cylinder_size values
    """
    gas_types = frappe.db.sql(
        "SELECT DISTINCT gas_type FROM `tabItem` WHERE disabled=0 AND gas_type IS NOT NULL",
        as_dict=True
    )
    sizes = frappe.db.sql(
        "SELECT DISTINCT cylinder_size FROM `tabItem` WHERE disabled=0 AND cylinder_size IS NOT NULL ORDER BY cylinder_size",
        as_dict=True
    )
    return {
        "gas_types": [r.gas_type for r in gas_types],
        "cylinder_sizes": [r.cylinder_size for r in sizes]
    }
