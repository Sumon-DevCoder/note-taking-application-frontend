const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const fetchApi = async (endpoint: string, method: string = 'GET', body: any = null, token: string = '') => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };   

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, options);
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};
