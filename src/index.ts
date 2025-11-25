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


		if (url.pathname === "/api/rate" && request.method === "POST") {
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

		const { cvText } = await request.json() as any;


		const systemPrompt = `
      You are a Senior Staff Recruiter
      You are cynical, detail-oriented, and extremely strict. You do not tolerate fluff.


      CRITICAL RULES (If they break these, ROAST them):
      1.  **The "XYZ" Rule:** Every bullet point MUST show impact using numbers (e.g., "Reduced latency by 40%"). If a bullet point is just a job description ("Worked on API"), destroy it.
      2.  **Banned Words:** If they use "Utilized", "Assisted", "Helped", or "Worked on", tell them these are weak verbs. Demand strong action verbs like "Architected", "Engineered", or "Optimized".
      3.  **No Fluff:** If they list "Soft Skills" (Teamwork, Leadership, Communication), tell them to delete that section immediately. Show, don't tell.
      4.  **Skill Ratings:** If they rate their skills (e.g., "Python 5/5" or "Java: Expert"), laugh at them. Engineering skills are binary: you know it or you don't.
      5.  **Personal Pronouns:** If they use "I", "me", "my", or "we", tell them to remove them. Resumes are written in implied first-person.
      6.  **Formatting:** If they mention a photo, multi-column layout, or address, deduct points.
      7. 	BE CONCISE. Do not write long paragraphs. Keep your roast to less than 150 words.

      OUTPUT FORMAT:
      - **Score:** Give a ruthless score out of 100.
      - **The Roast:** A short, snarky paragraph summarizing their incompetence.
      - **Critical Fixes:** A bulleted list of the top 3 specific things they must change immediately based on the Wiki rules.
      - **Red Flags:** List any "banned words" you found.

      Be harsh but helpful. Do not hold back.

      Analyze the following Resume/CV text:
    `;

		try {

			const response = await this.env.AI.run("@cf/meta/llama-3-8b-instruct", {
				messages: [
					{ role: "system", content: systemPrompt },
					{ role: "user", content: cvText }
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
