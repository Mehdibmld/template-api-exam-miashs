import fetch from "node-fetch";

const CITY_API_URL = "https://api-ugi2pflmha-ew.a.run.app/cities";
const WEATHER_API_URL = "https://api-ugi2pflmha-ew.a.run.app/weather";

export const getCityInfo = async (request, reply) => {
  try {
    const { cityId } = request.params;
    if (!cityId) return reply.status(400).send({ error: "ID de la ville requis." });

    // ✅ Vérification que la ville existe dans City API
    const cityListResponse = await fetch(`${CITY_API_URL}?apiKey=${process.env.API_KEY}`);
    if (!cityListResponse.ok) return reply.status(500).send({ error: "Impossible de récupérer la liste des villes." });

    const cityList = await cityListResponse.json();
    const cityExists = cityList.find(city => city.id === cityId);

    if (!cityExists) return reply.status(404).send({ error: "Ville non trouvée dans City API." });

    // ✅ Récupération des infos de la ville
    const cityResponse = await fetch(`${CITY_API_URL}/${cityId}?apiKey=${process.env.API_KEY}`);
    if (!cityResponse.ok) return reply.status(404).send({ error: "Ville non trouvée." });

    const cityData = await cityResponse.json();

    // ✅ Récupération des prévisions météo
    const weatherResponse = await fetch(`${WEATHER_API_URL}/${cityId}?apiKey=${process.env.API_KEY}`);
    if (!weatherResponse.ok) return reply.status(500).send({ error: "Problème avec Weather API." });

    const weatherData = await weatherResponse.json();

    // ✅ Réponse correcte
    reply.send({
      coordinates: [cityData.lat, cityData.lon],
      population: cityData.population,
      knownFor: cityData.knownFor,
      weatherPredictions: [
        { when: "today", min: weatherData.today.min, max: weatherData.today.max },
        { when: "tomorrow", min: weatherData.tomorrow.min, max: weatherData.tomorrow.max }
      ],
      recipes: cityData.recipes || []
    });
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    reply.status(500).send({ error: "Erreur serveur." });
  }
};
