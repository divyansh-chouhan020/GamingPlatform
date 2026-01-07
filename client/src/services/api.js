import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await axiosInstance({
      url: endpoint,
      method: options.method || "GET",
      data: options.body ? JSON.parse(options.body) : options.data,
      params: options.params,
      headers: {
        ...options.headers,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data?.message || "An error occurred");
    } else if (error.request) {
      // Request made but no response received
      throw new Error("Network error. Please check your connection.");
    } else {
      // Something else happened
      throw new Error(error.message || "An error occurred");
    }
  }
};

// Auth API
export const authAPI = {
  login: async (credentials) => {
    return apiRequest("/auth/login", {
      method: "POST",
      data: credentials,
    });
  },

  signup: async (userData) => {
    return apiRequest("/auth/signup", {
      method: "POST",
      data: userData,
    });
  },

  logout: async () => {
    return apiRequest("/auth/logout", {
      method: "GET",
    });
  },
};

// User API
export const userAPI = {
  getUser: async () => {
    return apiRequest("/user", {
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
      data: gameData,
    });
  },

  // List all approved games
  listAllGames: async (params = {}) => {
    return apiRequest("/game", {
      method: "GET",
      params: params,
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
    return apiRequest("/game/pending", {
      method: "GET",
      params: params,
    });
  },

  // List developer's games (developer only)
  listDeveloperGames: async (params = {}) => {
    return apiRequest("/game/developerlist", {
      method: "GET",
      params: params,
    });
  },

  // Update game (developer only)
  updateGame: async (gameId, gameData) => {
    return apiRequest(`/game/${gameId}`, {
      method: "PATCH",
      data: gameData,
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
      data: reviewData,
    });
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    return apiRequest(`/game/review/${reviewId}`, {
      method: "PATCH",
      data: reviewData,
    });
  },

  // Delete review
  deleteReview: async (reviewId) => {
    return apiRequest(`/game/review/${reviewId}`, {
      method: "DELETE",
    });
  },
};

// --- START OF ADDED PAYMENT API SECTION ---
export const paymentAPI = {
  // Create Razorpay Order for Lifetime Subscription
  createOrder: async () => {
    return apiRequest("/payments/createOrder", {
      method: "POST",
    });
  },

  // Verify Payment Signature and Upgrade User
  verifyPayment: async (paymentData) => {
    return apiRequest("/payments/verifyPayment", {
      method: "POST",
      data: paymentData,
    });
  },
};
// --- END OF ADDED PAYMENT API SECTION ---