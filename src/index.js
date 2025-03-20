import 'dotenv/config';
import Fastify from 'fastify';
import { submitForReview } from './submission.js';
import { getCityInfo } from './getCityInfo.js';
import { postCityRecipe } from './postCityRecipe.js';
import { deleteCityRecipe } from './deleteCityRecipe.js';

const fastify = Fastify({ logger: true });

// ✅ Vérifier si l'API_KEY est bien définie
if (!process.env.API_KEY) {
  console.error("❌ API_KEY non définie dans .env");
  process.exit(1);
}

// ✅ Définition des routes
fastify.get('/cities/:cityId/infos', getCityInfo);
fastify.post('/cities/:cityId/recipes', postCityRecipe);
fastify.delete('/cities/:cityId/recipes/:recipeId', deleteCityRecipe);

// ✅ Écoute du serveur avec affichage d'erreurs détaillé
fastify.listen(
  {
    port: process.env.PORT || 3000,
    host: process.env.RENDER_EXTERNAL_URL ? '0.0.0.0' : process.env.HOST || 'localhost',
  },
  function (err, address) {
    if (err) {
      console.error('❌ Erreur lors du démarrage du serveur :', err);
      process.exit(1);
    }

    console.log(`✅ Serveur démarré sur ${address}`);

    // ✅ Soumission automatique pour l'examen
    submitForReview(fastify);
  }
);
