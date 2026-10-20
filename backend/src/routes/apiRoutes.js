/**
 * Definición de Rutas API REST (JSON Views)
 */

const express = require("express");
const router = express.Router();

const DashboardController = require("../controllers/dashboardController");
const KpiController = require("../controllers/kpiController");
const ObjectiveController = require("../controllers/objectiveController");
const MeasurementController = require("../controllers/measurementController");
const InitiativeController = require("../controllers/initiativeController");
const AuthController = require("../controllers/authController");
const storage = require("../data/storage");
const JsonView = require("../views/presenters/jsonView");

// Auth
router.post("/auth/login", AuthController.apiLogin);
router.get("/users", AuthController.apiGetUsers);

// Dashboard
router.get("/dashboard", DashboardController.apiGetDashboard);

// KPIs (36 Indicadores)
router.get("/kpis", KpiController.apiGetAll);
router.get("/kpis/:id", KpiController.apiGetById);
router.post("/kpis", KpiController.apiCreate);
router.put("/kpis/:id", KpiController.apiUpdate);
router.delete("/kpis/:id", KpiController.apiDelete);

// Objetivos Estratégicos (12 Objetivos)
router.get("/objectives", ObjectiveController.apiGetAll);
router.get("/objectives/:id", ObjectiveController.apiGetById);
router.post("/objectives", ObjectiveController.apiCreate);
router.put("/objectives/:id", ObjectiveController.apiUpdate);
router.delete("/objectives/:id", ObjectiveController.apiDelete);

// Mediciones (Historial y actualización de valores Reales)
router.get("/measurements", MeasurementController.apiGetAll);
router.post("/measurements", MeasurementController.apiCreate);
router.put("/measurements/:id", MeasurementController.apiUpdate);

// Iniciativas Estratégicas (12 Iniciativas)
router.get("/initiatives", InitiativeController.apiGetAll);
router.get("/initiatives/:id", InitiativeController.apiGetById);
router.post("/initiatives", InitiativeController.apiCreate);
router.put("/initiatives/:id", InitiativeController.apiUpdate);
router.delete("/initiatives/:id", InitiativeController.apiDelete);

// Restaurar datos originales del Excel BSC
router.post("/system/reset-excel", (req, res) => {
  try {
    const data = storage.reset();
    return JsonView.success(res, data, "Datos del Excel BSC_TechPeru_Ampliado_2025.xlsx restaurados");
  } catch (err) {
    return JsonView.error(res, err.message, 500);
  }
});

module.exports = router;
