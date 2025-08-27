"""Database client for Supabase.

This module provides a helper function to instantiate a Supabase client
from environment variables. The client can be imported and reused in
route handlers and other modules.
"""

from __future__ import annotations

import os
from typing import Optional

try:
    from supabase import create_client, Client  # type: ignore
except ImportError:
    # The supabase package might not be installed in this environment.
    # Consumers of this module should ensure it is available at runtime.
    create_client = None  # type: ignore
    Client = None  # type: ignore


def get_supabase_client() -> Optional[Client]:
    """Create a Supabase client using environment variables.

    Reads ``SUPABASE_URL`` and either ``SUPABASE_SERVICE_KEY`` or
    ``SUPABASE_ANON_KEY`` from the environment. If the supabase package
    is not installed or the environment variables are missing, this
    function will return ``None``.

    Returns:
        Optional[Client]: An instance of the Supabase client, or ``None``
        if instantiation failed.
    """
    if create_client is None:
        # Supabase library is not available; cannot create client.
        return None

    url = os.getenv("SUPABASE_URL")
    # Prefer the service key if provided; fallback to anon key.
    key = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_ANON_KEY")
    if not url or not key:
        return None
    try:
        return create_client(url, key)
    except Exception:
        # Instantiation can raise if the URL or key is invalid.
        return None