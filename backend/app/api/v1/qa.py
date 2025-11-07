"""Q&A API endpoints for document-based questions."""
from typing import List
from fastapi import APIRouter, Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter(prefix="/qa", tags=["qa"])


class QARequest(BaseModel):
    """Q&A request schema."""
    question: str
    context_tickers: List[str] = []
    include_filings: bool = True
    include_news: bool = True


class QAResponse(BaseModel):
    """Q&A response schema."""
    question: str
    answer: str
    sources: List[dict] = []
    confidence: float


@router.post("/ask", response_model=dict)
async def ask_question(
    request: QARequest = Body(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Ask a question about financial documents.
    
    Args:
        request: Q&A request parameters
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Answer with sources
    """
    # Stub implementation - returns mock data
    return {
        "question": request.question,
        "answer": "Based on the available financial documents, the company showed strong performance in Q4 2023 with revenue growth of 15% year-over-year.",
        "sources": [
            {
                "type": "filing",
                "title": "Q4 2023 10-Q Filing",
                "url": "https://example.com/filing/123",
                "relevance": 0.95
            }
        ],
        "confidence": 0.92
    }


@router.get("/history", response_model=list)
async def get_qa_history(
    limit: int = 50,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get Q&A history for current user.
    
    Args:
        limit: Maximum number of results
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Q&A history
    """
    # Stub implementation - returns mock data
    return [
        {
            "id": 1,
            "question": "What was the revenue in Q4?",
            "answer": "The revenue in Q4 was $50 million.",
            "timestamp": "2024-01-15T10:30:00Z"
        }
    ]
