interface ChatInputProps {
	input: string;
	setInput: (value: string) => void;
	sendMessage: () => void;
	loading: boolean;
}

export default function ChatInput({ input, setInput, sendMessage, loading }: ChatInputProps) {
	return (
		<div className="w-full">
			<div className="flex items-center gap-2 p-2 bg-zinc-900 rounded-full border border-zinc-800 max-w-3xl mx-auto">
				<input
					type="text"
					placeholder="Ask me about your CV"
					className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-white placeholder-zinc-400"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
				/>

				<button
					onClick={sendMessage}
					disabled={loading || !input.trim()}
					className="px-6 py-2 rounded-full hover:bg-blue-600 text-white font-bold transition-colors disabled:opacity-50"
				>
					{loading ? '...' : 'Send'}
				</button>
			</div>
		</div>
	);
}
