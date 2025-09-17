#!/usr/bin/env bun

interface PokemonMove {
  level: number;
  move: string;
}

interface PokemonStats {
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

function parseLearnsets(evosAttacksContent: string): Record<string, PokemonMove[]> {
  const learnsets: Record<string, PokemonMove[]> = {};
  const lines = evosAttacksContent.split('\n');

  let currentPokemon = '';
  let currentMoves: PokemonMove[] = [];
  let inLearnsetSection = false;


  for (const line of lines) {
    const trimmed = line.trim();

    // Check for evos_attacks directive
    const evosMatch = trimmed.match(/evos_attacks\s+(\w+)/);
    if (evosMatch) {
      // Save previous Pokemon's learnset if we have one
      if (currentPokemon && currentMoves.length > 0) {
        learnsets[currentPokemon] = [...currentMoves];
      }

      currentPokemon = evosMatch[1].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      currentMoves = [];
      inLearnsetSection = false;

      continue;
    }

    // Look for learnset entries
    const learnsetMatch = trimmed.match(/learnset\s+(\d+),\s*([A-Z_]+)/);
    if (learnsetMatch) {
      inLearnsetSection = true;
      const level = parseInt(learnsetMatch[1]);
      const move = learnsetMatch[2].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      currentMoves.push({ level, move });
    }

    // End of Pokemon data (db -1)
    if (trimmed === 'db -1' && inLearnsetSection) {
      if (currentPokemon && currentMoves.length > 0) {
        learnsets[currentPokemon] = [...currentMoves];
      }
      inLearnsetSection = false;
    }
  }

  // Handle last Pokemon
  if (currentPokemon && currentMoves.length > 0) {
    learnsets[currentPokemon] = [...currentMoves];
  }

  return learnsets;
}

async function convertPokemonStats() {
  const pokemonStatsPath = "../data/pokemon/base_stats";
  const evosAttacksPath = "../data/pokemon/evos_attacks.asm";
  const outputPath = "./src/data";

  // Ensure output directory exists
  await Bun.$`mkdir -p ${outputPath}`;

  // Parse learnsets from evos_attacks.asm
  const evosAttacksContent = await Bun.file(evosAttacksPath).text();
  const learnsets = parseLearnsets(evosAttacksContent);


  // Get all Pokemon stat files
  const files = await Bun.$`find ${pokemonStatsPath} -name "*.asm"`.text();
  const pokemonFiles = files.trim().split('\n').filter(file => file.length > 0);

  const allPokemon: PokemonStats[] = [];

  for (const filePath of pokemonFiles) {
    try {
      const fileName = filePath.split('/').pop()?.replace('.asm', '') || '';
      const pokemonName = fileName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      const content = await Bun.file(filePath).text();
      const lines = content.split('\n').map(line => line.trim());

      // Parse the stats (first line with db and 6 numbers)
      const statsLine = lines.find(line => line.match(/^db\s+\d+,\s*\d+,\s*\d+,\s*\d+,\s*\d+,\s*\d+/));
      if (!statsLine) continue;

      const statsMatch = statsLine.match(/db\s+(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)(?:.*; (\d+) BST)?/);
      if (!statsMatch) continue;

      const [, hp, attack, defense, speed, specialAttack, specialDefense, bstComment] = statsMatch;
      const bst = bstComment ? parseInt(bstComment) :
        parseInt(hp) + parseInt(attack) + parseInt(defense) + parseInt(speed) + parseInt(specialAttack) + parseInt(specialDefense);

      // Parse types
      const typeLine = lines.find(line => line.includes('db') && (line.includes('NORMAL') || line.includes('FIRE') || line.includes('WATER') ||
        line.includes('ELECTRIC') || line.includes('GRASS') || line.includes('ICE') || line.includes('FIGHTING') ||
        line.includes('POISON') || line.includes('GROUND') || line.includes('FLYING') || line.includes('PSYCHIC') ||
        line.includes('BUG') || line.includes('ROCK') || line.includes('GHOST') || line.includes('DRAGON') ||
        line.includes('DARK') || line.includes('STEEL') || line.includes('FAIRY')));

      let types: string[] = [];
      if (typeLine) {
        const typeMatch = typeLine.match(/db\s+([A-Z_]+)(?:,\s*([A-Z_]+))?/);
        if (typeMatch) {
          types = [typeMatch[1].replace(/_/g, ' ')];
          if (typeMatch[2] && typeMatch[2] !== typeMatch[1]) {
            types.push(typeMatch[2].replace(/_/g, ' '));
          }
        }
      }

      // Parse catch rate and base exp
      const catchRateLine = lines.find(line => line.match(/db\s+\d+\s*;\s*catch rate/));
      const baseExpLine = lines.find(line => line.match(/db\s+\d+\s*;\s*base exp/));

      const catchRate = catchRateLine ? parseInt(catchRateLine.match(/db\s+(\d+)/)?.[1] || '0') : 0;
      const baseExp = baseExpLine ? parseInt(baseExpLine.match(/db\s+(\d+)/)?.[1] || '0') : 0;

      // Parse abilities
      const abilitiesLine = lines.find(line => line.includes('abilities_for'));
      let abilities: string[] = [];
      if (abilitiesLine) {
        const abilityMatch = abilitiesLine.match(/abilities_for\s+\w+,\s*(.+)/);
        if (abilityMatch) {
          abilities = abilityMatch[1].split(',').map(ability =>
            ability.trim().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          );
        }
      }

      // Parse growth rate
      const growthLine = lines.find(line => line.includes('GROWTH_'));
      let growthRate = '';
      if (growthLine) {
        const growthMatch = growthLine.match(/GROWTH_([A-Z_]+)/);
        if (growthMatch) {
          growthRate = growthMatch[1].replace(/_/g, ' ').toLowerCase();
        }
      }

      // Parse egg groups
      const eggGroupLine = lines.find(line => line.includes('EGG_'));
      let eggGroups: string[] = [];
      if (eggGroupLine) {
        const eggMatches = eggGroupLine.match(/EGG_([A-Z_]+)/g);
        if (eggMatches) {
          eggGroups = [...new Set(eggMatches.map(match =>
            match.replace('EGG_', '').replace(/_/g, ' ').toLowerCase()
          ))];
        }
      }

      // Parse EV yield
      const evLine = lines.find(line => line.includes('ev_yield'));
      let evYield = '';
      if (evLine) {
        const evMatch = evLine.match(/ev_yield\s+(.+)/);
        if (evMatch) {
          evYield = evMatch[1];
        }
      }

      // Try to match learnset with different naming patterns
      let foundLearnset = learnsets[pokemonName] || [];

      // If not found, try without spaces (for variant forms like "Muk Alolan" -> "MukAlolan")
      if (foundLearnset.length === 0) {
        const nameWithoutSpaces = pokemonName.replace(/\s+/g, '');
        foundLearnset = learnsets[nameWithoutSpaces] || [];
      }


      const pokemon: PokemonStats = {
        name: pokemonName,
        hp: parseInt(hp),
        attack: parseInt(attack),
        defense: parseInt(defense),
        speed: parseInt(speed),
        specialAttack: parseInt(specialAttack),
        specialDefense: parseInt(specialDefense),
        bst,
        types,
        catchRate,
        baseExp,
        abilities,
        growthRate,
        eggGroups,
        evYield,
        learnset: foundLearnset
      };

      allPokemon.push(pokemon);

    } catch (error) {
      console.warn(`Failed to parse ${filePath}:`, error);
    }
  }

  // Sort by name
  allPokemon.sort((a, b) => a.name.localeCompare(b.name));

  // Write to JSON file
  const outputFile = `${outputPath}/pokemon-stats.json`;
  await Bun.write(outputFile, JSON.stringify(allPokemon, null, 2));

  console.log(`✅ Converted ${allPokemon.length} Pokemon stats to ${outputFile}`);

  // Write TypeScript types file
  const typesFile = `${outputPath}/pokemon-types.ts`;
  const typesContent = `export interface PokemonStats {
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
`;

  await Bun.write(typesFile, typesContent);
  console.log(`✅ Generated TypeScript types at ${typesFile}`);
}

if (import.meta.main) {
  convertPokemonStats().catch(console.error);
}