/**
 * Modelo de Iniciativas Estratégicas y Planes de Acción
 * Administra los proyectos que responden al Análisis y Acción Recomendada del Excel
 */

const storage = require("../data/storage");

class InitiativeModel {
  static findAll() {
    return storage.get("initiatives") || [];
  }

  static findById(id) {
    const list = this.findAll();
    return list.find((i) => i.id === id) || null;
  }

  static findByObjective(objectiveId) {
    return this.findAll().filter((i) => i.objectiveId === objectiveId);
  }

  static create(data) {
    const initiatives = storage.get("initiatives") || [];
    const maxNum = Math.max(0, ...initiatives.map((i) => {
      const match = i.id.match(/\d+/);
      return match ? Number(match[0]) : 0;
    }));

    const newId = `INI-${String(maxNum + 1).padStart(2, "0")}`;
    const newIni = {
      id: newId,
      name: data.name,
      objectiveId: data.objectiveId,
      kpiId: data.kpiId || null,
      owner: data.owner || "Sin asignar",
      area: data.area || "General",
      start: data.start || new Date().toISOString().slice(0, 10),
      end: data.end || new Date().toISOString().slice(0, 10),
      budget: Number(data.budget ?? 0),
      progress: Number(data.progress ?? 0),
      status: Number(data.progress) === 100 ? "Finalizada" : (data.status || "En ejecución"),
      description: data.description || ""
    };

    initiatives.push(newIni);
    storage.set("initiatives", initiatives);
    return newIni;
  }

  static update(id, updates) {
    const initiatives = storage.get("initiatives") || [];
    const index = initiatives.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const progress = updates.progress !== undefined ? Number(updates.progress) : initiatives[index].progress;
    const status = progress === 100 ? "Finalizada" : (updates.status || initiatives[index].status);

    initiatives[index] = {
      ...initiatives[index],
      ...updates,
      progress,
      status,
      id
    };

    storage.set("initiatives", initiatives);
    return initiatives[index];
  }

  static delete(id) {
    let initiatives = storage.get("initiatives") || [];
    const exists = initiatives.some((i) => i.id === id);
    if (!exists) return false;

    initiatives = initiatives.filter((i) => i.id !== id);
    storage.set("initiatives", initiatives);
    return true;
  }
}

module.exports = InitiativeModel;
