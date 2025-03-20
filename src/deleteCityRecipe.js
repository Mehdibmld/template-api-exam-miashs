export const deleteCityRecipe = async (request, reply) => {
    try {
      const { cityId, recipeId } = request.params;
  
      if (!recipesDB[cityId]) return reply.status(404).send({ error: "Ville sans recette." });
  
      const recipeIndex = recipesDB[cityId].findIndex(r => r.id == recipeId);
      if (recipeIndex === -1) return reply.status(404).send({ error: "Recette non trouvée." });
  
      recipesDB[cityId].splice(recipeIndex, 1);
      reply.status(204).send();
    } catch (error) {
      reply.status(500).send({ error: "Erreur serveur." });
    }
  };
  