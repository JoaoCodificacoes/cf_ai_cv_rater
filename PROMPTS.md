# 🤖 AI Prompts & Workflow Log

This project leveraged AI assistance to accelerate the implementation of the Cloudflare Workers + Next.js architecture. Below is a log of the key prompts used to design the system, debug edge cases, and refine the UX.

## 1. Architecture & Durable Objects Design
**Goal:** Validate the stateful architecture for a serverless environment.

> **Prompt:** "I am designing a monolithic Cloudflare Worker that serves a static Next.js frontend and handles API requests. For the chat history persistence, I plan to use Durable Objects. Can you confirm if `this.ctx.storage` is the most performant way to persist the message array. I need to ensure the state survives page refreshes."

## 2. Backend Architecture & Durable Objects
**Goal:** Implement a scalable, persistent state layer that survives Worker eviction.

> **Prompt:** "I am designing the persistence layer for the `Memory` Durable Object. this.history array is on ram. Validate my implementation pattern: I plan to hydrate state via `await this.ctx.storage.get()` in the constructor or first fetch, and perform a blocking `await this.ctx.storage.put()` after every AI response to ensure data consistency. Are there any potential problems you can think of?"

> **Prompt:** "The Llama 3 model output is being truncated prematurely during detailed resume critiques. I need to adjust the inference parameters to ensure complete responses. Verify the token limits for `@cf/meta/llama-3-8b-instruct` on Workers AI—specifically, is it safe to increase `max_tokens` to 2048 to prevent cutoff without hitting the Worker's execution time limits?"

## 3. Frontend & UX Refinement
**Goal:** Polish the React UI with a modern design system and resolve layout quirks.

> **Prompt:** "I have a functional React chat component with a message list and an input form. The logic is working, but the UI is unstyled. Generate a complete Tailwind CSS template to overlay onto this component. The design should look like a modern AI chat interface (e.g., ChatGPT or Gemini) with rounded chat bubbles with distinct user/assistant colors, and a floating input bar at the bottom"

> **Prompt:** "I am implementing an auto-scrolling feature for the chat window. I need a  `useEffect` implementation to ensure the view anchors to the bottom immediately after a new message is added to the state array."

> **Prompt:** "I am encountering a layout issue where the fixed input bar is covered by at the bottom. Suggest a Tailwind CSS solution to ensure the input bar remains pinned above the browser chrome."

## 4. Persona Engineering (System Prompt)
**Goal:** Tune the LLM behavior to strictly follow specific constraints and handle edge cases.

> **Prompt:** "I need to construct a rigid System Prompt for Llama 3. The persona is a 'Cynical Engineering Recruiter.' It must strictly differentiate between two states:
> 1. **Chat Mode:** If the user asks a question, answer it rudely but helpfully.
> 2. **Analysis Mode:** If the user pastes a resume, roast it based on the STAR method and lack of metrics.
>
> Additionally, generate a prompt strategy that prevents the model from hallucinating specific names (like 'Jane Doe') when the user asks follow-up memory questions if that data isn't in the context window."

## 5. Documentation & Automation
**Goal:** Automate the generation of submission artifacts by synthesizing the development context.

> **Prompt:** "Analyze the development session history and the resulting codebase structure. Synthesize a draft of  `README.md` and `PROMPTS.md` files. For `PROMPTS.md`, do not just list raw chat logs; instead, refactor the specific technical queries we used into a curated, structured log that highlights the architectural validation and debugging steps"
