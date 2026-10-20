/**
 * Controlador de Dashboard Ejecutivo
 * Orquesta la información general de las 4 perspectivas y el semáforo global del BSC
 */

const KpiModel = require("../models/KpiModel");
const ObjectiveModel = require("../models/ObjectiveModel");
const InitiativeModel = require("../models/InitiativeModel");
const { PERSPECTIVES } = require("../config/constants");
const JsonView = require("../views/presenters/jsonView");

class DashboardController {
  static getDashboardData() {
    const summary = KpiModel.getSummary();
    const allKpis = KpiModel.findAll();
    const objectives = ObjectiveModel.findAll();
    const initiatives = InitiativeModel.findAll();

    // Desglose por perspectiva
    const perspectiveBreakdown = Object.values(PERSPECTIVES).map((p) => {
      const pKpis = allKpis.filter((k) => k.perspective === p.key);
      const evaluated = pKpis.filter((k) => k.achievement !== null);
      const totalWeight = evaluated.reduce((sum, k) => sum + (k.weight || 1), 0);
      const avgScore = totalWeight > 0
        ? evaluated.reduce((sum, k) => sum + k.achievement * (k.weight || 1), 0) / totalWeight
        : null;

      return {
        key: p.key,
        label: p.label,
        color: p.color,
        soft: p.soft,
        kpiCount: pKpis.length,
        averageScore: avgScore !== null ? Number(avgScore.toFixed(1)) : null,
        status: KpiModel.getStatus(avgScore)
      };
    });

    // Indicadores que requieren atención prioritaria (Críticos y En Riesgo)
    const attentionKpis = allKpis
      .filter((k) => ["bad", "warn"].includes(k.status.key))
      .sort((a, b) => (a.achievement ?? 0) - (b.achievement ?? 0));

    return {
      summary,
      perspectiveBreakdown,
      attentionKpis,
      totalObjectives: objectives.length,
      totalInitiatives: initiatives.length
    };
  }

  // API REST: GET /api/dashboard
  static apiGetDashboard(req, res) {
    try {
      const data = DashboardController.getDashboardData();
      return JsonView.success(res, data, "Datos del dashboard obtenidos correctamente");
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // Vista Web EJS: GET /
  static viewDashboard(req, res) {
    try {
      const data = DashboardController.getDashboardData();
      res.render("dashboard", {
        title: "Dashboard Ejecutivo BSC — TechPeru SAC 2025",
        page: "dashboard",
        ...data
      });
    } catch (err) {
      res.status(500).send("Error al renderizar el dashboard: " + err.message);
    }
  }
}

module.exports = DashboardController;
