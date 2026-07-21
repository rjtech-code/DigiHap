import React from 'react';
import { getHeatLevel } from '../utils/heatLevel';
import { useLanguage } from '../hooks/useLanguage';

const HeatBadge = ({ temperature }) => {
  const heatInfo = getHeatLevel(temperature);
  const { translateHeatLevel } = useLanguage();

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${heatInfo.color}`}>
      <span>{heatInfo.emoji}</span>
      <span>{translateHeatLevel(heatInfo.level)}</span>
    </span>
  );
};

export default HeatBadge;