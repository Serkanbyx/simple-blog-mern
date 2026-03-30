require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { version } = require('../package.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

// Security middleware stack (order matters)
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(compression());

// General rate limiter — 100 requests per 15 min per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Root welcome page
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple Blog MERN API</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{
      min-height:100vh;display:flex;align-items:center;justify-content:center;
      font-family:Georgia,'Times New Roman',serif;
      color:#2c1810;
      background:#faf8f5;
      background-image:
        repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(139,94,60,.03) 28px,rgba(139,94,60,.03) 29px),
        radial-gradient(ellipse at 20% 50%,rgba(196,149,106,.08) 0%,transparent 60%),
        radial-gradient(ellipse at 80% 50%,rgba(196,149,106,.05) 0%,transparent 60%);
    }
    .container{
      text-align:center;padding:3rem 2rem;position:relative;
      max-width:500px;width:100%;
    }
    .container::before{
      content:'\\201C';position:absolute;top:-20px;left:10%;
      font-size:8rem;color:rgba(139,94,60,.08);line-height:1;
    }
    .container::after{
      content:'\\201D';position:absolute;bottom:-40px;right:10%;
      font-size:8rem;color:rgba(139,94,60,.08);line-height:1;
    }
    h1{
      font-size:2.5rem;font-weight:700;letter-spacing:.06em;
      color:#2c1810;text-shadow:0 1px 2px rgba(44,24,16,.1);
      margin-bottom:.5rem;
    }
    h1::after{
      content:'';display:block;width:60px;height:3px;
      background:linear-gradient(90deg,transparent,#8b5e3c,transparent);
      margin:.75rem auto 0;border-radius:2px;
    }
    .version{
      font-size:.95rem;color:#8b5e3c;font-style:italic;
      margin-bottom:2rem;letter-spacing:.05em;
    }
    .links{
      display:flex;flex-wrap:wrap;gap:1rem;
      justify-content:center;margin-bottom:2.5rem;
    }
    .btn-primary{
      display:inline-block;padding:.75rem 1.75rem;border-radius:2rem;
      text-decoration:none;font-family:Georgia,serif;font-size:.9rem;
      letter-spacing:.03em;transition:all .3s ease;
      background:#8b5e3c;color:#faf8f5;
      box-shadow:0 2px 8px rgba(139,94,60,.25);
    }
    .btn-primary:hover{
      background:#6f4a2e;transform:translateY(-2px);
      box-shadow:0 4px 16px rgba(139,94,60,.35);
    }
    .sign{font-size:.85rem;color:#a08068;font-style:italic}
    .sign a{color:#8b5e3c;text-decoration:none;transition:color .2s ease}
    .sign a:hover{color:#6f4a2e;text-decoration:underline}
  </style>
</head>
<body>
  <div class="container">
    <h1>Simple Blog MERN</h1>
    <p class="version">v${version}</p>
    <div class="links">
      <a href="/api/health" class="btn-primary">Health Check</a>
    </div>
    <footer class="sign">
      Created by
      <a href="https://serkanbayraktar.com/" target="_blank" rel="noopener noreferrer">Serkanby</a>
      |
      <a href="https://github.com/Serkanbyx" target="_blank" rel="noopener noreferrer">Github</a>
    </footer>
  </div>
</body>
</html>`);
});

// Routes
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Global error handler (must be last middleware)
app.use(errorHandler);

// Connect to MongoDB, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
