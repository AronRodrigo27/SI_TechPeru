/**
 * Presenter de Vistas JSON para la API REST
 * Estandariza la respuesta de salida para el cliente HTTP
 */

class JsonView {
  static success(res, data, message = "Operación exitosa", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message = "Ocurrió un error", statusCode = 400, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }
}

module.exports = JsonView;
