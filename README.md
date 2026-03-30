# Simple Blog — MERN Stack

A full-stack blog application built with the MERN stack (MongoDB, Express, React, Node.js). Features a modern, responsive UI with Markdown-powered content, role-based admin dashboard, image uploads, and production-ready security hardening.

## Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime environment |
| Express | 5.x | Web framework |
| MongoDB | 7+ | NoSQL database |
| Mongoose | 9.x | MongoDB ODM |
| JSON Web Token | 9.x | Authentication |
| bcryptjs | 3.x | Password hashing |
| Multer | 2.x | File upload handling |
| Helmet | 8.x | HTTP security headers |
| express-rate-limit | 8.x | Rate limiting |
| express-mongo-sanitize | 2.x | NoSQL injection prevention |
| compression | 1.x | Gzip response compression |
| slugify | 1.x | URL-friendly slugs |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI library |
| Vite | 8.x | Build tool & dev server |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| React Router | 7.x | Client-side routing |
| Axios | 1.x | HTTP client |
| react-markdown | 10.x | Markdown rendering |
| remark-gfm | 4.x | GitHub Flavored Markdown |
| react-syntax-highlighter | 16.x | Code block syntax highlighting |

## Features

- **Public Blog** — Browse posts, read full articles with rich Markdown rendering
- **SEO-Friendly Slugs** — Auto-generated URL slugs from post titles
- **Markdown Support** — Full GFM (GitHub Flavored Markdown) with syntax-highlighted code blocks, tables, task lists, and more
- **Admin Dashboard** — Create, edit, delete, and manage blog posts from a dedicated panel
- **Image Uploads** — Upload cover images for posts via Multer
- **Category & Tag System** — Organize posts with categories and tags, with dedicated filter endpoints
- **Authentication** — JWT-based login/register with httpOnly-ready token flow
- **Role-Based Access** — Admin role auto-assigned via `ADMIN_EMAIL` environment variable
- **Rate Limiting** — General API limiter (100 req/15 min) + stricter auth limiter (20 req/15 min)
- **Security Hardened** — Helmet, CORS, mongo-sanitize, request size limits
- **Lazy Loading** — React.lazy + Suspense for optimized page loading
- **Responsive UI** — Mobile-first design with Tailwind CSS
- **Reusable UI Kit** — Button, Input, Modal, Alert, Badge, Skeleton, Spinner, Toast components
- **Health Check** — `/api/health` endpoint for uptime monitoring

## Screenshots

> Add your screenshots here after deployment.

| Page | Screenshot |
|---|---|
| Home | ![Home Page](screenshots/home.png) |
| Post Detail | ![Post Detail](screenshots/post-detail.png) |
| Admin Dashboard | ![Admin Dashboard](screenshots/admin-dashboard.png) |
| Create Post | ![Create Post](screenshots/create-post.png) |
| Login | ![Login](screenshots/login.png) |

## Getting Started

### Prerequisites

- **Node.js** 18+ — [Download](https://nodejs.org/)
- **MongoDB** 7+ — Local install or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/<your-username>/simple-blog-mern.git
cd simple-blog-mern
```

2. **Install server dependencies**

```bash
cd server
npm install
```

3. **Install client dependencies**

```bash
cd ../client
npm install
```

4. **Configure environment variables**

Create `.env` files from the provided examples:

```bash
# Server
cp server/.env.example server/.env

# Client
cp client/.env.example client/.env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/simple-blog
JWT_SECRET=replace_with_a_strong_random_string
ADMIN_EMAIL=admin@example.com
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

5. **Run development servers**

Start the backend (from `server/`):

```bash
npm run dev
```

Start the frontend (from `client/`):

```bash
npm run dev
```

The client runs at `http://localhost:5173` and the API at `http://localhost:5000`.

## Admin Access

Admin privileges are controlled by the `ADMIN_EMAIL` environment variable in `server/.env`.

1. Set `ADMIN_EMAIL` to the desired admin email address.
2. Register a new account through the UI using that exact email.
3. The server automatically assigns the `admin` role to any user whose email matches `ADMIN_EMAIL`.
4. Admin users gain access to the `/admin` dashboard where they can create, edit, and delete posts.

> **Tip:** To change the admin, update `ADMIN_EMAIL` in `.env` and restart the server. The new admin must register (or already have an account) with that email.

## API Endpoints

### Authentication

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | None | Register a new user |
| `POST` | `/api/auth/login` | None | Login and receive JWT |
| `GET` | `/api/auth/me` | JWT | Get current user profile |

### Posts

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/posts` | None | List all published posts (with pagination, search, filters) |
| `GET` | `/api/posts/filters` | None | Get available filter options |
| `GET` | `/api/posts/:slug` | None | Get a single post by slug |
| `GET` | `/api/posts/id/:id` | JWT + Admin | Get a single post by ID (admin) |
| `POST` | `/api/posts` | JWT + Admin | Create a new post |
| `PUT` | `/api/posts/:id` | JWT + Admin | Update a post |
| `DELETE` | `/api/posts/:id` | JWT + Admin | Delete a post |

### Categories & Tags

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/categories` | None | List all categories |
| `GET` | `/api/categories/tags` | None | List all tags |

### Upload

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/upload` | JWT + Admin | Upload an image (multipart `image` field) |

### Utility

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | None | Health check |

> **Rate Limits:** All `/api/*` routes are limited to 100 requests per 15 minutes per IP. Auth routes (`/api/auth/*`) have a stricter limit of 20 requests per 15 minutes.

## Markdown Support

Blog post content supports full **GitHub Flavored Markdown (GFM)** including:

- **Headings** (h1–h6)
- **Bold**, *italic*, ~~strikethrough~~
- Ordered and unordered lists
- Task lists (`- [x] Done`)
- Tables with alignment
- Blockquotes
- Inline code and fenced code blocks with **syntax highlighting**
- Links and images
- Horizontal rules

Rendering is handled by `react-markdown` with the `remark-gfm` plugin and custom components for styled output and `react-syntax-highlighter` for code blocks.

## Security Features

This application implements multiple layers of security suitable for production:

| Feature | Implementation |
|---|---|
| **HTTP Security Headers** | Helmet.js with sensible defaults |
| **CORS** | Restricted to `CLIENT_URL` origin only |
| **Rate Limiting** | General (100/15min) + Auth-specific (20/15min) per IP |
| **NoSQL Injection Prevention** | express-mongo-sanitize strips `$` and `.` from input |
| **Password Hashing** | bcryptjs with salt rounds |
| **JWT Authentication** | Signed tokens with secret key verification |
| **Role-Based Authorization** | Admin-only middleware for sensitive operations |
| **Request Size Limiting** | JSON and URL-encoded bodies capped at 10KB |
| **Input Validation** | Server-side validation on all endpoints |
| **Response Compression** | Gzip compression via compression middleware |

## Deployment

### Backend — Render

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables in Render dashboard:
   - `MONGO_URI` — Your MongoDB Atlas connection string
   - `JWT_SECRET` — A strong random string
   - `ADMIN_EMAIL` — Admin email address
   - `CLIENT_URL` — Your Netlify deployment URL (e.g., `https://your-app.netlify.app`)
   - `NODE_ENV` — `production`
5. Deploy.

### Frontend — Netlify

1. Create a new site on [Netlify](https://www.netlify.com).
2. Connect your GitHub repository.
3. Configure:
   - **Base Directory:** `client`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `client/dist`
4. Add environment variable:
   - `VITE_API_URL` — Your Render backend URL with `/api` suffix (e.g., `https://your-api.onrender.com/api`)
5. The `netlify.toml` and `public/_redirects` files are already configured for SPA routing.
6. Deploy.

> **Important:** After deploying the backend, update the `CLIENT_URL` env var on Render to match your Netlify URL, and update `VITE_API_URL` on Netlify to match your Render URL.

## Project Structure

```
s4.3_Simple Blog Mern/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── api/             # Axios instance & config
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth & Toast context providers
│   │   ├── layouts/         # Page layout wrappers
│   │   ├── pages/           # Route-level page components
│   │   └── utils/           # Markdown components & helpers
│   ├── netlify.toml         # Netlify deploy config
│   └── vite.config.js       # Vite configuration
├── server/                  # Express backend
│   ├── src/
│   │   ├── config/          # DB connection & Multer setup
│   │   ├── controllers/     # Route handler logic
│   │   ├── middlewares/      # Auth, admin, error handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API route definitions
│   │   └── utils/           # Helper functions
│   └── requests.http        # API test requests
└── README.md
```

## License

This project is licensed under the [MIT License](LICENSE).
