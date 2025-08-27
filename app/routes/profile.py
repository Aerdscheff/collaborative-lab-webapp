"""Profile-related API endpoints.

These endpoints handle retrieval and update of the authenticated
user's profile. Authentication and user identity are assumed to be
handled by a middleware or dependency in the broader application.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
import os
import httpx
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import base64
import json
import logging

from app.models import Profile
from app.database import get_supabase_client
from app.email_service import send_welcome_email
import asyncio

router = APIRouter(tags=["profiles"])

security = HTTPBearer()


async def get_current_user_email(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """Extract and verify the user email from a Supabase JWT.

    This helper validates the provided bearer token against Supabase's
    authentication API. It calls the ``/auth/v1/user`` endpoint with
    the token and a service or anon key to retrieve the user record.
    If verification succeeds, the user's email is returned. If the
    token is missing, invalid or the user cannot be determined, a
    401 response is raised.

    Args:
        credentials: Bearer token credentials provided by the HTTPBearer dependency.

    Returns:
        str: The authenticated user's email address.

    Raises:
        HTTPException: If authentication fails or the token is invalid.
    """
    token = credentials.credentials if credentials else None
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
        )
    supabase_url = os.getenv("SUPABASE_URL")
    # Prefer the service key for privileged queries; fallback to anon key
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_ANON_KEY")
    if not supabase_url or not supabase_key:
        # Supabase is not configured; deny access
        raise HTTPException(status_code=500, detail="Supabase configuration missing")
    # Build the endpoint for the user info. See Supabase auth docs.
    user_url = supabase_url.rstrip("/") + "/auth/v1/user"
    headers = {
        "Authorization": f"Bearer {token}",
        "apikey": supabase_key,
    }
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(user_url, headers=headers, timeout=10)
    except Exception as exc:
        logging.exception("Failed to contact Supabase auth endpoint: %s", exc)
        raise HTTPException(status_code=500, detail="Auth service unreachable")
    if response.status_code != 200:
        # Treat any non-200 as authentication failure
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )
    try:
        user_data = response.json()
    except Exception as exc:
        logging.exception("Failed to parse user info response: %s", exc)
        raise HTTPException(status_code=500, detail="Auth service error")
    # The user data should contain an email field or in user_metadata
    email = (
        user_data.get("email")
        or user_data.get("user_metadata", {}).get("email")
        or user_data.get("sub")
    )
    if not isinstance(email, str) or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email not found in user info",
        )
    return email


@router.get("/me/profile", response_model=Profile)
async def get_me_profile(email: str = Depends(get_current_user_email)) -> Profile:
    """Retrieve the authenticated user's profile.

    Looks up the profile in the Supabase ``profiles`` table by
    email. If no profile is found, a 404 is returned.

    Args:
        email: Injected email of the current user from the auth layer.

    Returns:
        Profile: The user's profile.
    """
    client = get_supabase_client()
    if client is None:
        raise HTTPException(status_code=500, detail="Supabase client unavailable")
    try:
        response = client.table("profiles").select("*").eq("email", email).single().execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    if not response.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return Profile(**response.data)


@router.put("/me/profile", response_model=Profile)
async def update_me_profile(
    profile: Profile, email: str = Depends(get_current_user_email)
) -> Profile:
    """Create or update the authenticated user's profile.

    Upserts the profile data into the ``profiles`` table. The email
    extracted from the JWT is authoritative and overrides any email in
    the request body.

    Args:
        profile: The new profile data submitted by the client.
        email: Injected email of the current user.

    Returns:
        Profile: The saved profile.
    """
    client = get_supabase_client()
    if client is None:
        raise HTTPException(status_code=500, detail="Supabase client unavailable")
    # Force the email to match the authenticated user
    data = profile.dict()
    data["email"] = email
    try:
        # Check if a profile already exists for this email
        existing = client.table("profiles").select("email").eq("email", email).execute()
        is_new = not existing.data
        # Upsert on the primary key (email)
        response = client.table("profiles").upsert(data, on_conflict="email").execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    # Send a welcome email asynchronously when a profile is created for the first time
    if is_new:
        try:
            asyncio.create_task(send_welcome_email(to_email=email, to_name=profile.name))
        except Exception:
            pass
    return Profile(**data)
