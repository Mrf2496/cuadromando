// API utility functions

const API_BASE = '/api';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Strategic Plan API
export const strategicPlanApi = {
  getAll: () => fetchApi<any[]>('/strategic-plans'),
  getById: (id: string) => fetchApi<any>(`/strategic-plans/${id}`),
  create: (data: any) => fetchApi<any>('/strategic-plans', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchApi<any>(`/strategic-plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchApi<void>(`/strategic-plans/${id}`, {
    method: 'DELETE',
  }),
  getFull: (id: string) => fetchApi<any>(`/strategic-plans/${id}/full`),
};

// Perspectives API
export const perspectivesApi = {
  getAll: (planId: string) => fetchApi<any[]>(`/perspectives?planId=${planId}`),
  create: (data: any) => fetchApi<any>('/perspectives', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchApi<any>(`/perspectives/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchApi<void>(`/perspectives/${id}`, {
    method: 'DELETE',
  }),
};

// Objectives API
export const objectivesApi = {
  getAll: (perspectiveId?: string) => {
    const query = perspectiveId ? `?perspectiveId=${perspectiveId}` : '';
    return fetchApi<any[]>(`/objectives${query}`);
  },
  create: (data: any) => fetchApi<any>('/objectives', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchApi<any>(`/objectives/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchApi<void>(`/objectives/${id}`, {
    method: 'DELETE',
  }),
};

// Corporate Goals API
export const corporateGoalsApi = {
  getAll: (objectiveId?: string) => {
    const query = objectiveId ? `?objectiveId=${objectiveId}` : '';
    return fetchApi<any[]>(`/corporate-goals${query}`);
  },
  create: (data: any) => fetchApi<any>('/corporate-goals', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchApi<any>(`/corporate-goals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchApi<void>(`/corporate-goals/${id}`, {
    method: 'DELETE',
  }),
};

// Corporate Strategies API
export const corporateStrategiesApi = {
  getAll: (objectiveId?: string) => {
    const query = objectiveId ? `?objectiveId=${objectiveId}` : '';
    return fetchApi<any[]>(`/corporate-strategies${query}`);
  },
  create: (data: any) => fetchApi<any>('/corporate-strategies', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchApi<any>(`/corporate-strategies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchApi<void>(`/corporate-strategies/${id}`, {
    method: 'DELETE',
  }),
};

// Corporate KPIs API
export const corporateKPIsApi = {
  getAll: (objectiveId?: string) => {
    const query = objectiveId ? `?objectiveId=${objectiveId}` : '';
    return fetchApi<any[]>(`/corporate-kpis${query}`);
  },
  create: (data: any) => fetchApi<any>('/corporate-kpis', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchApi<any>(`/corporate-kpis/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchApi<void>(`/corporate-kpis/${id}`, {
    method: 'DELETE',
  }),
};

// Policies API
export const policiesApi = {
  getAll: (objectiveId?: string) => {
    const query = objectiveId ? `?objectiveId=${objectiveId}` : '';
    return fetchApi<any[]>(`/policies${query}`);
  },
  create: (data: any) => fetchApi<any>('/policies', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchApi<any>(`/policies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchApi<void>(`/policies/${id}`, {
    method: 'DELETE',
  }),
};

// Action Plans API
export const actionPlansApi = {
  getAll: (objectiveId?: string) => {
    const query = objectiveId ? `?objectiveId=${objectiveId}` : '';
    return fetchApi<any[]>(`/action-plans${query}`);
  },
  getById: (id: string) => fetchApi<any>(`/action-plans/${id}`),
  create: (data: any) => fetchApi<any>('/action-plans', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchApi<any>(`/action-plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchApi<void>(`/action-plans/${id}`, {
    method: 'DELETE',
  }),
};

// Teams API
export const teamsApi = {
  getAll: (planId: string) => fetchApi<any[]>(`/teams?planId=${planId}`),
  create: (data: any) => fetchApi<any>('/teams', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchApi<any>(`/teams/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchApi<void>(`/teams/${id}`, {
    method: 'DELETE',
  }),
};

// Employees API
export const employeesApi = {
  getAll: (planId: string) => fetchApi<any[]>(`/employees?planId=${planId}`),
  create: (data: any) => fetchApi<any>('/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchApi<any>(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchApi<void>(`/employees/${id}`, {
    method: 'DELETE',
  }),
};

// Alerts API
export const alertsApi = {
  getAll: (planId: string) => fetchApi<any[]>(`/alerts?planId=${planId}`),
  markAsRead: (id: string) => fetchApi<void>(`/alerts/${id}/read`, {
    method: 'POST',
  }),
  resolve: (id: string) => fetchApi<void>(`/alerts/${id}/resolve`, {
    method: 'POST',
  }),
};

// Backup API
export const backupApi = {
  create: (planId: string, name: string) => fetchApi<any>('/backup', {
    method: 'POST',
    body: JSON.stringify({ planId, name }),
  }),
  restore: (backupId: string) => fetchApi<any>('/backup/restore', {
    method: 'POST',
    body: JSON.stringify({ backupId }),
  }),
  getAll: (planId: string) => fetchApi<any[]>(`/backup?planId=${planId}`),
  exportJson: (planId: string) => fetchApi<any>(`/backup/export/${planId}`),
};
