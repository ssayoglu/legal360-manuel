import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('API fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

// Specific hooks for common use cases
export const useLegalProcesses = (params = {}) => {
  const paramsString = JSON.stringify(params);
  return useApi(() => apiService.getLegalProcesses(params), [paramsString]);
};

export const useLegalProcess = (id) => {
  return useApi(() => apiService.getLegalProcess(id), [id]);
};

export const useCalculatorParameters = (category = null) => {
  return useApi(() => apiService.getCalculatorParameters(category), [category]);
};

export const useLegalAidInfo = () => {
  return useApi(() => apiService.getLegalAidInfo(), []);
};

export const useBlogPosts = (params = {}) => {
  const paramsString = JSON.stringify(params);
  return useApi(() => apiService.getBlogPosts(params), [paramsString]);
};

export const useSupremeCourtDecisions = (params = {}) => {
  const paramsString = JSON.stringify(params);
  return useApi(() => apiService.getSupremeCourtDecisions(params), [paramsString]);
};

// Section-based content hooks
export const useAboutPageContent = () => {
  return useApi(() => apiService.getAboutPageContent(), []);
};

export const useContactPageContent = () => {
  return useApi(() => apiService.getContactPageContent(), []);
};

export const useHomePageContent = () => {
  return useApi(() => apiService.getHomePageContent(), []);
};