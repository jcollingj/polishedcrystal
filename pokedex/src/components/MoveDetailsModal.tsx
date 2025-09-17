import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import type { MoveData } from '../data/move-types';

interface MoveDetailsModalProps {
  move: MoveData | null;
  isOpen: boolean;
  onClose: () => void;
}

const MoveDetailsModal: React.FC<MoveDetailsModalProps> = ({ move, isOpen, onClose }) => {
  if (!move) return null;

  const formatType = (type: string) => type.toLowerCase().replace(' ', '');

  const getPowerDisplay = (power: number) => {
    if (power === 0) return '—';
    if (power === 1) return 'Varies';
    return power.toString();
  };

  const getAccuracyDisplay = (accuracy: number) => {
    if (accuracy === -1) return '—';
    return `${accuracy}%`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">{move.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Move Type and Category */}
          <div className="flex justify-center gap-4">
            <Badge className={`type-${formatType(move.type)} text-sm`}>
              {move.type}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {move.category}
            </Badge>
          </div>

          {/* Move Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{getPowerDisplay(move.power)}</div>
              <div className="text-sm text-gray-600">Power</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{getAccuracyDisplay(move.accuracy)}</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{move.pp}</div>
              <div className="text-sm text-gray-600">PP</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {move.effectChance > 0 ? `${move.effectChance}%` : '—'}
              </div>
              <div className="text-sm text-gray-600">Effect Chance</div>
            </div>
          </div>

          {/* Move Effect */}
          {move.effect && move.effect !== 'Normal Hit' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Effect</h3>
              <div className="p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-800 font-medium">{move.effect}</span>
              </div>
            </div>
          )}

          {/* Move Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{move.description}</p>
          </div>

          {/* Additional Move Properties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{move.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{move.type}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Power:</span>
                <span className="font-medium">{getPowerDisplay(move.power)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Priority:</span>
                <span className="font-medium">Normal</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoveDetailsModal;