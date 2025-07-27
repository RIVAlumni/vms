"""
RIVA VMS implemented in FastAPI for Uvicorn
"""

from typing import Optional
from datetime import datetime
from re import fullmatch
import logging
from contextlib import asynccontextmanager
import sqlite3 # To be changed to a SQL server for prod

from fastapi import FastAPI, Request, Form, Response, Cookie, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Startup and shutdown actions"""
    # startup action
    init_db()
    yield
    # shutdown action, if any


app = FastAPI(lifespan=lifespan)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

LOG_FMT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
logging.basicConfig(format=LOG_FMT, filename="visitor.log", level=logging.INFO, encoding='utf-8')

DB = "visitors.db"

def init_db():
    """Initialise database"""
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS visitors (
    nric TEXT PRIMARY KEY,
    fullname TEXT,
    phone TEXT,
    datetime TEXT,
    operator TEXT
    )''')
    conn.commit()
    conn.close()

def log_event(*args):
    """Logger"""
    logging.info(" - ".join(args))

# Route /favicon.ico to /static/favicon.ico
@app.get("/favicon.ico")
async def favicon():
    """Returns favicon"""
    return FileResponse("static/favicon.ico")

@app.get("/", response_class=HTMLResponse)
async def qr_generate(request: Request):
    """Default page
    Authenticated - show VMS entry form
    Unauthenticated - redirect to login
    """
    return templates.TemplateResponse("qrgen.html", {"request": request})



@app.get("/form", response_class=HTMLResponse)
async def form_page(request: Request, operator: Optional[str] = Cookie(default=None)):
    """Default page
    Authenticated - show VMS entry form
    Unauthenticated - redirect to login
    """
    if not operator:
        return RedirectResponse("/login")
    return templates.TemplateResponse("form.html", {"request": request, "operator": operator})

@app.get("/login", response_class=HTMLResponse)
async def login_form(request: Request):
    """Login page"""
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login")
async def login_post(request: Request, response: Response, operator: str = Form(...)):
    """Login submission handler
    Sets cookies for operator and login_time, logs the login"""
    response = RedirectResponse("/form", status_code=302)
    response.set_cookie(key="operator", value=operator)
    # Set login_time cookie as ISO datetime string
    response.set_cookie(key="login_time", value=datetime.now().isoformat())
    ip = request.client.host
    log_event(ip, operator, "Login")
    return response

@app.post("/submit")
async def submit(
    request: Request,
    fullname: str = Form(...),
    nric: str = Form(...),
    phone: str = Form(...),
    operator: Optional[str] = Cookie(default=None)
):
    """Submit visitor entry"""
    if not operator:
        return JSONResponse({"status": "ERROR", "msg": "Unauthorized"}, status_code=401)

    ip = request.client.host

    now = datetime.now().isoformat()
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute("SELECT * FROM visitors WHERE nric = ?", (nric, ))
    row = c.fetchone()
    if row:
        conn.close()
        log_event(ip, operator, f"Submit: nric {row[0]} fullname {row[1]} phone {row[2]} \
                  datetime {row[3]} operator {row[4]} FAIL")
        return {
            "status": "FAIL", 
            "nric": row[0], 
            "fullname": row[1], 
            "phone": row[2], 
            "datetime": row[3], 
            "operator": row[4]
        }

    # Validation
    if not fullmatch(r"\w\d{7}\w", nric):
        raise HTTPException(status_code=400, detail="Invalid NRIC")
    if not fullmatch(r"\d{8}", phone):
        raise HTTPException(status_code=400, detail="Invalid phone number")
    if len(fullname) > 66 or len(operator) > 66:
        raise HTTPException(status_code=400, detail="Name too long")

    c.execute("INSERT INTO visitors (nric, fullname, phone, datetime, operator) \
               VALUES (?, ?, ?, ?, ?)",
              (nric.upper(), fullname, phone, now, operator))
    log_event(ip, operator, f"Submit: nric {nric} fullname {fullname} phone {phone} \
               datetime {now} operator {operator} OK")
    conn.commit()
    conn.close()
    return {"status": "OK"}

@app.get("/search", response_class=HTMLResponse)
async def search_page(request: Request, operator: Optional[str] = Cookie(default=None)):
    """Search query page"""
    if not operator:
        return RedirectResponse("/login")
    return templates.TemplateResponse("search.html", {"request": request})

@app.get("/list")
async def list_visitors(
    request: Request,
    page: int = 1,
    nric: str = "",
    fullname: str = "",
    phone: str = "",
    time: str = "",
    opfilter: str = "",
    operator: Optional[str] = Cookie(default=None),
    limit: int = 50
):
    """Search query handler"""
    offset = (page - 1) * limit
    params = []
    query = "SELECT nric, fullname, phone, datetime, operator FROM visitors WHERE "
    count_query = "SELECT COUNT(nric) FROM visitors WHERE "
    where_clause = "1=1"

    if nric:
        where_clause += " AND nric LIKE ?"
        params.append(f"%{nric}%")
    if fullname:
        where_clause += " AND fullname LIKE ?"
        params.append(f"%{fullname}%")
    if phone:
        where_clause += " AND phone LIKE ?"
        params.append(f"%{phone}%")
    if time:
        where_clause += " AND datetime LIKE ?"
        params.append(f"%{time}%")
    if opfilter:
        where_clause += " AND operator LIKE ?"
        params.append(f"%{opfilter}%")

    query += where_clause
    query += f" ORDER BY datetime DESC LIMIT {limit} OFFSET ?"
    count_query += where_clause
    ip = request.client.host
    log_event(ip, operator, f"Query: {query}, Count Query: {count_query}, params: {params}")

    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute(count_query, params)
    count = c.fetchone()[0]
    params.append(offset)
    c.execute(query, params)
    rows = c.fetchall()
    conn.close()
    return {"rows": rows, "total_count": count}
