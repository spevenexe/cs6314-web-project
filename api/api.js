/**
 * This file contains common fetching patterns used between multiple components
 */

import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
});

export default api;