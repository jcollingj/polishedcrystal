export interface PokemonStats {
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  specialAttack: number;
  specialDefense: number;
  bst: number;
  types: string[];
  catchRate: number;
  baseExp: number;
  abilities: string[];
  growthRate: string;
  eggGroups: string[];
  evYield: string;
  learnset: PokemonMove[];
}

export interface PokemonMove {
  level: number;
  move: string;
}
