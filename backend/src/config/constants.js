/**
 * Constantes y Parámetros del Balanced Scorecard (BSC) — TechPeru SAC 2025
 * Basado en las definiciones del archivo BSC_TechPeru_Ampliado_2025.xlsx
 */

const PERSPECTIVES = {
  financiera: {
    key: "financiera",
    label: "Financiera",
    color: "#3478e5",
    soft: "#edf4ff"
  },
  clientes: {
    key: "clientes",
    label: "Clientes",
    color: "#18a875",
    soft: "#eaf8f1"
  },
  procesos: {
    key: "procesos",
    label: "Procesos Internos",
    color: "#e99a2d",
    soft: "#fff5e6"
  },
  aprendizaje: {
    key: "aprendizaje",
    label: "Aprendizaje y Crecimiento",
    color: "#8b6bd6",
    soft: "#f2edff"
  }
};

const THRESHOLDS = {
  ALERT: 90.0,    // >= 90% -> LOGRADO (Verde)
  CRITICAL: 75.0  // < 75%  -> CRÍTICO (Rojo); 75% - 89.9% -> EN RIESGO (Ámbar)
};

const STATUS_KEYS = {
  GOOD: "good",
  WARN: "warn",
  BAD: "bad",
  NEUTRAL: "neutral"
};

const STATUS_LABELS = {
  GOOD: "✅ LOGRADO",
  WARN: "⚠️ EN RIESGO",
  BAD: "❌ CRÍTICO",
  NEUTRAL: "Sin datos"
};

module.exports = {
  PERSPECTIVES,
  THRESHOLDS,
  STATUS_KEYS,
  STATUS_LABELS
};
