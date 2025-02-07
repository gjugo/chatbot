# Chatbot Project

A modern chatbot application built with Node.js and Vue.js.

## Technologies Used

### Backend
- Node.js with Express.js
- LangChain for AI/LLM integration
- OpenAI integration
- Environment variables management with dotenv

### Frontend
- Vue.js
- Modern JavaScript (ES Modules)

## Getting Started

### Prerequisites
- Node.js (latest LTS version)
- npm (comes with Node.js)
- OpenAI API key

### Local Development Setup

1. Clone the repository
```bash
git clone [repository-url]
cd chatbot
```

2. Install dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Run the application
```bash
# Start the backend server
npm start

# In a separate terminal, start the frontend development server
cd frontend
npm run serve
```

The backend server will run on http://localhost:3000 (or your configured port)
The frontend development server will typically run on http://localhost:8080

## Note
Make sure to keep your API keys confidential and never commit them to version control.
