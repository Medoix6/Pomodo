export const API_BASE = (import.meta.env.VITE_API_BASE as string) ?? 'http://localhost:8080/api';

async function handleRes(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}

function getHeaders() {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchJSON(path: string) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { headers });
  return handleRes(res);
}

export async function postJSON(path: string, body: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

export async function putJSON(path: string, body: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

export async function deleteJSON(path: string) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers
  });
  if (!res.ok && res.status !== 204) throw new Error(`Delete failed: ${res.status}`);
  return null;
}
