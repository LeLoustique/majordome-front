
// Pas possible d’utiliser useAuth ici directement (hook React)
// On va donc exporter des fonctions pour créer un fetch wrapper
// que les composants utiliseront en récupérant le token via useAuth()

const API_URL = "https://sping-ai-majordome.onrender.com";

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de la connexion");
  }

  return response.json(); // { token, refreshToken }
}

/**
 * Wrapper fetch sécurisé avec token + refresh auto
 * @param {string} url
 * @param {object} options
 * @param {function} refreshAuthToken - fonction du contexte auth pour refresh token
 * @param {string} token - token d'auth actuel
 */
export async function authFetch(url, options = {}, refreshAuthToken, token) {
  if (!options.headers) options.headers = {};
  options.headers["Content-Type"] = "application/json";
  if (token) options.headers["Authorization"] = `Bearer ${token}`;

  let response = await fetch(url, options);

  // Si token expiré, on essaie de refresh
  if (response.status === 401 && refreshAuthToken) {
    const newToken = await refreshAuthToken();
    if (!newToken) throw new Error("Non autorisé, veuillez vous reconnecter.");

    options.headers["Authorization"] = `Bearer ${newToken}`;
    response = await fetch(url, options);
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur API");
  }

  return response.json();
}

/**
 * Envoi message chat en sécurisant avec token et refresh
 */
export async function sendMessageToChatController(message, refreshAuthToken, token) {
  return authFetch(
    `/api/chat`,
    { method: "POST", body: JSON.stringify({ message }) },
    refreshAuthToken,
    token
  );
}
