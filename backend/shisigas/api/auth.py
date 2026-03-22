import frappe
import random
import string


# ─── Helpers ────────────────────────────────────────────────────────────────

def _generate_otp(length=6):
    return "".join(random.choices(string.digits, k=length))


def _send_otp_sms(mobile, otp):
    """
    Hook into Africa's Talking or Twilio here.
    Replace with your SMS provider integration.
    """
    frappe.logger().info(f"[shisigas] OTP {otp} → {mobile}")
    # e.g. africas_talking.send(mobile, f"Your Shisia Gas OTP is {otp}")


# ─── Endpoints ──────────────────────────────────────────────────────────────

@frappe.whitelist(allow_guest=True)
def register_customer(full_name, mobile, email, password,
                      preferred_cylinder_size=None, preferred_gas_type=None):
    """
    Called by: RegistrationForm view
    Creates: Frappe User + Customer record, sends OTP to mobile
    """
    # Guard: duplicate mobile
    if frappe.db.exists("Customer", {"mobile_no": mobile}):
        frappe.throw("A customer with this mobile number already exists.")

    if frappe.db.exists("User", email):
        frappe.throw("An account with this email already exists.")

    # Create User (disabled until OTP verified)
    user = frappe.get_doc({
        "doctype": "User",
        "email": email,
        "first_name": full_name.split()[0],
        "last_name": " ".join(full_name.split()[1:]),
        "mobile_no": mobile,
        "new_password": password,
        "enabled": 0,          # Enabled after OTP
        "send_welcome_email": 0,
        "roles": [{"role": "Customer"}]
    })
    user.insert(ignore_permissions=True)

    # Create Customer
    customer = frappe.get_doc({
        "doctype": "Customer",
        "customer_name": full_name,
        "customer_type": "Individual",
        "email_id": email,
        "mobile_no": mobile,
        "preferred_cylinder_size": preferred_cylinder_size,
        "preferred_gas_type": preferred_gas_type,
    })
    customer.insert(ignore_permissions=True)
    frappe.db.commit()

    # Generate + cache OTP (5-minute TTL)
    otp = _generate_otp()
    frappe.cache().set_value(f"shisia_otp:{mobile}", otp, expires_in_sec=300)
    _send_otp_sms(mobile, otp)

    return {"status": "otp_sent", "mobile": mobile}


@frappe.whitelist(allow_guest=True)
def verify_otp(mobile, otp):
    """
    Called by: OTPVerification view
    Validates OTP, enables User, logs session in (issues Frappe session cookie — no JWT)
    """
    cached = frappe.cache().get_value(f"shisia_otp:{mobile}")
    if not cached or cached != otp:
        frappe.throw("Invalid or expired OTP. Please try again.")

    # Find and enable the User
    email = frappe.db.get_value("Customer", {"mobile_no": mobile}, "email_id")
    if not email:
        frappe.throw("No registration found for this mobile number.")

    user = frappe.get_doc("User", email)
    user.enabled = 1
    user.save(ignore_permissions=True)
    frappe.db.commit()

    # Clear OTP
    frappe.cache().delete_value(f"shisia_otp:{mobile}")

    # Log the user in — issues Frappe session cookie (no JWT needed)
    frappe.local.login_manager.login_as(email)

    return {"status": "verified", "user": email}


@frappe.whitelist(allow_guest=True)
def resend_otp(mobile):
    """
    Called by: OTPVerification view (resend link)
    """
    if not frappe.db.exists("Customer", {"mobile_no": mobile}):
        frappe.throw("Mobile number not registered.")

    otp = _generate_otp()
    frappe.cache().set_value(f"shisia_otp:{mobile}", otp, expires_in_sec=300)
    _send_otp_sms(mobile, otp)
    return {"status": "resent"}
