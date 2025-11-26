'use client';

import { useState, useEffect } from 'react';

interface Message {
	role: 'user' | 'bot';
	content: string;
}

export default function Home() {
	const [messages, setMessages] = useState<Message[]>([]); // chat messages
	const [input, setInput] = useState(''); // typing right now
	const [loading, setLoading] = useState(false); // waiting for AI
	const [sessionId, setSessionId] = useState(''); // session id

	useEffect(() => {
		// Get session id
		let id = localStorage.getItem('sessionId');
		if (!id) {
			// Generate session id
			id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			localStorage.setItem('sessionId', id);
		}
		setSessionId(id);
	}, []);

	async function sendMessage() {
		if (!input.trim()) return; // dont send empty messages

		const userMsg: Message = { role: 'user', content: input };

		setMessages(prev => [...prev, userMsg]);

		const text = input;
		setInput('');
		setLoading(true);

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: text,
					sessionId: sessionId
				})
			});

			const data = await response.json();


			const botMsg: Message = { role: 'bot', content: data.response };

			setMessages(prev => [...prev, botMsg]);

		} catch (e) {
			alert('Something went wrong, please try again later.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<main className="flex flex-col h-screen bg-black text-white">
			<div className="flex-1 overflow-y-auto p-4 space-y-4 w-full max-w-3xl mx-auto">

			</div>
			<div className="p-4 w-full">
				<div className="flex items-center gap-2 p-2 bg-zinc-900 rounded-full border border-zinc-800 max-w-3xl mx-auto">
					<input
						type="text"
						placeholder="Ask me about your CV"
						className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-white placeholder-zinc-400"
						value={input}
						onChange={e => setInput(e.target.value)}
					/>

					<button onClick={sendMessage}
									className="px-6 py-2 hover:bg-orange-500 rounded-full hover:bg-orange-600 text-white font-bold transition-colors"
					>
						Send
					</button>

				</div>

			</div>

		</main>
	);
}
