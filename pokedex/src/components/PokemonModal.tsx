import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import type { PokemonStats } from '../data/pokemon-types';

interface PokemonModalProps {
  pokemon: PokemonStats | null;
  isOpen: boolean;
  onClose: () => void;
}

const PokemonModal: React.FC<PokemonModalProps> = ({ pokemon, isOpen, onClose }) => {
  if (!pokemon) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">{pokemon.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  <Badge key={index} variant="secondary">
                    {ability}
                  </Badge>
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

          {/* Right Column - Learnset */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Learnset</h3>
            {pokemon.learnset && pokemon.learnset.length > 0 ? (
              <div className="max-h-96 overflow-y-auto border rounded-lg p-4">
                <div className="space-y-2">
                  {pokemon.learnset
                    .sort((a, b) => a.level - b.level)
                    .map((move, index) => (
                      <div key={index} className="flex justify-between items-center py-2 px-3 hover:bg-gray-50 rounded">
                        <span className="font-medium">{move.move}</span>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PokemonModal;