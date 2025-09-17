#!/usr/bin/env bun

interface MoveData {
  name: string;
  power: number;
  type: string;
  accuracy: number;
  pp: number;
  category: string;
  effect: string;
  effectChance: number;
  description: string;
}

async function convertMoves() {
  const movesDataPath = "../data/moves/moves.asm";
  const moveNamesPath = "../data/moves/names.asm";
  const moveDescriptionsPath = "../data/moves/descriptions.asm";
  const outputPath = "./src/data";

  // Ensure output directory exists
  await Bun.$`mkdir -p ${outputPath}`;

  // Parse move names
  const moveNamesContent = await Bun.file(moveNamesPath).text();
  const moveNames = parseMoveNames(moveNamesContent);

  // Parse move descriptions
  const moveDescriptionsContent = await Bun.file(moveDescriptionsPath).text();
  const moveDescriptions = parseMoveDescriptions(moveDescriptionsContent);

  // Parse move stats
  const movesContent = await Bun.file(movesDataPath).text();
  const moveStats = parseMoveStats(movesContent);

  // Combine all data
  const allMoves: MoveData[] = [];

  moveNames.forEach((name, index) => {
    const stats = moveStats[index];
    const description = moveDescriptions[index] || "No description available.";

    if (stats) {
      allMoves.push({
        name,
        power: stats.power,
        type: stats.type,
        accuracy: stats.accuracy,
        pp: stats.pp,
        category: stats.category,
        effect: stats.effect,
        effectChance: stats.effectChance,
        description
      });
    }
  });

  // Write to JSON file
  const outputFile = `${outputPath}/moves.json`;
  await Bun.write(outputFile, JSON.stringify(allMoves, null, 2));

  console.log(`✅ Converted ${allMoves.length} moves to ${outputFile}`);

  // Write TypeScript types file
  const typesFile = `${outputPath}/move-types.ts`;
  const typesContent = `export interface MoveData {
  name: string;
  power: number;
  type: string;
  accuracy: number;
  pp: number;
  category: string;
  effect: string;
  effectChance: number;
  description: string;
}
`;

  await Bun.write(typesFile, typesContent);
  console.log(`✅ Generated TypeScript types at ${typesFile}`);
}

function parseMoveNames(content: string): string[] {
  const names: string[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(/^li\s+"(.+)"$/);
    if (match) {
      names.push(match[1]);
    }
  }

  return names;
}

function parseMoveDescriptions(content: string): string[] {
  const descriptions: string[] = [];
  const lines = content.split('\n');

  let currentDescription = '';
  let inDescription = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Check if this is a description label
    if (trimmed.endsWith('Description:')) {
      // Save previous description if we have one
      if (inDescription && currentDescription) {
        descriptions.push(currentDescription.trim());
      }
      currentDescription = '';
      inDescription = true;
      continue;
    }

    // If we're in a description, collect the text
    if (inDescription) {
      if (trimmed === 'done') {
        descriptions.push(currentDescription.trim());
        currentDescription = '';
        inDescription = false;
      } else if (trimmed.startsWith('text "')) {
        const textMatch = trimmed.match(/text\s+"(.+)"$/);
        if (textMatch) {
          currentDescription += textMatch[1] + ' ';
        }
      } else if (trimmed.startsWith('next "')) {
        const nextMatch = trimmed.match(/next\s+"(.+)"$/);
        if (nextMatch) {
          currentDescription += nextMatch[1] + ' ';
        }
      }
    }
  }

  return descriptions;
}

function parseMoveStats(content: string): Array<{
  power: number;
  type: string;
  accuracy: number;
  pp: number;
  category: string;
  effect: string;
  effectChance: number;
}> {
  const moves: Array<{
    power: number;
    type: string;
    accuracy: number;
    pp: number;
    category: string;
    effect: string;
    effectChance: number;
  }> = [];

  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Look for move definition lines
    const moveMatch = trimmed.match(/^move\s+([A-Z_]+),\s*([A-Z_]+),\s*(\d+),\s*([A-Z_]+),\s*(-?\d+),\s*(\d+),\s*(\d+),\s*([A-Z_]+)$/);
    if (moveMatch) {
      const [, , effect, power, type, accuracy, pp, effectChance, category] = moveMatch;

      moves.push({
        power: parseInt(power),
        type: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        accuracy: parseInt(accuracy) === -1 ? 100 : parseInt(accuracy), // -1 means always hits
        pp: parseInt(pp),
        category: category.replace(/\b\w/g, l => l.toUpperCase()),
        effect: effect.replace(/EFFECT_/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        effectChance: parseInt(effectChance)
      });
    }
  }

  return moves;
}

if (import.meta.main) {
  convertMoves().catch(console.error);
}