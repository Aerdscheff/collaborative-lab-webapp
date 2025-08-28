"""Export API endpoints.

Provides an endpoint to export all data from the database into a JSON
structure. This endpoint is intended for administrators and may be
protected via role-based access control in a real deployment.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.database import get_supabase_client
from app.google_api import upload_json_to_drive
from .profile import get_current_user_email  # to ensure authentication exists

router = APIRouter(tags=["export"])


@router.get("/export.json")
async def export_json(email: str = Depends(get_current_user_email)) -> dict:
    """Export all tables from the database as a JSON object.

    Only users with the ``admin`` role should be allowed to call this
    endpoint. Role checking is not implemented here and should be
    enforced in production.

    Args:
        email: Injected email of the current user.

    Returns:
        dict: A dictionary containing lists of rows for each table.
    """
    client = get_supabase_client()
    if client is None:
        raise HTTPException(status_code=500, detail="Supabase client unavailable")
    data = {}
    try:
        for table in ["users", "profiles", "fiches"]:
            response = client.table(table).select("*").execute()
            data[table] = response.data
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    # Attempt to upload the export to Google Drive when credentials are available.
    # If the upload succeeds, include the Drive file ID in the response under
    # the key ``_drive_file_id``. If the upload fails silently, the ID will
    # simply be omitted. Any exceptions raised by the upload helper are
    # suppressed to avoid exposing internal errors.
    try:
        file_id = upload_json_to_drive(data, filename="export.json")
        if file_id:
            data["_drive_file_id"] = file_id
    except Exception:
        # Ignore errors during upload
        pass
    return data
