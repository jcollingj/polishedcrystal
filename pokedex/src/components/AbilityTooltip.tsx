import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import type { AbilityData } from '../data/ability-types';

interface AbilityTooltipProps {
  abilityName: string;
  children: React.ReactNode;
}

const AbilityTooltip: React.FC<AbilityTooltipProps> = ({ abilityName, children }) => {
  const [abilities, setAbilities] = useState<AbilityData[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchAbilities = async () => {
      try {
        const response = await fetch('/api/abilities');
        const data = await response.json();
        setAbilities(data);
      } catch (error) {
        console.error('Failed to fetch abilities:', error);
      }
    };

    fetchAbilities();
  }, []);

  const handleMouseEnter = (event: React.MouseEvent) => {
    setIsHovered(true);
    updateTooltipPosition(event);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    updateTooltipPosition(event);
  };

  const updateTooltipPosition = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const ability = abilities.find(a => a.name.toLowerCase() === abilityName.toLowerCase());

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="cursor-help"
      >
        {children}
      </div>

      {isHovered && ability && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-sm rounded-lg p-3 shadow-lg border border-gray-700 max-w-xs"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
            pointerEvents: 'none'
          }}
        >
          <div className="font-semibold text-blue-200 mb-1">{ability.name}</div>
          <div className="text-gray-200">{ability.description}</div>

          {/* Triangle pointer */}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"
          />
        </div>
      )}
    </div>
  );
};

export default AbilityTooltip;