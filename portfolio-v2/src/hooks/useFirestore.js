import { useState, useEffect } from 'react';
import { getAllDocuments } from '../services/firestore';

/**
 * Custom hook to fetch data from a Firestore collection
 * @param {string} collectionName - The name of the Firestore collection
 * @param {string} orderByField - Field to order by (default: 'createdAt')
 * @returns {Object} { data, loading, error, refetch }
 */
export const useFirestore = (collectionName, orderByField = 'createdAt') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllDocuments(collectionName, orderByField);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      console.error(`Error fetching ${collectionName}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [collectionName, orderByField]);

  return { data, loading, error, refetch: fetchData };
};

export default useFirestore;
