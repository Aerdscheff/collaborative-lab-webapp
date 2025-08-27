"""Entry point for the Aerdscheff Collaborative Lab API.

This module defines the FastAPI application and configures common
middleware such as CORS. It also includes a health check endpoint
and mounts the individual routers provided in the ``app.routes``
package.
"""

from __future__ import annotations

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import profile, fiches, export, messages

app = FastAPI(title="Aerdscheff Collaborative Lab API")

# Configure CORS based on environment variables. If no origins are
# specified, allow all origins for development convenience.
origins_env = os.getenv("CORS_ALLOWED_ORIGINS", "*")
origins = [origin.strip() for origin in origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    """Simple health check endpoint.

    Returns:
        dict[str, str]: A JSON object indicating service status.
    """
    return {"status": "ok"}


# Include routers from submodules. Each router defines its own set of
# endpoints and tags.
app.include_router(profile.router)
app.include_router(fiches.router)
app.include_router(export.router)
app.include_router(messages.router)