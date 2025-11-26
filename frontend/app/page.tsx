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
					sessionId: sessionId,
				}),
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

	)
}
