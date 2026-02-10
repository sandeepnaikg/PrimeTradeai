# from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from dotenv import load_dotenv
# from starlette.middleware.cors import CORSMiddleware
# from motor.motor_asyncio import AsyncIOMotorClient
# import os
# import logging
# from pathlib import Path
# from pydantic import BaseModel, Field, ConfigDict, EmailStr
# from typing import List, Optional
# from datetime import datetime, timezone, timedelta
# from passlib.context import CryptContext
# from jose import JWTError, jwt

# ROOT_DIR = Path(__file__).parent
# load_dotenv(ROOT_DIR / '.env')

# # MongoDB connection
# mongo_url = os.environ['MONGO_URL']
# client = AsyncIOMotorClient(mongo_url)
# db = client[os.environ['DB_NAME']]

# # Security
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production-12345678')
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# security = HTTPBearer()

# # Create the main app without a prefix
# app = FastAPI()

# # Create a router with the /api prefix
# api_router = APIRouter(prefix="/api")

# # Helper Functions
# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)

# def get_password_hash(password):
#     return pwd_context.hash(password)

# def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.now(timezone.utc) + expires_delta
#     else:
#         expire = datetime.now(timezone.utc) + timedelta(minutes=15)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt

# async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
#     try:
#         token = credentials.credentials
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email: str = payload.get("sub")
#         if email is None:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Could not validate credentials",
#                 headers={"WWW-Authenticate": "Bearer"},
#             )
#     except JWTError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Could not validate credentials",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
    
#     user = await db.users.find_one({"email": email}, {"_id": 0})
#     if user is None:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Could not validate credentials",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     return user

# # Models
# class UserRegister(BaseModel):
#     name: str
#     email: EmailStr
#     password: str

# class UserLogin(BaseModel):
#     email: EmailStr
#     password: str

# class UserResponse(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     email: str
#     name: str
#     created_at: str

# class UserUpdate(BaseModel):
#     name: Optional[str] = None

# class Token(BaseModel):
#     access_token: str
#     token_type: str
#     user: UserResponse

# class TaskCreate(BaseModel):
#     title: str
#     description: Optional[str] = None
#     status: str = "pending"
#     priority: str = "medium"

# class TaskUpdate(BaseModel):
#     title: Optional[str] = None
#     description: Optional[str] = None
#     status: Optional[str] = None
#     priority: Optional[str] = None

# class Task(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str
#     title: str
#     description: Optional[str] = None
#     status: str
#     priority: str
#     user_email: str
#     created_at: str
#     updated_at: str

# # Auth Routes
# @api_router.post("/auth/register", response_model=Token)
# async def register(user: UserRegister):
#     # Check if user exists
#     existing_user = await db.users.find_one({"email": user.email})
#     if existing_user:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Email already registered"
#         )
    
#     # Hash password
#     hashed_password = get_password_hash(user.password)
    
#     # Create user document
#     user_doc = {
#         "email": user.email,
#         "name": user.name,
#         "password": hashed_password,
#         "created_at": datetime.now(timezone.utc).isoformat()
#     }
    
#     await db.users.insert_one(user_doc)
    
#     # Create access token
#     access_token = create_access_token(
#         data={"sub": user.email},
#         expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     )
    
#     user_response = UserResponse(
#         email=user.email,
#         name=user.name,
#         created_at=user_doc["created_at"]
#     )
    
#     return Token(
#         access_token=access_token,
#         token_type="bearer",
#         user=user_response
#     )

# @api_router.post("/auth/login", response_model=Token)
# async def login(user_login: UserLogin):
#     # Find user
#     user = await db.users.find_one({"email": user_login.email})
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password"
#         )
    
#     # Verify password
#     if not verify_password(user_login.password, user["password"]):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password"
#         )
    
#     # Create access token
#     access_token = create_access_token(
#         data={"sub": user["email"]},
#         expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     )
    
#     user_response = UserResponse(
#         email=user["email"],
#         name=user["name"],
#         created_at=user["created_at"]
#     )
    
#     return Token(
#         access_token=access_token,
#         token_type="bearer",
#         user=user_response
#     )

# @api_router.get("/auth/profile", response_model=UserResponse)
# async def get_profile(current_user: dict = Depends(get_current_user)):
#     return UserResponse(
#         email=current_user["email"],
#         name=current_user["name"],
#         created_at=current_user["created_at"]
#     )

# @api_router.put("/auth/profile", response_model=UserResponse)
# async def update_profile(
#     user_update: UserUpdate,
#     current_user: dict = Depends(get_current_user)
# ):
#     update_data = {}
#     if user_update.name:
#         update_data["name"] = user_update.name
    
#     if update_data:
#         await db.users.update_one(
#             {"email": current_user["email"]},
#             {"$set": update_data}
#         )
    
#     updated_user = await db.users.find_one({"email": current_user["email"]}, {"_id": 0})
    
#     return UserResponse(
#         email=updated_user["email"],
#         name=updated_user["name"],
#         created_at=updated_user["created_at"]
#     )

# # Task Routes
# @api_router.post("/tasks", response_model=Task)
# async def create_task(
#     task: TaskCreate,
#     current_user: dict = Depends(get_current_user)
# ):
#     import uuid
    
#     task_doc = {
#         "id": str(uuid.uuid4()),
#         "title": task.title,
#         "description": task.description,
#         "status": task.status,
#         "priority": task.priority,
#         "user_email": current_user["email"],
#         "created_at": datetime.now(timezone.utc).isoformat(),
#         "updated_at": datetime.now(timezone.utc).isoformat()
#     }
    
#     await db.tasks.insert_one(task_doc)
    
#     return Task(**task_doc)

# @api_router.get("/tasks", response_model=List[Task])
# async def get_tasks(
#     search: Optional[str] = None,
#     status: Optional[str] = None,
#     priority: Optional[str] = None,
#     current_user: dict = Depends(get_current_user)
# ):
#     query = {"user_email": current_user["email"]}
    
#     if search:
#         query["$or"] = [
#             {"title": {"$regex": search, "$options": "i"}},
#             {"description": {"$regex": search, "$options": "i"}}
#         ]
    
#     if status:
#         query["status"] = status
    
#     if priority:
#         query["priority"] = priority
    
#     tasks = await db.tasks.find(query, {"_id": 0}).to_list(1000)
    
#     return [Task(**task) for task in tasks]

# @api_router.get("/tasks/{task_id}", response_model=Task)
# async def get_task(
#     task_id: str,
#     current_user: dict = Depends(get_current_user)
# ):
#     task = await db.tasks.find_one(
#         {"id": task_id, "user_email": current_user["email"]},
#         {"_id": 0}
#     )
    
#     if not task:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Task not found"
#         )
    
#     return Task(**task)

# @api_router.put("/tasks/{task_id}", response_model=Task)
# async def update_task(
#     task_id: str,
#     task_update: TaskUpdate,
#     current_user: dict = Depends(get_current_user)
# ):
#     # Check if task exists and belongs to user
#     task = await db.tasks.find_one(
#         {"id": task_id, "user_email": current_user["email"]}
#     )
    
#     if not task:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Task not found"
#         )
    
#     update_data = {"updated_at": datetime.now(timezone.utc).isoformat()}
    
#     if task_update.title is not None:
#         update_data["title"] = task_update.title
#     if task_update.description is not None:
#         update_data["description"] = task_update.description
#     if task_update.status is not None:
#         update_data["status"] = task_update.status
#     if task_update.priority is not None:
#         update_data["priority"] = task_update.priority
    
#     await db.tasks.update_one(
#         {"id": task_id},
#         {"$set": update_data}
#     )
    
#     updated_task = await db.tasks.find_one({"id": task_id}, {"_id": 0})
    
#     return Task(**updated_task)

# @api_router.delete("/tasks/{task_id}")
# async def delete_task(
#     task_id: str,
#     current_user: dict = Depends(get_current_user)
# ):
#     result = await db.tasks.delete_one(
#         {"id": task_id, "user_email": current_user["email"]}
#     )
    
#     if result.deleted_count == 0:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Task not found"
#         )
    
#     return {"message": "Task deleted successfully"}

# # Include the router in the main app
# app.include_router(api_router)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],   # 🔥 allow all during development
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Configure logging
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
# )
# logger = logging.getLogger(__name__)

# @app.on_event("shutdown")
# async def shutdown_db_client():
#     client.close()
    
    
from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import uuid

# ================= ENV =================
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.getenv("MONGO_URL", "mongodb://127.0.0.1:27017")
DB_NAME = os.getenv("DB_NAME", "primeTrade")
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")

# ================= DB =================
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ================= SECURITY =================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

security = HTTPBearer()

# ================= APP =================
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ================= HELPERS =================
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password[:72], hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password[:72])

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta if expires_delta else timedelta(minutes=15)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise Exception()
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return user

# ================= MODELS =================
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    email: str
    name: str
    created_at: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class UserUpdate(BaseModel):
    name: Optional[str] = None

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "pending"
    priority: str = "medium"

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None

class Task(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    user_email: str
    created_at: str
    updated_at: str

# ================= AUTH =================
@api_router.post("/auth/register", response_model=Token)
async def register(user: UserRegister):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "email": user.email,
        "name": user.name,
        "password": get_password_hash(user.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    await db.users.insert_one(user_doc)

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            email=user.email,
            name=user.name,
            created_at=user_doc["created_at"],
        ),
    )

@api_router.post("/auth/login", response_model=Token)
async def login(user_login: UserLogin):
    user = await db.users.find_one({"email": user_login.email})
    if not user or not verify_password(user_login.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token = create_access_token(
        data={"sub": user["email"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            email=user["email"],
            name=user["name"],
            created_at=user["created_at"],
        ),
    )

@api_router.get("/auth/profile", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        email=current_user["email"],
        name=current_user["name"],
        created_at=current_user["created_at"]
    )

@api_router.put("/auth/profile", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    update_data = {}
    if user_update.name:
        update_data["name"] = user_update.name
    
    if update_data:
        await db.users.update_one(
            {"email": current_user["email"]},
            {"$set": update_data}
        )
    
    updated_user = await db.users.find_one({"email": current_user["email"]}, {"_id": 0})
    
    return UserResponse(
        email=updated_user["email"],
        name=updated_user["name"],
        created_at=updated_user["created_at"]
    )

# ================= TASK ROUTES =================
@api_router.post("/tasks", response_model=Task)
async def create_task(
    task: TaskCreate,
    current_user: dict = Depends(get_current_user)
):
    task_doc = {
        "id": str(uuid.uuid4()),
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "priority": task.priority,
        "user_email": current_user["email"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.tasks.insert_one(task_doc)
    
    return Task(**task_doc)

@api_router.get("/tasks", response_model=List[Task])
async def get_tasks(
    search: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    query = {"user_email": current_user["email"]}
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    if status:
        query["status"] = status
    
    if priority:
        query["priority"] = priority
    
    tasks = await db.tasks.find(query, {"_id": 0}).to_list(1000)
    
    return [Task(**task) for task in tasks]

@api_router.get("/tasks/{task_id}", response_model=Task)
async def get_task(
    task_id: str,
    current_user: dict = Depends(get_current_user)
):
    task = await db.tasks.find_one(
        {"id": task_id, "user_email": current_user["email"]},
        {"_id": 0}
    )
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return Task(**task)

@api_router.put("/tasks/{task_id}", response_model=Task)
async def update_task(
    task_id: str,
    task_update: TaskUpdate,
    current_user: dict = Depends(get_current_user)
):
    # Check if task exists and belongs to user
    task = await db.tasks.find_one(
        {"id": task_id, "user_email": current_user["email"]}
    )
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    update_data = {"updated_at": datetime.now(timezone.utc).isoformat()}
    
    if task_update.title is not None:
        update_data["title"] = task_update.title
    if task_update.description is not None:
        update_data["description"] = task_update.description
    if task_update.status is not None:
        update_data["status"] = task_update.status
    if task_update.priority is not None:
        update_data["priority"] = task_update.priority
    
    await db.tasks.update_one(
        {"id": task_id},
        {"$set": update_data}
    )
    
    updated_task = await db.tasks.find_one({"id": task_id}, {"_id": 0})
    
    return Task(**updated_task)

@api_router.delete("/tasks/{task_id}")
async def delete_task(
    task_id: str,
    current_user: dict = Depends(get_current_user)
):
    result = await db.tasks.delete_one(
        {"id": task_id, "user_email": current_user["email"]}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return {"message": "Task deleted successfully"}

# ================= ROUTES =================
app.include_router(api_router)

# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= LOGGING =================
logging.basicConfig(level=logging.INFO)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()