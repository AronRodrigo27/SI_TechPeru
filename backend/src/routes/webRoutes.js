/**
 * Definición de Rutas Web (Server-Side Rendering con Vistas EJS)
 */

const express = require("express");
const router = express.Router();

const DashboardController = require("../controllers/dashboardController");
const KpiController = require("../controllers/kpiController");
const ObjectiveController = require("../controllers/objectiveController");
const InitiativeController = require("../controllers/initiativeController");

// Vistas del BSC
router.get("/", DashboardController.viewDashboard);
router.get("/dashboard", DashboardController.viewDashboard);
router.get("/kpis", KpiController.viewKpis);
router.get("/objetivos", ObjectiveController.viewObjectives);
router.get("/iniciativas", InitiativeController.viewInitiatives);

module.exports = router;
