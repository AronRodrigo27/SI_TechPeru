/**
 * Gestor de Persistencia para el Backend MVC
 * Maneja el almacenamiento de Objetivos, KPIs, Mediciones, Iniciativas y Usuarios.
 */

const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "bsc_current_state.json");
const INITIAL_DATA_FILE = path.join(__dirname, "bsc_initial_data.json");

class Storage {
  constructor() {
    this.state = this._loadInitialState();
  }

  _loadInitialState() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn("No se pudo cargar el archivo de estado actual, usando datos semilla:", err.message);
    }

    const rawInitial = fs.readFileSync(INITIAL_DATA_FILE, "utf-8");
    const data = JSON.parse(rawInitial);

    // Inicializar mediciones para los 36 KPIs
    const months = ["2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12"];
    data.kpis.forEach((k) => {
      k.measurements = [];
      months.forEach((month, idx) => {
        const progress = (idx + 1) / 6;
        let v;
        if (k.direction === "menor") {
          v = Number((k.baseline - (k.baseline - k.current) * progress).toFixed(2));
        } else {
          v = Number((k.baseline + (k.current - k.baseline) * progress).toFixed(2));
        }
        if (idx === 5) v = k.current;
        k.measurements.push({
          id: `M-${k.id}-${month}`,
          period: month,
          date: `${month}-${["31", "31", "30", "31", "30", "31"][idx]}`,
          value: v,
          notes: idx === 5 ? k.description : "Evolución mensual acumulada — TechPeru SAC",
          responsible: k.owner
        });
      });
    });

    this._saveToFile(data);
    return data;
  }

  _saveToFile(data) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error al persistir estado en disco:", err.message);
    }
  }

  save() {
    this._saveToFile(this.state);
  }

  reset() {
    if (fs.existsSync(DATA_FILE)) {
      try {
        fs.unlinkSync(DATA_FILE);
      } catch (e) {}
    }
    this.state = this._loadInitialState();
    return this.state;
  }

  get(key) {
    return this.state[key];
  }

  set(key, val) {
    this.state[key] = val;
    this.save();
  }
}

const storageInstance = new Storage();
module.exports = storageInstance;
