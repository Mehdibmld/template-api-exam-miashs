import { fetchCityInfo, fetchWeather, recipesDB } from "./services.js";

// Route GET /cities/:cityId/infos
export const getCityInfo = async (req, res) => {
  try {
    const { cityId } = req.params;

    // Vérifier si la ville existe dans City API
    const cityData = await fetchCityInfo(cityId);
    if (!cityData) {
      return res.status(404).json({ success: false, error: "City not found" });
    }

    // Récupération des prévisions météo
    const weatherData = await fetchWeather(cityId);
    if (!weatherData.length) {
      return res.status(404).json({ success: false, error: "Weather data not found" });
    }

    // Vérification du format attendu
    const response = {
      coordinates: [cityData.coordinates.latitude, cityData.coordinates.longitude],
      population: cityData.population || 0,
      knownFor: cityData.knownFor || [],
      weatherPredictions: weatherData.slice(0, 2),
      recipes: recipesDB[cityId] || [],
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching city info:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Route POST /cities/:cityId/recipes
export const addRecipe = (req, res) => {
  const { cityId } = req.params;
  const { content } = req.body;

  // Vérifier si la ville existe
  if (!recipesDB[cityId]) {
    return res.status(404).json({ success: false, error: "City not found" });
  }

  // Validation du contenu
  if (!content) {
    return res.status(400).json({ success: false, error: "Content is required" });
  }
  if (content.length < 10) {
    return res.status(400).json({ success: false, error: "Content too short" });
  }
  if (content.length > 2000) {
    return res.status(400).json({ success: false, error: "Content too long" });
  }

  // Génération d'un ID pour la recette
  const recipeId = Date.now();
  const newRecipe = { id: recipeId, content };

  // Ajout à la liste des recettes
  recipesDB[cityId].push(newRecipe);

  res.status(201).json(newRecipe);
};

// Route DELETE /cities/:cityId/recipes/:recipeId
export const deleteRecipe = (req, res) => {
  const { cityId, recipeId } = req.params;

  // Vérifier si la ville existe
  if (!recipesDB[cityId]) {
    return res.status(404).json({ success: false, error: "City not found" });
  }

  // Vérifier si la recette existe
  const recipeIndex = recipesDB[cityId].findIndex((recipe) => recipe.id == recipeId);
  if (recipeIndex === -1) {
    return res.status(404).json({ success: false, error: "Recipe not found" });
  }

  // Supprimer la recette
  recipesDB[cityId].splice(recipeIndex, 1);
  res.status(204).send();
};
