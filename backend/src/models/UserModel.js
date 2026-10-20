/**
 * Modelo de Usuarios y Control de Acceso
 */

const storage = require("../data/storage");

class UserModel {
  static findAll() {
    return storage.get("users") || [];
  }

  static findById(id) {
    const users = this.findAll();
    return users.find((u) => u.id === id) || null;
  }

  static findByEmail(email) {
    const users = this.findAll();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static authenticate(email, password) {
    // Contraseña por defecto para demostración: BSC2026!
    const user = this.findByEmail(email);
    if (!user) return null;

    if (password === "BSC2026!") {
      return user;
    }
    return null;
  }
}

module.exports = UserModel;
