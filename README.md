# AI Site Planner

Generate professional sitemaps and wireframes for your website in minutes using AI. Describe your company, and get an AI-powered site plan, sitemap, and wireframes based on industry best practices. The application also provides SEO checklists, LD+JSON schema generation, and other enhancement suggestions.

## Features

*   AI-powered sitemap generation.
*   AI-powered wireframe generation for each page in the sitemap.
*   Customizable AI creativity (temperature) setting.
*   Save, load, and reset site plans using browser local storage.
*   Downloadable site plan in JSON format.
*   Generation of basic LD+JSON schema.
*   AI-driven site enhancement suggestions.
*   AI-generated Go-Live and Web Development checklists.
*   Comprehensive static SEO checklist.
*   Responsive design.

## Prerequisites

*   Node.js (v18.x or later recommended)
*   npm (v8.x or later) or yarn

## API Key Setup

This application uses the Google Gemini API. You need to obtain an API key from Google AI Studio.

1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Create an API key.
3.  **Important**: This API key is sensitive. Do not share it publicly or commit it to version control.

Once you have your API key:

1.  In the root directory of this project, create a new file named `.env`.
2.  Copy the contents of `.env.example` into your new `.env` file.
3.  Replace `"YOUR_GEMINI_API_KEY_HERE"` with your actual Gemini API key.

Example `.env` file:
```
VITE_API_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```
The application will not function correctly without this API key.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ai-site-planner
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up your API Key:**
    Follow the instructions in the "API Key Setup" section above to create your `.env` file with your `VITE_API_KEY`.

## Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    This will start the Vite development server, typically on `http://localhost:5173`. Open this URL in your browser.

## Building for Production

1.  **Build the application:**
    ```bash
    npm run build
    # or
    # yarn build
    ```
    This command will create a `dist/` folder in the project root with the optimized static assets for your application.

2.  **Preview the production build:**
    ```bash
    npm run preview
    # or
    # yarn preview
    ```
    This command serves the contents of the `dist/` folder locally, allowing you to test the production build before deployment.

## Debugging

Effective debugging can be done using your browser's built-in developer tools and the React Developer Tools extension.

*   **Browser Developer Tools**:
    *   **Console Tab**: Check for any errors, warnings, or `console.log` messages from the application. The `geminiService.ts` logs information about API calls and JSON parsing.
    *   **Network Tab**: Inspect API requests to the Gemini API. You can see the request payload, headers, and the raw response from the server. This is useful for diagnosing API-related issues.
    *   **Sources Tab**: You can set breakpoints in your TypeScript/TSX code (thanks to Vite's source maps) and step through execution to understand the application flow and variable states.
*   **React Developer Tools**:
    *   This browser extension is invaluable for inspecting React component hierarchies, their props, and state.
    *   You can find it for [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/).
*   **Logging**: The application includes `console.error` and `console.warn` statements in key areas, particularly within `geminiService.ts` for API interactions and JSON parsing, and in `SitePlanner.tsx` for state management and user actions. Review these logs for insights into issues.

## Project Structure

*   `public/`: Contains static assets that are copied directly to the build output (e.g., `vite.svg`).
*   `src/`: Contains all the application's source code.
    *   `components/`: React components, organized into general UI components and specific feature components.
        *   `checklists/`: Data for static checklists.
        *   `common/`: Reusable UI components like Button, Card, Icon, Loader.
    *   `services/`: Modules for interacting with external APIs (e.g., `geminiService.ts`).
    *   `types.ts`: TypeScript type definitions and enums.
    *   `App.tsx`: The main application component.
    *   `index.tsx`: The entry point for the React application.
*   `index.html`: The main HTML file, serving as the entry point for Vite.
*   `vite.config.ts`: Configuration for the Vite build tool.
*   `package.json`: Project metadata, dependencies, and scripts.
*   `README.md`: This file.
*   `.env.example`: Template for environment variables.
*   `.gitignore`: Specifies intentionally untracked files that Git should ignore.
*   `metadata.json`: Application metadata.

---

This AI Site Planner is a tool to assist in the initial phases of website planning. Always review and refine the AI-generated outputs to ensure they meet your specific requirements and best practices.
