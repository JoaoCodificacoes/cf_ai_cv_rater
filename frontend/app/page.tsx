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

}
