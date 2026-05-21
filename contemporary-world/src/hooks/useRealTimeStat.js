import { useState, useEffect, useRef } from 'react';

/**
 * Hook to simulate real-time statistic growth over time based on a starting baseline and a growth rate.
 * Optimized: updates once per second via setInterval instead of every frame via rAF,
 * dramatically reducing unnecessary React re-renders.
 * @param {number} baseline The starting number (e.g. 8000000000)
 * @param {number} growthPerSecond How much the number should increase per second
 * @param {number} baseTimestamp The unix timestamp (ms) when the baseline was accurate (default is arbitrary recent date)
 * @returns {number} The current live statistic value
 */
const useRealTimeStat = (baseline, growthPerSecond, baseTimestamp = 1715424000000) => {
  const calcValue = () => {
    const elapsedSeconds = (Date.now() - baseTimestamp) / 1000;
    return Math.floor(baseline + elapsedSeconds * growthPerSecond);
  };

  const [currentValue, setCurrentValue] = useState(calcValue);
  const paramsRef = useRef({ baseline, growthPerSecond, baseTimestamp });
  paramsRef.current = { baseline, growthPerSecond, baseTimestamp };

  useEffect(() => {
    const tick = () => {
      const { baseline: b, growthPerSecond: g, baseTimestamp: t } = paramsRef.current;
      const elapsedSeconds = (Date.now() - t) / 1000;
      setCurrentValue(Math.floor(b + elapsedSeconds * g));
    };

    // Update once per second — perfectly sufficient for counters, reduces renders from 960/s to 16/s total
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return currentValue;
};

export default useRealTimeStat;
