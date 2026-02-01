# Uptrade Backend - Main Application
# FastAPI server with TradeX comparison engine

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Create FastAPI app
app = FastAPI(
    title="Uptrade API",
    description="AI-Powered Financial Analysis & Trading Intelligence",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers
from api.tradex_router import router as tradex_router
app.include_router(tradex_router)


@app.get("/")
async def root():
    return {
        "name": "Uptrade API",
        "version": "1.0.0",
        "endpoints": {
            "tradex": "/tradex",
            "docs": "/docs",
            "health": "/tradex/health"
        }
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
