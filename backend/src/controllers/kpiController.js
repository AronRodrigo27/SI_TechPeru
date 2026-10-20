/**
 * Controlador de Indicadores (KPIs)
 * Maneja la lógica de negocio y las rutas de los 36 KPIs del Excel
 */

const KpiModel = require("../models/KpiModel");
const ObjectiveModel = require("../models/ObjectiveModel");
const { PERSPECTIVES } = require("../config/constants");
const JsonView = require("../views/presenters/jsonView");

class KpiController {
  // API REST: GET /api/kpis
  static apiGetAll(req, res) {
    try {
      const { perspective, status, owner, search } = req.query;
      let kpis = KpiModel.findAll();

      if (perspective) {
        kpis = kpis.filter((k) => k.perspective === perspective);
      }
      if (status) {
        kpis = kpis.filter((k) => k.status.key === status);
      }
      if (owner) {
        kpis = kpis.filter((k) => k.owner.toLowerCase() === owner.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        kpis = kpis.filter((k) =>
          k.id.toLowerCase().includes(q) ||
          k.name.toLowerCase().includes(q) ||
          k.description.toLowerCase().includes(q) ||
          k.owner.toLowerCase().includes(q)
        );
      }

      return JsonView.success(res, kpis, `Se obtuvieron ${kpis.length} indicadores`);
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // API REST: GET /api/kpis/:id
  static apiGetById(req, res) {
    try {
      const kpi = KpiModel.findById(req.params.id);
      if (!kpi) {
        return JsonView.error(res, `Indicador ${req.params.id} no encontrado`, 404);
      }
      return JsonView.success(res, kpi);
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // API REST: POST /api/kpis
  static apiCreate(req, res) {
    try {
      const { name, perspective, objectiveId, unit, formula, target } = req.body;
      if (!name || !perspective || !objectiveId || !unit || !formula || target === undefined) {
        return JsonView.error(res, "Faltan campos obligatorios para registrar el KPI", 422);
      }

      const newKpi = KpiModel.create(req.body);
      return JsonView.success(res, newKpi, "KPI creado exitosamente", 201);
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // API REST: PUT /api/kpis/:id
  static apiUpdate(req, res) {
    try {
      const updated = KpiModel.update(req.params.id, req.body);
      if (!updated) {
        return JsonView.error(res, `No se encontró el indicador ${req.params.id}`, 404);
      }
      return JsonView.success(res, updated, "KPI actualizado correctamente");
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // API REST: DELETE /api/kpis/:id
  static apiDelete(req, res) {
    try {
      const ok = KpiModel.delete(req.params.id);
      if (!ok) {
        return JsonView.error(res, `No se encontró el KPI ${req.params.id}`, 404);
      }
      return JsonView.success(res, null, `KPI ${req.params.id} eliminado`);
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // Vista Web EJS: GET /kpis
  static viewKpis(req, res) {
    try {
      const kpis = KpiModel.findAll();
      const summary = KpiModel.getSummary();
      const objectives = ObjectiveModel.findAll();

      res.render("kpis", {
        title: "Catálogo de 36 Indicadores (KPIs) — TechPeru SAC 2025",
        page: "kpis",
        kpis,
        summary,
        objectives,
        perspectives: PERSPECTIVES
      });
    } catch (err) {
      res.status(500).send("Error al cargar la vista de KPIs: " + err.message);
    }
  }
}

module.exports = KpiController;
