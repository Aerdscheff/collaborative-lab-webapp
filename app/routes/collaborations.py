from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import uuid

# ⚠️ à remplacer par ton vrai JWT-check
async def get_current_user():
    # Simule un utilisateur connecté
    return {"id": "demo-user-uuid", "role": "teacher"}

router = APIRouter(prefix="/collaborations", tags=["Collaborations"])

# ---- Schémas ----
class CollaborationRequest(BaseModel):
    age: str
    competences: List[str]
    odd: List[str]

class CollaborationResponse(BaseModel):
    id: str
    trame: str
    criteria: Dict

# ---- Routes ----
@router.post("/", response_model=CollaborationResponse)
async def create_collaboration(req: CollaborationRequest, user=Depends(get_current_user)):
    """
    Génère une collaboration via GPT en croisant les fiches et critères.
    Pour l'instant, squelette → à compléter avec OpenAI + Supabase.
    """
    fake_trame = (
        f"Trame générée pour âge {req.age}, "
        f"compétences {', '.join(req.competences)}, "
        f"ODD {', '.join(req.odd)}"
    )

    return {
        "id": str(uuid.uuid4()),
        "trame": fake_trame,
        "criteria": req.dict()
    }

@router.get("/", response_model=List[CollaborationResponse])
async def list_collaborations(user=Depends(get_current_user)):
    """
    Liste les collaborations de l'utilisateur.
    Pour l'instant retourne une liste vide.
    """
    return []
