"""
Utilities for interacting with Google APIs.

This module centralizes the logic for constructing Google API service
clients using OAuth2 credentials. It supports both Google Drive and
Google Sheets APIs. Credentials are loaded from environment variables
``GOOGLE_CLIENT_ID``, ``GOOGLE_CLIENT_SECRET``, ``GOOGLE_REFRESH_TOKEN`` and
optionally ``GOOGLE_ACCESS_TOKEN``. The refresh token is required to
obtain an access token when none is provided or when the existing token
expires.

To use this module you must create an OAuth client in the Google Cloud
Console and authorize it for the scopes defined in ``SCOPES``. Then,
exchange the authorization code for a refresh token and store that
refresh token in the environment. See Google’s OAuth 2.0 documentation
for details on generating refresh tokens for installed applications.
"""

from __future__ import annotations

import os
from typing import Optional

try:
    from google.oauth2.credentials import Credentials  # type: ignore
    from googleapiclient.discovery import build  # type: ignore
    from googleapiclient.http import MediaInMemoryUpload  # type: ignore
except Exception:
    # google-auth and google-api-python-client may not be installed in
    # certain environments. The functions below will handle this case.
    Credentials = None  # type: ignore
    build = None  # type: ignore
    MediaInMemoryUpload = None  # type: ignore


# Define the scopes required for Drive and Sheets access. ``drive.file``
# allows uploading files into a user's Drive. ``spreadsheets`` allows
# reading and writing spreadsheet data. Adjust scopes as necessary.
SCOPES = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/spreadsheets",
]


def get_google_credentials() -> Optional[Credentials]:
    """Construct Google OAuth2 credentials from environment variables.

    Reads ``GOOGLE_CLIENT_ID``, ``GOOGLE_CLIENT_SECRET`` and
    ``GOOGLE_REFRESH_TOKEN`` from the environment. If an access token is
    provided via ``GOOGLE_ACCESS_TOKEN``, it will be used; otherwise
    Google’s auth library will refresh the token automatically using
    the refresh token. If the required environment variables are not
    present or the google-auth libraries are missing, ``None`` is
    returned.

    Returns:
        Optional[Credentials]: A credentials instance or ``None`` if
        credentials could not be constructed.
    """
    if Credentials is None:
        return None
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    refresh_token = os.getenv("GOOGLE_REFRESH_TOKEN")
    access_token = os.getenv("GOOGLE_ACCESS_TOKEN")
    if not client_id or not client_secret or not refresh_token:
        # Missing required pieces
        return None
    creds = Credentials(
        token=access_token,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client_id,
        client_secret=client_secret,
        scopes=SCOPES,
    )
    return creds


def get_drive_service(creds: Optional[Credentials] = None):
    """Create a Google Drive API service.

    Args:
        creds: Optional credentials instance. If not provided, the
            environment variables will be used to construct credentials.

    Returns:
        googleapiclient.discovery.Resource | None: An instance of the
        Drive service or ``None`` if credentials or the client library
        are unavailable.
    """
    if build is None:
        return None
    creds = creds or get_google_credentials()
    if creds is None:
        return None
    try:
        return build("drive", "v3", credentials=creds)
    except Exception:
        return None


def get_sheets_service(creds: Optional[Credentials] = None):
    """Create a Google Sheets API service.

    Args:
        creds: Optional credentials instance. If not provided, the
            environment variables will be used to construct credentials.

    Returns:
        googleapiclient.discovery.Resource | None: An instance of the
        Sheets service or ``None`` if credentials or the client library
        are unavailable.
    """
    if build is None:
        return None
    creds = creds or get_google_credentials()
    if creds is None:
        return None
    try:
        return build("sheets", "v4", credentials=creds)
    except Exception:
        return None


def upload_json_to_drive(data: dict, filename: str = "export.json") -> Optional[str]:
    """Upload a JSON object to Google Drive.

    This utility encodes the provided data as JSON and uploads it to
    the user's Drive using the ``drive.file`` scope. If the upload
    succeeds, the file ID is returned.

    Args:
        data: The Python object to serialize to JSON.
        filename: Name of the file to create in Drive.

    Returns:
        Optional[str]: The ID of the created file or ``None`` if the
        upload fails or the Drive service is unavailable.
    """
    if MediaInMemoryUpload is None:
        return None
    drive_service = get_drive_service()
    if drive_service is None:
        return None
    import json

    media_body = MediaInMemoryUpload(
        json.dumps(data).encode("utf-8"), mimetype="application/json"
    )
    file_metadata = {"name": filename}
    try:
        result = (
            drive_service.files()
            .create(body=file_metadata, media_body=media_body, fields="id")
            .execute()
        )
        return result.get("id")
    except Exception:
        return None
