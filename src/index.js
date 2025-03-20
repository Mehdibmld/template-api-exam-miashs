import 'dotenv/config';
import Fastify from 'fastify';
import { submitForReview } from './submission.js';
import { getCityInfo } from './getCityInfo.js';
import { postCityRecipe } from './postCityRecipe.js';
import { deleteCityRecipe } from './deleteCityRecipe.js';

const fastify = Fastify({ logger: true });

fastify.get('/cities/:cityId/infos', getCityInfo);
fastify.post('/cities/:cityId/recipes', postCityRecipe);
fastify.delete('/cities/:cityId/recipes/:recipeId', deleteCityRecipe);

fastify.listen(
  {
    port: process.env.PORT || 3000,
    host: process.env.RENDER_EXTERNAL_URL ? '0.0.0.0' : process.env.HOST || 'localhost',
  },
  function (err) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }

    console.log('✅ Serveur démarré sur http://localhost:' + process.env.PORT);

    ////////////////////////////////////////////////////////////////////////
    // NE PAS SUPPRIMER : Soumission automatique de l'API pour l'examen  //
    ////////////////////////////////////////////////////////////////////////
    submitForReview(fastify);
  }
);
