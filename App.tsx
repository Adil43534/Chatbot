
import React, { useState, useCallback } from 'react';
import { getGeminiResponse } from './services/geminiService';
import { SparklesIcon, PaperAirplaneIcon, ExclamationTriangleIcon } from './components/Icons';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAnswer('');

    try {
      const response = await getGeminiResponse(query);
      setAnswer(response);
    } catch (err) {
      setError('Failed to get a response. Please check your connection and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [query, isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 text-slate-200 font-sans p-4 flex flex-col items-center">
      <main className="w-full max-w-3xl flex-grow flex flex-col justify-center">
        <header className="text-center mb-8">
          <div className="inline-block bg-sky-500/10 p-4 rounded-full mb-4">
            <SparklesIcon className="w-10 h-10 text-sky-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
            AI Query Assistant
          </h1>
          <p className="mt-4 text-lg text-slate-400">Ask anything. Get answers from Gemini.</p>
        </header>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/20 border border-slate-700 p-6 flex-grow flex flex-col">
          <div id="response-container" className="flex-grow overflow-y-auto mb-6 pr-2 custom-scrollbar">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center space-x-3 text-slate-400">
                  <div className="w-3 h-3 bg-sky-400 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-sky-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-3 h-3 bg-sky-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                  <span className="text-lg">Thinking...</span>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-lg flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold">Error</h3>
                  <p>{error}</p>
                </div>
              </div>
            )}
            {answer && !isLoading && (
              <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white prose-strong:text-sky-400 max-w-none whitespace-pre-wrap">
                {answer}
              </div>
            )}
            {!answer && !isLoading && !error && (
                <div className="text-center text-slate-500 h-full flex flex-col justify-center items-center">
                    <p className="text-xl">Your answer will appear here.</p>
                    <p>What knowledge are you seeking today?</p>
                </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question, for example: 'Why is the sky blue?'"
              className="w-full bg-slate-900/70 border border-slate-700 rounded-xl p-4 pr-16 resize-none focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all duration-300 text-slate-200 placeholder-slate-500"
              rows={3}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    handleSubmit(e as any);
                }
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute bottom-3 right-3 h-10 w-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 disabled:scale-100"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
        <footer className="text-center text-slate-600 mt-8 text-sm">
          <p>Powered by Google Gemini. UI crafted for clarity and function.</p>
        </footer>
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(134, 239, 172, 0.1);
          border-radius: 20px;
          border: 3px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(56, 189, 248, 0.5);
        }
      `}</style>
    </div>
  );
};

export default App;
