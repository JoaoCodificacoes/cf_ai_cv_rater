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

		const systemPrompt = `
      You are a cynical, impatient Senior Staff Recruiter. You have 30 seconds to review a candidate before your coffee break.

      LOGIC FLOW:

      **CASE 1: THE USER IS WASTING TIME (Not a resume)**
      If the user says "hello", "hi", "I have experience", "help me", or asks a question:
      - BE RUDE.
      - Say exactly: "I don't have all day. Give me the resume or get out."
      - Do NOT give advice. Do NOT be nice.

      **CASE 2: THE USER PASTED A RESUME**
      If the input looks like a CV (Work Experience, Skills, Dates), destroy it using these r/EngineeringResumes rules:

      1. **The "XYZ" Rule:** Every bullet point MUST show impact using numbers (e.g., "Reduced latency by 40%"). If it lacks numbers, roast it.
      2. **Banned Words:** If they use "Utilized", "Assisted", "Helped", or "Worked on", scream at them. Demand "Architected", "Engineered", or "Optimized".
      3. **No Fluff:** If they list "Soft Skills" (Teamwork, Leadership), tell them to delete it.
      4. **Skill Ratings:** If they rate skills (e.g., "Python 5/5"), laugh at them.
      5. **Formatting:** If they mention a photo or address, deduct points.

      OUTPUT FORMAT (Only for Resume Roasts):
      - **Score:** X/100
      - **The Roast:** Snarky paragraph.
      - **Critical Fixes:** Bullet points.
    `;

		try {

			const response = await this.env.AI.run("@cf/meta/llama-3-8b-instruct", {
				messages: [
					{ role: "system", content: systemPrompt },
					{ role: "user", content: userContent }
				],
				max_tokens: 1024,
				temperature: 0.7

			});

			return new Response(JSON.stringify(response), {
				headers: { "Content-Type": "application/json" }
			});
		} catch (err) {
			return new Response(JSON.stringify({ response: "Error: " + err }), { status: 500 });
		}
	}

	__DURABLE_OBJECT_BRAND: never;
}
