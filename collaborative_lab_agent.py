"""
Collaborative Lab API agent.

This module implements a simple FastAPI application that serves as the
intermediary between a front‑end web application and a set of third‑party
services.  It enforces authentication via Supabase Auth, stores data in
Google Sheets, schedules backups to Google Drive, and dispatches emails
through EmailJS.  The goal is to provide teachers with a clean REST API
for managing their educational profiles and project fiches while hiding
the complexity of external integrations.

The API assumes the following external services are configured:

    • Supabase Auth: users authenticate via magic links or Google OAuth.
      This API validates JWT tokens against the Supabase JWKS.

    • Google Sheets: used as a lightweight database.  Three sheets
      represent the `users`, `profiles` and `fiches` tables.  Each row
      corresponds to one record.  Multi‑value fields are stored as
      comma‑separated strings.

    • Google Drive: receives periodic JSON snapshots of all data.

    • EmailJS: sends transactional emails (welcome, reminders, admin
      notifications).

The code below outlines the structure of such a service.  It includes
placeholders where you should integrate your own logic for calling the
Google Sheets API, uploading files to Google Drive, and sending emails via
EmailJS.  Do not expose any secrets—store API keys and tokens in
environment variables on your server.

Note: this file is provided as a starting point.  You may need to
install the dependencies (`fastapi`, `python-jose[cryptography]`, `pydantic`,
`requests` or `httpx`) and set up appropriate Google credentials to
interact with Sheets and Drive.
"""

import json
import os
from datetime import datetime
from typing import List, Optional

import httpx
from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from jose import jwt
from pydantic import BaseModel, Field


###############################################################################
# Configuration
###############################################################################

SUPABASE_JWKS_URL = os.getenv("SUPABASE_JWKS_URL")  # e.g. https://your-project.supabase.co/auth/v1/keys
SUPABASE_AUDIENCE = os.getenv("SUPABASE_AUDIENCE")    # e.g. https://your-project.supabase.co

# Google Sheets identifiers (spreadsheet ID and sheet names)
GOOGLE_SPREADSHEET_ID = os.getenv("GOOGLE_SPREADSHEET_ID")
SHEET_USERS = os.getenv("SHEET_USERS", "users")
SHEET_PROFILES = os.getenv("SHEET_PROFILES", "profiles")
SHEET_FICHES = os.getenv("SHEET_FICHES", "fiches")

# EmailJS configuration (service ID and template IDs)
EMAILJS_SERVICE_ID = os.getenv("EMAILJS_SERVICE_ID")
EMAILJS_TEMPLATE_WELCOME = os.getenv("EMAILJS_TEMPLATE_WELCOME")
EMAILJS_TEMPLATE_REMINDER = os.getenv("EMAILJS_TEMPLATE_REMINDER")
EMAILJS_TEMPLATE_NEW_FICHE = os.getenv("EMAILJS_TEMPLATE_NEW_FICHE")
EMAILJS_USER_ID = os.getenv("EMAILJS_USER_ID")

# Backup folder on Google Drive
GOOGLE_DRIVE_FOLDER_ID = os.getenv("GOOGLE_DRIVE_FOLDER_ID")

###############################################################################
# Pydantic models
###############################################################################

class Profile(BaseModel):
    niveaux: List[str] = Field(default_factory=list)
    disciplines: List[str] = Field(default_factory=list)
    ODD: List[str] = Field(default_factory=list)
    pedagogies: List[str] = Field(default_factory=list)
    preferences: Optional[str] = None
    bio: Optional[str] = None

class Fiche(BaseModel):
    fiche_id: str
    user_id: str
    titre: str
    niveau: List[str] = Field(default_factory=list)
    disciplines: List[str] = Field(default_factory=list)
    periode: Optional[str] = None
    modalites: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    objectifs: Optional[str] = None
    resume: Optional[str] = None
    updated_at: datetime

class User(BaseModel):
    user_id: str
    email: str
    name: Optional[str] = None
    school: Optional[str] = None
    created_at: datetime
    role: str = "teacher"  # or "admin"


###############################################################################
# Utility functions
###############################################################################

async def fetch_jwks(url: str) -> dict:
    """Fetch JWKS (JSON Web Key Set) from Supabase."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        resp.raise_for_status()
        return resp.json()


async def verify_token(token: str) -> dict:
    """
    Validate a JWT from Supabase.  Returns the payload if valid.

    Raises HTTPException(401) if the token is invalid or expired.
    """
    if not SUPABASE_JWKS_URL or not SUPABASE_AUDIENCE:
        raise HTTPException(status_code=500, detail="Auth not configured")

    try:
        jwks = await fetch_jwks(SUPABASE_JWKS_URL)
        header = jwt.get_unverified_header(token)
        key = next((k for k in jwks["keys"] if k["kid"] == header["kid"]), None)
        if not key:
            raise Exception("Key not found")

        payload = jwt.decode(
            token,
            key,
            algorithms=[header["alg"]],
            audience=SUPABASE_AUDIENCE,
            options={"verify_exp": True},
        )
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from e


async def get_current_user(request: Request) -> User:
    """Extract and return the current user from the Authorization header."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    token = auth_header.split(" ", 1)[1]
    payload = await verify_token(token)
    user_id = payload.get("sub")
    email = payload.get("email")
    role = payload.get("role", "teacher")

    # Lookup the user in Sheets and create if necessary
    user = await read_user_from_sheets(user_id)
    if not user:
        user = User(
            user_id=user_id,
            email=email,
            name=payload.get("user_metadata", {}).get("full_name"),
            created_at=datetime.utcnow(),
            role=role,
        )
        await create_user_in_sheets(user)
        # Optionally send welcome email
        await send_welcome_email(user)
    return user


# Placeholder functions for Sheets/Drive/Email integrations

async def read_user_from_sheets(user_id: str) -> Optional[User]:
    """Retrieve a user from the `users` sheet by user_id."""
    # TODO: Implement Google Sheets API call here
    return None

async def create_user_in_sheets(user: User) -> None:
    """Insert a new user into the `users` sheet."""
    # TODO: Implement Google Sheets API call here
    pass

async def read_profile_from_sheets(user_id: str) -> Optional[Profile]:
    """Retrieve a profile by user_id."""
    # TODO: Implement Google Sheets API call here
    return None

async def upsert_profile_in_sheets(user_id: str, profile: Profile) -> None:
    """Create or update a profile row in the `profiles` sheet."""
    # TODO: Implement Google Sheets API call here
    pass

async def read_fiches_from_sheets(filters: dict) -> List[Fiche]:
    """Retrieve fiches matching filters from the `fiches` sheet."""
    # TODO: Implement Google Sheets API call here
    return []

async def insert_fiche_in_sheets(fiche: Fiche) -> None:
    """Insert a new fiche into the `fiches` sheet."""
    # TODO: Implement Google Sheets API call here
    pass

async def update_fiche_in_sheets(fiche_id: str, fiche: Fiche) -> None:
    """Update an existing fiche in the `fiches` sheet."""
    # TODO: Implement Google Sheets API call here
    pass

async def delete_fiche_from_sheets(fiche_id: str, user: User) -> None:
    """Delete a fiche from Sheets if the user has permission."""
    # TODO: Implement Google Sheets API call here
    pass

async def backup_to_drive() -> None:
    """Serialize data and upload JSON backup to Google Drive."""
    # TODO: Implement Google Drive API upload here
    pass

async def send_welcome_email(user: User) -> None:
    """Send a welcome email via EmailJS."""
    # TODO: Implement EmailJS call here
    pass

async def send_reminder_email(user: User) -> None:
    """Send a profile completion reminder email via EmailJS."""
    # TODO: Implement EmailJS call here
    pass

async def send_new_fiche_notification(fiche: Fiche) -> None:
    """Notify admins that a new fiche has been created."""
    # TODO: Implement EmailJS call here
    pass


###############################################################################
# FastAPI application
###############################################################################

app = FastAPI(title="Collaborative Lab API", version="0.1.0")


@app.get("/me/profile", response_model=Profile)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    profile = await read_profile_from_sheets(current_user.user_id)
    if not profile:
        # Return empty profile for new users
        return Profile()
    return profile


@app.put("/me/profile", response_model=Profile)
async def update_my_profile(new_profile: Profile, current_user: User = Depends(get_current_user)):
    # Normalise lists: remove duplicates and strip whitespace
    def normalise_list(values: List[str]) -> List[str]:
        clean = [v.strip() for v in values if v.strip()]
        return list(dict.fromkeys(clean))

    new_profile.niveaux = normalise_list(new_profile.niveaux)
    new_profile.disciplines = normalise_list(new_profile.disciplines)
    new_profile.ODD = normalise_list(new_profile.ODD)
    new_profile.pedagogies = normalise_list(new_profile.pedagogies)

    await upsert_profile_in_sheets(current_user.user_id, new_profile)
    return new_profile


@app.get("/fiches", response_model=List[Fiche])
async def list_fiches(request: Request, filters: Optional[str] = None, current_user: User = Depends(get_current_user)):
    # `filters` is expected to be a URL‑encoded JSON string representing a dict
    try:
        parsed_filters = json.loads(filters) if filters else {}
    except Exception as e:
        raise HTTPException(status_code=422, detail="Invalid filters parameter") from e
    fiches = await read_fiches_from_sheets(parsed_filters)
    return fiches


@app.post("/fiches", response_model=Fiche, status_code=status.HTTP_201_CREATED)
async def create_fiche(fiche_data: Fiche, current_user: User = Depends(get_current_user)):
    # Assign user_id and timestamps
    fiche = fiche_data.copy()
    fiche.user_id = current_user.user_id
    if not fiche.fiche_id:
        fiche.fiche_id = os.urandom(8).hex()
    fiche.updated_at = datetime.utcnow()

    await insert_fiche_in_sheets(fiche)
    # Trigger backup and notification
    await backup_to_drive()
    await send_new_fiche_notification(fiche)
    return fiche


@app.put("/fiches/{fiche_id}", response_model=Fiche)
async def update_fiche_endpoint(fiche_id: str, fiche_data: Fiche, current_user: User = Depends(get_current_user)):
    # TODO: read existing fiche to verify ownership or admin rights
    fiche = fiche_data.copy()
    fiche.fiche_id = fiche_id
    fiche.user_id = fiche_data.user_id  # ensure not changed
    fiche.updated_at = datetime.utcnow()
    await update_fiche_in_sheets(fiche_id, fiche)
    await backup_to_drive()
    return fiche


@app.delete("/fiches/{fiche_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_fiche_endpoint(fiche_id: str, current_user: User = Depends(get_current_user)):
    # TODO: verify ownership or admin rights before deletion
    await delete_fiche_from_sheets(fiche_id, current_user)
    await backup_to_drive()
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})


@app.get("/export.json")
async def export_data(current_user: User = Depends(get_current_user)):
    # Only admins can export all data
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Forbidden: admin only")

    # TODO: fetch all rows from users, profiles and fiches
    users_data = []  # await read_all_users()
    profiles_data = []  # await read_all_profiles()
    fiches_data = []  # await read_all_fiches()

    snapshot = {
        "users": users_data,
        "profiles": profiles_data,
        "fiches": fiches_data,
        "exported_at": datetime.utcnow().isoformat(),
    }
    # Backup to drive as part of export
    await backup_to_drive()
    return snapshot


@app.post("/import.json")
async def import_data_endpoint(data: dict, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Forbidden: admin only")
    # TODO: validate and upsert users, profiles and fiches
    return {"status": "import not implemented"}


###############################################################################
# Background tasks (reminders)
###############################################################################

async def check_incomplete_profiles() -> None:
    """Send reminder emails to users with incomplete profiles after 7 days."""
    # TODO: enumerate profiles, check for missing required fields, track last login
    # and send reminders via EmailJS.
    pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("collaborative_lab_agent:app", host="0.0.0.0", port=8000, reload=True)