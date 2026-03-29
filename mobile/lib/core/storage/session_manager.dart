import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final sessionProvider = Provider<SessionManager>((ref) => SessionManager());

class SessionManager {
  final _storage = const FlutterSecureStorage();
  
  static const _tokenKey = 'jwt_token';
  static const _emailKey = 'user_email';
  static const _passwordKey = 'user_password';
  static const _biometricsKey = 'biometrics_enabled';
  static const _onboardingCompleteKey = 'onboarding_complete';

  Future<void> setOnboardingComplete() async {
    await _storage.write(key: _onboardingCompleteKey, value: 'true');
  }

  Future<bool> isOnboardingComplete() async {
    final val = await _storage.read(key: _onboardingCompleteKey);
    return val == 'true';
  }

  Future<void> saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  Future<void> saveCredentials(String email, String password) async {
    await _storage.write(key: _emailKey, value: email);
    await _storage.write(key: _passwordKey, value: password);
  }

  Future<Map<String, String?>> getCredentials() async {
    final email = await _storage.read(key: _emailKey);
    final password = await _storage.read(key: _passwordKey);
    return {'email': email, 'password': password};
  }

  Future<void> setBiometrics(bool enabled) async {
    await _storage.write(key: _biometricsKey, value: enabled.toString());
  }

  Future<bool> isBiometricsEnabled() async {
    final enabled = await _storage.read(key: _biometricsKey);
    return enabled == 'true';
  }

  Future<void> deleteSession() async {
    await _storage.delete(key: _tokenKey);
  }

  Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
