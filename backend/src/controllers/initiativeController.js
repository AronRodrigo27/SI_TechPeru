/**
 * Controlador de Iniciativas Estratégicas y Planes de Acción
 */

const InitiativeModel = require("../models/InitiativeModel");
const ObjectiveModel = require("../models/ObjectiveModel");
const KpiModel = require("../models/KpiModel");
const JsonView = require("../views/presenters/jsonView");

class InitiativeController {
  // API REST: GET /api/initiatives
  static apiGetAll(req, res) {
    try {
      const list = InitiativeModel.findAll();
      return JsonView.success(res, list, `Se obtuvieron ${list.length} iniciativas`);
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // API REST: GET /api/initiatives/:id
  static apiGetById(req, res) {
    try {
      const item = InitiativeModel.findById(req.params.id);
      if (!item) {
        return JsonView.error(res, `Iniciativa ${req.params.id} no encontrada`, 404);
      }
      return JsonView.success(res, item);
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // API REST: POST /api/initiatives
  static apiCreate(req, res) {
    try {
      const { name, objectiveId } = req.body;
      if (!name || !objectiveId) {
        return JsonView.error(res, "Nombre y objetivo asociado son obligatorios", 422);
      }

      const created = InitiativeModel.create(req.body);
      return JsonView.success(res, created, "Iniciativa creada exitosamente", 201);
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // API REST: PUT /api/initiatives/:id
  static apiUpdate(req, res) {
    try {
      const updated = InitiativeModel.update(req.params.id, req.body);
      if (!updated) {
        return JsonView.error(res, `Iniciativa ${req.params.id} no encontrada`, 404);
      }
      return JsonView.success(res, updated, "Iniciativa actualizada");
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // API REST: DELETE /api/initiatives/:id
  static apiDelete(req, res) {
    try {
      const ok = InitiativeModel.delete(req.params.id);
      if (!ok) {
        return JsonView.error(res, `Iniciativa ${req.params.id} no encontrada`, 404);
      }
      return JsonView.success(res, null, "Iniciativa eliminada");
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // Vista Web EJS: GET /iniciativas
  static viewInitiatives(req, res) {
    try {
      const initiatives = InitiativeModel.findAll();
      const objectives = ObjectiveModel.findAll();
      const kpis = KpiModel.findAll();

      res.render("iniciativas", {
        title: "12 Iniciativas Estratégicas y Planes de Acción — TechPeru SAC",
        page: "iniciativas",
        initiatives,
        objectives,
        kpis
      });
    } catch (err) {
      res.status(500).send("Error al cargar iniciativas: " + err.message);
    }
  }
}

module.exports = InitiativeController;
