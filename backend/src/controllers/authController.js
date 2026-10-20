/**
 * Controlador de Autenticación y Usuarios
 */

const UserModel = require("../models/UserModel");
const JsonView = require("../views/presenters/jsonView");

class AuthController {
  // API REST: POST /api/auth/login
  static apiLogin(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return JsonView.error(res, "Email y contraseña requeridos", 400);
      }

      const user = UserModel.authenticate(email, password);
      if (!user) {
        return JsonView.error(res, "Credenciales incorrectas", 401);
      }

      return JsonView.success(res, {
        user,
        token: `mock-token-${user.id}-${Date.now()}`
      }, "Inicio de sesión exitoso");
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }

  // API REST: GET /api/users
  static apiGetUsers(req, res) {
    try {
      const users = UserModel.findAll();
      return JsonView.success(res, users);
    } catch (err) {
      return JsonView.error(res, err.message, 500);
    }
  }
}

module.exports = AuthController;
