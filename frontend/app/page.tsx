'use client';

import { useState, useEffect, useRef } from 'react';
import ChatInput from '@/components/ChatInput';
import ChatBubble from '@/components/ChatBubble';

interface Message {
	role: 'user' | 'bot';
	content: string;
}

// Constants
const SESSION_ID_LENGTH = 15;
const SESSION_ID_RADIX = 36;
const SESSION_ID_START_INDEX = 2;
const STORAGE_KEY_SESSION_ID = 'sessionId';

export default function Home() {
	const [messages, setMessages] = useState<Message[]>([]); // chat messages
	const [input, setInput] = useState(''); // typing right now
	const [loading, setLoading] = useState(false); // waiting for AI
	const [sessionId, setSessionId] = useState(''); // session id

	useEffect(() => {
		// Get session id
		let id = localStorage.getItem(STORAGE_KEY_SESSION_ID);
		if (!id) {
			// Generate session id
			id = Math.random().toString(SESSION_ID_RADIX).substring(SESSION_ID_START_INDEX, SESSION_ID_LENGTH) +
				Math.random().toString(SESSION_ID_RADIX).substring(SESSION_ID_START_INDEX, SESSION_ID_LENGTH);
			localStorage.setItem(STORAGE_KEY_SESSION_ID, id);
		}
		setSessionId(id);
	}, []);

	const bottomRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (bottomRef.current) {
			(bottomRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'end' });
		}
	}, [messages, loading]);

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

			<div className="flex-1 overflow-y-auto flex flex-col gap-y-4 w-full max-w-3xl mx-auto scrollbar-hide p-4 ">

				{messages.length === 0 && (
					<div className="flex flex-col items-center justify-center flex-1 text-zinc-500">
						<p className="text-xl font-bold">I'm ready to roast you</p>
						<p className="text-lg">Paste your CV</p>
					</div>
				)}

				{messages.map((msg, i) => (
					<ChatBubble key={i} role={msg.role} content={msg.content} />
				))}

				<div ref={bottomRef} />

			</div>

			<div className="w-full max-w-3xl mx-auto p-4 sticky bottom-0 bg-black">

			<ChatInput
					input={input}
					setInput={setInput}
					sendMessage={sendMessage}
					loading={loading}
				/>
			</div>

		</main>
	);
}
