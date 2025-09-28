from fastapi import APIRouter

router = APIRouter(tags=["Health"])

@router.get("/health")
async def healthcheck():
    """
    Vérifie la connectivité avec Supabase, Google, EmailJS, OpenAI.
    Pour l’instant renvoie des valeurs fictives.
    """
    status = {
        "supabase": "ok",   # TODO: remplacer par un vrai ping Supabase
        "google": "todo",
        "emailjs": "todo",
        "openai": "todo"
    }
    return {"status": status}
