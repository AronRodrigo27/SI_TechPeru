/**
 * Servidor Principal HTTP — BSC TechPeru SAC
 */

require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Servidor BSC TechPeru SAC (Backend MVC) iniciado`);
  console.log(`📍 Puerto: http://localhost:${PORT}`);
  console.log(`📑 Vistas Web (EJS): http://localhost:${PORT}/dashboard`);
  console.log(`⚡ API REST: http://localhost:${PORT}/api/dashboard`);
  console.log(`======================================================\n`);
});
