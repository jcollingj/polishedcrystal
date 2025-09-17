import React from 'react';
import { Badge } from './ui/badge';
import { getDefensiveEffectiveness, getOffensiveEffectiveness } from '../data/type-effectiveness';

interface TypeEffectivenessProps {
  pokemonTypes: string[];
}

const TypeEffectiveness: React.FC<TypeEffectivenessProps> = ({ pokemonTypes }) => {
  const defensive = getDefensiveEffectiveness(pokemonTypes);
  const offensive = getOffensiveEffectiveness(pokemonTypes);

  const formatType = (type: string) => type.toLowerCase().replace(' ', '');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Defensive Effectiveness</h3>
        <div className="space-y-3">
          {defensive.superEffective.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-2">Weak to (2× damage taken):</h4>
              <div className="flex flex-wrap gap-1">
                {defensive.superEffective.map((type) => (
                  <Badge
                    key={type}
                    className={`type-${formatType(type)} text-xs opacity-90`}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {defensive.notVeryEffective.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-2">Resists (½× damage taken):</h4>
              <div className="flex flex-wrap gap-1">
                {defensive.notVeryEffective.map((type) => (
                  <Badge
                    key={type}
                    className={`type-${formatType(type)} text-xs opacity-90`}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {defensive.noEffect.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-blue-700 mb-2">Immune to (0× damage taken):</h4>
              <div className="flex flex-wrap gap-1">
                {defensive.noEffect.map((type) => (
                  <Badge
                    key={type}
                    className={`type-${formatType(type)} text-xs opacity-90`}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Offensive Effectiveness</h3>
        <div className="space-y-3">
          {offensive.superEffective.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-2">Super effective against (2× damage dealt):</h4>
              <div className="flex flex-wrap gap-1">
                {offensive.superEffective.map((type) => (
                  <Badge
                    key={type}
                    className={`type-${formatType(type)} text-xs opacity-90`}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {offensive.notVeryEffective.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-orange-700 mb-2">Not very effective against (½× damage dealt):</h4>
              <div className="flex flex-wrap gap-1">
                {offensive.notVeryEffective.map((type) => (
                  <Badge
                    key={type}
                    className={`type-${formatType(type)} text-xs opacity-90`}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {offensive.noEffect.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">No effect against (0× damage dealt):</h4>
              <div className="flex flex-wrap gap-1">
                {offensive.noEffect.map((type) => (
                  <Badge
                    key={type}
                    className={`type-${formatType(type)} text-xs opacity-90`}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypeEffectiveness;