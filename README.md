
# AI SQL Developer Assistant

This is a a full-stack application that uses an LLM to convert natural language queries into SQL, provide explanations, and offer optimization suggestions.

Due to short time constraints, skipped adding docker config files.

Disclaimer: AI assistant was used to generate some parts of the code especially for config files.

## Tech Stack

-   **Frontend:** React (TypeScript, Vite)
-   **Backend:** Express.js (TypeScript)
-   **LLM Interaction:** LangChain.js with OpenAI
-   **Database (Logging):** SQLite (using Knex.js for migrations and queries)


## Features

-   Convert natural language to SQL queries.
-   Explain generated SQL queries.
-   Provide optimization tips for SQL.
-   multiple SQL dialects (PostgreSQL, MySQL, SQLite, SQL Server, Oracle).
-   (Optional) Log queries and responses to an SQLite database.


## Prerequisites

-   Node.js (v18 or later recommended)
-   npm or yarn
-   OpenAI API Key

## Setup and Running the Application

### 1. Clone the Repository (or Unzip the Source Code)

```bash
# If you cloned a git repo:
# git clone <repository-url>
# cd ai-sql-assistant
```

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

**a. Create Environment File:**

Copy the example environment file and update it with your OpenAI API key:

```bash
cp .env.example .env
```

Edit `.env` and set your `OPENAI_API_KEY`:

```
OPENAI_API_KEY=your_actual_openai_api_key
PORT=3001
```

**b. Install Dependencies:**

```bash
npm install
# or
# yarn install
```

**c. Run Database Migrations (for SQLite logging):**

This will create the `dev.sqlite3` database file in the `backend` directory and the `query_logs` table.

```bash
npm run migrate
```
*(If `npm run migrate` has issues, you might need to run `npx knex migrate:latest --knexfile ./knexfile.js` directly or ensure `knex` is globally installed or accessible via `npx`)*


**d. Start the Backend Server:**

```bash
npm run dev
```

The backend server will start, typically on `http://localhost:3001`.

### 3. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
```

**a. Install Dependencies:**

```bash
npm install
# or
# yarn install
```
**b. (Optional) Configure API URL for Local Development (if backend is not on localhost:3001):**
The frontend is configured to call the backend at `http://localhost:3001` by default for local development. If your backend runs on a different URL when developing locally , you can create a `.env.local` file in the `frontend` directory:
```
# frontend/.env.local
VITE_API_BASE_URL=http://your-backend-url:port
```

**c. Start the Frontend Development Server:**

```bash
npm run dev
```

The frontend development server will start, typically on `http://localhost:3000`. Open this URL in your browser.


## How to Use

1.  Open the frontend application in your browser (e.g., `http://localhost:3000`).
2.  Type your data request in natural language into the input field (e.g., "show me all users from california who signed up last month").
3.  Select the desired SQL dialect from the dropdown.
4.  Click "Generate SQL".
5.  The application will display the generated SQL query, an explanation, and any optimization suggestions.

## Project Structure

```
ai-sql-assistant/
├── backend/                  # Express.js backend
│   ├── src/
│   │   ├── db/migrations/    # Knex migration files (for SQLite logging)
│   │   ├── routes/           # Express.js routes
│   │   ├── services/
│   │   └── types/
│   ├── .env.example
│   ├── knexfile.js
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   ├── public/
│   ├── .env.example          # Example for VITE_API_BASE_URL (if needed locally)
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md                 # This file
```

## Assumptions and Simplifications

-   Error handling is basic.
-   LLM responses for SQL, explanation, and optimization are used directly.
-   We don't have user authentication or complex state management in the frontend.
-   The focus is on the core LLM integration and full-stack pipeline.
-   SQLite database is used for simplicity in logging here. For production, a switch to PostgreSQL would be recommended as it's more robust I believe.
