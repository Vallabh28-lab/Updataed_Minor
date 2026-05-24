const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = {
  /**
   * @desc    Authenticate user credentials
   * @param   {string} email
   * @param   {string} password
   */
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },

  /**
   * @desc    Register a new user account profile
   * @param   {Object} userData - Contains name, email, password, profession, age
   */
  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return data;
  },

  /**
   * @desc    Submit account email alongside new password selection to overwrite database record
   * @param   {string} email
   * @param   {string} newPassword
   */
  forgotPassword: async (email, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, newPassword }) // Safely passes down both fields to authController
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Password reset request failed');
    }

    return data;
  }
};

export default api;