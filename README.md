
# SMEPro Lite

SMEPro Lite is a sophisticated, narrowly-trained subject matter expert (SME) AI Model built with React. SMEPro Intelligence AI. Powered by the Google Gemini API. It allows users to select an industry, sub-type, and operating segment to start a highly contextual and specialized conversation with an AI expert.

## Key Features

- **Specialized AI Experts**: Choose from a wide range of industries and roles for both "Solo" and "Business" plans to get tailored, expert-level advice.
- **Interactive & Guided Sessions**: Move beyond simple Q&A. The AI can generate structured plans and interactive options to guide you toward a specific outcome.
- **SMEPro Vault**: A personal knowledge base where you can save key insights, plans, and conversations.
- **AI-Powered Analysis**: The Vault includes an Analysis Workbench that uses AI to synthesize new strategies from your saved items.
- **Universal API Connectors**: Integrate your existing AI workflows. Securely connect your API keys from OpenAI, Grok, and AWS to sync and normalize your conversation histories. SMEPro's AI analyzes and transforms this external data into the structured, actionable format of your Vault, creating a unified knowledge base.
- **Real-time Collaboration**: Share chat sessions with a unique link for team members to join and collaborate in real-time.
- **AI Safety Module**: A configurable safety layer to monitor prompts for sensitive keywords, log attempts, and warn users, ensuring responsible AI usage.
- **Rich Markdown Rendering**: Code blocks with syntax highlighting and copy buttons, scrollable tables, and well-formatted text for clarity.
- **Multi-page Marketing Site**: A full-featured landing site with pages for Features, How It Works, and Plans to onboard new users.
- **Responsive Design**: Fully responsive UI that works seamlessly across desktop and mobile devices.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI**: Google Gemini API (`@google/genai`)
- **Markdown Parsing**: `marked`
- **Syntax Highlighting**: `highlight.js`

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

### Configuration

The application requires a Google Gemini API key to function. The project is set up to read this key from an environment variable named `API_KEY`. Ensure this variable is available in your deployment environment.

For local development with a tool like Vite, you would typically create a `.env` file in the root of the project:

```
VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

### Running the Application

Once the dependencies are installed and the environment is configured, you can start a local development server:

```bash
npm run dev
```

This will typically run the app at `http://localhost:5173`.

## Deployment & Infrastructure

SMEPro Lite is a **static single-page application (SPA)**. It does not require a complex backend server or database infrastructure. The deployment process consists of two main steps:

1.  **Build the Project**: Use a build tool like Vite or Next.js to compile the React/TypeScript code into a set of static HTML, CSS, and JavaScript files.
2.  **Host the Static Files**: Upload the contents of the build directory (e.g., `dist/`) to any static hosting provider.

This simple architecture makes the application highly scalable, secure, and cost-effective.

**Common Hosting Platforms:**
- Vercel
- Netlify
- AWS S3 with CloudFront
- Google Firebase Hosting
- GitHub Pages

Because of this simple static hosting model, there is no need for infrastructure-as-code files like `docker-compose.yml` or Terraform configurations. The included `deploy.bat` script provides a template for automating the build and deployment process to a cloud provider's CLI.

## Note on Dependencies

This is a JavaScript/TypeScript project, and its dependencies are managed by the `package.json` file. The `requirements.txt` file is included to directly address a user request but is not used by the build system (`npm` or `yarn`). For a definitive list of project dependencies, please refer to `package.json`.
