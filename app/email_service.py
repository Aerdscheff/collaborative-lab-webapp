"""EmailJS integration helpers.

This module provides asynchronous helper functions to send transactional
emails via the EmailJS REST API. It uses environment variables to
configure the EmailJS service (service ID, user ID, template IDs) and
provides convenience wrappers for common email types used by the
Aerdscheff Collaborative Lab platform.

The ``send_email`` function is the generic low-level helper that
constructs the request payload and sends it to the EmailJS API. Other
functions build on top of it to fill in specific template parameters
for welcome messages, profile reminders and new fiche notifications.

If any of the required environment variables are missing, the helpers
will silently skip sending the email.
"""

from __future__ import annotations

import os
import logging
from typing import Any, Dict, Optional, List

import httpx

logger = logging.getLogger(__name__)

async def send_email(template_key: str, params: Dict[str, Any]) -> None:
    """Send an email via EmailJS.

    Looks up the service ID, user ID and template ID from environment
    variables. The template key should correspond to the suffix of
    ``EMAILJS_TEMPLATE_<key>`` in the environment. For example,
    passing "NEW_FICHE" will look up ``EMAILJS_TEMPLATE_NEW_FICHE``.

    Args:
        template_key: The suffix identifying which template ID to use.
        params: A dictionary of variables to pass to the template.

    Notes:
        - If any required environment variables are missing, the
          function will log a warning and return without raising.
        - Errors contacting the EmailJS API are logged but do not
          propagate; email sending failures should not disrupt the
          application flow.
    """
    service_id = os.getenv("EMAILJS_SERVICE_ID")
    user_id = os.getenv("EMAILJS_USER_ID")
    template_id = os.getenv(f"EMAILJS_TEMPLATE_{template_key}")
    if not service_id or not user_id or not template_id:
        logger.warning(
            "EmailJS configuration missing (service_id=%s, user_id=%s, template_id=%s)",
            bool(service_id), bool(user_id), bool(template_id),
        )
        return
    payload = {
        "service_id": service_id,
        "template_id": template_id,
        "user_id": user_id,
        "template_params": params or {},
    }
    url = "https://api.emailjs.com/api/v1.0/email/send"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=15)
        if response.status_code >= 400:
            logger.warning(
                "EmailJS send failed with status %s: %s",
                response.status_code,
                response.text,
            )
    except Exception as exc:
        logger.exception("Failed to send email via EmailJS: %s", exc)

async def send_welcome_email(to_email: str, to_name: Optional[str] = None) -> None:
    """Send a welcome email to a new user.

    Args:
        to_email: Recipient's email address.
        to_name: Recipient's name (optional).
    """
    params = {
        "to_email": to_email,
        "to_name": to_name or to_email,
    }
    await send_email("WELCOME", params)

async def send_profile_reminder_email(to_email: str, to_name: Optional[str] = None) -> None:
    """Send a reminder email prompting the user to complete their profile.

    Args:
        to_email: Recipient's email address.
        to_name: Recipient's name (optional).
    """
    params = {
        "to_email": to_email,
        "to_name": to_name or to_email,
    }
    await send_email("REMINDER", params)

async def send_new_fiche_notification(
  """EmailJS integration helpers.

This module provides asynchronous helper functions to send transactional
emails via the EmailJS REST API. It uses environment variables to
configure the EmailJS service (service ID, user ID, template IDs) and
provides convenience wrappers for common email types used by the
Aerdscheff Collaborative Lab platform.

The ``send_email`` function is the generic low-level helper that
constructs the request payload and sends it to the EmailJS API. Other
functions build on top of it to fill in specific template parameters
for welcome messages, profile reminders and new fiche notifications.

If any of the required environment variables are missing, the helpers
will silently skip sending the email.
"""

from __future__ import annotations

import os
import logging
from typing import Any, Dict, Optional, List

import httpx

logger = logging.getLogger(__name__)

async def send_email(template_key: str, params: Dict[str, Any]) -> None:
    """Send an email via EmailJS.

    Looks up the service ID, user ID and template ID from environment
    variables. The template key should correspond to the suffix of
    ``EMAILJS_TEMPLATE_<key>`` in the environment. For example,
    passing "NEW_FICHE" will look up ``EMAILJS_TEMPLATE_NEW_FICHE``.

    Args:
        template_key: The suffix identifying which template ID to use.
        params: A dictionary of variables to pass to the template.

    Notes:
        - If any required environment variables are missing, the
          function will log a warning and return without raising.
        - Errors contacting the EmailJS API are logged but do not
          propagate; email sending failures should not disrupt the
          application flow.
    """
    service_id = os.getenv("EMAILJS_SERVICE_ID")
    user_id = os.getenv("EMAILJS_USER_ID")
    template_id = os.getenv(f"EMAILJS_TEMPLATE_{template_key}")
    if not service_id or not user_id or not template_id:
        logger.warning(
            "EmailJS configuration missing (service_id=%s, user_id=%s, template_id=%s)",
            bool(service_id), bool(user_id), bool(template_id),
        )
        return
    payload = {
        "service_id": service_id,
        "template_id": template_id,
        "user_id": user_id,
        "template_params": params or {},
    }
    url = "https://api.emailjs.com/api/v1.0/email/send"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=15)
        if response.status_code >= 400:
            logger.warning(
                "EmailJS send failed with status %s: %s",
                response.status_code,
                response.text,
            )
    except Exception as exc:
        logger.exception("Failed to send email via EmailJS: %s", exc)

async def send_welcome_email(to_email: str, to_name: Optional[str] = None) -> None:
    """Send a welcome email to a new user.

    Args:
        to_email: Recipient's email address.
        to_name: Recipient's name (optional).
    """
    params = {
        "to_email": to_email,
        "to_name": to_name or to_email,
    }
    await send_email("WELCOME", params)

async def send_profile_reminder_email(to_email: str, to_name: Optional[str] = None) -> None:
    """Send a reminder email prompting the user to complete their profile.

    Args:
        to_email: Recipient's email address.
        to_name: Recipient's name (optional).
    """
    params = {
        "to_email": to_email,
        "to_name": to_name or to_email,
    }
    await send_email("REMINDER", params)

async def send_new_fiche_notification(
    fiche: Dict[str, Any], admin_emails: List[str]
) -> None:
    """Send an email notification when a new fiche is created.

    Constructs template parameters from the fiche data and sends the
    notification to each admin in the provided list. The admins
    should be email addresses configured in the ``ADMIN_WHITELIST``
    environment variable.

    Args:
        fiche: The newly created fiche as a dict.
        admin_emails: A list of admin email addresses to notify.
    """
    if not fiche or not admin_emails:
        return
    # Build a concise description for the notification email
    title = fiche.get("title")
    if not title:
        # Fallback: show first level if title is missing
        levels = fiche.get("levels") or []
        title = levels[0] if levels else "Nouvelle fiche"
    summary = fiche.get("summary", "")
    for email in admin_emails:
        params = {
            "to_email": email,
            "fiche_title": title,
            "fiche_summary": summary,
            "owner": fiche.get("owner"),
        }
        await send_email("NEW_FICHE", params)  fiche: Dict[str, Any], admin_emails: List[str]
) -> None:
    """Send an email notification when a new fiche is created.

    Constructs template parameters from the fiche data and sends the
    notification to each admin in the provided list. The admins
    should be email addresses configured in the ``ADMIN_WHITELIST``
    environment variable.

    Args:
        fiche: The newly created fiche as a dict.
        admin_emails: A list of admin email addresses to notify.
    """
    if not fiche or not admin_emails:
        return
    # Build a concise description for the notification email
    title = fiche.get("title")
    if not title:
        # Fallback: show first level if title is missing
        levels = fiche.get("levels") or []
        title = levels[0] if levels else "Nouvelle fiche"
    summary = fiche.get("summary", "")
    for email in admin_emails:
        params = {
            "to_email": email,
            "fiche_title": title,
            "fiche_summary": summary,
            "owner": fiche.get("owner"),
        }
        await send_email("NEW_FICHE", params)
