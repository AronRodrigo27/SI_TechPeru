/**
 * Modelo de Mediciones (Registro de Resultados)
 * Permite registrar valores reales para los KPIs y mantiene el histórico mensual.
 */

const storage = require("../data/storage");
const KpiModel = require("./KpiModel");

class MeasurementModel {
  static findAll() {
    const kpis = storage.get("kpis") || [];
    const allMeasurements = [];

    kpis.forEach((k) => {
      (k.measurements || []).forEach((m) => {
        const achievement = KpiModel.calculateAchievement(k.target, m.value, k.direction, k.lower, k.upper);
        const status = KpiModel.getStatus(achievement, k.alertAt, k.criticalAt);
        allMeasurements.push({
          ...m,
          kpiId: k.id,
          kpiName: k.name,
          unit: k.unit,
          target: k.target,
          achievement,
          status
        });
      });
    });

    return allMeasurements.sort((a, b) => b.date.localeCompare(a.date) || a.kpiId.localeCompare(b.kpiId));
  }

  static findByKpi(kpiId) {
    const kpi = (storage.get("kpis") || []).find((k) => k.id === kpiId);
    if (!kpi) return [];

    return (kpi.measurements || []).map((m) => {
      const achievement = KpiModel.calculateAchievement(kpi.target, m.value, kpi.direction, kpi.lower, kpi.upper);
      return {
        ...m,
        kpiId: kpi.id,
        kpiName: kpi.name,
        unit: kpi.unit,
        target: kpi.target,
        achievement,
        status: KpiModel.getStatus(achievement, kpi.alertAt, kpi.criticalAt)
      };
    }).sort((a, b) => b.period.localeCompare(a.period));
  }

  static create(measurementData) {
    const kpis = storage.get("kpis") || [];
    const kpi = kpis.find((k) => k.id === measurementData.kpiId);
    if (!kpi) {
      throw new Error(`El KPI con código ${measurementData.kpiId} no existe.`);
    }

    const value = Number(measurementData.value);
    if (!Number.isFinite(value)) {
      throw new Error("El valor de la medición debe ser un número válido.");
    }

    const newId = `M-${kpi.id}-${Date.now()}`;
    const newMeasurement = {
      id: newId,
      period: measurementData.period || new Date().toISOString().slice(0, 7),
      date: measurementData.date || new Date().toISOString().slice(0, 10),
      value,
      notes: measurementData.notes || "",
      responsible: measurementData.responsible || kpi.owner
    };

    kpi.measurements = kpi.measurements || [];
    kpi.measurements.push(newMeasurement);

    // Ordenar mediciones y actualizar el valor 'current' del KPI al último valor cronológico
    kpi.measurements.sort((a, b) => a.period.localeCompare(b.period) || a.date.localeCompare(b.date));
    const latest = kpi.measurements[kpi.measurements.length - 1];
    kpi.current = latest ? latest.value : null;

    storage.set("kpis", kpis);

    const achievement = KpiModel.calculateAchievement(kpi.target, value, kpi.direction, kpi.lower, kpi.upper);
    return {
      ...newMeasurement,
      kpiId: kpi.id,
      kpiName: kpi.name,
      achievement,
      status: KpiModel.getStatus(achievement, kpi.alertAt, kpi.criticalAt)
    };
  }

  static update(id, updates) {
    const kpis = storage.get("kpis") || [];
    let updatedMeasurement = null;

    for (const kpi of kpis) {
      const idx = (kpi.measurements || []).findIndex((m) => m.id === id);
      if (idx !== -1) {
        kpi.measurements[idx] = {
          ...kpi.measurements[idx],
          ...updates,
          id
        };

        // Recalcular el valor actual del KPI
        kpi.measurements.sort((a, b) => a.period.localeCompare(b.period) || a.date.localeCompare(b.date));
        const latest = kpi.measurements[kpi.measurements.length - 1];
        kpi.current = latest ? latest.value : null;

        updatedMeasurement = kpi.measurements[idx];
        break;
      }
    }

    if (updatedMeasurement) {
      storage.set("kpis", kpis);
    }

    return updatedMeasurement;
  }
}

module.exports = MeasurementModel;
