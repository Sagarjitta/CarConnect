const API_BASE = '/api';

export const auth = {
  getToken() {
    return localStorage.getItem('carconnect_token');
  },
  setToken(token) {
    localStorage.setItem('carconnect_token', token);
  },
  getUser() {
    const userStr = localStorage.getItem('carconnect_user');
    return userStr ? JSON.parse(userStr) : null;
  },
  setUser(user) {
    localStorage.setItem('carconnect_user', JSON.stringify(user));
  },
  logout() {
    localStorage.removeItem('carconnect_token');
    localStorage.removeItem('carconnect_user');
  },
  isLoggedIn() {
    return !!this.getToken();
  },
  isOwner() {
    const user = this.getUser();
    return user && (user.role === 'ROLE_CAR_OWNER' || user.role === 'CAR_OWNER');
  },
  isCustomer() {
    const user = this.getUser();
    return user && (user.role === 'ROLE_CUSTOMER' || user.role === 'CUSTOMER');
  },
  isAdmin() {
    const user = this.getUser();
    return user && (user.role === 'ROLE_ADMIN' || user.role === 'ADMIN');
  }
};

async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const token = auth.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  auth: {
    login: (credentials) => apiRequest('/auth/login', 'POST', credentials),
    register: (userData) => apiRequest('/auth/register', 'POST', userData),
    logout: () => apiRequest('/auth/logout', 'POST')
  },
  users: {
    getMe: () => apiRequest('/users/me'),
    updateProfile: (profileData) => apiRequest('/users/me', 'PUT', profileData)
  },
  cars: {
    search: (params = {}) => {
      const query = new URLSearchParams();
      if (params.city) query.append('city', params.city);
      if (params.carType) query.append('carType', params.carType);
      if (params.fuelType) query.append('fuelType', params.fuelType);
      if (params.transmission) query.append('transmission', params.transmission);
      if (params.minSeats) query.append('minSeats', params.minSeats);
      if (params.maxPrice) query.append('maxPrice', params.maxPrice);
      if (params.searchQuery) query.append('searchQuery', params.searchQuery);
      if (params.startDate) query.append('startDate', params.startDate);
      if (params.endDate) query.append('endDate', params.endDate);
      const qs = query.toString();
      return apiRequest(`/cars${qs ? `?${qs}` : ''}`);
    },
    getById: (id) => apiRequest(`/cars/${id}`)
  },
  owner: {
    getMyCars: () => apiRequest('/owner/cars'),
    createCar: (carData) => apiRequest('/owner/cars', 'POST', carData),
    updateCar: (id, carData) => apiRequest(`/owner/cars/${id}`, 'PUT', carData),
    deleteCar: (id) => apiRequest(`/owner/cars/${id}`, 'DELETE'),
    togglePublish: (id) => apiRequest(`/owner/cars/${id}/toggle-publish`, 'PATCH'),
    getAnalytics: () => apiRequest('/owner/analytics'),
    getBookings: () => apiRequest('/owner/bookings'),
    acceptBooking: (id) => apiRequest(`/owner/bookings/${id}/accept`, 'PATCH'),
    rejectBooking: (id, reason) => apiRequest(`/owner/bookings/${id}/reject`, 'PATCH', { reason }),
    completeBooking: (id) => apiRequest(`/owner/bookings/${id}/complete`, 'PATCH')
  },
  bookings: {
    create: (bookingData) => apiRequest('/bookings', 'POST', bookingData),
    getMyBookings: () => apiRequest('/bookings/my'),
    getById: (id) => apiRequest(`/bookings/${id}`),
    cancel: (id) => apiRequest(`/bookings/${id}/cancel`, 'PATCH')
  },
  payments: {
    process: (paymentData) => apiRequest('/payments/process', 'POST', paymentData),
    getByBookingId: (bookingId) => apiRequest(`/payments/booking/${bookingId}`)
  },
  reviews: {
    addReview: (reviewData) => apiRequest('/reviews', 'POST', reviewData),
    getCarReviews: (carId) => apiRequest(`/reviews/car/${carId}`)
  },
  admin: {
    getDashboard: () => apiRequest('/admin/dashboard'),
    getUsers: () => apiRequest('/admin/users'),
    updateUserStatus: (id, status) => apiRequest(`/admin/users/${id}/status`, 'PATCH', { status }),
    deleteUser: (id) => apiRequest(`/admin/users/${id}`, 'DELETE'),
    getCars: () => apiRequest('/admin/cars'),
    updateCarStatus: (id, status) => apiRequest(`/admin/cars/${id}/status`, 'PATCH', { status }),
    deleteCar: (id) => apiRequest(`/admin/cars/${id}`, 'DELETE'),
    getBookings: () => apiRequest('/admin/bookings'),
    updateBookingStatus: (id, status) => apiRequest(`/admin/bookings/${id}/status`, 'PATCH', { status })
  }
};
