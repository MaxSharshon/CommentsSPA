# CommentsSPA

**CommentsSPA** is a web application for creating and viewing comments with support for replies, CAPTCHA protection, and comment sorting/pagination. The project includes a backend built with ASP.NET Core and a frontend built with React (Vite) using Chakra UI and Tailwind CSS.

---

## **Features**

- Create and view comments and replies
- CAPTCHA protection to prevent spam
- Comment sorting and pagination
- File upload support (backend implemented, frontend integration planned)

---

## **Technologies**

**Backend:**
- ASP.NET Core
- Entity Framework Core
- AutoMapper
- FluentValidation
- SixLabors.ImageSharp (for image processing)

**Frontend:**
- Vite + React
- Chakra UI
- Tailwind CSS

**Other:**
- Docker Compose for running backend, frontend, and database together
- `.env` file for storing database credentials and connection strings

---

## **Setup and Run**

1. Clone the repository:
```bash
git clone https://github.com/MaxSharshon/CommentsSPA
cd CommentsSPA
```

2. Create `.env` file in the project root with the following variables:
```.env
MSSQL_SA_PASSWORD=your_strong_password
API_CONNECTION=your_connection_string
```

3. Start all services using Docker Compose:
```bash
docker-compose up --build 
```

This will start three services:
- `api` - ASP.NET Core backend
- `db` - SQL Server database
- `frontend` - React frontend

> Access the backend at `http://localhost:5000`

> Access the frontend at `http://localhost:3000`

---

## **API Endpoints**

### Comments

- `POST /api/comments` — create a new comment
- `GET /api/comments/{id}` — get a comment by ID
- `GET /api/comments/top` — get top comments (with pagination)
- `GET /api/comments/{id}/replies` — get replies for a comment

### CAPTCHA

- `GET /api/captcha/generate` — generate a new CAPTCHA (returns base64 image and captchaId)
- `GET /api/captcha/generate-image` — generate CAPTCHA as PNG image
- `GET /api/captcha/refresh?captchaId=<id>` — refresh an existing CAPTCHA

### File Upload

- `POST /api/uploads` - upload a file

---

## **Future Improvements**

- Integrate file upload in the frontend
- Improve UX for comments and replies
- Server-side HTML tag validation and enhanced security