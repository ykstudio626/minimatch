import { useState } from 'react';
import MatchingForm from './components/MatchingForm';
import ResultsDisplay from './components/ResultsDisplay';
import type { MatchingResult } from './types';

interface AppState {
  results: MatchingResult[] | null;
  recommendedActions: string[];
}

export default function App() {
  const [state, setState] = useState<AppState>({
    results: null,
    recommendedActions: [],
  });

  const handleResultsReceived = (results: MatchingResult[], recommendedActions: string[]) => {
    setState({ results, recommendedActions });
  };

  const handleBackToForm = () => {
    setState({ results: null, recommendedActions: [] });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold">miniMatch</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {state.results === null ? (
          <MatchingForm onResultsReceived={handleResultsReceived} />
        ) : (
          <ResultsDisplay 
            results={state.results}
            recommendedActions={state.recommendedActions}
            onBackToForm={handleBackToForm} 
          />
        )}
      </main>
    </div>
  );
}
