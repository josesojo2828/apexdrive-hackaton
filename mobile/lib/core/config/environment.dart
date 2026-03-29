class Environment {
  // Configuración de la API
  // Cambia esta URL por la de tu servidor local o de producción
  static const String apiUrl = 'https://speed-drive.quanticarch.com/api';
  static const String socketUrl = 'https://speed-drive.quanticarch.com';
  
  // Timeouts de red (ms)
  static const int connectTimeout = 10000;
  static const int receiveTimeout = 10000;
  
  // Otras constantes globales
  static const String appName = 'Speed Drive';
  static const String appVersion = '1.0.0';
}
