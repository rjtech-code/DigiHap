import React from 'react';
import { getHeatLevel } from '../utils/heatLevel';

const HeatBadge = ({ temperature }) => {
  const heatInfo = getHeatLevel(temperature);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${heatInfo.color}`}>
      <span>{heatInfo.emoji}</span>
      <span>{heatInfo.level}</span>
    </span>
  );
};

export default HeatBadge;