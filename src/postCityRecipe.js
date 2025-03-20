const recipesDB = {};

export const postCityRecipe = async (request, reply) => {
  try {
    const { cityId } = request.params;
    const { content } = request.body;

    if (!cityId) return reply.status(400).send({ error: "ID de la ville requis." });
    if (!content || typeof content !== "string") return reply.status(400).send({ error: "Contenu requis." });
    if (content.length < 10) return reply.status(400).send({ error: "Contenu trop court." });
    if (content.length > 2000) return reply.status(400).send({ error: "Contenu trop long." });

    // 🔥 Vérification de l'existence de la ville
    const cityResponse = await fetch(`https://api-ugi2pflmha-ew.a.run.app/cities/${cityId}/insights?apiKey=${process.env.API_KEY}`);
    if (!cityResponse.ok) return reply.status(404).send({ error: "Ville inexistante." });

    // Stocker la recette en mémoire
    const recipeId = Date.now();
    if (!recipesDB[cityId]) recipesDB[cityId] = [];
    recipesDB[cityId].push({ id: recipeId, content });

    // Réponse avec un bon format
    reply.status(201).send({ id: recipeId, content });
  } catch (error) {
    reply.status(500).send({ error: "Erreur serveur.", details: error.message });
  }
};
