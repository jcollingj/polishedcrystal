// Type effectiveness data based on Pokemon ROM type_matchups.asm
export type EffectivenessValue = 'super' | 'normal' | 'not_very' | 'no_effect';

export interface TypeMatchup {
  attacker: string;
  defender: string;
  effectiveness: EffectivenessValue;
}

// Convert ROM type names to display names
const typeMapping: Record<string, string> = {
  'NORMAL': 'Normal',
  'FIGHTING': 'Fighting',
  'FLYING': 'Flying',
  'POISON': 'Poison',
  'GROUND': 'Ground',
  'ROCK': 'Rock',
  'BUG': 'Bug',
  'GHOST': 'Ghost',
  'STEEL': 'Steel',
  'FIRE': 'Fire',
  'WATER': 'Water',
  'GRASS': 'Grass',
  'ELECTRIC': 'Electric',
  'PSYCHIC': 'Psychic',
  'ICE': 'Ice',
  'DRAGON': 'Dragon',
  'DARK': 'Dark',
  'FAIRY': 'Fairy'
};

// All Pokemon types for comprehensive chart
export const allTypes = [
  'Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel',
  'Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Ice', 'Dragon', 'Dark', 'Fairy'
];

// Type effectiveness data from ROM
const typeMatchupData: TypeMatchup[] = [
  // Normal
  { attacker: 'Normal', defender: 'Rock', effectiveness: 'not_very' },
  { attacker: 'Normal', defender: 'Steel', effectiveness: 'not_very' },
  { attacker: 'Normal', defender: 'Ghost', effectiveness: 'no_effect' },

  // Fire
  { attacker: 'Fire', defender: 'Fire', effectiveness: 'not_very' },
  { attacker: 'Fire', defender: 'Water', effectiveness: 'not_very' },
  { attacker: 'Fire', defender: 'Grass', effectiveness: 'super' },
  { attacker: 'Fire', defender: 'Ice', effectiveness: 'super' },
  { attacker: 'Fire', defender: 'Bug', effectiveness: 'super' },
  { attacker: 'Fire', defender: 'Rock', effectiveness: 'not_very' },
  { attacker: 'Fire', defender: 'Dragon', effectiveness: 'not_very' },
  { attacker: 'Fire', defender: 'Steel', effectiveness: 'super' },

  // Water
  { attacker: 'Water', defender: 'Fire', effectiveness: 'super' },
  { attacker: 'Water', defender: 'Water', effectiveness: 'not_very' },
  { attacker: 'Water', defender: 'Grass', effectiveness: 'not_very' },
  { attacker: 'Water', defender: 'Ground', effectiveness: 'super' },
  { attacker: 'Water', defender: 'Rock', effectiveness: 'super' },
  { attacker: 'Water', defender: 'Dragon', effectiveness: 'not_very' },

  // Electric
  { attacker: 'Electric', defender: 'Water', effectiveness: 'super' },
  { attacker: 'Electric', defender: 'Electric', effectiveness: 'not_very' },
  { attacker: 'Electric', defender: 'Grass', effectiveness: 'not_very' },
  { attacker: 'Electric', defender: 'Ground', effectiveness: 'no_effect' },
  { attacker: 'Electric', defender: 'Flying', effectiveness: 'super' },
  { attacker: 'Electric', defender: 'Dragon', effectiveness: 'not_very' },

  // Grass
  { attacker: 'Grass', defender: 'Fire', effectiveness: 'not_very' },
  { attacker: 'Grass', defender: 'Water', effectiveness: 'super' },
  { attacker: 'Grass', defender: 'Grass', effectiveness: 'not_very' },
  { attacker: 'Grass', defender: 'Poison', effectiveness: 'not_very' },
  { attacker: 'Grass', defender: 'Ground', effectiveness: 'super' },
  { attacker: 'Grass', defender: 'Flying', effectiveness: 'not_very' },
  { attacker: 'Grass', defender: 'Bug', effectiveness: 'not_very' },
  { attacker: 'Grass', defender: 'Rock', effectiveness: 'super' },
  { attacker: 'Grass', defender: 'Dragon', effectiveness: 'not_very' },
  { attacker: 'Grass', defender: 'Steel', effectiveness: 'not_very' },

  // Ice
  { attacker: 'Ice', defender: 'Water', effectiveness: 'not_very' },
  { attacker: 'Ice', defender: 'Grass', effectiveness: 'super' },
  { attacker: 'Ice', defender: 'Ice', effectiveness: 'not_very' },
  { attacker: 'Ice', defender: 'Ground', effectiveness: 'super' },
  { attacker: 'Ice', defender: 'Flying', effectiveness: 'super' },
  { attacker: 'Ice', defender: 'Dragon', effectiveness: 'super' },
  { attacker: 'Ice', defender: 'Steel', effectiveness: 'not_very' },
  { attacker: 'Ice', defender: 'Fire', effectiveness: 'not_very' },

  // Fighting
  { attacker: 'Fighting', defender: 'Normal', effectiveness: 'super' },
  { attacker: 'Fighting', defender: 'Ice', effectiveness: 'super' },
  { attacker: 'Fighting', defender: 'Poison', effectiveness: 'not_very' },
  { attacker: 'Fighting', defender: 'Flying', effectiveness: 'not_very' },
  { attacker: 'Fighting', defender: 'Psychic', effectiveness: 'not_very' },
  { attacker: 'Fighting', defender: 'Bug', effectiveness: 'not_very' },
  { attacker: 'Fighting', defender: 'Rock', effectiveness: 'super' },
  { attacker: 'Fighting', defender: 'Dark', effectiveness: 'super' },
  { attacker: 'Fighting', defender: 'Steel', effectiveness: 'super' },
  { attacker: 'Fighting', defender: 'Fairy', effectiveness: 'not_very' },
  { attacker: 'Fighting', defender: 'Ghost', effectiveness: 'no_effect' },

  // Poison
  { attacker: 'Poison', defender: 'Grass', effectiveness: 'super' },
  { attacker: 'Poison', defender: 'Poison', effectiveness: 'not_very' },
  { attacker: 'Poison', defender: 'Ground', effectiveness: 'not_very' },
  { attacker: 'Poison', defender: 'Rock', effectiveness: 'not_very' },
  { attacker: 'Poison', defender: 'Ghost', effectiveness: 'not_very' },
  { attacker: 'Poison', defender: 'Steel', effectiveness: 'no_effect' },
  { attacker: 'Poison', defender: 'Fairy', effectiveness: 'super' },

  // Ground
  { attacker: 'Ground', defender: 'Fire', effectiveness: 'super' },
  { attacker: 'Ground', defender: 'Electric', effectiveness: 'super' },
  { attacker: 'Ground', defender: 'Grass', effectiveness: 'not_very' },
  { attacker: 'Ground', defender: 'Poison', effectiveness: 'super' },
  { attacker: 'Ground', defender: 'Flying', effectiveness: 'no_effect' },
  { attacker: 'Ground', defender: 'Bug', effectiveness: 'not_very' },
  { attacker: 'Ground', defender: 'Rock', effectiveness: 'super' },
  { attacker: 'Ground', defender: 'Steel', effectiveness: 'super' },

  // Flying
  { attacker: 'Flying', defender: 'Electric', effectiveness: 'not_very' },
  { attacker: 'Flying', defender: 'Grass', effectiveness: 'super' },
  { attacker: 'Flying', defender: 'Fighting', effectiveness: 'super' },
  { attacker: 'Flying', defender: 'Bug', effectiveness: 'super' },
  { attacker: 'Flying', defender: 'Rock', effectiveness: 'not_very' },
  { attacker: 'Flying', defender: 'Steel', effectiveness: 'not_very' },

  // Psychic
  { attacker: 'Psychic', defender: 'Fighting', effectiveness: 'super' },
  { attacker: 'Psychic', defender: 'Poison', effectiveness: 'super' },
  { attacker: 'Psychic', defender: 'Psychic', effectiveness: 'not_very' },
  { attacker: 'Psychic', defender: 'Dark', effectiveness: 'no_effect' },
  { attacker: 'Psychic', defender: 'Steel', effectiveness: 'not_very' },

  // Bug
  { attacker: 'Bug', defender: 'Fire', effectiveness: 'not_very' },
  { attacker: 'Bug', defender: 'Grass', effectiveness: 'super' },
  { attacker: 'Bug', defender: 'Fighting', effectiveness: 'not_very' },
  { attacker: 'Bug', defender: 'Poison', effectiveness: 'not_very' },
  { attacker: 'Bug', defender: 'Flying', effectiveness: 'not_very' },
  { attacker: 'Bug', defender: 'Psychic', effectiveness: 'super' },
  { attacker: 'Bug', defender: 'Ghost', effectiveness: 'not_very' },
  { attacker: 'Bug', defender: 'Dark', effectiveness: 'super' },
  { attacker: 'Bug', defender: 'Steel', effectiveness: 'not_very' },
  { attacker: 'Bug', defender: 'Fairy', effectiveness: 'not_very' },

  // Rock
  { attacker: 'Rock', defender: 'Fire', effectiveness: 'super' },
  { attacker: 'Rock', defender: 'Ice', effectiveness: 'super' },
  { attacker: 'Rock', defender: 'Fighting', effectiveness: 'not_very' },
  { attacker: 'Rock', defender: 'Ground', effectiveness: 'not_very' },
  { attacker: 'Rock', defender: 'Flying', effectiveness: 'super' },
  { attacker: 'Rock', defender: 'Bug', effectiveness: 'super' },
  { attacker: 'Rock', defender: 'Steel', effectiveness: 'not_very' },

  // Ghost
  { attacker: 'Ghost', defender: 'Normal', effectiveness: 'no_effect' },
  { attacker: 'Ghost', defender: 'Psychic', effectiveness: 'super' },
  { attacker: 'Ghost', defender: 'Dark', effectiveness: 'not_very' },
  { attacker: 'Ghost', defender: 'Ghost', effectiveness: 'super' },

  // Dragon
  { attacker: 'Dragon', defender: 'Dragon', effectiveness: 'super' },
  { attacker: 'Dragon', defender: 'Steel', effectiveness: 'not_very' },
  { attacker: 'Dragon', defender: 'Fairy', effectiveness: 'no_effect' },

  // Dark
  { attacker: 'Dark', defender: 'Fighting', effectiveness: 'not_very' },
  { attacker: 'Dark', defender: 'Psychic', effectiveness: 'super' },
  { attacker: 'Dark', defender: 'Ghost', effectiveness: 'super' },
  { attacker: 'Dark', defender: 'Dark', effectiveness: 'not_very' },
  { attacker: 'Dark', defender: 'Fairy', effectiveness: 'not_very' },

  // Steel
  { attacker: 'Steel', defender: 'Fire', effectiveness: 'not_very' },
  { attacker: 'Steel', defender: 'Water', effectiveness: 'not_very' },
  { attacker: 'Steel', defender: 'Electric', effectiveness: 'not_very' },
  { attacker: 'Steel', defender: 'Ice', effectiveness: 'super' },
  { attacker: 'Steel', defender: 'Rock', effectiveness: 'super' },
  { attacker: 'Steel', defender: 'Steel', effectiveness: 'not_very' },
  { attacker: 'Steel', defender: 'Fairy', effectiveness: 'super' },

  // Fairy
  { attacker: 'Fairy', defender: 'Fire', effectiveness: 'not_very' },
  { attacker: 'Fairy', defender: 'Fighting', effectiveness: 'super' },
  { attacker: 'Fairy', defender: 'Poison', effectiveness: 'not_very' },
  { attacker: 'Fairy', defender: 'Dragon', effectiveness: 'super' },
  { attacker: 'Fairy', defender: 'Dark', effectiveness: 'super' },
  { attacker: 'Fairy', defender: 'Steel', effectiveness: 'not_very' },
];

export function getTypeEffectiveness(attackingType: string, defendingType: string): EffectivenessValue {
  const matchup = typeMatchupData.find(
    m => m.attacker === attackingType && m.defender === defendingType
  );
  return matchup?.effectiveness || 'normal';
}

export function getDefensiveEffectiveness(pokemonTypes: string[]): {
  superEffective: string[];
  notVeryEffective: string[];
  noEffect: string[];
} {
  const superEffective: string[] = [];
  const notVeryEffective: string[] = [];
  const noEffect: string[] = [];

  allTypes.forEach(attackingType => {
    let totalEffectiveness = 1;

    pokemonTypes.forEach(defendingType => {
      const effectiveness = getTypeEffectiveness(attackingType, defendingType);
      switch (effectiveness) {
        case 'super':
          totalEffectiveness *= 2;
          break;
        case 'not_very':
          totalEffectiveness *= 0.5;
          break;
        case 'no_effect':
          totalEffectiveness *= 0;
          break;
      }
    });

    if (totalEffectiveness > 1) {
      superEffective.push(attackingType);
    } else if (totalEffectiveness === 0) {
      noEffect.push(attackingType);
    } else if (totalEffectiveness < 1) {
      notVeryEffective.push(attackingType);
    }
  });

  return { superEffective, notVeryEffective, noEffect };
}

export function getOffensiveEffectiveness(pokemonTypes: string[]): {
  superEffective: string[];
  notVeryEffective: string[];
  noEffect: string[];
} {
  const superEffective: string[] = [];
  const notVeryEffective: string[] = [];
  const noEffect: string[] = [];

  allTypes.forEach(defendingType => {
    const attackers = pokemonTypes.map(type => getTypeEffectiveness(type, defendingType));

    // Check if any of the Pokemon's types are super effective
    if (attackers.includes('super')) {
      superEffective.push(defendingType);
    } else if (attackers.includes('no_effect')) {
      noEffect.push(defendingType);
    } else if (attackers.includes('not_very')) {
      notVeryEffective.push(defendingType);
    }
  });

  return { superEffective, notVeryEffective, noEffect };
}