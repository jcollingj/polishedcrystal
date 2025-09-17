import React, { useState, useEffect, useRef } from 'react';
import { Badge } from './ui/badge';
import MoveDetailsModal from './MoveDetailsModal';
import type { MoveData } from '../data/move-types';

const MovesExplorer: React.FC = () => {
  const [allMoves, setAllMoves] = useState<MoveData[]>([]);
  const [filteredMoves, setFilteredMoves] = useState<MoveData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMove, setSelectedMove] = useState<MoveData | null>(null);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const moveTypes = [
    'Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel',
    'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark', 'Fairy'
  ];

  const moveCategories = ['Physical', 'Special', 'Status'];

  useEffect(() => {
    const fetchMoves = async () => {
      try {
        const response = await fetch('/api/moves');
        const data = await response.json();
        setAllMoves(data);
        setFilteredMoves(data);
      } catch (error) {
        console.error('Failed to fetch moves:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoves();
  }, []);

  // Auto-focus search input on page load
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let filtered = allMoves;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(move =>
        move.name.toLowerCase().includes(searchLower) ||
        move.type.toLowerCase().includes(searchLower) ||
        move.effect.toLowerCase().includes(searchLower) ||
        move.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(move => move.type === selectedType);
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(move => move.category === selectedCategory);
    }

    setFilteredMoves(filtered);
  }, [allMoves, searchTerm, selectedType, selectedCategory]);

  const handleMoveClick = (move: MoveData) => {
    setSelectedMove(move);
    setMoveModalOpen(true);
  };

  const getPowerDisplay = (power: number) => {
    if (power === 0) return '—';
    if (power === 1) return 'Var';
    return power.toString();
  };

  const getAccuracyDisplay = (accuracy: number) => {
    if (accuracy === -1) return '—';
    return `${accuracy}%`;
  };

  const formatType = (type: string) => type.toLowerCase().replace(' ', '');

  if (loading) {
    return (
      <div className="pokemon-viewer">
        <h1>Moves Explorer</h1>
        <div className="text-center py-8">Loading moves...</div>
      </div>
    );
  }

  return (
    <div className="pokemon-viewer">
      <h1>Moves Explorer</h1>

      <div className="controls-container">
        <div className="search-and-sort">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search moves by name, type, effect, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="sort-select"
          >
            <option value="">All Types</option>
            {moveTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="sort-select"
          >
            <option value="">All Categories</option>
            {moveCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="results-info">
          <span>Showing {filteredMoves.length} of {allMoves.length} moves</span>
          {(searchTerm || selectedType || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('');
                setSelectedCategory('');
              }}
              className="clear-filters-btn"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="pokemon-container">
        <div className="pokemon-list">
          {filteredMoves.map((move, index) => (
            <div
              key={index}
              className="pokemon-card cursor-pointer"
              onClick={() => handleMoveClick(move)}
            >
              <div className="pokemon-header">
                <h3>{move.name}</h3>
                <div className="pokemon-types">
                  <Badge className={`type-${formatType(move.type)} text-xs`}>
                    {move.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs ml-1">
                    {move.category}
                  </Badge>
                </div>
              </div>

              <div className="pokemon-basic-stats">
                <span>Power: {getPowerDisplay(move.power)}</span>
                <span>Acc: {getAccuracyDisplay(move.accuracy)}</span>
                <span>PP: {move.pp}</span>
                <span>Effect: {move.effectChance > 0 ? `${move.effectChance}%` : '—'}</span>
              </div>

              {move.description && (
                <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {move.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <MoveDetailsModal
        move={selectedMove}
        isOpen={moveModalOpen}
        onClose={() => setMoveModalOpen(false)}
      />
    </div>
  );
};

export default MovesExplorer;