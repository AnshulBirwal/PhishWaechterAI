# Phish Wächter AI

Phish Wächter AI is a web application that uses artificial intelligence to analyze suspicious emails. By pasting an email's headers and body text into the app, users get an instant threat analysis to help them determine if the email is a phishing attempt.

## What It Does

* **Header Analysis:** Reads complex raw email headers to check for technical red flags, such as failing SPF, DKIM, or DMARC authentication.
* **Content Scanning:** Analyzes the email body for psychological manipulation, urgency cues, and suspicious links.
* **Threat Scoring:** Provides a clear confidence score from 0 to 100, indicating how likely the email is to be malicious.
* **Detailed Breakdown:** Gives a bulleted list of specific red flags found, as well as safe indicators.
* **Educational Context:** Includes a section at the bottom to teach users about the financial impact of phishing and how to spot it.

## Technology Stack

* **Frontend:** React, TypeScript, Vite
* **Styling:** Tailwind CSS (v4)
* **Backend:** Vercel Serverless Functions (Node.js)
* **Artificial Intelligence:** Google Gemini 2.5 Flash API
* **Icons:** Lucide React

## How It Works (Architecture)

To keep the application secure, the frontend does not talk directly to the Google Gemini API. If it did, the secret API key would be exposed in the browser. 

Instead, the React frontend sends the user's input to a secure Vercel Serverless backend (located in the /api folder). This backend securely holds the API key, communicates with the Gemini AI, and sends the formatted results back to the user interface.

## How to Run This Project Locally

To run this project on your own computer, you will need Node.js installed and a free API key from Google AI Studio.

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/phish-waechter-ai.git
    cd phish-waechter-ai
    ```
2. **Install dependencies:**
    ```bash

    npm install
    ```
  
3.  **Set up your environment variables:**
    Create a file named .env in the root folder of the project. Add your Gemini API key to this file like so:
    

    ```
    GEMINI_API_KEY="api_key_here"
    ```

4.   **Install the Vercel CLI:**
    Because this project uses Vercel serverless functions for the backend, you need the Vercel CLI to run it properly on your local machine.

     ```
     npm install -g vercel
     ```
5.   **Start the development server:**
    
     ```
     vercel dev
     ```
     Follow the terminal prompts (you can say "no" to linking it to a Vercel project if you are just testing). The application will start, usually at http://localhost:3000.

## Deployment

This project is optimized for deployment on Vercel. Simply import your GitHub repository into your Vercel dashboard, add your GEMINI_API_KEY to the Environment Variables section in the project settings, and click Deploy. Vercel will automatically configure both the React frontend and the serverless backend.
