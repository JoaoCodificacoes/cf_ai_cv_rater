interface ChatBubbleProps {
	role: 'user' | 'bot';
	content: string;
	key: number;
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
	const isUser = role === 'user';

	return (
		<div className={`flex items-center gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
			<p
				className={`px-4 py-2 rounded-2xl max-w-xs whitespace-pre-wrap ${
					isUser
						? 'bg-blue-600 text-white rounded-br-none'
						: 'bg-orange-800 text-zinc-200 border border-orange-700 rounded-bl-none'
				}`}
			>
				{content}
			</p>
		</div>
	);
}
