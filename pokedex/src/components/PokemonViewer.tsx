import React, { useState, useEffect, useMemo } from 'react';
import type { PokemonStats } from '../data/pokemon-types';
import PokemonModal from './PokemonModal';

interface Filters {
  search: string;
  types: string[];
  abilities: string[];
  minBST: number;
  maxBST: number;
  minHP: number;
  maxHP: number;
  minAttack: number;
  maxAttack: number;
  minDefense: number;
  maxDefense: number;
  minSpeed: number;
  maxSpeed: number;
  minSpecialAttack: number;
  maxSpecialAttack: number;
  minSpecialDefense: number;
  maxSpecialDefense: number;
  growthRates: string[];
  eggGroups: string[];
}

type SortOption = 'name' | 'bst' | 'hp' | 'attack' | 'defense' | 'speed' | 'specialAttack' | 'specialDefense' | 'catchRate' | 'baseExp';
type SortDirection = 'asc' | 'desc';

const PokemonViewer: React.FC = () => {
  const [allPokemon, setAllPokemon] = useState<PokemonStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonStats | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const [filters, setFilters] = useState<Filters>({
    search: '',
    types: [],
    abilities: [],
    minBST: 0,
    maxBST: 1000,
    minHP: 0,
    maxHP: 300,
    minAttack: 0,
    maxAttack: 300,
    minDefense: 0,
    maxDefense: 300,
    minSpeed: 0,
    maxSpeed: 300,
    minSpecialAttack: 0,
    maxSpecialAttack: 300,
    minSpecialDefense: 0,
    maxSpecialDefense: 300,
    growthRates: [],
    eggGroups: []
  });

  // Get unique values for filter options
  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    allPokemon.forEach(p => p.types.forEach(type => types.add(type)));
    return Array.from(types).sort();
  }, [allPokemon]);

  const uniqueAbilities = useMemo(() => {
    const abilities = new Set<string>();
    allPokemon.forEach(p => p.abilities.forEach(ability => abilities.add(ability)));
    return Array.from(abilities).sort();
  }, [allPokemon]);

  const uniqueGrowthRates = useMemo(() => {
    const rates = new Set<string>();
    allPokemon.forEach(p => rates.add(p.growthRate));
    return Array.from(rates).filter(rate => rate).sort();
  }, [allPokemon]);

  const uniqueEggGroups = useMemo(() => {
    const groups = new Set<string>();
    allPokemon.forEach(p => p.eggGroups.forEach(group => groups.add(group)));
    return Array.from(groups).filter(group => group).sort();
  }, [allPokemon]);

  useEffect(() => {
    fetchPokemon();
  }, []);

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pokemon');
      const data = await response.json();
      setAllPokemon(data);
    } catch (error) {
      console.error('Failed to fetch Pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtered and sorted Pokemon
  const filteredAndSortedPokemon = useMemo(() => {
    let filtered = allPokemon.filter(pokemon => {
      // Text search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = pokemon.name.toLowerCase().includes(searchLower) ||
          pokemon.types.some(type => type.toLowerCase().includes(searchLower)) ||
          pokemon.abilities.some(ability => ability.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Type filters
      if (filters.types.length > 0) {
        const hasRequiredType = filters.types.some(type => pokemon.types.includes(type));
        if (!hasRequiredType) return false;
      }

      // Ability filters
      if (filters.abilities.length > 0) {
        const hasRequiredAbility = filters.abilities.some(ability => pokemon.abilities.includes(ability));
        if (!hasRequiredAbility) return false;
      }

      // Growth rate filters
      if (filters.growthRates.length > 0) {
        if (!filters.growthRates.includes(pokemon.growthRate)) return false;
      }

      // Egg group filters
      if (filters.eggGroups.length > 0) {
        const hasRequiredEggGroup = filters.eggGroups.some(group => pokemon.eggGroups.includes(group));
        if (!hasRequiredEggGroup) return false;
      }

      // Stat range filters
      if (pokemon.bst < filters.minBST || pokemon.bst > filters.maxBST) return false;
      if (pokemon.hp < filters.minHP || pokemon.hp > filters.maxHP) return false;
      if (pokemon.attack < filters.minAttack || pokemon.attack > filters.maxAttack) return false;
      if (pokemon.defense < filters.minDefense || pokemon.defense > filters.maxDefense) return false;
      if (pokemon.speed < filters.minSpeed || pokemon.speed > filters.maxSpeed) return false;
      if (pokemon.specialAttack < filters.minSpecialAttack || pokemon.specialAttack > filters.maxSpecialAttack) return false;
      if (pokemon.specialDefense < filters.minSpecialDefense || pokemon.specialDefense > filters.maxSpecialDefense) return false;

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: number | string = a[sortBy];
      let bValue: number | string = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [allPokemon, filters, sortBy, sortDirection]);

  const handlePokemonClick = (poke: PokemonStats) => {
    setSelectedPokemon(poke);
    setModalOpen(true);
  };

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (filterKey: 'types' | 'abilities' | 'growthRates' | 'eggGroups', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: prev[filterKey].includes(value)
        ? prev[filterKey].filter(item => item !== value)
        : [...prev[filterKey], value]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      types: [],
      abilities: [],
      minBST: 0,
      maxBST: 1000,
      minHP: 0,
      maxHP: 300,
      minAttack: 0,
      maxAttack: 300,
      minDefense: 0,
      maxDefense: 300,
      minSpeed: 0,
      maxSpeed: 300,
      minSpecialAttack: 0,
      maxSpecialAttack: 300,
      minSpecialDefense: 0,
      maxSpecialDefense: 300,
      growthRates: [],
      eggGroups: []
    });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    count += filters.types.length;
    count += filters.abilities.length;
    count += filters.growthRates.length;
    count += filters.eggGroups.length;

    // Check if any stat ranges are not at default
    if (filters.minBST > 0 || filters.maxBST < 1000) count++;
    if (filters.minHP > 0 || filters.maxHP < 300) count++;
    if (filters.minAttack > 0 || filters.maxAttack < 300) count++;
    if (filters.minDefense > 0 || filters.maxDefense < 300) count++;
    if (filters.minSpeed > 0 || filters.maxSpeed < 300) count++;
    if (filters.minSpecialAttack > 0 || filters.maxSpecialAttack < 300) count++;
    if (filters.minSpecialDefense > 0 || filters.maxSpecialDefense < 300) count++;

    return count;
  }, [filters]);

  return (
    <div className="pokemon-viewer">
      <h1>Pokémon Stats Viewer</h1>

      <div className="controls-container">
        <div className="search-and-sort">
          <input
            type="text"
            placeholder="Search by name, type, or ability..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="search-input"
          />

          <div className="sort-controls">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="sort-select"
            >
              <option value="name">Name</option>
              <option value="bst">BST</option>
              <option value="hp">HP</option>
              <option value="attack">Attack</option>
              <option value="defense">Defense</option>
              <option value="speed">Speed</option>
              <option value="specialAttack">Sp. Attack</option>
              <option value="specialDefense">Sp. Defense</option>
              <option value="catchRate">Catch Rate</option>
              <option value="baseExp">Base Exp</option>
            </select>

            <button
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="sort-direction-btn"
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-toggle-btn ${activeFiltersCount > 0 ? 'has-filters' : ''}`}
          >
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>
        </div>

        <div className="results-info">
          {loading ? 'Loading...' : `${filteredAndSortedPokemon.length} of ${allPokemon.length} Pokemon`}
          {activeFiltersCount > 0 && (
            <button onClick={clearAllFilters} className="clear-filters-btn">
              Clear All Filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-section">
              <h3>Types</h3>
              <div className="filter-chips">
                {uniqueTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => toggleArrayFilter('types', type)}
                    className={`filter-chip type-${type.toLowerCase()} ${filters.types.includes(type) ? 'active' : ''}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Abilities</h3>
              <div className="filter-chips">
                {uniqueAbilities.slice(0, 20).map(ability => (
                  <button
                    key={ability}
                    onClick={() => toggleArrayFilter('abilities', ability)}
                    className={`filter-chip ${filters.abilities.includes(ability) ? 'active' : ''}`}
                  >
                    {ability}
                  </button>
                ))}
              </div>
              {uniqueAbilities.length > 20 && (
                <div className="filter-note">Showing first 20 abilities. Use search to find specific ones.</div>
              )}
            </div>

            <div className="filter-section">
              <h3>Stat Ranges</h3>
              <div className="stat-ranges">
                <div className="stat-range">
                  <label>BST: {filters.minBST} - {filters.maxBST}</label>
                  <div className="range-inputs">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.minBST}
                      onChange={(e) => updateFilter('minBST', Number(e.target.value))}
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.maxBST}
                      onChange={(e) => updateFilter('maxBST', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="stat-range">
                  <label>HP: {filters.minHP} - {filters.maxHP}</label>
                  <div className="range-inputs">
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={filters.minHP}
                      onChange={(e) => updateFilter('minHP', Number(e.target.value))}
                    />
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={filters.maxHP}
                      onChange={(e) => updateFilter('maxHP', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="stat-range">
                  <label>Attack: {filters.minAttack} - {filters.maxAttack}</label>
                  <div className="range-inputs">
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={filters.minAttack}
                      onChange={(e) => updateFilter('minAttack', Number(e.target.value))}
                    />
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={filters.maxAttack}
                      onChange={(e) => updateFilter('maxAttack', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="stat-range">
                  <label>Defense: {filters.minDefense} - {filters.maxDefense}</label>
                  <div className="range-inputs">
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={filters.minDefense}
                      onChange={(e) => updateFilter('minDefense', Number(e.target.value))}
                    />
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={filters.maxDefense}
                      onChange={(e) => updateFilter('maxDefense', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="stat-range">
                  <label>Speed: {filters.minSpeed} - {filters.maxSpeed}</label>
                  <div className="range-inputs">
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={filters.minSpeed}
                      onChange={(e) => updateFilter('minSpeed', Number(e.target.value))}
                    />
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={filters.maxSpeed}
                      onChange={(e) => updateFilter('maxSpeed', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="stat-range">
                  <label>Sp. Attack: {filters.minSpecialAttack} - {filters.maxSpecialAttack}</label>
                  <div className="range-inputs">
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={filters.minSpecialAttack}
                      onChange={(e) => updateFilter('minSpecialAttack', Number(e.target.value))}
                    />
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={filters.maxSpecialAttack}
                      onChange={(e) => updateFilter('maxSpecialAttack', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="stat-range">
                  <label>Sp. Defense: {filters.minSpecialDefense} - {filters.maxSpecialDefense}</label>
                  <div className="range-inputs">
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={filters.minSpecialDefense}
                      onChange={(e) => updateFilter('minSpecialDefense', Number(e.target.value))}
                    />
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={filters.maxSpecialDefense}
                      onChange={(e) => updateFilter('maxSpecialDefense', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="filter-section">
              <h3>Growth Rates</h3>
              <div className="filter-chips">
                {uniqueGrowthRates.map(rate => (
                  <button
                    key={rate}
                    onClick={() => toggleArrayFilter('growthRates', rate)}
                    className={`filter-chip ${filters.growthRates.includes(rate) ? 'active' : ''}`}
                  >
                    {rate}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Egg Groups</h3>
              <div className="filter-chips">
                {uniqueEggGroups.map(group => (
                  <button
                    key={group}
                    onClick={() => toggleArrayFilter('eggGroups', group)}
                    className={`filter-chip ${filters.eggGroups.includes(group) ? 'active' : ''}`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pokemon-container">
        <div className="pokemon-list">
          {filteredAndSortedPokemon.map((poke) => (
            <div
              key={poke.name}
              className={`pokemon-card ${selectedPokemon?.name === poke.name ? 'selected' : ''}`}
              onClick={() => handlePokemonClick(poke)}
            >
              <div className="pokemon-header">
                <h3>{poke.name}</h3>
                <div className="pokemon-types">
                  {poke.types.map((type) => (
                    <span key={type} className={`type-badge type-${type.toLowerCase()}`}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pokemon-basic-stats">
                <span>BST: {poke.bst}</span>
                <span>HP: {poke.hp}</span>
                <span>ATK: {poke.attack}</span>
                <span>DEF: {poke.defense}</span>
                <span>SPE: {poke.speed}</span>
                <span>SPA: {poke.specialAttack}</span>
                <span>SPD: {poke.specialDefense}</span>
                <span></span>
              </div>
            </div>
          ))}
        </div>

        {selectedPokemon && (
          <div className="pokemon-details">
            <h2>{selectedPokemon.name} Details</h2>

            <div className="detail-section">
              <h3>Base Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">HP:</span>
                  <span className="stat-value">{selectedPokemon.hp}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Attack:</span>
                  <span className="stat-value">{selectedPokemon.attack}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Defense:</span>
                  <span className="stat-value">{selectedPokemon.defense}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Speed:</span>
                  <span className="stat-value">{selectedPokemon.speed}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Sp. Attack:</span>
                  <span className="stat-value">{selectedPokemon.specialAttack}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Sp. Defense:</span>
                  <span className="stat-value">{selectedPokemon.specialDefense}</span>
                </div>
                <div className="stat-item total">
                  <span className="stat-label">Base Stat Total:</span>
                  <span className="stat-value">{selectedPokemon.bst}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Types</h3>
              <div className="types-list">
                {selectedPokemon.types.map((type) => (
                  <span key={type} className={`type-badge type-${type.toLowerCase()}`}>
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Abilities</h3>
              <div className="abilities-list">
                {selectedPokemon.abilities.map((ability, index) => (
                  <span key={ability} className="ability-badge">
                    {ability} {index === selectedPokemon.abilities.length - 1 ? '(Hidden)' : ''}
                  </span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Other Info</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Catch Rate:</span>
                  <span className="info-value">{selectedPokemon.catchRate}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Base Experience:</span>
                  <span className="info-value">{selectedPokemon.baseExp}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Growth Rate:</span>
                  <span className="info-value">{selectedPokemon.growthRate}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Egg Groups:</span>
                  <span className="info-value">{selectedPokemon.eggGroups.join(', ')}</span>
                </div>
                {selectedPokemon.evYield && (
                  <div className="info-item">
                    <span className="info-label">EV Yield:</span>
                    <span className="info-value">{selectedPokemon.evYield}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <PokemonModal
        pokemon={selectedPokemon}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default PokemonViewer;