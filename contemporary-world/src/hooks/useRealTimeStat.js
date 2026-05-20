import { useState, useEffect } from 'react';

/**
 * Hook to simulate real-time statistic growth over time based on a starting baseline and a growth rate.
 * @param {number} baseline The starting number (e.g. 8000000000)
 * @param {number} growthPerSecond How much the number should increase per second
 * @param {number} baseTimestamp The unix timestamp (ms) when the baseline was accurate (default is arbitrary recent date)
 * @returns {number} The current live statistic value
 */
const useRealTimeStat = (baseline, growthPerSecond, baseTimestamp = 1715424000000) => {
  const [currentValue, setCurrentValue] = useState(baseline);

  useEffect(() => {
    let animationFrameId;
    
    const updateStat = () => {
      const now = Date.now();
      const elapsedSeconds = (now - baseTimestamp) / 1000;
      
      // Calculate how much it has grown since the baseline time
      const growth = elapsedSeconds * growthPerSecond;
      
      setCurrentValue(Math.floor(baseline + growth));
      
      animationFrameId = requestAnimationFrame(updateStat);
    };

    animationFrameId = requestAnimationFrame(updateStat);

    return () => cancelAnimationFrame(animationFrameId);
  }, [baseline, growthPerSecond, baseTimestamp]);

  return currentValue;
};

export default useRealTimeStat;
