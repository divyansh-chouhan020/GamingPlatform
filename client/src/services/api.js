const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

// Helper function to get auth token from cookies
const getToken = () => {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  }
  return null;
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Important for cookies
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }

  return data;
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (userData) => {
    return apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    return apiRequest("/auth/logout", {
      method: "GET",
    });
  },
};

// Game API
export const gameAPI = {
  // Create game (developer only)
  createGame: async (gameData) => {
    return apiRequest("/game", {
      method: "POST",
      body: JSON.stringify(gameData),
    });
  },

  // List all approved games
  listAllGames: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/game?${queryString}`, {
      method: "GET",
    });
  },

  // Approve game (admin only)
  approveGame: async (gameId) => {
    return apiRequest(`/game/approve/${gameId}`, {
      method: "PATCH",
    });
  },

  // List pending games (admin only)
  listPendingGames: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/game/pending?${queryString}`, {
      method: "GET",
    });
  },

  // List developer's games (developer only)
  listDeveloperGames: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/game/developerlist?${queryString}`, {
      method: "GET",
    });
  },

  // Update game (developer only)
  updateGame: async (gameId, gameData) => {
    return apiRequest(`/game/${gameId}`, {
      method: "PATCH",
      body: JSON.stringify(gameData),
    });
  },

  // Delete game (developer only)
  deleteGame: async (gameId) => {
    return apiRequest(`/game/${gameId}`, {
      method: "DELETE",
    });
  },
};

// Review API
export const reviewAPI = {
  // Create review
  createReview: async (reviewData) => {
    return apiRequest("/game/review", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    return apiRequest(`/game/review/${reviewId}`, {
      method: "PATCH",
      body: JSON.stringify(reviewData),
    });
  },

  // Delete review
  deleteReview: async (reviewId) => {
    return apiRequest(`/game/review/${reviewId}`, {
      method: "DELETE",
    });
  },
};

