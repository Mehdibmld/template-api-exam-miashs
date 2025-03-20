import { recipesDB } from "./services.js";

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

  // Vérification après suppression
  if (recipesDB[cityId].length === 0) {
    delete recipesDB[cityId]; // Supprimer l'entrée si elle est vide
  }

  return res.status(204).send(); // No Content
};
