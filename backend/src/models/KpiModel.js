/**
 * Modelo de Indicadores Clave de Desempeño (KPI)
 * Implementa la lógica matemática y de semaforización de BSC_TechPeru_Ampliado_2025.xlsx
 */

const storage = require("../data/storage");
const { THRESHOLDS, STATUS_KEYS, STATUS_LABELS } = require("../config/constants");

class KpiModel {
  /**
   * Cálculo del porcentaje de cumplimiento idéntico al Excel:
   * - Indicador Directo (Mayor es mejor): (Real / Meta) * 100
   * - Indicador Inverso (Menor es mejor): (Meta / Real) * 100
   */
  static calculateAchievement(target, current, direction = "mayor", lower = null, upper = null) {
    if (current === null || current === undefined || current === "" || target === null || target === undefined) {
      return null;
    }

    const val = Number(current);
    const tgt = Number(target);

    if (direction === "rango") {
      if (val >= Number(lower) && val <= Number(upper)) return 100.0;
      const distance = val < Number(lower) ? Number(lower) - val : val - Number(upper);
      const span = Math.max(1, Math.abs(Number(upper) - Number(lower)));
      return Number(Math.max(0, 100 - (distance / span) * 100).toFixed(1));
    }

    if (direction === "menor") {
      if (tgt <= 0 || val <= 0) return 0.0;
      return Number(Math.max(0, Math.min(150, (tgt / val) * 100)).toFixed(1));
    }

    // Default: 'mayor'
    if (tgt === 0) return val >= 0 ? 100.0 : 0.0;
    return Number(Math.max(0, Math.min(150, (val / tgt) * 100)).toFixed(1));
  }

  /**
   * Obtiene la categoría y semáforo según el cumplimiento:
   * ✅ LOGRADO (>= 90%) | ⚠️ EN RIESGO (75% - 89.9%) | ❌ CRÍTICO (< 75%)
   */
  static getStatus(achievementValue, alertThreshold = THRESHOLDS.ALERT, criticalThreshold = THRESHOLDS.CRITICAL) {
    if (achievementValue === null || achievementValue === undefined) {
      return { key: STATUS_KEYS.NEUTRAL, label: STATUS_LABELS.NEUTRAL, pct: null };
    }

    const pct = Number(achievementValue);
    if (pct >= alertThreshold) {
      return { key: STATUS_KEYS.GOOD, label: STATUS_LABELS.GOOD, pct };
    }
    if (pct >= criticalThreshold) {
      return { key: STATUS_KEYS.WARN, label: STATUS_LABELS.WARN, pct };
    }
    return { key: STATUS_KEYS.BAD, label: STATUS_LABELS.BAD, pct };
  }

  static enrichKpi(kpi) {
    const achievement = this.calculateAchievement(kpi.target, kpi.current, kpi.direction, kpi.lower, kpi.upper);
    const status = this.getStatus(achievement, kpi.alertAt ?? THRESHOLDS.ALERT, kpi.criticalAt ?? THRESHOLDS.CRITICAL);
    return {
      ...kpi,
      achievement,
      status
    };
  }

  static findAll() {
    const kpis = storage.get("kpis") || [];
    return kpis.map((k) => this.enrichKpi(k));
  }

  static findById(id) {
    const kpis = storage.get("kpis") || [];
    const k = kpis.find((x) => x.id === id);
    return k ? this.enrichKpi(k) : null;
  }

  static findByPerspective(perspective) {
    return this.findAll().filter((k) => k.perspective === perspective);
  }

  static findByObjective(objectiveId) {
    return this.findAll().filter((k) => k.objectiveId === objectiveId);
  }

  static create(kpiData) {
    const kpis = storage.get("kpis") || [];
    const maxNumber = Math.max(0, ...kpis.map((k) => Number(k.id.replace("KPI-", "")) || 0));
    const newId = `KPI-${String(maxNumber + 1).padStart(2, "0")}`;

    const newKpi = {
      id: newId,
      name: kpiData.name,
      perspective: kpiData.perspective,
      objectiveId: kpiData.objectiveId,
      unit: kpiData.unit || "%",
      formula: kpiData.formula || "",
      baseline: Number(kpiData.baseline ?? 0),
      target: Number(kpiData.target ?? 100),
      current: kpiData.current !== undefined && kpiData.current !== null && kpiData.current !== "" ? Number(kpiData.current) : null,
      direction: kpiData.direction || "mayor",
      frequency: kpiData.frequency || "Mensual",
      owner: kpiData.owner || "Sin asignar",
      area: kpiData.area || "General",
      weight: Number(kpiData.weight ?? 1),
      alertAt: Number(kpiData.alertAt ?? THRESHOLDS.ALERT),
      criticalAt: Number(kpiData.criticalAt ?? THRESHOLDS.CRITICAL),
      lower: kpiData.lower ? Number(kpiData.lower) : null,
      upper: kpiData.upper ? Number(kpiData.upper) : null,
      description: kpiData.description || "",
      measurements: []
    };

    kpis.push(newKpi);
    storage.set("kpis", kpis);
    return this.enrichKpi(newKpi);
  }

  static update(id, updates) {
    const kpis = storage.get("kpis") || [];
    const index = kpis.findIndex((k) => k.id === id);
    if (index === -1) return null;

    kpis[index] = {
      ...kpis[index],
      ...updates,
      id // ID protegido
    };

    storage.set("kpis", kpis);
    return this.enrichKpi(kpis[index]);
  }

  static delete(id) {
    let kpis = storage.get("kpis") || [];
    const exists = kpis.some((k) => k.id === id);
    if (!exists) return false;

    kpis = kpis.filter((k) => k.id !== id);
    storage.set("kpis", kpis);
    return true;
  }

  static getSummary() {
    const all = this.findAll();
    const evaluated = all.filter((k) => k.achievement !== null);
    
    const good = all.filter((k) => k.status.key === STATUS_KEYS.GOOD);
    const warn = all.filter((k) => k.status.key === STATUS_KEYS.WARN);
    const bad = all.filter((k) => k.status.key === STATUS_KEYS.BAD);

    // Cumplimiento global ponderado
    const totalWeight = evaluated.reduce((sum, k) => sum + (k.weight || 1), 0);
    const globalScore = totalWeight > 0
      ? evaluated.reduce((sum, k) => sum + k.achievement * (k.weight || 1), 0) / totalWeight
      : null;

    return {
      total: all.length,
      evaluated: evaluated.length,
      goodCount: good.length,
      warnCount: warn.length,
      badCount: bad.length,
      globalScore: globalScore !== null ? Number(globalScore.toFixed(1)) : null,
      globalStatus: this.getStatus(globalScore)
    };
  }
}

module.exports = KpiModel;
