from fastapi import FastAPI
from routes import collaborations, health

app = FastAPI(
    title="Collaborative Lab – Äerdschëff",
    version="0.1.0"
)

# Inclure les routes
app.include_router(collaborations.router)
app.include_router(health.router)

@app.get("/")
async def root():
    return {"message": "Backend API Collaborative Lab – Äerdschëff active"}
