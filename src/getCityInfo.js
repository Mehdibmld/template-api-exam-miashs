import fetch from "node-fetch";

const CITY_API_URL = "https://api-ugi2pflmha-ew.a.run.app/cities";
const WEATHER_API_URL = "https://api-ugi2pflmha-ew.a.run.app/weather-predictions";

export const getCityInfo = async (request, reply) => {
  try {
    const { cityId } = request.params;
    if (!cityId) return reply.status(400).send({ error: "ID de la ville requis." });

    // 🔥 Nouvelle URL pour récupérer les infos d'une ville
    const cityResponse = await fetch(`${CITY_API_URL}/${cityId}/insights?apiKey=${process.env.API_KEY}`);
    if (!cityResponse.ok) return reply.status(404).send({ error: "Ville non trouvée." });

    const cityData = await cityResponse.json();

    // 🔥 Nouvelle URL pour récupérer les prévisions météo
    const weatherResponse = await fetch(`${WEATHER_API_URL}?cityId=${cityId}&apiKey=${process.env.API_KEY}`);
    if (!weatherResponse.ok) return reply.status(500).send({ error: "Problème météo." });

    const weatherData = await weatherResponse.json();

    // On s'assure que les prédictions sont bien récupérées
    const predictions = weatherData.find(w => w.cityId === cityId)?.predictions || [];

    if (predictions.length < 2) {
      return reply.status(500).send({ error: "Données météo incomplètes." });
    }

    reply.send({
      coordinates: [cityData.coordinates.latitude, cityData.coordinates.longitude],
      population: cityData.population,
      knownFor: cityData.knownFor,
      weatherPredictions: [
        { when: "today", min: predictions[0].min, max: predictions[0].max },
        { when: "tomorrow", min: predictions[1].min, max: predictions[1].max }
      ],
      recipes: []
    });
  } catch (error) {
    reply.status(500).send({ error: "Erreur serveur.", details: error.message });
  }
};
