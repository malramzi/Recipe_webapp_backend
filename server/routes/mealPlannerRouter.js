const express = require("express");
const router = express.Router();
const mealPlannerController = require("../controllers/mealPlansController");
const auth = require("../../middleware/auth");

router.post("/mealPlan", auth, mealPlannerController.createMealPlan);
router.get("/mealPlans", mealPlannerController.getAllMealPlans);
router.get("/mealPlans/user", auth, mealPlannerController.getUserMealPlans);
router.get("/mealPlan/:id", auth, mealPlannerController.getMealPlanById);
router.patch("/mealPlan/:id", auth, mealPlannerController.updateMealPlan);
router.delete("/mealPlan/:id", auth, mealPlannerController.deleteMealPlan);

module.exports = router;
