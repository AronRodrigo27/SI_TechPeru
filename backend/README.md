# 🛠️ Backend MVC — Balanced Scorecard (BSC) TechPeru SAC 2025

Servicio backend modular diseñado bajo el patrón arquitectónico **Modelo - Vista - Controlador (MVC)** en **Node.js y Express**, implementando todas las reglas estratégicas, fórmulas de cálculo y datos del archivo `BSC_TechPeru_Ampliado_2025.xlsx`.

---

## 🏗️ Arquitectura MVC

```text
backend/
├── package.json               # Dependencias del proyecto (express, ejs, cors, dotenv)
├── .env.example               # Variables de entorno de muestra
├── src/
│   ├── app.js                 # Inicialización y configuración de middlewares y rutas
│   ├── server.js              # Punto de entrada y levantamiento del servidor HTTP
│   ├── config/
│   │   └── constants.js       # Constantes del BSC (perspectivas, umbrales del semáforo)
│   ├── data/
│   │   ├── bsc_initial_data.json # Datos completos y sincronizados del Excel
│   │   └── storage.js         # Capa de almacenamiento y persistencia
│   ├── models/                # [M] MODELOS: Lógica de negocio y cálculo
│   │   ├── KpiModel.js        # Cálculo de directos/inversos, semáforo (Verde, Ámbar, Rojo)
│   │   ├── ObjectiveModel.js  # 12 Objetivos y cálculo de cumplimientos promedio
│   │   ├── MeasurementModel.js# Registro de mediciones e historial mensual
│   │   ├── InitiativeModel.js # 12 Iniciativas estratégicas y seguimiento de avance
│   │   └── UserModel.js       # Usuarios, roles y credenciales
│   ├── controllers/           # [C] CONTROLADORES: Orquestación de peticiones
│   │   ├── dashboardController.js   # Datos ejecutivos y consolidados
│   │   ├── kpiController.js         # Gestión de los 36 KPIs
│   │   ├── objectiveController.js   # Gestión de objetivos
│   │   ├── measurementController.js # Registro de resultados (columna Real)
│   │   ├── initiativeController.js  # Portafolio de proyectos
│   │   └── authController.js        # Autenticación
│   ├── views/                 # [V] VISTAS: Renderizado SSR y Presenters JSON
│   │   ├── partials/
│   │   │   ├── header.ejs     # Navegación y estilos del sistema
│   │   │   └── footer.ejs     # Pie de página corporativo
│   │   ├── dashboard.ejs      # Vista HTML del Dashboard BSC
│   │   ├── kpis.ejs           # Vista HTML del Catálogo de 36 KPIs
│   │   ├── objetivos.ejs      # Vista HTML de los 12 Objetivos
│   │   ├── iniciativas.ejs    # Vista HTML de las 12 Iniciativas
│   │   └── presenters/
│   │       └── jsonView.js    # Formateador estándar para la API REST
│   └── routes/                # Enrutamiento desacoplado
│       ├── webRoutes.js       # Rutas web SSR para navegación
│       └── apiRoutes.js       # Rutas API REST para consumo de clientes
```

---

## ⚡ Instalación y Ejecución

1. Entrar a la carpeta `backend/`:
   ```bash
   cd backend
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor:
   ```bash
   npm start
   ```
   *(O en modo desarrollo con recarga automática: `npm run dev`)*

4. Acceder en el navegador:
   - **Vistas Web (SSR EJS):** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - **Catálogo de KPIs:** [http://localhost:3000/kpis](http://localhost:3000/kpis)
   - **Objetivos Estratégicos:** [http://localhost:3000/objetivos](http://localhost:3000/objetivos)
   - **Iniciativas:** [http://localhost:3000/iniciativas](http://localhost:3000/iniciativas)

---

## 📡 Endpoints de la API REST

### 1. Dashboard y Resumen Global
- `GET /api/dashboard`: Obtiene el índice global BSC, métricas de semáforo (Logrado, En Riesgo, Crítico) y desglose por perspectiva.

### 2. Indicadores (36 KPIs)
- `GET /api/kpis`: Lista los 36 KPIs (filtros opcionales por `perspective`, `status`, `owner`, `search`).
- `GET /api/kpis/:id`: Retorna la ficha técnica y fórmula del KPI.
- `POST /api/kpis`: Registra un nuevo KPI.
- `PUT /api/kpis/:id`: Actualiza metas o parámetros de un KPI.
- `DELETE /api/kpis/:id`: Elimina un KPI.

### 3. Objetivos Estratégicos (12 Objetivos)
- `GET /api/objectives`: Retorna los 12 objetivos con sus KPIs asociados y porcentaje promedio.
- `GET /api/objectives/:id`: Detalle de un objetivo estratégico.

### 4. Registro de Resultados (Mediciones)
- `GET /api/measurements`: Historial completo de mediciones cronológicas.
- `POST /api/measurements`: Registra una nueva medición. Actualiza automáticamente el valor `current` (columna Real) del KPI y recalcula su semáforo.

### 5. Iniciativas Estratégicas (12 Iniciativas)
- `GET /api/initiatives`: Lista las 12 iniciativas estratégicas y su avance porcentual.
- `PUT /api/initiatives/:id`: Actualiza el avance (%) o estado del proyecto.

### 6. Sistema
- `POST /api/system/reset-excel`: Restaura todos los datos al estado original del archivo `BSC_TechPeru_Ampliado_2025.xlsx`.
