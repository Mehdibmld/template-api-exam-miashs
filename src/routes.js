import express from "express";
import { getCityInfo, addRecipe } from "./controllers.js";
import { deleteRecipe } from "./delete.js";

const router = express.Router();

router.get("/:cityId/infos", getCityInfo);
router.post("/:cityId/recipes", addRecipe);
router.delete("/:cityId/recipes/:recipeId", deleteRecipe);

export default router;
