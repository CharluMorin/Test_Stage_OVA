const BASE_URL = "/api/grocery";

async function request(path = "", options = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error(
      "Serveur injoignable. Vérifiez que le backend est démarré.",
    );
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(body?.message ?? "Une erreur inattendue est survenue");
  }

  return body;
}

export const groceryApi = {
  getAll: async () => (await request()).data,

  create: async (item) =>
    (await request("", { method: "POST", body: JSON.stringify(item) })).data,

  update: async (id, item) =>
    (await request(`/${id}`, { method: "PUT", body: JSON.stringify(item) }))
      .data,

  remove: (id) => request(`/${id}`, { method: "DELETE" }),

  removeAll: () => request("", { method: "DELETE" }),
};
