"""Fiche-related API endpoints.

These endpoints manage the creation, retrieval, update and deletion
of educational fiches. All routes require authentication; the
authenticated user's email is used as the owner when creating new
resources.
"""

from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status, Response
import os
import asyncio
from app.email_service import send_new_fiche_notification

from app.models import Fiche, FicheCreate, FicheUpdate
from app.database import get_supabase_client
from .profile import get_current_user_email, is_admin

router = APIRouter(tags=["fiches"])


@router.post("/fiches", response_model=Fiche, status_code=status.HTTP_201_CREATED)
async def create_fiche(
    fiche: FicheCreate, email: str = Depends(get_current_user_email)
) -> Fiche:
    """Create a new fiche owned by the authenticated user.

    Args:
        fiche: The fiche data to create (without an ``id``).
        email: Email of the authenticated user.

    Returns:
        Fiche: The created fiche.
    """
    client = get_supabase_client()
    if client is None:
        raise HTTPException(status_code=500, detail="Supabase client unavailable")
    data = fiche.dict()
    data["owner"] = email
    try:
        response = client.table("fiches").insert(data).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    created = response.data[0]

    # Send an email notification to administrators about the new fiche.
    # Administrators are defined in the ADMIN_WHITELIST environment variable
    admin_list = os.getenv("ADMIN_WHITELIST", "")
    admin_emails = [e.strip() for e in admin_list.split(",") if e.strip()]
    if admin_emails:
        # Dispatch notification in background to avoid blocking the response
        try:
            asyncio.create_task(send_new_fiche_notification(created, admin_emails))
        except Exception:
            # Ignore any errors during email dispatch
            pass
    return Fiche(**created)


@router.get("/fiches", response_model=List[Fiche])
async def list_fiches(
    owner: Optional[str] = Query(None, description="Filter by owner email"),
    levels: Optional[List[str]] = Query(None, description="Filter by one or more levels"),
    disciplines: Optional[List[str]] = Query(None, description="Filter by one or more disciplines"),
    tags: Optional[List[str]] = Query(None, description="Filter by one or more tags"),
    pedagogy: Optional[List[str]] = Query(None, description="Filter by pedagogy types"),
    period: Optional[str] = Query(None, description="Filter by period (e.g. semester)"),
    modalities: Optional[str] = Query(None, description="Filter by modalities"),
    email: str = Depends(get_current_user_email),
) -> List[Fiche]:
    """List fiches for the authenticated user or by filters.

    This endpoint supports filtering on several fields defined on a fiche. If
    ``owner`` is provided, fiches owned by that email will be returned;
    otherwise fiches owned by the requesting user are returned. Lists such
    as levels, disciplines, tags and pedagogy can be filtered using the
    ``contains`` operator provided by Supabase, which checks whether the
    stored array contains all of the supplied values.

    Args:
        owner: Optional owner email to filter results (admin use case).
        levels: Optional list of levels or ages to match.
        disciplines: Optional list of disciplines to match.
        tags: Optional list of tags to match.
        pedagogy: Optional list of pedagogy types to match.
        period: Optional period string to filter results.
        modalities: Optional modalities string to filter results.
        email: Injected email of the current user.

    Returns:
        List[Fiche]: A list of fiches matching the provided filters.
    """
    client = get_supabase_client()
    if client is None:
        raise HTTPException(status_code=500, detail="Supabase client unavailable")

    query = client.table("fiches").select("*")

    requesting_admin = is_admin(email)

    if owner:
        if not requesting_admin and owner != email:
            raise HTTPException(status_code=403, detail="Not authorized to view these fiches")
        query = query.eq("owner", owner)
    elif not requesting_admin:
        query = query.eq("owner", email)

    # Apply array-based filters when provided. Supabase's ``contains``
    # operator requires a JSON-like structure. When multiple values
    # are supplied, the record must contain all of them.
    if levels:
        query = query.contains("levels", levels)
    if disciplines:
        query = query.contains("disciplines", disciplines)
    if tags:
        query = query.contains("tags", tags)
    if pedagogy:
        query = query.contains("pedagogy", pedagogy)

    # Apply simple string filters (case-sensitive)
    if period:
        query = query.eq("period", period)
    if modalities:
        query = query.eq("modalities", modalities)

    try:
        response = query.execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    return [Fiche(**row) for row in response.data]


@router.get("/fiches/{fiche_id}", response_model=Fiche)
async def get_fiche(fiche_id: str, email: str = Depends(get_current_user_email)) -> Fiche:
    """Retrieve a single fiche by ID.

    The fiche must be owned by the requesting user unless the user is
    listed as an administrator.
    """
    client = get_supabase_client()
    if client is None:
        raise HTTPException(status_code=500, detail="Supabase client unavailable")
    try:
        response = client.table("fiches").select("*").eq("id", fiche_id).single().execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    fiche_data = response.data
    if not fiche_data:
        raise HTTPException(status_code=404, detail="Fiche not found")
    if fiche_data.get("owner") != email and not is_admin(email):
        raise HTTPException(status_code=403, detail="Not authorized to access this fiche")
    return Fiche(**fiche_data)


@router.put("/fiches/{fiche_id}", response_model=Fiche)
async def update_fiche(
    fiche_id: str, fiche: FicheUpdate, email: str = Depends(get_current_user_email)
) -> Fiche:
    """Update an existing fiche.

    Fields that are not provided will remain unchanged. The ``owner``
    field cannot be updated and is ignored if provided in the body.
    """
    client = get_supabase_client()
    if client is None:
        raise HTTPException(status_code=500, detail="Supabase client unavailable")
    try:
        existing = (
            client.table("fiches").select("*").eq("id", fiche_id).single().execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    fiche_data = existing.data
    if not fiche_data:
        raise HTTPException(status_code=404, detail="Fiche not found")
    if fiche_data.get("owner") != email and not is_admin(email):
        raise HTTPException(status_code=403, detail="Not authorized to update this fiche")
    data = fiche.dict(exclude_unset=True)
    if not data:
        return Fiche(**fiche_data)
    try:
        response = (
            client.table("fiches").update(data).eq("id", fiche_id).execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    updated = response.data[0] if response.data else {**fiche_data, **data}
    return Fiche(**updated)


@router.delete("/fiches/{fiche_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_fiche(fiche_id: str, email: str = Depends(get_current_user_email)) -> Response:
    """Delete a fiche by ID.

    Only the owner of the fiche or an administrator can delete it.
    """
    client = get_supabase_client()
    if client is None:
        raise HTTPException(status_code=500, detail="Supabase client unavailable")
    try:
        existing = (
            client.table("fiches").select("owner").eq("id", fiche_id).single().execute()
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    fiche_data = existing.data
    if not fiche_data:
        raise HTTPException(status_code=404, detail="Fiche not found")
    if fiche_data.get("owner") != email and not is_admin(email):
        raise HTTPException(status_code=403, detail="Not authorized to delete this fiche")
    try:
        response = client.table("fiches").delete().eq("id", fiche_id).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    if response.count == 0:
        raise HTTPException(status_code=404, detail="Fiche not found")
    # Return an empty response with 204 No Content to avoid sending a response body
    return Response(status_code=status.HTTP_204_NO_CONTENT)
