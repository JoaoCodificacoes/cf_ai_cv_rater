import { DurableObject, env } from 'cloudflare:workers';

export interface Env {
	AI: any;
	Memory: DurableObjectNamespace;
	ASSETS: Fetcher;
}


export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);


		if (url.pathname === "/") {
			return env.ASSETS.fetch(request);
		}


		if (url.pathname === "/api/chat" && request.method === "POST") {
			const { sessionId } = await request.clone().json() as any;


			const id = env.Memory.idFromName(sessionId || "default");
			const stub = env.Memory.get(id);


			return stub.fetch(request);
		}


		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler<Env>;


export class Memory extends DurableObject<Env> {

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async fetch(request: Request): Promise<Response> {
		const body = await request.json();

		const userContent = body.message

		if (!userContent) return new Response(JSON.stringify({ response: "Error: No message provided" }), { status: 400 });

		let history = (await this.ctx.storage.get("history")) as { role: string, content: string }[] || [];
		history.push({ role: "user", content: userContent });

		const systemPrompt = `
      You are a cynical, impatient Senior Staff Recruiter at a top tech company.
      You have 30 seconds to review a candidate.

      PRIORITY DIRECTIVE: MEMORY CHECK
      If the user asks "What is my name?" or "What did we talk about?":
      1. SEARCH the chat history below.
      2. IF YOU FIND THE INFO: Quote it and mock them for forgetting.
         (Example: "You literally just said your name is [Name]. Focus.")
      3. IF YOU DO NOT FIND THE INFO: Mock them for asking me questions they haven't answered yet.
         (Example: "You haven't told me your name yet. I'm a recruiter, not a psychic. Paste your resume.")

      **DO NOT HALLUCINATE.** If the info is missing, admit it aggressively.

      LOGIC FLOW:
      **CASE 1: WASTING TIME** (Hello, Hi, Help) -> BE RUDE.
      - Say: "I don't have all day. Paste the resume or get out."

      **CASE 2: RESUME DETECTED** -> DESTROY IT.
      Apply **Elite Engineering Hiring Standards**:

      1. **The "XYZ" Rule:** Every bullet point MUST show impact using numbers.
      2. **Banned Words:** Hate "Utilized", "Assisted", "Helped".
      3. **No Fluff:** Soft Skills = Delete immediately.

      OUTPUT FORMAT (For Resume Roasts ONLY):
      - **Score:** X/100
      - **The Roast:** Snarky paragraph.
      - **Critical Fixes:** Bullet points.
    `;

		try {
			const messages = [
				{ role: "system", content: systemPrompt },
				...history
			]
			const response = await this.env.AI.run("@cf/meta/llama-3-8b-instruct", {
				messages,
				max_tokens: 1024,
				temperature: 0.7

			});

			const botReply = response.response || JSON.stringify(response);
			history.push({ role: "assistant", content: botReply });
			await this.ctx.storage.put("history", history);

			return new Response(JSON.stringify(response), {
				headers: { "Content-Type": "application/json" }
			});
		} catch (err) {
			return new Response(JSON.stringify({ response: "Error: " + err }), { status: 500 });
		}
	}

	__DURABLE_OBJECT_BRAND: never;
}
