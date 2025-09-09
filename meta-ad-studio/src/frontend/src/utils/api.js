import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Reemplaza con la URL de tu API

export const generateAds = async (prompt) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-ads`, { prompt });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating ads:', error);
    throw error;
  }
};

export const fetchAdResults = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ad-results`);
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching ad results:', error);
    throw error;
  }
};