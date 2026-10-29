const BASE_URL = '/api/grocery';

async function request(path = '', options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(body?.message ?? 'Unexpected error');
  }

  return body;
}

export const groceryApi = {
  getAll: async () => (await request()).data,

  create: async (item) =>
    (await request('', { method: 'POST', body: JSON.stringify(item) })).data,

  update: async (id, item) =>
    (await request(`/${id}`, { method: 'PUT', body: JSON.stringify(item) })).data,

  remove: (id) => request(`/${id}`, { method: 'DELETE' }),

  removeAll: () => request('', { method: 'DELETE' }),
};