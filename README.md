# CF AI Resume Roaster

An AI-powered resume critique application built on Cloudflare's edge infrastructure. Get brutally honest, actionable feedback on your CV from a cynical AI recruiter powered by Llama 3.

## 🎯 Overview

This application combines Cloudflare Workers AI, Durable Objects for persistent memory, and a Next.js frontend to create an interactive resume review experience. The AI maintains conversation context across sessions and applies real engineering hiring standards to critique resumes.


### How It Works

1. User sends a message through the chat interface
2. Worker routes the request to the appropriate Durable Object based on session ID
3. Durable Object retrieves conversation history from persistent storage
4. Message + history sent to Llama 3 via Workers AI
5. AI response stored in history and returned to user
6. Frontend displays the conversation with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Cloudflare account
- Wrangler CLI: `npm install -g wrangler`

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/JoaoCodificacoes/cf_ai_cv_rater
cd cf_ai_cv_rater
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

4. **Configure Wrangler**

Login to Cloudflare:
```bash
wrangler login
```

Update `wrangler.toml` with your account details if needed.

5. **Deploy the Worker**
```bash
npm run deploy
```

## 💻 Local Development

### Running the Worker Locally
```bash
npm run dev
```


### Running the Frontend Locally

In a separate terminal:
```bash
cd frontend
npm run dev
```



## 🎮 Usage

1. **Open the application** in your browser (deployed URL or localhost:3000)
2. **Start chatting** - try saying "Hi" to see the AI's personality
3. **Paste your resume** - the AI will analyze it using real hiring standards
4. **Ask follow-up questions** - the AI remembers your conversation
5. **Test memory** - ask "What is my name?" after introducing yourself

### Example Interactions
```
You: Hello
Bot: I don't have all day. Paste the resume or get out.

You: [paste resume]
Bot: Score: 45/100
     The Roast: [brutal but constructive feedback]
     Critical Fixes:
     - Add metrics to every achievement
     - Remove "assisted" and "helped"
     - Quantify your impact

You: What did we talk about?
Bot: We literally just reviewed your resume. It scored 45/100. Focus.
```

## 🔑 Features

- **Persistent Memory**
- **Session Management**
- **Real-time Chat**
- **Resume Analysis**

## 🛠️ Tech Stack

- **Cloudflare Workers**
- **Cloudflare Workers AI**
- **Durable Objects**
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
---

**Built for Cloudflare AI Assignment**
