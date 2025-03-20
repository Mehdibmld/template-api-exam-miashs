import express from "express";
import { getCityInfo, addRecipe, deleteRecipe } from "./src/controllers.js";

const router = express.Router();

router.get("/:cityId/infos", getCityInfo);
router.post("/:cityId/recipes", addRecipe);
router.delete("/:cityId/recipes/:recipeId", deleteRecipe);

export default router;
