#!/usr/bin/env bun

interface AbilityData {
  name: string;
  description: string;
}

async function convertAbilities() {
  const abilityNamesPath = "../data/abilities/names.asm";
  const abilityDescriptionsPath = "../data/abilities/descriptions.asm";
  const outputPath = "./src/data";

  // Ensure output directory exists
  await Bun.$`mkdir -p ${outputPath}`;

  // Parse ability names
  const abilityNamesContent = await Bun.file(abilityNamesPath).text();
  const abilityNames = parseAbilityNames(abilityNamesContent);

  // Parse ability descriptions
  const abilityDescriptionsContent = await Bun.file(abilityDescriptionsPath).text();
  const abilityDescriptions = parseAbilityDescriptions(abilityDescriptionsContent);

  // Combine all data
  const allAbilities: AbilityData[] = [];

  abilityNames.forEach((name, index) => {
    const description = abilityDescriptions[index] || "No description available.";

    if (name && name !== "No Ability") {
      allAbilities.push({
        name,
        description
      });
    }
  });

  // Write to JSON file
  const outputFile = `${outputPath}/abilities.json`;
  await Bun.write(outputFile, JSON.stringify(allAbilities, null, 2));

  console.log(`✅ Converted ${allAbilities.length} abilities to ${outputFile}`);

  // Write TypeScript types file
  const typesFile = `${outputPath}/ability-types.ts`;
  const typesContent = `export interface AbilityData {
  name: string;
  description: string;
}
`;

  await Bun.write(typesFile, typesContent);
  console.log(`✅ Generated TypeScript types at ${typesFile}`);
}

function parseAbilityNames(content: string): string[] {
  const names: string[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Look for ability name definitions like: StenchName: rawchar "Stench@"
    const match = trimmed.match(/^(\w+):\s+rawchar\s+"(.+?)@"$/);
    if (match) {
      names.push(match[2]);
    }
  }

  return names;
}

function parseAbilityDescriptions(content: string): string[] {
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

  // Handle last description if file doesn't end with 'done'
  if (inDescription && currentDescription) {
    descriptions.push(currentDescription.trim());
  }

  return descriptions;
}

if (import.meta.main) {
  convertAbilities().catch(console.error);
}