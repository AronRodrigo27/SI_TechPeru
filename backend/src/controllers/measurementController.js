/**
 * Controlador de Mediciones y Registro de Resultados
 * Permite registrar y actualizar los valores 'Real' de los KPIs
 */

const MeasurementModel = require("../models/MeasurementModel");
const KpiModel = require("../models/KpiModel");
const JsonView = require("../views/presenters/jsonView");

class MeasurementController {
  // API REST: GET /api/measurements
  static apiGetAll(req, res) {
    try {
      const { kpiId } = req.query;
      let measurements;
      if (kpiId) {
        measurements = MeasurementModel.findByKpi(kpiId);
      } else {
        measurements = MeasurementModel.findAll();
      }
      return JsonView.success(res, measurements, `Se obtuvieron ${measurements.length} mediciones`);
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // API REST: POST /api/measurements (Equivalente a cambiar la celda 'Real' en el Excel)
  static apiCreate(req, res) {
    try {
      const { kpiId, value, period, notes } = req.body;
      if (!kpiId || value === undefined) {
        return JsonView.error(res, "kpiId y value son campos obligatorios", 422);
      }

      const created = MeasurementModel.create(req.body);
      const updatedKpi = KpiModel.findById(kpiId);

      return JsonView.success(
        res,
        {
          measurement: created,
          updatedKpi
        },
        "Medición registrada y valor Real actualizado",
        201
      );
    } catch (err) {
      return JsonView.error(res, err.message, 400);
    }
  }

  // API REST: PUT /api/measurements/:id
  static apiUpdate(req, res) {
    try {
      const updated = MeasurementModel.update(req.params.id, req.body);
      if (!updated) {
        return JsonView.error(res, `Medición ${req.params.id} no encontrada`, 404);
      }
      return JsonView.success(res, updated, "Medición actualizada");
    } catch (err) {
      return JsonView.error(res, err.message, 400);
    }
  }
}

module.exports = MeasurementController;
