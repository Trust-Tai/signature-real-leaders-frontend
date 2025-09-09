import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface StatsCard {
  number: string;
  label: string;
  description: string;
  color?: string;
  icon?: React.ReactNode;
}

interface StatsCardsProps {
  stats: StatsCard[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const StatsCards: React.FC<StatsCardsProps> = ({ 
  stats, 
  columns = 4, 
  className = "" 
}) => {
  const getGridCols = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    }
  };

  return (
    <div className={`grid ${getGridCols()} gap-4 sm:gap-6 ${className}`}>
      {stats.map((card, index) => (
        <div key={index} className="bg-white rounded-xl px-[16px] py-[8px] shadow-sm border border-gray-100">
          {/* Icon in top-right corner */}
          <div className="flex justify-end mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-full flex items-center justify-center">
              {card.icon || <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-[#CF3232]" />}
            </div>
          </div>
          
          {/* Number and label on left side */}
          <div className="mb-4">
            <h3 
              className="text-3xl sm:text-5xl font-bold text-[#101117] mb-1" 
              style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}
            >
              {card.number}
            </h3>
            <p 
              className="font-semibold text-xs sm:text-sm tracking-wide"
              style={{ color: card.color || '#CF3232' }}
            >
              {card.label}
            </p>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;







