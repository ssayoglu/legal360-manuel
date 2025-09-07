import { API_CONFIG } from '../config';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BACKEND_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Legal Processes
  async getLegalProcesses(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.append('category', params.category);
    if (params.search) searchParams.append('search', params.search);
    
    const query = searchParams.toString();
    const endpoint = `/api/legal-processes${query ? `?${query}` : ''}`;
    
    return this.request(endpoint);
  }

  async getLegalProcess(id) {
    return this.request(`/api/legal-processes/${id}`);
  }

  // Calculator Parameters
  async getCalculatorParameters(category = null) {
    const endpoint = category 
      ? `/api/calculator-parameters?category=${category}`
      : '/api/calculator-parameters';
    return this.request(endpoint);
  }

  async calculateCompensation(data) {
    return this.request('/api/calculate-compensation', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async calculateExecution(data) {
    return this.request('/api/calculate-execution', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Content Pages
  async getContentPages() {
    return this.request('/api/content-pages');
  }

  async getContentPage(slug) {
    return this.request(`/api/content-pages/${slug}`);
  }

  // Blog Posts
  async getBlogPosts(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.append('category', params.category);
    if (params.limit) searchParams.append('limit', params.limit);
    
    const query = searchParams.toString();
    const endpoint = `/api/blog-posts${query ? `?${query}` : ''}`;
    
    return this.request(endpoint);
  }

  async getBlogPost(slug) {
    return this.request(`/api/blog-posts/${slug}`);
  }

  // Legal Aid Info
  async getLegalAidInfo() {
    return this.request('/api/legal-aid-info');
  }

  // Supreme Court Decisions
  async getSupremeCourtDecisions(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.append('category', params.category);
    if (params.importance) searchParams.append('importance', params.importance);
    if (params.limit) searchParams.append('limit', params.limit);
    
    const query = searchParams.toString();
    const endpoint = `/api/supreme-court-decisions${query ? `?${query}` : ''}`;
    
    return this.request(endpoint);
  }

  async getSupremeCourtDecision(id) {
    return this.request(`/api/supreme-court-decisions/${id}`);
  }

  // Search
  async search(query, type = null) {
    const searchParams = new URLSearchParams({ q: query });
    if (type) searchParams.append('type', type);
    
    return this.request(`/api/search?${searchParams.toString()}`);
  }
}

export const apiService = new ApiService();
export default apiService;