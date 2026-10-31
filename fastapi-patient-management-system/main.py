from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from routers import patient

app = FastAPI(
    title="Patient Management System API",
    description="An API for managing patient records",
    version="1.0.0"
)

@app.get("/", include_in_schema=False)
def home():
    return RedirectResponse(url="/site/")

@app.get("/about")
def about():
    return {
        "message": "This is a website based on FastAPI"
    }

@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "message": "Patient Management API is running"
    }


app.include_router(patient.router)

# Serve the website (index.html, dashboard.html, css/, js/) at /site
app.mount("/site", StaticFiles(directory=str(Path(__file__).resolve().parent / "website"), html=True), name="site")
