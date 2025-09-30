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
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...options.headers,
      },
      ...options,
    };

    try {
      // Debug: surface outgoing requests in dev
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.log('[api] request', config.method || 'GET', url);
      }
      const response = await fetch(url, config);
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.log('[api] response', response.status, url);
      }
      
      if (!response.ok) {
        let body = '';
        try { body = await response.text(); } catch {}
        const err = new Error(`HTTP error! status: ${response.status}`);
        err.responseBody = body;
        throw err;
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error, error.responseBody || '');
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

  // Ad Settings
  async getAdSettings() {
    return this.request('/api/ad-settings');
  }

  async getAdminAdSettings() {
    const token = localStorage.getItem('admin_token');
    return this.request('/api/admin/ad-settings', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }

  async updateAdminAdSettings(data) {
    const token = localStorage.getItem('admin_token');
    return this.request('/api/admin/ad-settings', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data),
    });
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

  // ============================================
  // SECTION-BASED CONTENT MANAGEMENT
  // ============================================
  
  // Public section content (for frontend pages)
  async getAboutPageContent() {
    return this.request('/api/about-page-content');
  }

  async getContactPageContent() {
    return this.request('/api/contact-page-content');
  }

  async getHomePageContent() {
    return this.request('/api/home-page-content');
  }

  // Admin section content management
  async getAdminAboutPageContent() {
    return this.request('/api/admin/about-page-content');
  }

  async updateAboutPageContent(data) {
    return this.request('/api/admin/about-page-content', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async getAdminContactPageContent() {
    return this.request('/api/admin/contact-page-content');
  }

  async updateContactPageContent(data) {
    return this.request('/api/admin/contact-page-content', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async getAdminHomePageContent() {
    return this.request('/api/admin/home-page-content');
  }

  async updateHomePageContent(data) {
    return this.request('/api/admin/home-page-content', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // ============================================
  // SITE SETTINGS & CONFIGURATION
  // ============================================
  
  // Public site settings (for frontend)
  async getSiteSettings() {
    return this.request('/api/site-settings');
  }

  async getMenuConfig() {
    return this.request('/api/menu-config');
  }

  async getFooterConfig() {
    return this.request('/api/footer-config');
  }

  async getContactPageContent() {
    return this.request('/api/contact-page-content');
  }

  async getHomePageContent() {
    return this.request('/api/home-page-content');
  }
}

export const apiService = new ApiService();
export default apiService;