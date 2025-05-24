# Projects Created For IndoLike Internship

These projects were created as part of the IndoLike Internship. You can view them live at: shovitdutta.github.io/IndoLike/

This document outlines the workflows of the three projects in this repository: AudioSphere, GeminiChat, and QuoteGen.

## AudioSphere

AudioSphere is a music streaming application built with Next.js.

**Workflow:**

1.  **Frontend (src/app/(home)/page.jsx):**
    *   The main page component fetches data for "latest" songs, "trending" songs, and "latest" albums from local API endpoints (`/api/search/songs` and `/api/search/albums`) using `fetch`.
    *   It uses `useState` and `useEffect` hooks to manage the state of the fetched data and trigger data fetching on component mount.
    *   The fetched data is displayed using `SongCard` and `AlbumCard` components.
    *   The UI includes sections for "Latest Songs", "Latest Albums", and "Popular Songs", utilizing `ScrollArea` for horizontal scrolling.
    *   Framer Motion is used for animations.

2.  **API Routes (src/app/api/search/songs/route.js, src/app/api/search/albums/route.js):**
    *   These API routes handle incoming requests from the frontend.
    *   They extract the `query` parameter from the request URL.
    *   They fetch data from an external API (`https://jiosaavn-api.shovitdutta1.workers.dev/api/search/songs` or similar for albums) based on the query.
    *   They handle potential errors during the external API fetch.
    *   The fetched data is returned as a JSON response to the frontend.

**Dependencies (from package.json):**

*   Next.js: Framework for building the application.
*   React and React DOM: For building the user interface.
*   UI Libraries: `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`, `vaul` for styling and components.
*   Animation: `framer-motion` for UI animations.
*   Icons: `lucide-react`, `react-icons`.
*   State Management/Utilities: `react-hot-toast`, `sonner` for notifications, `react-resizable-panels`, `cmdk`, `nextjs-toploader`.
*   Styling: `tailwindcss`, `postcss`, `autoprefixer`.

## GeminiChat

GeminiChat is a chat application that integrates with the Google Gemini API, built with Next.js.

**Workflow:**

1.  **Frontend (src/app/page.tsx):**
    *   The main page displays information about different Gemini models and their features.
    *   It uses `next-auth` for Google authentication (`useSession`).
    *   Users can select a Gemini model.
    *   Upon successful authentication and model selection, the user is redirected to the `/chat` page with the selected model details as URL parameters.

2.  **Frontend (src/app/chat/page.tsx):**
    *   This component provides the main chat interface.
    *   It checks for user authentication using `useSession` and redirects to the sign-in page if not authenticated.
    *   It fetches and displays chat messages, managing the chat history state.
    *   Users can input text messages, select a different Gemini model, configure model settings (temperature, max output tokens, etc.), upload files, and manage cache.
    *   It interacts with several API endpoints:
        *   `/api/chat`: For sending user prompts and receiving AI responses (streamed).
        *   `/api/chat/sessions`: For fetching and managing chat sessions.
        *   `/api/chat/upload`: For handling file uploads.
        *   `/api/chat/cache`: For managing AI response cache.
    *   Uses `react-markdown` and `rehype-highlight` for rendering markdown and code in chat messages.
    *   Includes a `Sidebar` component for session management.

3.  **API Routes (src/app/api/chat/route.ts, src/app/api/chat/sessions/route.ts, src/app/api/chat/upload/route.ts, src/app/api/chat/cache/route.ts):**
    *   These routes handle the backend logic for the chat application.
    *   `/api/chat`: Processes user prompts, interacts with the Google Gemini API (`@google/genai`), and streams the AI response back to the frontend. It also handles session management and potentially file data and cache.
    *   `/api/chat/sessions`: Manages chat sessions, likely interacting with a database (Prisma is used in this project).
    *   `/api/chat/upload`: Handles the logic for uploading files.
    *   `/api/chat/cache`: Manages caching of AI responses.

4.  **Database (Prisma):**
    *   Prisma is used as the ORM for database interactions, likely for storing chat sessions and messages. The `prisma` directory contains the schema and migration files.

**Dependencies (from package.json):**

*   Next.js: Framework for building the application.
*   React and React DOM: For building the user interface.
*   Authentication: `next-auth`, `@auth/prisma-adapter`.
*   AI Integration: `@google/genai`.
*   Database: `prisma`, `@prisma/client`, `mongoose`.
*   UI Libraries: `framer-motion`, `lucide-react`, `react-icons`.
*   Markdown Rendering: `react-markdown`, `react-syntax-highlighter`, `rehype-highlight`.
*   Styling: `tailwindcss`, `@tailwindcss/postcss`.
*   TypeScript: For type safety.

## QuoteGen

QuoteGen is an AI quote generator application built with Next.js.

**Workflow:**

1.  **Frontend (src/app/page.tsx):**
    *   The main page allows users to generate quotes based on predefined topics or a custom topic.
    *   It uses `useState` and `useRef` hooks to manage the state of the generated quote, reasoning, loading status, and user input.
    *   It fetches quotes from local API endpoints (`/api/static` and `/api/custom`) using `fetch` and handles streaming responses.
    *   Includes features like a history of generated quotes (stored in local storage), dark mode, and topic search.
    *   Uses `framer-motion` for animations and `react-icons` for icons.
    *   Manages topic counts and history in local storage.

2.  **API Routes (src/app/api/static/route.ts, src/app/api/custom/route.ts):**
    *   These API routes handle the quote generation logic.
    *   They receive a `topic` in the request body.
    *   They interact with the OpenRouter API (`https://openrouter.ai/api/v1/chat/completions`) using the `deepseek/deepseek-r1:free` model to generate a quote and reasoning based on the provided topic.
    *   They stream the response from the OpenRouter API back to the frontend, separating the quote content and reasoning using Server-Sent Events (SSE) format.
    *   Requires an `OPENROUTER_API_KEY` environment variable.

**Dependencies (from package.json):**

*   Next.js: Framework for building the application.
*   React and React DOM: For building the user interface.
*   Animation: `framer-motion`.
*   Icons: `react-icons`.
*   Styling: `tailwindcss`, `@tailwindcss/postcss`, `daisyui`.
*   TypeScript: For type safety.
