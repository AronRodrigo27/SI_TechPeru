# 📊 Sistema de Información Gerencial: Balanced Scorecard (BSC) — TechPeru SAC 2025

Prototipo interactivo web de un **Cuadro de Mando Integral (Balanced Scorecard - BSC)** desarrollado para la gestión estratégica y monitoreo del desempeño de la organización **TechPeru SAC** (Período 2025).

---

## 👥 Participantes del Proyecto

| N° | Apellidos y Nombres | Rol / Contribución |
|:--:|:--------------------|:-------------------|
| 1 | **Apaza Mamani Wilson Ronald** | Desarrollo y Gestión de Datos |
| 2 | **Chambi Sirena Yoel Wagner** | Modelado Estratégico y Métricas |
| 3 | **Magaño Quispe Aron Rodrigo** | Arquitectura del Sistema y Frontend |

---

## 📑 Implementación del Modelo Excel (`BSC_TechPeru_Ampliado_2025.xlsx`)

El presente software implementa y traslada al 100% la lógica estratégica, matemática y operativa definida en el modelo de evaluación corporativo formulado en Excel (`BSC_TechPeru_Ampliado_2025.xlsx`).

### 1. Estructura Organizacional y Metodológica (Kaplan & Norton)
El modelo se organiza a lo largo de las **4 perspectivas fundamentales** del Balanced Scorecard, integrando un total de **12 Objetivos Estratégicos** y **36 Indicadores Clave de Desempeño (KPIs)** (9 indicadores por perspectiva):

1. **💰 Perspectiva Financiera (87.8% de cumplimiento):**
   - **OBJ-F1:** Incrementar la Rentabilidad (`KPI-01` a `KPI-03`).
   - **OBJ-F2:** Acelerar el Crecimiento de Ingresos (`KPI-04` a `KPI-06`).
   - **OBJ-F3:** Optimizar la Estructura de Costos (`KPI-07` a `KPI-09`).
2. **👥 Perspectiva de Clientes (86.0% de cumplimiento):**
   - **OBJ-C1:** Maximizar la Satisfacción del Cliente (`KPI-10` a `KPI-12`).
   - **OBJ-C2:** Aumentar la Retención y Fidelización (`KPI-13` a `KPI-15`).
   - **OBJ-C3:** Expandir la Base de Clientes (`KPI-16` a `KPI-18`).
3. **🔧 Perspectiva de Procesos Internos (79.4% de cumplimiento):**
   - **OBJ-P1:** Excelencia en Operaciones y Calidad (`KPI-19` a `KPI-21`).
   - **OBJ-P2:** Innovación y Desarrollo de Producto (`KPI-22` a `KPI-24`).
   - **OBJ-P3:** Gestión Eficiente de Proveedores (`KPI-25` a `KPI-27`).
4. **📚 Perspectiva de Aprendizaje y Crecimiento (83.8% de cumplimiento):**
   - **OBJ-A1:** Desarrollar el Capital Humano (`KPI-28` a `KPI-30`).
   - **OBJ-A2:** Fortalecer la Cultura y el Clima (`KPI-31` a `KPI-33`).
   - **OBJ-A3:** Impulsar la Innovación Organizacional (`KPI-34` a `KPI-36`).

---

### 2. Motor Matemático de Cálculo y Reglas de Semaforización

En el modelo Excel original, cada indicador posee una naturaleza de optimización específica que ha sido codificada en el motor de cálculo del prototipo (`app.js`):

#### A. Indicadores Directos (25 KPIs — "Mayor valor es mejor")
Para métricas de ventas, rentabilidad, satisfacción o productividad:
$$\text{\% Cumplimiento} = \left(\frac{\text{Valor Real}}{\text{Meta}}\right) \times 100$$

#### B. Indicadores Inversos (11 KPIs — "Menor valor es mejor")
Para variables críticas de costos, tiempos de entrega, tasas de defectos, Churn rate, incidencias y rotación de personal:
$$\text{\% Cumplimiento} = \left(\frac{\text{Meta}}{\text{Valor Real}}\right) \times 100$$

*Ejemplo:* Un *Churn Rate* real de 7.2% frente a una meta de 5.0% produce un cumplimiento del $69.4\%$ (categorizado como Crítico).

#### C. Umbrales del Semáforo Estratégico
El estado de salud de cada objetivo y KPI se clasifica automáticamente según los umbrales estándar definidos en el Excel:
- `✅ LOGRADO` (Verde): Cumplimiento $\ge 90\%$ (**11 KPIs**).
- `⚠️ EN RIESGO` (Ámbar): Cumplimiento entre $75\%$ y $89.9\%$ (**19 KPIs**).
- `❌ CRÍTICO` (Rojo): Cumplimiento $< 75\%$ (**6 KPIs** prioritarios de intervención inmediata).

#### D. Índice Global de Cumplimiento BSC
El desempeño global de TechPeru SAC es de **84.2%**, situando a la organización en estado general `⚠️ EN RIESGO`.

---

### 3. Portafolio de Iniciativas Estratégicas y Planes de Acción
El Excel original incluye en su columna *Análisis / Acción Recomendada* diagnósticos para cada métrica desviada. El sistema implementó **12 Iniciativas Estratégicas asociadas con presupuesto asignado**, tales como:
- Plan de reducción de gastos y automatización de costos (OBJ-F1).
- Implementación de Customer Success y programa de fidelización para revertir el Churn Rate (OBJ-C2).
- Control de Calidad Total, optimización de picking y automatización con RPA (OBJ-P1).
- Sistema de evaluación mensual de proveedores y SLAs (OBJ-P3).
- Plan de cierre de brechas de competencias y retención del talento humano (OBJ-A1 y OBJ-A2).

---

### 4. Características de la Implementación Web Interactiva
- **Dashboard Ejecutivo:** Resumen de métricas globales, semáforos, gráficos de barras por perspectiva (Chart.js) y tendencia histórica del índice BSC.
- **Mapa Estratégico Interactivo:** Visualización de relaciones de causa-efecto en las 4 calles estratégicas con detalle drill-down de KPIs e iniciativas.
- **Módulo de Indicadores (KPIs):** Ficha técnica de cada KPI, visualización de fórmulas, baseline, metas, responsables y acciones correctivas.
- **Registro de Resultados y Recálculo en Vivo:** Permite simular el cambio del valor en la columna `Real` (tal como editar las celdas en el Excel), recalculando en tiempo real el porcentaje y el semáforo.
- **Persistencia Local (`localStorage`):** Los cambios, nuevas mediciones o ajustes de metas persisten en el navegador y pueden restaurarse al estado original del Excel en cualquier momento desde **Administración → Restaurar datos del Excel**.
- **Generación de Reportes y Exportación:** Exportación de tablas maestras a formato CSV descargable y opción de impresión/PDF.
- **Control de Acceso basado en Roles (RBAC):** Perfiles de demostración diferenciados para Administrador, Gerente y Responsable de indicadores.

---

## 🚀 Guía de Ejecución

El prototipo no requiere dependencias pesadas de backend ni instalaciones complejas:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/AronRodrigo27/SI_TechPeru.git
   ```
2. **Abrir la aplicación:**
   - Hacer doble clic en [index.html](file:///index.html) para abrirlo directamente en cualquier navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox o Safari).

3. **Credenciales de Acceso Demo:**
   | Perfil | Correo Electrónico | Contraseña | Permisos |
   |:-------|:-------------------|:-----------|:---------|
   | **Administrador** | `admin@demo.com` | `BSC2026!` | Acceso total, configuración y usuarios |
   | **Gerente** | `gerente@demo.com` | `BSC2026!` | Edición de KPIs, objetivos e iniciativas |
   | **Responsable** | `responsable@demo.com` | `BSC2026!` | Registro y actualización de mediciones |

4. **Ejecutar el Servidor Backend MVC (Node.js & Express):**
   ```bash
   cd backend
   npm install
   npm start
   ```
   - Servidor Web SSR (Vistas EJS): `http://localhost:3000/dashboard`
   - API REST JSON: `http://localhost:3000/api/dashboard`

---

## 📁 Estructura del Proyecto

```text
SI_TechPeru/
├── index.html              # Punto de entrada principal Frontend (SPA)
├── README.md               # Documentación general y técnica del proyecto
├── css/
│   └── styles.css          # Estilos CSS modernos, diseño responsive y paleta de semáforos
├── js/
│   └── app.js              # Lógica de cálculo BSC, datos del Excel, gráficos y persistencia
├── html/                   # Redirecciones y vistas modulares independientes
│   ├── administracion.html
│   ├── dashboard.html
│   ├── indicadores.html
│   ├── iniciativas.html
│   ├── mapa-estrategico.html
│   ├── objetivos.html
│   ├── registro-resultados.html
│   └── reportes.html
└── backend/                # Servidor Backend bajo patrón Modelo - Vista - Controlador (MVC)
    ├── package.json        # Dependencias (express, ejs, cors, dotenv)
    ├── README.md           # Documentación específica del backend y API REST
    ├── src/
    │   ├── app.js          # Configuración de Express, middlewares y vistas EJS
    │   ├── server.js       # Levantamiento del servidor HTTP
    │   ├── config/         # Constantes del BSC y umbrales del semáforo
    │   ├── data/           # Datos del Excel sincronizados y persistencia
    │   ├── models/         # [M] MODELOS: KpiModel, ObjectiveModel, InitiativeModel, etc.
    │   ├── controllers/    # [C] CONTROLADORES: dashboard, kpis, objetivos, mediciones
    │   ├── views/          # [V] VISTAS: Plantillas EJS (SSR) y presentadores JSON
    │   └── routes/         # Rutas desacopladas (webRoutes y apiRoutes)
```

