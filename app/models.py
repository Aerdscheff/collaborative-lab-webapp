"""Pydantic models for the Aerdscheff Collaborative Lab API.

These models represent the core data structures used by the API. They
mirror the schemas defined in the project plan and are used for
request validation and response serialization.
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class User(BaseModel):
    """Representation of a user account.

    Users are authenticated via Supabase Auth and have roles such as
    ``admin`` or ``teacher``. The ``email`` field acts as a natural
    primary key.
    """

    email: EmailStr
    name: str
    role: str = Field(..., description="User role, e.g. 'admin' or 'teacher'")
    confirmed: bool = False
    registeredAt: Optional[datetime] = None
    lastLoginAt: Optional[datetime] = None


class Profile(BaseModel):
    """Additional information attached to a user.

    Profiles capture teaching subjects, classes taught, and Sustainable
    Development Goals (SDGs) alignment. The ``email`` field links back
    to a User.
    """

    email: EmailStr
    subject: str
    classes: str
    sdgs: str
    bio: Optional[str] = None
    preferences: Optional[str] = None


class FicheBase(BaseModel):
    """Common fields shared by fiche payloads."""

    title: str
    period: str
    modalities: str
    levels: List[str]
    pedagogy: List[str]
    disciplines: List[str]
    tags: List[str]
    summary: str


class Fiche(FicheBase):
    """Educational resource record returned by the API.

    Fiches (learning sheets) can be created by teachers and matched
    across disciplines. Lists such as ``levels`` and ``disciplines``
    are represented as Python lists and will be serialized to arrays or
    JSON structures in the underlying database.
    """

    id: Optional[str] = Field(None, description="Unique identifier (UUID)")
    owner: EmailStr = Field(..., description="Email of the fiche creator")
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None


class FicheCreate(FicheBase):
    """Payload required to create a fiche."""


class FicheUpdate(BaseModel):
    """Payload for partial updates of a fiche."""

    title: Optional[str] = None
    period: Optional[str] = None
    modalities: Optional[str] = None
    levels: Optional[List[str]] = None
    pedagogy: Optional[List[str]] = None
    disciplines: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    summary: Optional[str] = None


class Message(BaseModel):
    """Internal message record.

    Messages are used for internal notifications (e.g. new fiches,
    matches) and personal communications between users. Each message
    includes sender and recipient emails, a subject, content, a
    timestamp and a read flag.
    """

    id: Optional[str] = Field(None, description="Unique identifier (UUID)")
    to_email: EmailStr = Field(..., description="Recipient email")
    from_email: EmailStr = Field(..., description="Sender email")
    subject: str = Field(..., description="Subject line of the message")
    content: str = Field(..., description="Body of the message")
    date: datetime = Field(..., description="Timestamp of when the message was sent")
    read: bool = Field(False, description="Indicates whether the message has been read")


class ProfileUpdate(BaseModel):
    """Partial payload for profile creation or update."""

    subject: Optional[str] = None
    classes: Optional[str] = None
    sdgs: Optional[str] = None
    bio: Optional[str] = None
    preferences: Optional[str] = None
