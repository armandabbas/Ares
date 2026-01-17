import React from 'react';

interface GaugeChartProps {
  score: number;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ score }) => {
  // SVG Math for a semi-circle gauge
  const radius = 80;
  // Thin stroke to match the minimalist button border
  const stroke = 2; 
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // We only want a semi-circle (50% of circumference)
  const maxOffset = circumference / 2; 
  const strokeDashoffset = maxOffset - (score / 100) * maxOffset;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="rotate-[180deg] transform" // Rotate so it starts from left
      >
        {/* Background Track - The "Empty" part */}
        <circle
          stroke="#262626"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={`${maxOffset} ${circumference}`} 
          strokeLinecap="butt"
        />
        {/* Foreground Value - The "Score" part */}
        <circle
          stroke="white"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={`${maxOffset} ${circumference}`}
          style={{ strokeDashoffset }}
          strokeLinecap="butt"
        />
      </svg>
      
      {/* Centered Text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 text-center mt-4">
        <div className="text-7xl font-serif italic text-white leading-none">
          {score}
        </div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mt-2">
          Short Score
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;