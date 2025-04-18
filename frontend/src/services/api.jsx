const API_BASE_URL = 'http://localhost:3000';

const getCurrentToken = () => localStorage.getItem('token');

const api = {
  
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },
  
  clearAuthToken() {
    localStorage.removeItem('token');
  },
  
  getHeaders(includeContentType = true) {
    const headers = {};
    
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  },
  async handleResponse(response) {
    if (response.status === 204) return {};
    
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || response.statusText,
        errors: data.errors
      };
    }
    
    return data;
  },
  
  async get(endpoint) {
    const token = getCurrentToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      this.clearAuthToken();
      window.location.href = '/login';
      throw new Error('Session expired');
    }

    return this.handleResponse(response);
  },
  
  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    
    return this.handleResponse(response);
  },
  
  async put(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    
    return this.handleResponse(response);
  },
  
  async delete(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    
    return this.handleResponse(response);
  },
  
  async upload(endpoint, formData, method = 'POST') {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: method,
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        console.error('Server response error:', response.status, errorData);
        throw new Error(`Server error: ${response.status} - ${JSON.stringify(errorData)}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error during ${method} to ${endpoint}:`, error);
      throw error;
    }
  }
};

export default api;