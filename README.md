# Terms of Service Decliend (TOSDenied)

TOSDenied analyzes company and product Terms of Service and Privacy Policies using the Perplexity AI API, highlights potential red flags, assigns a consumer-friendliness grade.

## Features

- Analyze at **company-level** or **product-specific** scope
- Identify and categorize **red flags** by severity (high, medium, low)
- Assign a **grade** (S, A, B, C, E) for consumer friendliness
- **Cache** results for 7 days in MongoDB to reduce API calls

## Perplexity AI Integration

TOSDenied leverages the Perplexity AI deep-research model to automate the analysis of Terms of Service and Privacy Policies:
- **Tailored Prompts:** Dynamically adapts prompts for company-wide or product-specific analysis.
- **Structured Output:** Receives AI-generated summaries, red flags, and grades in JSON format for seamless UI rendering.
- **Caching:** Stores analysis results in MongoDB for 7 days to ensure consistent, fast performance and reduce API usage.

This integration demonstrates how Perplexity’s deep-research capabilities can quickly surface key policy insights with minimal manual effort.


## Tech Stack

- **Framework:** Next.js (App Router) with TypeScript
- **Styling:** Tailwind CSS, class-variance-authority, tw-animate-css
- **UI Components:** Radix UI, Sonner (toast notifications)
- **API:** Perplexity Chat Completions
- **Database:** MongoDB (`mongodb` driver)
- **Deployment:** Docker (Distroless), Vercel-compatible

## Getting Started

### Prerequisites

- Node.js v20+
- pnpm (or npm/yarn)
- MongoDB database (connection URI)
- Perplexity API key

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/<your-org>/tosdenied.git
   cd tosdenied
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create `.env` in project root:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   PERPLEXITY_API_KEY=your-perplexity-api-key
   ```

### Development

Start the development server:
```bash
pnpm dev
```
Open http://localhost:3000 in your browser.

### Production Build

```bash
pnpm build
pnpm start
```
The app will listen on port 3000 by default.

### Docker

Build and run with Docker:
```bash
docker build -t tosdenied .
docker run -d \
  -e MONGODB_URI="$MONGODB_URI" \
  -e PERPLEXITY_API_KEY="$PERPLEXITY_API_KEY" \
  -p 3000:3000 \
  tosdenied
```

## Project Structure

```
.
├── src/
│   ├── app/        # Next.js App Router (pages, layouts, API routes)
│   ├── components/ # Reusable UI components
│   └── lib/        # Database, API clients, utilities, types
├── public/         # Static assets
├── Dockerfile      # Containerization for production
├── package.json
└── tailwind.config.mjs
```

## Environment Variables

| Name                 | Description                                 |
|----------------------|---------------------------------------------|
| `MONGODB_URI`        | MongoDB connection string for caching       |
| `PERPLEXITY_API_KEY` | Perplexity Chat Completions API key         |
| `NODE_ENV`           | `development` or `production` (default: dev)|

## Scripts

| Command       | Description                |
|---------------|----------------------------|
| `pnpm dev`    | Run development server     |
| `pnpm build`  | Build for production       |
| `pnpm start`  | Run production server      |
| `pnpm lint`   | Run ESLint                 |
