import { useState, useEffect } from "react";
import { referencesData } from "../data/referencesData";

/**
 * Custom hook to simulate fetching related studies/references from an API.
 * Returns references, loading state, and error state.
 */
export const useReferences = (categoryFilter = "All") => {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Simulate API fetch delay
    const timer = setTimeout(() => {
      try {
        let filtered = referencesData;
        if (categoryFilter !== "All") {
          filtered = referencesData.filter(
            (ref) => ref.category.toLowerCase() === categoryFilter.toLowerCase()
          );
        }
        setReferences(filtered);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch references from the API.");
        setLoading(false);
      }
    }, 400); // 400ms simulated network latency

    return () => clearTimeout(timer);
  }, [categoryFilter]);

  return { references, loading, error };
};
