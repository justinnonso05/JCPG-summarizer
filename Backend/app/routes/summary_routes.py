from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Summary, User
from app.services import summarizer
from app.utils.auth import decode_access_token
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security = HTTPBearer()

router = APIRouter()

@router.post("/summarize")
async def summarize(
    url: str,
    authorization: Optional[str] = Header(None),  # Make authentication optional
    db: Session = Depends(get_db)
):
    summarized_text = await summarizer.summarize_text(url)
    user_email = None

    # If authorization header is provided, try to decode it
    if authorization:
        try:
            token = authorization.split("Bearer ")[1]  # Extract the token
            payload = decode_access_token(token)
            user_email = payload.get("sub")
        except (IndexError, HTTPException):
            pass  # Invalid token, but don't raise an error

    # If authenticated, store the summary in DB
    if user_email:
        user = db.query(User).filter(User.email == user_email).first()
        if user:
            new_summary = Summary(url=url, content=summarized_text, user_id=user.id)
            db.add(new_summary)
            db.commit()
            db.refresh(new_summary)

    return {
        "url": url,
        "summary": summarized_text
    }

@router.get("/my-summaries")
async def my_summaries(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    user_email = None

    try:
        payload = decode_access_token(token)
        user_email = payload.get("sub")
    except HTTPException:
        pass

    if user_email:
        user = db.query(User).filter(User.email == user_email).first()
        if user:
            summaries = db.query(Summary).filter(Summary.user_id == user.id).all()
            return summaries

    return HTTPException(status_code=404, detail="User not found")