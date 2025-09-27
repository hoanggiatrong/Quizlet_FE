import React, { createContext, useContext, useReducer, useEffect } from "react";

// API Base URL - same as in api.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://35.240.251.182:3000";

// Initial state
const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  REGISTER_START: "REGISTER_START",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  REGISTER_FAILURE: "REGISTER_FAILURE",
  LOGOUT: "LOGOUT",
  SET_LOADING: "SET_LOADING",
  REFRESH_TOKEN_SUCCESS: "REFRESH_TOKEN_SUCCESS",
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load auth data from localStorage on app start
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const accessToken = localStorage.getItem("accessTokenQuiz");
        const refreshToken = localStorage.getItem("refreshTokenQuiz");
        const user = localStorage.getItem("user");

        if (accessToken && refreshToken && user) {
          const parsedUser = JSON.parse(user);
          console.log(
            "AuthContext - Loading user from localStorage:",
            parsedUser
          );

          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              accessToken,
              refreshToken,
              user: parsedUser,
            },
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadAuthData();
  }, []);

  // Save auth data to localStorage
  const saveAuthData = (user, accessToken, refreshToken) => {
    localStorage.setItem("accessTokenQuiz", accessToken);
    localStorage.setItem("refreshTokenQuiz", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
  };

  // Clear auth data from localStorage
  const clearAuthData = () => {
    localStorage.removeItem("accessTokenQuiz");
    localStorage.removeItem("refreshTokenQuiz");
    localStorage.removeItem("user");
  };

  // Login function
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        const { user, accessToken, refreshToken } = data.data;

        saveAuthData(user, accessToken, refreshToken);

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, accessToken, refreshToken },
        });

        return { success: true, data };
      } else {
        dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
        return { success: false, error: data.message || "Đăng nhập thất bại" };
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      return { success: false, error: "Lỗi kết nối" };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        const { user, accessToken, refreshToken } = data.data;

        saveAuthData(user, accessToken, refreshToken);

        dispatch({
          type: AUTH_ACTIONS.REGISTER_SUCCESS,
          payload: { user, accessToken, refreshToken },
        });

        return { success: true, data };
      } else {
        dispatch({ type: AUTH_ACTIONS.REGISTER_FAILURE });
        return { success: false, error: data.message || "Đăng ký thất bại" };
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.REGISTER_FAILURE });
      return { success: false, error: "Lỗi kết nối" };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API if accessToken exists
      if (state.accessToken) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      clearAuthData();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: state.refreshToken }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        const { accessToken, refreshToken: newRefreshToken } = data.data;

        localStorage.setItem("accessTokenQuiz", accessToken);
        localStorage.setItem("refreshTokenQuiz", newRefreshToken);

        dispatch({
          type: AUTH_ACTIONS.REFRESH_TOKEN_SUCCESS,
          payload: { accessToken, refreshToken: newRefreshToken },
        });

        return { success: true, accessToken };
      } else {
        // Refresh token expired, logout user
        logout();
        return { success: false };
      }
    } catch (error) {
      logout();
      return { success: false };
    }
  };

  // Get profile function
  const getProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        const user = data.data.user;
        localStorage.setItem("user", JSON.stringify(user));

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user,
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
          },
        });

        return { success: true, user };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: "Lỗi kết nối" };
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    getProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
