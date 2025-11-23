const API_URL = '/api';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    // If 401 (unauthorized) and no token, return empty response for login page
    if (response.status === 401 && !this.getToken()) {
      console.log(`API: 401 Unauthorized for ${endpoint} (no token - user not logged in)`);
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      console.error(`API Error [${response.status}] ${endpoint}:`, error);
      throw new Error(error.message || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async register(data: { name: string; email: string; password: string; role: string }) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  // Health Data
  async createHealthData(data: { glucose: number; insulin: number; carbs: number; activityLevel?: string; notes?: string }) {
    return this.request<{ data: any }>('/health-data', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getHealthData(userId?: string) {
    const params = userId ? `?userId=${userId}` : '';
    return this.request<{ data: any[] }>(`/health-data${params}`);
  }

  async getLatestHealthData() {
    return this.request<{ data: any }>('/health-data/latest');
  }

  // Meals
  async createMeal(data: { name: string; carbs: number; protein?: number; fat?: number; calories?: number; voiceRecorded?: boolean }) {
    return this.request<{ data: any }>('/meals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMeals(userId?: string) {
    const params = userId ? `?userId=${userId}` : '';
    return this.request<{ data: any[] }>(`/meals${params}`);
  }

  // Doctor
  async getPatients() {
    return this.request<{ patients: any[] }>('/doctor/patients');
  }

  // Admin
  async getAllUsers() {
    return this.request<{ users: any[] }>('/admin/users');
  }

  async updateUserApproval(userId: string, isApproved: boolean) {
    return this.request<{ user: any }>(`/admin/users/${userId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ isApproved }),
    });
  }

  // Reports
  async uploadReport(file: File, patientId?: string, description?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (patientId) formData.append('patientId', patientId);
    if (description) formData.append('description', description);

    const token = this.getToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/reports/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }

  async getReports(patientId?: string) {
    const params = patientId ? `?patientId=${patientId}` : '';
    return this.request<{ reports: any[] }>(`/reports${params}`);
  }
}

export const api = new ApiClient();

// Utility function for direct API requests
export async function apiRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

export function setAuthToken(token: string) {
  localStorage.setItem('token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('token');
}

export function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function setCurrentUser(user: any) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function removeCurrentUser() {
  localStorage.removeItem('user');
}

export function logout() {
  removeAuthToken();
  removeCurrentUser();
}
