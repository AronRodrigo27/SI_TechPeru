/**
 * Controlador de Objetivos Estratégicos
 * Administra los 12 objetivos del Balanced Scorecard
 */

const ObjectiveModel = require("../models/ObjectiveModel");
const { PERSPECTIVES } = require("../config/constants");
const JsonView = require("../views/presenters/jsonView");

class ObjectiveController {
  // API REST: GET /api/objectives
  static apiGetAll(req, res) {
    try {
      const { perspective } = req.query;
      let list = ObjectiveModel.findAll();
      if (perspective) {
        list = list.filter((o) => o.perspective === perspective);
      }
      return JsonView.success(res, list, `Se obtuvieron ${list.length} objetivos estratégicos`);
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // API REST: GET /api/objectives/:id
  static apiGetById(req, res) {
    try {
      const obj = ObjectiveModel.findById(req.params.id);
      if (!obj) {
        return JsonView.error(res, `Objetivo ${req.params.id} no encontrado`, 404);
      }
      return JsonView.success(res, obj);
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // API REST: POST /api/objectives
  static apiCreate(req, res) {
    try {
      const { name, perspective } = req.body;
      if (!name || !perspective) {
        return JsonView.error(res, "Nombre y perspectiva son campos obligatorios", 422);
      }

      const newObj = ObjectiveModel.create(req.body);
      return JsonView.success(res, newObj, "Objetivo creado exitosamente", 201);
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // API REST: PUT /api/objectives/:id
  static apiUpdate(req, res) {
    try {
      const updated = ObjectiveModel.update(req.params.id, req.body);
      if (!updated) {
        return JsonView.error(res, `Objetivo ${req.params.id} no encontrado`, 404);
      }
      return JsonView.success(res, updated, "Objetivo actualizado");
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // API REST: DELETE /api/objectives/:id
  static apiDelete(req, res) {
    try {
      const ok = ObjectiveModel.delete(req.params.id);
      if (!ok) {
        return JsonView.error(res, `Objetivo ${req.params.id} no encontrado`, 404);
      }
      return JsonView.success(res, null, "Objetivo eliminado");
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // Vista Web EJS: GET /objetivos
  static viewObjectives(req, res) {
    try {
      const objectives = ObjectiveModel.findAll();
      res.render("objetivos", {
        title: "12 Objetivos Estratégicos — TechPeru SAC 2025",
        page: "objetivos",
        objectives,
        perspectives: PERSPECTIVES
      });
    } catch (err) {
      res.status(500).send("Error al cargar la vista de objetivos: " + err.message);
    }
  }
}

module.exports = ObjectiveController;
