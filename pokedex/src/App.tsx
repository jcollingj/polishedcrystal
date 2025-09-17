import PokemonViewer from "./components/PokemonViewer";
import "./components/PokemonViewer.css";
import "./index.css";

export function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PokemonViewer />
        </div>
    );
}

export default App;
