const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const Post = require("./models/Post");
const User = require("./models/User");

const POSTS = [
  {
    title: "JavaScript ES2024: Modern Features Every Developer Should Know",
    content: `JavaScript keeps evolving at a rapid pace. With ES2024 and recent additions, the language has become more powerful and expressive than ever. Let's explore the most impactful modern features.

## Temporal API

The long-awaited **Temporal API** is finally here, replacing the notoriously tricky \`Date\` object:

\`\`\`javascript
const now = Temporal.Now.plainDateTimeISO();
const meeting = Temporal.PlainDateTime.from('2026-04-15T14:30:00');

const duration = now.until(meeting);
console.log(\`Meeting in \${duration.days} days and \${duration.hours} hours\`);
\`\`\`

## Array Grouping

\`Object.groupBy()\` simplifies data categorization:

\`\`\`javascript
const products = [
  { name: 'Laptop', category: 'electronics', price: 999 },
  { name: 'Shirt', category: 'clothing', price: 29 },
  { name: 'Phone', category: 'electronics', price: 699 },
];

const grouped = Object.groupBy(products, (item) => item.category);
// { electronics: [...], clothing: [...] }
\`\`\`

## Promise.withResolvers()

No more awkward promise constructor patterns:

\`\`\`javascript
const { promise, resolve, reject } = Promise.withResolvers();

setTimeout(() => resolve('Done!'), 2000);
const result = await promise;
\`\`\`

## Pattern Matching (Proposal)

Although still a proposal, pattern matching will revolutionize conditional logic:

\`\`\`javascript
const response = match (status) {
  when (200) -> 'OK',
  when (404) -> 'Not Found',
  when (500) -> 'Server Error',
};
\`\`\`

## Records and Tuples

Immutable data structures are coming natively:

\`\`\`javascript
const point = #{ x: 10, y: 20 };
const coords = #[1, 2, 3];

// Deep equality comparison works out of the box
#{ x: 10 } === #{ x: 10 }; // true
\`\`\`

## Decorators

Class decorators bring metaprogramming elegance:

\`\`\`javascript
function logged(value, context) {
  return function (...args) {
    console.log(\`Calling \${context.name}\`);
    return value.call(this, ...args);
  };
}

class Calculator {
  @logged
  add(a, b) {
    return a + b;
  }
}
\`\`\`

## Key Takeaway

Modern JavaScript is closing the gap with languages like Python and Rust in terms of expressiveness. Staying updated with these features not only improves code quality but also developer productivity.

> The best time to learn modern JavaScript was yesterday. The second best time is today.`,
    category: "JavaScript",
    tags: ["javascript", "es2024", "web development"],
  },
  {
    title: "React 19: Server Components, Actions, and the New Mental Model",
    content: `React 19 represents a paradigm shift in how we build user interfaces. With Server Components, Server Actions, and a revamped data-fetching strategy, the framework has fundamentally changed.

## The Server Component Revolution

Server Components run **only on the server**, sending rendered HTML to the client without any JavaScript bundle cost:

\`\`\`jsx
// This component never ships JS to the browser
async function BlogPosts() {
  const posts = await db.posts.findMany();

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
\`\`\`

The key benefit: **zero client-side JavaScript** for data-fetching components.

## Server Actions

Form handling has been completely reimagined:

\`\`\`jsx
async function createPost(formData) {
  'use server';

  const title = formData.get('title');
  const content = formData.get('content');

  await db.posts.create({ title, content });
  revalidatePath('/blog');
}

function NewPostForm() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Publish</button>
    </form>
  );
}
\`\`\`

## The \`use\` Hook

A unified primitive for consuming async resources:

\`\`\`jsx
function UserProfile({ userPromise }) {
  const user = use(userPromise);

  return <h1>{user.name}</h1>;
}
\`\`\`

## Improved Metadata Management

\`\`\`jsx
function BlogPost({ post }) {
  return (
    <>
      <title>{post.title} | My Blog</title>
      <meta name="description" content={post.excerpt} />
      <article>{post.content}</article>
    </>
  );
}
\`\`\`

## useOptimistic for Better UX

\`\`\`jsx
function LikeButton({ postId, initialLikes }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (state) => state + 1
  );

  async function handleLike() {
    addOptimisticLike();
    await likePost(postId);
  }

  return <button onClick={handleLike}>{optimisticLikes} Likes</button>;
}
\`\`\`

## Migration Strategy

Moving to React 19 doesn't have to be painful. Start by:

1. Updating dependencies gradually
2. Converting leaf components to Server Components first
3. Replacing \`useEffect\` data-fetching with server-side patterns
4. Adopting Server Actions for form mutations

React 19 is not just an update — it's a new way of thinking about the relationship between server and client.`,
    category: "React",
    tags: ["react", "server components", "frontend"],
  },
  {
    title: "Node.js Performance: From Good to Blazingly Fast",
    content: `Building a Node.js application that works is one thing. Building one that handles thousands of requests per second efficiently is another. Let's dive into battle-tested performance optimization techniques.

## Event Loop Understanding

The single-threaded event loop is both Node's greatest strength and its Achilles heel:

\`\`\`javascript
// BAD: Blocks the event loop
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

app.get('/fib/:n', (req, res) => {
  const result = fibonacci(parseInt(req.params.n));
  res.json({ result });
});

// GOOD: Offload to worker thread
const { Worker } = require('worker_threads');

app.get('/fib/:n', (req, res) => {
  const worker = new Worker('./fibonacci-worker.js', {
    workerData: { n: parseInt(req.params.n) },
  });

  worker.on('message', (result) => res.json({ result }));
  worker.on('error', (err) => res.status(500).json({ error: err.message }));
});
\`\`\`

## Stream Processing

Never load entire files into memory:

\`\`\`javascript
const { pipeline } = require('stream/promises');
const { createReadStream } = require('fs');
const { createGzip } = require('zlib');

app.get('/download/:file', async (req, res) => {
  res.setHeader('Content-Encoding', 'gzip');

  await pipeline(
    createReadStream(\`./files/\${req.params.file}\`),
    createGzip(),
    res
  );
});
\`\`\`

## Connection Pooling

Database connections are expensive to create:

\`\`\`javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: 50,
  minPoolSize: 10,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
});
\`\`\`

## Caching Strategies

Implement multi-layer caching:

\`\`\`javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

async function getCachedData(key, fetchFunction) {
  const cached = cache.get(key);
  if (cached) return cached;

  const fresh = await fetchFunction();
  cache.set(key, fresh);
  return fresh;
}

app.get('/api/posts', async (req, res) => {
  const posts = await getCachedData('all-posts', () =>
    Post.find().sort({ createdAt: -1 }).lean()
  );
  res.json(posts);
});
\`\`\`

## Clustering

Utilize all CPU cores:

\`\`\`javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(\`Worker \${worker.process.pid} died. Spawning replacement.\`);
    cluster.fork();
  });
} else {
  require('./server');
}
\`\`\`

## Benchmarking Results

After applying these optimizations to a real-world API:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Requests/sec | 1,200 | 8,500 | 7x |
| P99 Latency | 450ms | 35ms | 13x |
| Memory Usage | 512MB | 180MB | 2.8x |

Performance is not a luxury — it's a responsibility to your users.`,
    category: "Node.js",
    tags: ["nodejs", "performance", "backend"],
  },
  {
    title: "CSS Architecture: Building Scalable and Maintainable Stylesheets",
    content: `CSS at scale is one of the hardest challenges in frontend development. Without a solid architecture, stylesheets quickly become an unmanageable spaghetti of overrides and specificity battles.

## The Specificity Problem

Every CSS developer has encountered this:

\`\`\`css
/* Developer A writes */
.card .title { color: blue; }

/* Developer B, frustrated, writes */
.card .title { color: red !important; }

/* Developer C gives up on life */
#main .card .title { color: green !important; }
\`\`\`

This escalation is a sign of architectural failure, not a technical limitation.

## Modern CSS Custom Properties

CSS Variables (Custom Properties) enable true theming:

\`\`\`css
:root {
  --color-primary: #3b82f6;
  --color-surface: #ffffff;
  --color-text: #1f2937;
  --spacing-unit: 0.25rem;
  --radius-md: 0.5rem;
  --shadow-card: 0 1px 3px rgb(0 0 0 / 0.12);
}

[data-theme='dark'] {
  --color-primary: #60a5fa;
  --color-surface: #1e293b;
  --color-text: #f1f5f9;
  --shadow-card: 0 1px 3px rgb(0 0 0 / 0.4);
}

.card {
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: calc(var(--spacing-unit) * 6);
}
\`\`\`

## Container Queries

The game-changer for component-based design:

\`\`\`css
.card-container {
  container-type: inline-size;
  container-name: card;
}

.card {
  display: grid;
  gap: 1rem;
}

@container card (min-width: 400px) {
  .card {
    grid-template-columns: 200px 1fr;
  }
}

@container card (min-width: 700px) {
  .card {
    grid-template-columns: 300px 1fr auto;
  }
}
\`\`\`

## Logical Properties

Write layout-agnostic CSS:

\`\`\`css
.element {
  /* Instead of margin-left and margin-right */
  margin-inline: auto;

  /* Instead of padding-top and padding-bottom */
  padding-block: 2rem;

  /* Instead of border-bottom */
  border-block-end: 1px solid var(--color-border);
}
\`\`\`

## The \`:has()\` Selector

CSS finally has a parent selector:

\`\`\`css
/* Style a card differently when it contains an image */
.card:has(img) {
  grid-template-rows: 200px 1fr;
}

/* Style label when its input is focused */
label:has(+ input:focus) {
  color: var(--color-primary);
  font-weight: 600;
}

/* Empty state handling */
.list:has(> :last-child:first-child) {
  display: flex;
  justify-content: center;
}
\`\`\`

## Nesting (Native CSS)

No more preprocessors needed for nesting:

\`\`\`css
.navigation {
  display: flex;
  gap: 1rem;

  & a {
    text-decoration: none;
    color: var(--color-text);

    &:hover {
      color: var(--color-primary);
    }

    &.active {
      font-weight: 700;
      border-bottom: 2px solid currentColor;
    }
  }
}
\`\`\`

## Architecture Principles

1. **Token-first**: Define design tokens as custom properties
2. **Component-scoped**: Each component owns its styles
3. **Composition over inheritance**: Use utility classes for variations
4. **Progressive enhancement**: Start with semantic HTML

Modern CSS is incredibly powerful. The tooling gap between CSS and preprocessors is nearly closed.`,
    category: "CSS",
    tags: ["css", "frontend", "web design"],
  },
  {
    title: "MongoDB Aggregation Pipeline: Mastering Data Transformation",
    content: `MongoDB's Aggregation Pipeline is one of its most powerful features, yet many developers barely scratch the surface. Let's explore advanced patterns that can replace complex application-level data processing.

## Pipeline Fundamentals

Think of aggregation as an assembly line — each stage transforms the data before passing it to the next:

\`\`\`javascript
const result = await Post.aggregate([
  { $match: { category: 'technology' } },
  { $sort: { createdAt: -1 } },
  { $limit: 10 },
  { $project: { title: 1, excerpt: 1, createdAt: 1 } },
]);
\`\`\`

## Faceted Search

Build complex filter + pagination + count in a single query:

\`\`\`javascript
const [result] = await Post.aggregate([
  {
    $facet: {
      metadata: [
        { $count: 'totalCount' },
      ],
      data: [
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
            pipeline: [{ $project: { username: 1 } }],
          },
        },
        { $unwind: '$author' },
      ],
      categories: [
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ],
    },
  },
]);
\`\`\`

## Time-Series Analytics

Generate blog analytics by month:

\`\`\`javascript
const analytics = await Post.aggregate([
  {
    $group: {
      _id: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
      },
      postCount: { $sum: 1 },
      avgReadingTime: { $avg: '$readingTime' },
      categories: { $addToSet: '$category' },
    },
  },
  { $sort: { '_id.year': -1, '_id.month': -1 } },
  {
    $project: {
      period: {
        $concat: [
          { $toString: '$_id.year' },
          '-',
          {
            $cond: [
              { $lt: ['$_id.month', 10] },
              { $concat: ['0', { $toString: '$_id.month' }] },
              { $toString: '$_id.month' },
            ],
          },
        ],
      },
      postCount: 1,
      avgReadingTime: { $round: ['$avgReadingTime', 1] },
      uniqueCategories: { $size: '$categories' },
    },
  },
]);
\`\`\`

## Text Search with Scoring

\`\`\`javascript
// First, create a text index
// postSchema.index({ title: 'text', content: 'text' });

const searchResults = await Post.aggregate([
  {
    $match: {
      $text: { $search: 'javascript performance optimization' },
    },
  },
  {
    $addFields: {
      relevanceScore: { $meta: 'textScore' },
    },
  },
  { $sort: { relevanceScore: -1 } },
  { $limit: 20 },
]);
\`\`\`

## $lookup with Pipeline (Joins)

Complex joins with filtering:

\`\`\`javascript
const authorsWithStats = await User.aggregate([
  {
    $lookup: {
      from: 'posts',
      let: { authorId: '$_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$author', '$$authorId'] } } },
        {
          $group: {
            _id: null,
            totalPosts: { $sum: 1 },
            avgReadingTime: { $avg: '$readingTime' },
            latestPost: { $max: '$createdAt' },
          },
        },
      ],
      as: 'stats',
    },
  },
  { $unwind: { path: '$stats', preserveNullAndEmptyArrays: true } },
]);
\`\`\`

## Performance Tips

- Place \`$match\` and \`$sort\` stages as early as possible — they can use indexes
- Use \`$project\` to reduce document size between stages
- For large datasets, consider \`allowDiskUse: true\`
- Monitor with \`explain('executionStats')\`

The Aggregation Pipeline can eliminate entire microservices worth of data-processing logic. Master it, and your backend becomes significantly simpler.`,
    category: "Database",
    tags: ["mongodb", "database", "backend"],
  },
  {
    title: "Git Workflow Strategies for Professional Teams",
    content: `Git is arguably the most important tool in a developer's toolkit, yet many teams use it poorly. A well-designed Git workflow can dramatically improve collaboration, reduce conflicts, and streamline deployments.

## Trunk-Based Development

The modern approach favored by high-performing teams:

\`\`\`
main ─────●────●────●────●────●────●────●
           \\  /      \\  /      \\  /
feature-a ──●        ──●       ──●
(short-lived branches, merged within 1-2 days)
\`\`\`

**Key principles:**
- Short-lived feature branches (< 2 days)
- Frequent merges to main
- Feature flags for incomplete work
- CI runs on every push

## Conventional Commits

Structured commit messages enable automation:

\`\`\`
feat: add dark mode toggle to settings page
fix: resolve race condition in auth middleware
refactor: extract validation logic into shared utils
docs: update API endpoint documentation
chore: upgrade mongoose from 8.x to 9.x
perf: add database query caching for popular posts
test: add integration tests for post creation flow
\`\`\`

Benefits:
- Automated changelog generation
- Semantic versioning automation
- Clear project history

## Interactive Rebase for Clean History

Before merging a feature branch:

\`\`\`bash
# Squash work-in-progress commits into meaningful units
git rebase -i HEAD~5

# Result: Clean, logical commit history
# Before: "wip", "fix typo", "try again", "actually fix", "done"
# After: "feat: implement user notification system"
\`\`\`

## Git Hooks with Husky

Automate quality checks:

\`\`\`json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_MSG"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md,json}": ["prettier --write"]
  }
}
\`\`\`

## Handling Merge Conflicts Like a Pro

\`\`\`bash
# Update your branch with the latest main
git fetch origin
git rebase origin/main

# If conflicts arise, resolve them file by file
git status
# Edit conflicting files
git add .
git rebase --continue

# If things go wrong, safely abort
git rebase --abort
\`\`\`

## Git Bisect for Bug Hunting

Find the exact commit that introduced a bug:

\`\`\`bash
git bisect start
git bisect bad          # Current state is broken
git bisect good v2.1.0  # This version was working

# Git checks out a middle commit
# Test it, then mark:
git bisect good  # or
git bisect bad

# After ~7 steps (for 100 commits), Git finds the culprit
# abc1234 is the first bad commit
git bisect reset
\`\`\`

## Branch Protection Rules

Essential GitHub settings for production:

1. Require pull request reviews before merging
2. Require status checks (CI) to pass
3. Require branches to be up to date before merging
4. Prevent force pushes to main
5. Require signed commits for security-critical repos

## The Golden Rules

- **Never** force-push to shared branches
- **Always** pull before starting new work
- **Write** descriptive commit messages
- **Keep** branches short-lived
- **Review** code thoroughly before approving

A disciplined Git workflow is the foundation of professional software development.`,
    category: "DevOps",
    tags: ["git", "version control", "workflow"],
  },
  {
    title: "RESTful API Design: Principles, Patterns, and Common Pitfalls",
    content: `Designing a great REST API is both an art and a science. A well-designed API is intuitive, consistent, and a pleasure to work with. A poorly designed one creates friction for every developer who touches it.

## Resource Naming Conventions

\`\`\`
# GOOD — Nouns, plural, hierarchical
GET    /api/users
GET    /api/users/123
GET    /api/users/123/posts
POST   /api/users/123/posts
DELETE /api/users/123/posts/456

# BAD — Verbs in URL, inconsistent pluralization
GET    /api/getUser/123
POST   /api/createNewPost
GET    /api/user/123/post
DELETE /api/deletePost/456
\`\`\`

## HTTP Methods and Status Codes

| Method | Usage | Success Code | Idempotent |
|--------|-------|-------------|------------|
| GET | Read resource(s) | 200 OK | Yes |
| POST | Create resource | 201 Created | No |
| PUT | Full update | 200 OK | Yes |
| PATCH | Partial update | 200 OK | No |
| DELETE | Remove resource | 204 No Content | Yes |

## Pagination

Always paginate list endpoints:

\`\`\`javascript
// Cursor-based pagination (preferred for large datasets)
app.get('/api/posts', async (req, res) => {
  const { cursor, limit = 20 } = req.query;

  const query = cursor
    ? { _id: { $lt: cursor } }
    : {};

  const posts = await Post.find(query)
    .sort({ _id: -1 })
    .limit(parseInt(limit) + 1);

  const hasMore = posts.length > limit;
  const data = hasMore ? posts.slice(0, -1) : posts;
  const nextCursor = hasMore ? data[data.length - 1]._id : null;

  res.json({
    data,
    pagination: {
      hasMore,
      nextCursor,
    },
  });
});
\`\`\`

## Error Response Format

Consistent error responses across the entire API:

\`\`\`javascript
const errorResponse = (res, statusCode, message, details = null) => {
  const response = {
    status: 'error',
    statusCode,
    message,
    timestamp: new Date().toISOString(),
  };

  if (details) response.details = details;

  return res.status(statusCode).json(response);
};

// Usage
errorResponse(res, 422, 'Validation failed', [
  { field: 'email', message: 'Invalid email format' },
  { field: 'password', message: 'Must be at least 8 characters' },
]);
\`\`\`

## Rate Limiting

Protect your API from abuse:

\`\`\`javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests, please try again later',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: 'error',
    message: 'Too many login attempts',
  },
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
\`\`\`

## Versioning

\`\`\`javascript
// URL versioning (most common)
app.use('/api/v1/posts', postRoutesV1);
app.use('/api/v2/posts', postRoutesV2);

// Header versioning (cleaner URLs)
app.use('/api/posts', (req, res, next) => {
  const version = req.headers['api-version'] || '1';
  req.apiVersion = parseInt(version);
  next();
});
\`\`\`

## Filtering, Sorting, and Field Selection

\`\`\`
GET /api/posts?category=tech&sort=-createdAt&fields=title,excerpt,createdAt
GET /api/posts?createdAt[gte]=2026-01-01&readingTime[lte]=5
GET /api/posts?search=javascript&tag=frontend
\`\`\`

## Security Checklist

- **Authentication**: JWT or OAuth 2.0
- **Authorization**: Role-based access control (RBAC)
- **Input validation**: Sanitize all user input
- **CORS**: Configure allowed origins
- **Helmet**: Set security headers
- **HTTPS**: Always in production

A great API is invisible — developers use it without thinking about it.`,
    category: "Backend",
    tags: ["api", "rest", "backend"],
  },
  {
    title: "Web Security Essentials: Protecting Your Application from Common Attacks",
    content: `Security is not a feature — it's a foundation. Every web application is a target, and understanding common attack vectors is the first step toward building resilient systems.

## Cross-Site Scripting (XSS)

The most prevalent web vulnerability. Attackers inject malicious scripts into trusted websites:

\`\`\`javascript
// VULNERABLE — Never insert raw user input into HTML
element.innerHTML = userInput;

// SAFE — Use textContent or sanitization libraries
element.textContent = userInput;

// In React, dangerouslySetInnerHTML warns you by name
// Always sanitize with DOMPurify if you must render HTML
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userGeneratedHTML);
\`\`\`

**Server-side protection:**

\`\`\`javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));
\`\`\`

## SQL/NoSQL Injection

\`\`\`javascript
// VULNERABLE — MongoDB injection
const user = await User.findOne({
  email: req.body.email,
  password: req.body.password, // attacker sends { "$gt": "" }
});

// SAFE — Always validate and sanitize input types
const { email, password } = req.body;

if (typeof email !== 'string' || typeof password !== 'string') {
  return res.status(400).json({ message: 'Invalid input' });
}

const user = await User.findOne({ email });
const isMatch = await user.comparePassword(password);
\`\`\`

## Cross-Site Request Forgery (CSRF)

\`\`\`javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

app.post('/transfer', csrfProtection, (req, res) => {
  // CSRF token automatically validated
});
\`\`\`

## Authentication Security

\`\`\`javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Password hashing — never store plain text
const SALT_ROUNDS = 12;
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

// JWT best practices
const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  {
    expiresIn: '1h',
    issuer: 'your-app-name',
    audience: 'your-app-users',
  }
);

// HTTP-Only cookies prevent XSS token theft
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 3600000,
});
\`\`\`

## Rate Limiting & Brute Force Protection

\`\`\`javascript
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Try again in 15 minutes.',
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 3,
  delayMs: (hits) => hits * 500,
});

app.post('/api/auth/login', speedLimiter, loginLimiter, loginHandler);
\`\`\`

## Security Headers

\`\`\`javascript
app.use(helmet());

// Additional custom headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});
\`\`\`

## The OWASP Top 10 Checklist

1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable Components
7. Authentication Failures
8. Data Integrity Failures
9. Logging & Monitoring Failures
10. Server-Side Request Forgery (SSRF)

Security is everyone's responsibility. Start with these fundamentals and build a security-first mindset.`,
    category: "Security",
    tags: ["security", "web development", "backend"],
  },
  {
    title: "Docker for Developers: From Development to Production",
    content: `Docker has transformed how we develop, ship, and run applications. Understanding containerization is no longer optional — it's a core skill for every modern developer.

## Why Docker?

The classic "it works on my machine" problem disappears when your application runs in identical containers across all environments.

## Dockerfile Best Practices

\`\`\`dockerfile
# Multi-stage build for Node.js application
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build

# Production stage — minimal image
FROM node:20-alpine AS production

RUN addgroup -g 1001 appgroup && \\
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser

WORKDIR /app
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./

USER appuser
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "dist/index.js"]
\`\`\`

## Docker Compose for Development

\`\`\`yaml
version: '3.9'

services:
  api:
    build:
      context: ./server
      dockerfile: Dockerfile.dev
    ports:
      - '5000:5000'
    volumes:
      - ./server/src:/app/src
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - MONGO_URI=mongodb://mongo:27017/simple-blog
    depends_on:
      mongo:
        condition: service_healthy

  client:
    build:
      context: ./client
      dockerfile: Dockerfile.dev
    ports:
      - '5173:5173'
    volumes:
      - ./client/src:/app/src
      - /app/node_modules

  mongo:
    image: mongo:7
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh --quiet
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  mongo_data:
\`\`\`

## .dockerignore

\`\`\`
node_modules
npm-debug.log
.git
.gitignore
.env
*.md
.vscode
coverage
dist
\`\`\`

## Container Networking

\`\`\`bash
# Create a custom network
docker network create blog-network

# Run containers on the same network
docker run -d --name mongo --network blog-network mongo:7
docker run -d --name api --network blog-network -e MONGO_URI=mongodb://mongo:27017/blog api-image

# Containers can communicate by name
# api can reach mongo at "mongodb://mongo:27017"
\`\`\`

## Image Optimization

| Optimization | Before | After |
|-------------|--------|-------|
| Alpine base image | 1.1 GB | 180 MB |
| Multi-stage build | 180 MB | 95 MB |
| Layer caching | 3 min build | 30 sec build |
| .dockerignore | 200 MB context | 15 MB context |

## Production Checklist

- Use specific image tags (never \`latest\`)
- Run as non-root user
- Add health checks
- Set resource limits
- Scan images for vulnerabilities
- Use multi-stage builds
- Implement proper logging

Docker is the bridge between development and production. Master it, and deployment becomes a non-event.`,
    category: "DevOps",
    tags: ["docker", "devops", "deployment"],
  },
  {
    title: "TypeScript Advanced Patterns: Beyond the Basics",
    content: `TypeScript has evolved far beyond just "JavaScript with types." Advanced type patterns enable you to build APIs that are both flexible and impossible to misuse.

## Generic Constraints

\`\`\`typescript
interface HasId {
  id: string | number;
}

function findById<T extends HasId>(items: T[], id: T['id']): T | undefined {
  return items.find((item) => item.id === id);
}

const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
const found = findById(users, 1); // Type: { id: number; name: string } | undefined
\`\`\`

## Discriminated Unions

Model state machines with compile-time safety:

\`\`\`typescript
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function renderState<T>(state: RequestState<T>): string {
  switch (state.status) {
    case 'idle':
      return 'Ready to fetch';
    case 'loading':
      return 'Loading...';
    case 'success':
      return \`Got \${JSON.stringify(state.data)}\`;
    case 'error':
      return \`Error: \${state.error.message}\`;
    // TypeScript ensures all cases are handled
  }
}
\`\`\`

## Template Literal Types

\`\`\`typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiPath = '/users' | '/posts' | '/comments';
type Endpoint = \`\${HttpMethod} \${ApiPath}\`;

// "GET /users" | "GET /posts" | "POST /users" | ... (12 combinations)

type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type ButtonEvents = EventName<'click' | 'hover' | 'focus'>;
// "onClick" | "onHover" | "onFocus"
\`\`\`

## Mapped Types

\`\`\`typescript
type FormFields = {
  username: string;
  email: string;
  age: number;
};

type FormErrors = {
  [K in keyof FormFields]?: string;
};

type FormTouched = {
  [K in keyof FormFields]: boolean;
};

// Make all properties readonly and optional
type ReadonlyPartial<T> = {
  readonly [K in keyof T]?: T[K];
};
\`\`\`

## Conditional Types

\`\`\`typescript
type ApiResponse<T> = T extends Array<infer U>
  ? { data: U[]; total: number; page: number }
  : { data: T };

// ApiResponse<User[]> = { data: User[]; total: number; page: number }
// ApiResponse<User>   = { data: User }

type NonNullableDeep<T> = T extends object
  ? { [K in keyof T]: NonNullableDeep<NonNullable<T[K]>> }
  : NonNullable<T>;
\`\`\`

## The \`satisfies\` Operator

\`\`\`typescript
type Theme = Record<string, string>;

const colors = {
  primary: '#3b82f6',
  secondary: '#64748b',
  danger: '#ef4444',
} satisfies Theme;

// TypeScript knows the exact keys AND validates the type
colors.primary; // string (not string | undefined)
// colors.nonExistent; // Error — TypeScript catches this
\`\`\`

## Builder Pattern with Types

\`\`\`typescript
class QueryBuilder<T extends Record<string, unknown>> {
  private filters: Partial<T> = {};
  private sortField?: keyof T;
  private limitCount = 10;

  where<K extends keyof T>(field: K, value: T[K]): this {
    this.filters[field] = value;
    return this;
  }

  sort(field: keyof T): this {
    this.sortField = field;
    return this;
  }

  limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  build(): { filters: Partial<T>; sort?: keyof T; limit: number } {
    return {
      filters: this.filters,
      sort: this.sortField,
      limit: this.limitCount,
    };
  }
}

interface Post {
  title: string;
  category: string;
  createdAt: Date;
}

const query = new QueryBuilder<Post>()
  .where('category', 'tech') // Type-safe: only accepts string
  .sort('createdAt')         // Type-safe: only accepts keyof Post
  .limit(20)
  .build();
\`\`\`

TypeScript's type system is a programming language in itself. The more you leverage it, the fewer bugs escape to production.`,
    category: "TypeScript",
    tags: ["typescript", "javascript", "types"],
  },
  {
    title: "Web Performance Optimization: Making Every Millisecond Count",
    content: `Performance is user experience. A 100ms delay in load time can decrease conversion rates by 7%. Let's explore practical techniques to build blazingly fast web applications.

## Core Web Vitals

Google's metrics for measuring user experience:

- **LCP** (Largest Contentful Paint): < 2.5s — How fast the main content loads
- **INP** (Interaction to Next Paint): < 200ms — How responsive the page is
- **CLS** (Cumulative Layout Shift): < 0.1 — How stable the visual layout is

## Image Optimization

Images are typically the heaviest assets on a page:

\`\`\`html
<!-- Modern responsive images -->
<picture>
  <source
    srcset="hero-400.avif 400w, hero-800.avif 800w, hero-1200.avif 1200w"
    type="image/avif"
    sizes="(max-width: 768px) 100vw, 50vw"
  />
  <source
    srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1200.webp 1200w"
    type="image/webp"
    sizes="(max-width: 768px) 100vw, 50vw"
  />
  <img
    src="hero-800.jpg"
    alt="Hero image"
    width="1200"
    height="600"
    loading="lazy"
    decoding="async"
  />
</picture>
\`\`\`

## Code Splitting with React

\`\`\`jsx
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </Suspense>
  );
}
\`\`\`

## Resource Hints

\`\`\`html
<head>
  <!-- Preconnect to critical third-party origins -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://api.example.com" />

  <!-- Preload critical resources -->
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />

  <!-- Prefetch next likely navigation -->
  <link rel="prefetch" href="/blog" />

  <!-- DNS prefetch for less critical origins -->
  <link rel="dns-prefetch" href="https://analytics.example.com" />
</head>
\`\`\`

## Virtual Scrolling

For long lists, render only what's visible:

\`\`\`jsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: \`\${virtualizer.getTotalSize()}px\`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              transform: \`translateY(\${virtualItem.start}px)\`,
              height: \`\${virtualItem.size}px\`,
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
\`\`\`

## Memoization

\`\`\`jsx
import { memo, useMemo, useCallback } from 'react';

const ExpensiveList = memo(function ExpensiveList({ items, onItemClick }) {
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.score - a.score),
    [items]
  );

  return sortedItems.map((item) => (
    <ListItem key={item.id} item={item} onClick={onItemClick} />
  ));
});

function Parent() {
  const handleClick = useCallback((id) => {
    console.log('Clicked:', id);
  }, []);

  return <ExpensiveList items={data} onItemClick={handleClick} />;
}
\`\`\`

## Performance Budget

Set and enforce performance limits:

| Metric | Budget | Tool |
|--------|--------|------|
| Total JS bundle | < 200 KB (gzipped) | Webpack Bundle Analyzer |
| LCP | < 2.5s | Lighthouse |
| First byte (TTFB) | < 600ms | WebPageTest |
| Total page weight | < 1.5 MB | Chrome DevTools |

> "The fastest code is the code that never runs." — Every performance engineer ever

Performance optimization is an ongoing discipline, not a one-time task.`,
    category: "Performance",
    tags: ["performance", "frontend", "optimization"],
  },
  {
    title: "Machine Learning for Web Developers: A Practical Introduction",
    content: `Machine Learning isn't just for data scientists anymore. With TensorFlow.js and modern APIs, web developers can integrate intelligent features directly into browsers and Node.js applications.

## ML in the Browser

TensorFlow.js runs ML models entirely client-side:

\`\`\`javascript
import * as tf from '@tensorflow/tfjs';

// Simple linear regression
const model = tf.sequential();
model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

model.compile({
  optimizer: tf.train.sgd(0.01),
  loss: 'meanSquaredError',
});

// Training data: predicting house prices by size
const xs = tf.tensor2d([500, 800, 1200, 1500, 2000], [5, 1]);
const ys = tf.tensor2d([150000, 240000, 360000, 450000, 600000], [5, 1]);

await model.fit(xs, ys, { epochs: 200 });

// Predict price for a 1000 sq ft house
const prediction = model.predict(tf.tensor2d([1000], [1, 1]));
prediction.print(); // ~$300,000
\`\`\`

## Sentiment Analysis

Classify text as positive or negative:

\`\`\`javascript
async function analyzeSentiment(text) {
  const response = await fetch('/api/sentiment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  const { score, label } = await response.json();
  return { score, label }; // { score: 0.92, label: 'positive' }
}

// Server-side with natural library
const natural = require('natural');
const analyzer = new natural.SentimentAnalyzer('English',
  natural.PorterStemmer, 'afinn'
);

app.post('/api/sentiment', (req, res) => {
  const { text } = req.body;
  const tokens = new natural.WordTokenizer().tokenize(text);
  const score = analyzer.getSentiment(tokens);

  res.json({
    score,
    label: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
  });
});
\`\`\`

## Image Classification

\`\`\`javascript
import * as mobilenet from '@tensorflow-models/mobilenet';

async function classifyImage(imageElement) {
  const model = await mobilenet.load();
  const predictions = await model.classify(imageElement);

  return predictions.map((p) => ({
    className: p.className,
    probability: (p.probability * 100).toFixed(1) + '%',
  }));
}

// Result: [{ className: 'golden retriever', probability: '94.2%' }, ...]
\`\`\`

## Recommendation Engine

\`\`\`javascript
// Content-based recommendation using cosine similarity
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

function recommendPosts(currentPost, allPosts, topN = 5) {
  const scores = allPosts
    .filter((post) => post.id !== currentPost.id)
    .map((post) => ({
      post,
      similarity: cosineSimilarity(currentPost.features, post.features),
    }))
    .sort((a, b) => b.similarity - a.similarity);

  return scores.slice(0, topN).map((s) => s.post);
}
\`\`\`

## Practical ML Use Cases for Web Apps

| Use Case | Technique | Library |
|----------|-----------|---------|
| Search autocomplete | NLP / Fuzzy matching | Fuse.js |
| Image tagging | CNN classification | TensorFlow.js |
| Spam detection | Text classification | Natural |
| Content recommendations | Collaborative filtering | Custom |
| Anomaly detection | Statistical analysis | Simple-statistics |
| Chatbot | Transformer models | LangChain.js |

## Key Concepts Simplified

- **Supervised Learning**: Learn from labeled examples (spam/not-spam)
- **Unsupervised Learning**: Find patterns without labels (customer segments)
- **Neural Networks**: Layers of connected nodes that learn features
- **Training**: Adjusting model weights to minimize prediction errors
- **Overfitting**: Model memorizes training data but fails on new data

ML in the browser is still in its early days, but the possibilities are enormous. Start with simple use cases and build up your intuition.`,
    category: "AI",
    tags: ["machine learning", "ai", "tensorflow"],
  },
  {
    title: "Clean Code Principles: Writing Software That Lasts",
    content: `Code is read far more often than it is written. Clean code isn't about clever tricks — it's about empathy for the next developer who will read your work (often yourself, six months later).

## Meaningful Names

\`\`\`javascript
// BAD — What does this even mean?
const d = new Date();
const arr = users.filter((u) => u.a > 18 && u.s === 'active');
const x = calculatePrice(q, p, d);

// GOOD — Self-documenting code
const currentDate = new Date();
const activeAdultUsers = users.filter(
  (user) => user.age > 18 && user.status === 'active'
);
const discountedPrice = calculatePrice(quantity, unitPrice, discountRate);
\`\`\`

## Functions Should Do One Thing

\`\`\`javascript
// BAD — This function does everything
async function handleUserRegistration(userData) {
  // Validate
  if (!userData.email) throw new Error('Email required');
  if (userData.password.length < 8) throw new Error('Password too short');

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  // Save to database
  const user = await User.create({ ...userData, password: hashedPassword });

  // Send welcome email
  await sendEmail(user.email, 'Welcome!', welcomeTemplate(user.name));

  // Create audit log
  await AuditLog.create({ action: 'USER_REGISTERED', userId: user.id });

  return user;
}

// GOOD — Each function has a single responsibility
async function handleUserRegistration(userData) {
  validateUserData(userData);
  const user = await createUser(userData);
  await onUserRegistered(user);
  return user;
}

function validateUserData({ email, password }) {
  if (!email) throw new ValidationError('Email required');
  if (password.length < 8) throw new ValidationError('Password too short');
}

async function createUser(userData) {
  const hashedPassword = await hashPassword(userData.password);
  return User.create({ ...userData, password: hashedPassword });
}

async function onUserRegistered(user) {
  await Promise.all([
    sendWelcomeEmail(user),
    createAuditLog('USER_REGISTERED', user.id),
  ]);
}
\`\`\`

## Early Returns

\`\`\`javascript
// BAD — Arrow code / pyramid of doom
function processOrder(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.payment) {
        if (order.payment.verified) {
          return submitOrder(order);
        } else {
          return { error: 'Payment not verified' };
        }
      } else {
        return { error: 'No payment info' };
      }
    } else {
      return { error: 'No items' };
    }
  } else {
    return { error: 'No order' };
  }
}

// GOOD — Guard clauses with early returns
function processOrder(order) {
  if (!order) return { error: 'No order' };
  if (order.items.length === 0) return { error: 'No items' };
  if (!order.payment) return { error: 'No payment info' };
  if (!order.payment.verified) return { error: 'Payment not verified' };

  return submitOrder(order);
}
\`\`\`

## Error Handling

\`\`\`javascript
// BAD — Swallowing errors
try {
  await saveData(data);
} catch (e) {
  console.log(e);
}

// GOOD — Handle errors meaningfully
class DatabaseError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'DatabaseError';
    this.originalError = originalError;
  }
}

async function saveData(data) {
  try {
    return await db.collection('posts').insertOne(data);
  } catch (error) {
    if (error.code === 11000) {
      throw new ConflictError('A record with this key already exists');
    }
    throw new DatabaseError('Failed to save data', error);
  }
}
\`\`\`

## The Boy Scout Rule

> "Leave the code cleaner than you found it." — Robert C. Martin

Every time you touch a file:
- Rename one unclear variable
- Extract one complex condition into a named function
- Remove one dead code block
- Add one missing type annotation

Small improvements compound over time into a dramatically better codebase.

## Code Smells to Watch For

1. **Long functions** (> 30 lines): Break them up
2. **Magic numbers**: Replace with named constants
3. **Deeply nested code**: Use early returns
4. **Duplicate logic**: Extract shared utilities
5. **Boolean parameters**: Use options objects or separate functions
6. **Comments explaining "what"**: Rewrite the code to be self-explanatory

Clean code is not about perfection — it's about communication.`,
    category: "Software Engineering",
    tags: ["clean code", "best practices", "refactoring"],
  },
  {
    title: "Cloud Computing Fundamentals: AWS, Azure, and GCP Compared",
    content: `Cloud computing has become the backbone of modern software infrastructure. Understanding the major cloud providers and their core services is essential for any developer working on production systems.

## The Big Three

| Feature | AWS | Azure | GCP |
|---------|-----|-------|-----|
| Market Share | ~32% | ~23% | ~10% |
| Launched | 2006 | 2010 | 2008 |
| Regions | 30+ | 60+ | 35+ |
| Strength | Breadth of services | Enterprise / hybrid | Data & AI |

## Core Services Comparison

### Compute

\`\`\`
AWS:   EC2, Lambda, ECS, EKS, Fargate
Azure: Virtual Machines, Functions, AKS, Container Apps
GCP:   Compute Engine, Cloud Functions, GKE, Cloud Run
\`\`\`

### Storage

\`\`\`
AWS:   S3, EBS, EFS, Glacier
Azure: Blob Storage, Disk Storage, Files, Archive
GCP:   Cloud Storage, Persistent Disk, Filestore, Archive
\`\`\`

### Database

\`\`\`
AWS:   RDS, DynamoDB, ElastiCache, DocumentDB
Azure: SQL Database, Cosmos DB, Cache for Redis
GCP:   Cloud SQL, Firestore, Memorystore, Bigtable
\`\`\`

## Serverless Architecture

Deploy a Node.js API without managing servers:

\`\`\`javascript
// AWS Lambda
exports.handler = async (event) => {
  const { httpMethod, path, body } = event;

  if (httpMethod === 'GET' && path === '/api/posts') {
    const posts = await getPosts();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(posts),
    };
  }

  return { statusCode: 404, body: 'Not found' };
};
\`\`\`

\`\`\`javascript
// GCP Cloud Functions
const functions = require('@google-cloud/functions-framework');

functions.http('getPosts', async (req, res) => {
  if (req.method === 'GET') {
    const posts = await getPosts();
    res.json(posts);
  } else {
    res.status(405).send('Method not allowed');
  }
});
\`\`\`

## Infrastructure as Code

\`\`\`yaml
# AWS CloudFormation / SAM
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  BlogApi:
    Type: AWS::Serverless::Function
    Properties:
      Handler: index.handler
      Runtime: nodejs20.x
      MemorySize: 256
      Timeout: 30
      Events:
        GetPosts:
          Type: Api
          Properties:
            Path: /api/posts
            Method: GET
\`\`\`

\`\`\`hcl
# Terraform (cloud-agnostic)
resource "aws_lambda_function" "blog_api" {
  filename         = "lambda.zip"
  function_name    = "blog-api"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "nodejs20.x"
  memory_size     = 256
  timeout         = 30

  environment {
    variables = {
      MONGO_URI = var.mongo_uri
    }
  }
}
\`\`\`

## Cost Optimization

1. **Right-sizing**: Don't over-provision resources
2. **Reserved instances**: Save 30-60% for predictable workloads
3. **Spot/Preemptible instances**: Save 60-90% for fault-tolerant tasks
4. **Auto-scaling**: Scale down during off-peak hours
5. **Storage tiers**: Move cold data to cheaper storage classes

## Choosing a Cloud Provider

- **AWS**: Best for startups and teams needing the widest service catalog
- **Azure**: Best for enterprises already using Microsoft ecosystem
- **GCP**: Best for data-intensive and ML-heavy workloads

## The Multi-Cloud Reality

Most organizations end up using multiple cloud providers:

\`\`\`
Frontend → Netlify / Vercel (built on AWS)
API → AWS Lambda or GCP Cloud Run
Database → MongoDB Atlas (multi-cloud)
CDN → Cloudflare (independent)
Email → SendGrid (GCP-based)
Monitoring → Datadog (multi-cloud)
\`\`\`

The cloud is not a destination — it's a strategy. Choose services based on your specific needs, not brand loyalty.`,
    category: "Cloud",
    tags: ["cloud", "aws", "devops"],
  },
  {
    title: "Tailwind CSS: Utility-First Design System in Practice",
    content: `Tailwind CSS has fundamentally changed how developers approach styling. Instead of writing custom CSS, you compose designs using utility classes directly in your markup. Let's explore how to build production-grade interfaces with Tailwind.

## Why Utility-First?

Traditional CSS creates a naming problem. With Tailwind, the styles are the API:

\`\`\`html
<!-- Traditional approach: What does "card" look like? Check the CSS file -->
<div class="card">
  <h2 class="card-title">Hello</h2>
</div>

<!-- Tailwind: Everything is visible in the markup -->
<div class="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
  <h2 class="text-xl font-bold text-gray-900 dark:text-white">Hello</h2>
</div>
\`\`\`

## Responsive Design

Mobile-first breakpoints built right in:

\`\`\`html
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  <article class="rounded-lg bg-white p-4 shadow transition hover:shadow-lg">
    <img
      class="aspect-video w-full rounded-md object-cover"
      src="/post-image.jpg"
      alt="Blog post"
    />
    <h3 class="mt-4 text-lg font-semibold line-clamp-2">
      Building Modern Web Applications
    </h3>
    <p class="mt-2 text-sm text-gray-600 line-clamp-3">
      A comprehensive guide to building scalable web apps...
    </p>
    <div class="mt-4 flex items-center justify-between">
      <span class="text-xs text-gray-500">5 min read</span>
      <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
        Technology
      </span>
    </div>
  </article>
</div>
\`\`\`

## Dark Mode

\`\`\`html
<div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
  <header class="border-b border-gray-200 dark:border-gray-700">
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <a href="/" class="text-2xl font-bold text-blue-600 dark:text-blue-400">
        Blog
      </a>
      <button
        class="rounded-lg bg-gray-100 p-2 dark:bg-gray-800"
        aria-label="Toggle dark mode"
      >
        <SunIcon class="hidden dark:block" />
        <MoonIcon class="block dark:hidden" />
      </button>
    </nav>
  </header>
</div>
\`\`\`

## Component Extraction with @apply

When patterns repeat, extract them:

\`\`\`css
@layer components {
  .btn {
    @apply inline-flex items-center justify-center rounded-lg px-4 py-2
      text-sm font-medium transition focus:outline-none
      focus:ring-2 focus:ring-offset-2;
  }

  .btn-primary {
    @apply btn bg-blue-600 text-white hover:bg-blue-700
      focus:ring-blue-500;
  }

  .btn-secondary {
    @apply btn border border-gray-300 bg-white text-gray-700
      hover:bg-gray-50 focus:ring-gray-500
      dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200;
  }
}
\`\`\`

## Animations

\`\`\`html
<!-- Skeleton loading -->
<div class="animate-pulse space-y-4">
  <div class="h-48 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
  <div class="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
  <div class="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
</div>

<!-- Smooth entrance -->
<div class="animate-fade-in-up opacity-0"
     style="animation-delay: 200ms; animation-fill-mode: forwards">
  Content appears smoothly
</div>
\`\`\`

Custom animation in config:

\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
};
\`\`\`

## Tailwind + React Pattern

\`\`\`jsx
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function Button({ variant = 'primary', size = 'md', className, children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'border border-gray-300 bg-white hover:bg-gray-50': variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
\`\`\`

## Performance

Tailwind generates only the CSS you actually use. A typical production build:

| Metric | Without Purge | With Purge |
|--------|--------------|------------|
| CSS Size | ~3.5 MB | ~8-15 KB |
| Gzipped | ~350 KB | ~3-5 KB |

Tailwind doesn't add runtime cost. The utility classes are compiled away, leaving you with the smallest possible CSS bundle.`,
    category: "CSS",
    tags: ["tailwind", "css", "ui design"],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    let admin = await User.findOne({ role: "admin" });

    if (!admin) {
      admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    }

    if (!admin) {
      console.log("No admin user found. Creating seed admin...");
      admin = await User.create({
        username: "adminuser",
        email: process.env.ADMIN_EMAIL || "admin@example.com",
        password: "Admin1234",
        role: "admin",
      });
      console.log(`Admin created: ${admin.username} (${admin.email})`);
    }

    console.log(`Using author: ${admin.username} (${admin._id})`);

    let created = 0;
    let skipped = 0;

    for (const postData of POSTS) {
      const existing = await Post.findOne({ title: postData.title });

      if (existing) {
        console.log(`  SKIP: "${postData.title}" (already exists)`);
        skipped++;
        continue;
      }

      await Post.create({ ...postData, author: admin._id });
      console.log(`  CREATED: "${postData.title}"`);
      created++;
    }

    console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

seed();
