import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import TypeEffectiveness from './TypeEffectiveness';
import MoveDetailsModal from './MoveDetailsModal';
import AbilityTooltip from './AbilityTooltip';
import type { PokemonStats } from '../data/pokemon-types';
import type { MoveData } from '../data/move-types';

interface PokemonModalProps {
  pokemon: PokemonStats | null;
  isOpen: boolean;
  onClose: () => void;
}

const PokemonModal: React.FC<PokemonModalProps> = ({ pokemon, isOpen, onClose }) => {
  const [allMoves, setAllMoves] = useState<MoveData[]>([]);
  const [selectedMove, setSelectedMove] = useState<MoveData | null>(null);
  const [moveModalOpen, setMoveModalOpen] = useState(false);

  useEffect(() => {
    const fetchMoves = async () => {
      try {
        const response = await fetch('/api/moves');
        const data = await response.json();
        setAllMoves(data);
      } catch (error) {
        console.error('Failed to fetch moves:', error);
      }
    };

    if (isOpen) {
      fetchMoves();
    }
  }, [isOpen]);

  const handleMoveClick = (moveName: string) => {
    // Clean up move name for matching (remove underscores, normalize case)
    const cleanMoveName = moveName.replace(/_/g, ' ').toLowerCase();
    const move = allMoves.find(m => m.name.toLowerCase() === cleanMoveName);

    if (move) {
      setSelectedMove(move);
      setMoveModalOpen(true);
    }
  };

  if (!pokemon) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">{pokemon.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            {/* Types */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Types</h3>
              <div className="flex gap-2">
                {pokemon.types.map((type, index) => (
                  <Badge key={index} className={`type-${type.toLowerCase().replace(' ', '')}`}>
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Base Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">HP:</span>
                    <span className="font-bold text-green-600">{pokemon.hp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Attack:</span>
                    <span className="font-bold text-red-600">{pokemon.attack}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Defense:</span>
                    <span className="font-bold text-blue-600">{pokemon.defense}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Speed:</span>
                    <span className="font-bold text-yellow-600">{pokemon.speed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sp. Attack:</span>
                    <span className="font-bold text-purple-600">{pokemon.specialAttack}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sp. Defense:</span>
                    <span className="font-bold text-indigo-600">{pokemon.specialDefense}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t">
                <div className="flex justify-between">
                  <span className="font-semibold">Base Stat Total:</span>
                  <span className="font-bold text-lg">{pokemon.bst}</span>
                </div>
              </div>
            </div>

            {/* Abilities */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Abilities</h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((ability, index) => (
                  <AbilityTooltip key={index} abilityName={ability}>
                    <Badge variant="secondary" className="cursor-help hover:bg-blue-100 transition-colors">
                      {ability}
                    </Badge>
                  </AbilityTooltip>
                ))}
              </div>
            </div>

            {/* Game Info */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Game Info</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Catch Rate:</span>
                  <span className="font-medium">{pokemon.catchRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Base EXP:</span>
                  <span className="font-medium">{pokemon.baseExp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Growth Rate:</span>
                  <span className="font-medium capitalize">{pokemon.growthRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">EV Yield:</span>
                  <span className="font-medium">{pokemon.evYield}</span>
                </div>
              </div>
            </div>

            {/* Egg Groups */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Egg Groups</h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.eggGroups.map((group, index) => (
                  <Badge key={index} variant="outline">
                    {group}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - Learnset */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Learnset</h3>
            {pokemon.learnset && pokemon.learnset.length > 0 ? (
              <div className="max-h-96 overflow-y-auto border rounded-lg p-4">
                <div className="space-y-2">
                  {pokemon.learnset
                    .sort((a, b) => a.level - b.level)
                    .map((move, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 px-3 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                        onClick={() => handleMoveClick(move.move)}
                      >
                        <span className="font-medium text-blue-600 hover:text-blue-800">{move.move}</span>
                        <Badge variant="outline" className="ml-2">
                          Lv. {move.level}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No learnset data available</p>
            )}
          </div>

          {/* Right Column - Type Effectiveness */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Type Effectiveness</h3>
            <TypeEffectiveness pokemonTypes={pokemon.types} />
          </div>
        </div>

        <MoveDetailsModal
          move={selectedMove}
          isOpen={moveModalOpen}
          onClose={() => setMoveModalOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PokemonModal;