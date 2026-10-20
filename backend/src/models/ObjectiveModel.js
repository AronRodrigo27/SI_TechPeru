/**
 * Modelo de Objetivos Estratégicos
 * Agrupa los KPIs por cada uno de los 12 objetivos del Balanced Scorecard
 */

const storage = require("../data/storage");
const KpiModel = require("./KpiModel");

class ObjectiveModel {
  static enrichObjective(obj) {
    const associatedKpis = KpiModel.findByObjective(obj.id);
    const validKpis = associatedKpis.filter((k) => k.achievement !== null);

    const totalWeight = validKpis.reduce((sum, k) => sum + (k.weight || 1), 0);
    const averageScore = totalWeight > 0
      ? validKpis.reduce((sum, k) => sum + k.achievement * (k.weight || 1), 0) / totalWeight
      : null;

    return {
      ...obj,
      kpiCount: associatedKpis.length,
      averageScore: averageScore !== null ? Number(averageScore.toFixed(1)) : null,
      statusBadge: KpiModel.getStatus(averageScore),
      kpis: associatedKpis
    };
  }

  static findAll() {
    const objectives = storage.get("objectives") || [];
    return objectives.map((o) => this.enrichObjective(o));
  }

  static findById(id) {
    const objectives = storage.get("objectives") || [];
    const obj = objectives.find((o) => o.id === id);
    return obj ? this.enrichObjective(obj) : null;
  }

  static findByPerspective(perspective) {
    return this.findAll().filter((o) => o.perspective === perspective);
  }

  static create(objData) {
    const objectives = storage.get("objectives") || [];
    const maxNum = Math.max(0, ...objectives.map((o) => {
      const match = o.id.match(/\d+/);
      return match ? Number(match[0]) : 0;
    }));
    
    // Generar prefijo según perspectiva
    const prefix = objData.perspective ? objData.perspective[0].toUpperCase() : "X";
    const newId = `OBJ-${prefix}${maxNum + 1}`;

    const newObj = {
      id: newId,
      name: objData.name,
      perspective: objData.perspective,
      description: objData.description || "",
      owner: objData.owner || "Sin asignar",
      priority: objData.priority || "Media",
      weight: Number(objData.weight ?? 100),
      status: objData.status || "Activo"
    };

    objectives.push(newObj);
    storage.set("objectives", objectives);
    return this.enrichObjective(newObj);
  }

  static update(id, updates) {
    const objectives = storage.get("objectives") || [];
    const index = objectives.findIndex((o) => o.id === id);
    if (index === -1) return null;

    objectives[index] = {
      ...objectives[index],
      ...updates,
      id
    };

    storage.set("objectives", objectives);
    return this.enrichObjective(objectives[index]);
  }

  static delete(id) {
    let objectives = storage.get("objectives") || [];
    const exists = objectives.some((o) => o.id === id);
    if (!exists) return false;

    objectives = objectives.filter((o) => o.id !== id);
    storage.set("objectives", objectives);
    return true;
  }
}

module.exports = ObjectiveModel;
