# AI Snippet Service

AI-powered summarization service. Submit a block of text and get back an intelligent summary, generated via an AI model. Designed with a clean API, modular frontend and Dockerized architecture.

## 🧰 Tech Stack

Backend

- Node.js + TypeScript
- NestJS
- Prisma ORM
- MongoDB (ReplicaSet via Docker)
- Swagger (OpenAPI)
- Jest (Unit Testing)

Frontend

- Next.js + TypeScript
- TailwindCSS
- ShadCN/UI
- V0 by Vercel (initial generation)

⸻

## 🚀 Getting Started

Prerequisites

- Docker
- Docker Compose
- Node.js (if running locally)

1. Clone the project

```bash
git clone https://github.com/jhuonas/ai-snippet-service.git
cd ai-snippet-service
```

2. Start with Docker Compose

```bash
docker-compose up --build
```

This will spin up:

- api: available at http://localhost:3000
- web: available at http://localhost:3001
- mongodb: replica set initialized automatically

⸻

## 📚 API Documentation

Swagger UI is available at:

http://localhost:3000/api-docs

Example Requests (using curl)

Create Snippet

```bash
curl -X POST http://localhost:3000/snippets \
 -H "Content-Type: application/json" \
 -d '{"text":"Your long input text goes here..."}'
```

Get Snippets (paginated)

```bash
curl http://localhost:3000/snippets?take=5&skip=0
```

Get Snippet by ID

```bash
curl http://localhost:3000/snippets/SNIPPET_ID
```

⸻

## ✅ Completed Features

- Submit text and generate summary using AI
- Save new snippets directly from frontend
- Paginated listing of snippets
- View snippet by ID
- Swagger documentation
- Frontend fully connected and functional
- Unit tests for services
- CI pipeline for backend

⸻

🛠 What’s Next

- Authentication (basic token-based auth or session)
- AI summary generation via streaming (SSE)
- Add caching layer (e.g., Redis)
- Rate limiting for public endpoints
- Production-ready Docker images and deployment (Fly.io or Railway)
- Frontend enhancements (optimistic UI, skeletons, toast feedback)
- Accessibility improvements
- End-to-end tests (Playwright or Cypress)

⸻

🧪 Testing

Run backend unit tests:

cd api
npm install
npm test

CI pipeline is configured on main branch push or PR:

.github/workflows/ci.yml

⸻

## 🔐 API Keys

The project uses a real AI API to generate text summaries. You must provide a valid API key via environment variables.

Supported provider:

- Anthropic Claude API

How to configure: 1. Create a .env file in the /api directory or use .env.docker (used in Docker Compose):

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

    The key is automatically loaded via process.env inside the AiService.

⚠️ If no valid key is provided, the summarization feature will fail.

⸻

## 💬 Post-Challenge Reflection

With more time, I would:

- Implement real-time summarization using Server-Sent Events (SSE)
- Add proper authentication & rate limiting
- Improve test coverage (unit, integration, e2e)
- Add frontend validation and accessibility polish

Trade-offs:

- Focused on clear structure, separation of concerns, and feature completeness
- Used mocked summaries initially to avoid key/API dependency during early development

⸻

## 📁 Project Structure

```
/api
└── src
├── modules/snippets
├── ai/ (external AI integration)
└── database/ (Prisma)
└── test/
└── Dockerfile

/web
└── app/
├── components/
└── page.tsx (entry)
└── Dockerfile

/docker-compose.yml
```
