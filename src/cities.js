// routes/cities.js
// On suppose que recipesStore est déjà défini et exporté depuis ce fichier.
const recipesStore = {};

// Global counter pour générer des IDs uniques pour les recettes
if (!global.recipeIdCounter) {
  global.recipeIdCounter = 1;
}


export async function getCityInfos(request, reply) {
    try {
      const { cityId } = request.params;
  
      // 1) Récupérer les infos de la ville
      const cityResponse = await fetch(
        `https://api-ugi2pflmha-ew.a.run.app/cities/${cityId}/insights?apiKey=${process.env.API_KEY}`
      );
      if (!cityResponse.ok) {
        return reply.status(404).send({ error: `City with id "${cityId}" not found` });
      }
      const cityData = await cityResponse.json();

      const weatherResponse = await fetch(
        `https://api-ugi2pflmha-ew.a.run.app/weather-predictions?cityId=${cityId}&apiKey=${process.env.API_KEY}`
      );
      if (!weatherResponse.ok) {
        return reply
          .status(500)
          .send({ error: `Failed to fetch weather for city "${cityId}"` });
      }
      const weatherData = await weatherResponse.json();
  
      
      const cityWeather = weatherData[0];
      if (!cityWeather || !cityWeather.predictions || cityWeather.predictions.length < 2) {
        return reply
          .status(500)
          .send({ error: `Weather data format invalid for city "${cityId}"` });
      }
  
      const [today, tomorrow] = cityWeather.predictions;
  
      // 3) Construire la réponse attendue
      const responsePayload = {
        // On transforme l'objet en tableau [lat, lon]
        coordinates: [cityData.coordinates.latitude, cityData.coordinates.longitude],
        population: cityData.population,
        knownFor: cityData.knownFor,
        weatherPredictions: [
          { when: 'today', min: today.min, max: today.max },
          { when: 'tomorrow', min: tomorrow.min, max: tomorrow.max },
        ],
        // On renvoie les recettes (recipesStore[cityId] || [])
        recipes: recipesStore[cityId] || [],
      };
  
      return reply.send(responsePayload);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: error.message });
    }
  }
  

export async function addCityRecipe(request, reply) {
  try {
    const { cityId } = request.params;
    const { content } = request.body;

    // Validation du contenu
    if (!content || content.trim() === '') {
      return reply.status(400).send({ error: 'Recipe content is required.' });
    }
    if (content.length < 10) {
      return reply.status(400).send({ error: 'Recipe content is too short (minimum 10 characters).' });
    }
    if (content.length > 2000) {
      return reply.status(400).send({ error: 'Recipe content is too long (maximum 2000 characters).' });
    }
    const cityResponse = await fetch(
      `https://api-ugi2pflmha-ew.a.run.app/cities/${cityId}/insights?apiKey=${process.env.API_KEY}`
    );
    if (!cityResponse.ok) {
      return reply.status(404).send({ error: `City with id "${cityId}" not found` });
    }


    const newRecipe = {
      id: global.recipeIdCounter++,
      content: content.trim(),
    };

    if (!recipesStore[cityId]) {
      recipesStore[cityId] = [];
    }
    recipesStore[cityId].push(newRecipe);

    return reply.status(201).send(newRecipe);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: error.message });
  }
}
export async function deleteCityRecipe(request, reply) {
  try {
    const { cityId, recipeId } = request.params;

    const cityResponse = await fetch(
      `https://api-ugi2pflmha-ew.a.run.app/cities/${cityId}/insights?apiKey=${process.env.API_KEY}`
    );
    if (!cityResponse.ok) {
      return reply.status(404).send({ error: `City with id "${cityId}" not found` });
    }
    const recipes = recipesStore[cityId];
    const recipeIdNum = parseInt(recipeId, 10);
    if (!recipes || !recipes.find((recipe) => recipe.id === recipeIdNum)) {
      return reply.status(404).send({ error: `Recipe with id "${recipeId}" not found for city "${cityId}"` });
    }

    recipesStore[cityId] = recipes.filter((recipe) => recipe.id !== recipeIdNum);

   
    return reply.status(204).send();
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: error.message });
  }
}

export { recipesStore };
