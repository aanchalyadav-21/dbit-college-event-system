import axios from 'axios';

// Dynamically resolve hostname so devices on Wi-Fi or local network connect to this machine
const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${hostname}:8080/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor to extract response data and normalize errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMessage = 'Network error or backend is not running. Please verify Spring Boot on port 8080.';
    if (error.response && error.response.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
        // If field-level validation errors are attached
        if (error.response.data.data && typeof error.response.data.data === 'object') {
          const fieldErrors = Object.values(error.response.data.data).join(', ');
          errorMessage += `: ${fieldErrors}`;
        }
      }
    }
    return Promise.reject(new Error(errorMessage));
  }
);

// Event Endpoints
export const getEvents = (search = '', category = '') => {
  const params = {};
  if (search) params.search = search;
  if (category && category !== 'All') params.category = category;
  return apiClient.get('/events', { params });
};
export const getEventById = (id) => apiClient.get(`/events/${id}`);
export const createEvent = (data) => apiClient.post('/events', data);
export const updateEvent = (id, data) => apiClient.put(`/events/${id}`, data);
export const deleteEvent = (id) => apiClient.delete(`/events/${id}`);

// Organizer Endpoints
export const getOrganizers = () => apiClient.get('/organizers');
export const getOrganizerById = (id) => apiClient.get(`/organizers/${id}`);
export const createOrganizer = (data) => apiClient.post('/organizers', data);
export const updateOrganizer = (id, data) => apiClient.put(`/organizers/${id}`, data);
export const deleteOrganizer = (id) => apiClient.delete(`/organizers/${id}`);

// Venue Endpoints
export const getVenues = () => apiClient.get('/venues');
export const getVenueById = (id) => apiClient.get(`/venues/${id}`);
export const createVenue = (data) => apiClient.post('/venues', data);
export const updateVenue = (id, data) => apiClient.put(`/venues/${id}`, data);
export const deleteVenue = (id) => apiClient.delete(`/venues/${id}`);

// Registration & Participant Endpoints
export const registerStudent = (data) => apiClient.post('/registrations', data);
export const getRegistrations = () => apiClient.get('/registrations');
export const getRegistrationsByEvent = (eventId) => apiClient.get(`/registrations/event/${eventId}`);
export const cancelRegistration = (id) => apiClient.delete(`/registrations/${id}`);
export const getParticipants = () => apiClient.get('/participants');

// Dashboard Endpoint
export const getDashboardSummary = () => apiClient.get('/dashboard/summary');

export default apiClient;
