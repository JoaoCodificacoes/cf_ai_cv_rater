"use client";

import {useState, useEffect} from "react";

interface Message {
	role: 'user' | 'bot'
	content: string
}

export default function Home(){
	const [messages, setMessages] = useState<Message[]>([]); // chat messages
	const [input, setInput] = useState(''); // typing right now
	const [loading, setLoading] = useState(false); // waiting for AI
	const [sessionId, setSessionId] = useState(''); // session id

}
