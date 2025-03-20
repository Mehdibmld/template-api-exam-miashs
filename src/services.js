import axios from "axios";

const API_KEY = process.env.API_KEY;
const CITY_API_BASE_URL = "https://api-ugi2pflmha-ew.a.run.app/cities";
const WEATHER_API_BASE_URL = "https://api-ugi2pflmha-ew.a.run.app/weather-predictions";

export let recipesDB = {};

// Fonction pour récupérer les infos d'une ville
export const fetchCityInfo = async (cityId) => {
  try {
    const response = await axios.get(`${CITY_API_BASE_URL}/${cityId}/insights`, {
      params: { apiKey: API_KEY },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

// Fonction pour récupérer les prévisions météo
export const fetchWeather = async (cityId) => {
  try {
    const response = await axios.get(WEATHER_API_BASE_URL, {
      params: { cityId, apiKey: API_KEY },
    });
    return response.data[0]?.predictions || [];
  } catch (error) {
    return [];
  }
};
