from fastapi import FastAPI
from sqlalchemy.orm import Session
from app.database import init_db
from app.routes import summary_routes, user_routes
from fastapi.security import APIKeyHeader, OAuth2PasswordBearer

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.on_event("startup")
def startup():
    init_db()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI with SQLite!"}

# Include routers
app.include_router(user_routes.router, prefix="/users", tags=["Users"])
app.include_router(summary_routes.router, prefix="/api", tags=["Summaries"])
