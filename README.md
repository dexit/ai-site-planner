# AI Site Planner

Generate professional sitemaps and wireframes for your website in minutes using AI. Describe your company, and get an AI-powered site plan, sitemap, and wireframes based on industry best practices. The application also provides SEO checklists, LD+JSON schema generation, and other enhancement suggestions.

## Features

*   **Step-by-Step Guided UI**: A clear navigator guides you through the process: Describe -> Plan & Wireframe -> Enhance.
*   **AI-Powered Sitemap Generation**: Instantly get a logical sitemap based on your company description.
*   **Visual Skeleton Wireframes**: Instead of just text, see a visual representation of each page's layout using skeleton loaders.
*   **Comprehensive Enhancements**:
    *   **LD+JSON Schema Generation**: Creates a rich array of schemas (`Organization`, `WebSite`, `WebPage`, etc.) for advanced SEO.
    *   **SERP Preview**: See how your site might look on Google's search results.
    *   **AI SEO Strategy**: Get tailored, actionable SEO advice.
    *   **AI-Generated Checklists**: Get checklists for going live and for web development.
*   **Export & Save**:
    *   Save your progress to local storage and load it later.
    *   Export your full site plan as a JSON file.
    *   Export a formatted PDF of your plan for easy sharing.
*   **Customizable AI Creativity**: Adjust the AI's "temperature" for more precise or more creative results.

## Prerequisites

*   Node.js (v18.x or later recommended)
*   npm (v8.x or later) or yarn

## API Key Setup

This application uses the Google Gemini API. You need to obtain an API key from Google AI Studio.

1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Create an API key.
3.  **Important**: This API key is sensitive. Do not share it publicly or commit it to version control.

Once you have your API key, you must make it available to the application as an environment variable.

1.  In the root directory of this project, create a new file named `.env`. If you see a `.env.example` file, you can rename it to `.env`.
2.  Inside your `.env` file, add the following line, replacing `YOUR_GEMINI_API_KEY_HERE` with your actual API key:

```
VITE_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

**Note**: The `VITE_` prefix is required by the Vite build tool to expose the variable to the client-side code. The application will not function without this key.

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

## Project Structure

*   `public/`: Contains static assets that are copied directly to the build output.
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
*   `.env`: Local environment variables (create this yourself).
*   `.gitignore`: Specifies intentionally untracked files that Git should ignore.
*   `metadata.json`: Application metadata.

---

This AI Site Planner is a tool to assist in the initial phases of website planning. Always review and refine the AI-generated outputs to ensure they meet your specific requirements and best practices.
