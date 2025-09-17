import React, { useState } from "react";
import PokemonViewer from "./components/PokemonViewer";
import MovesExplorer from "./components/MovesExplorer";
import "./components/PokemonViewer.css";
import "./index.css";

type ViewMode = 'pokemon' | 'moves';

export function App() {
    const [currentView, setCurrentView] = useState<ViewMode>('pokemon');

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b-2 border-gray-200 p-4 mb-6">
                <div className="max-w-6xl mx-auto flex justify-center gap-4">
                    <button
                        onClick={() => setCurrentView('pokemon')}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            currentView === 'pokemon'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        📱 Pokémon
                    </button>
                    <button
                        onClick={() => setCurrentView('moves')}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            currentView === 'moves'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        ⚔️ Moves
                    </button>
                </div>
            </nav>

            {currentView === 'pokemon' ? <PokemonViewer /> : <MovesExplorer />}
        </div>
    );
}

export default App;
