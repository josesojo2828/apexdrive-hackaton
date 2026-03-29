import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:speed_drive_mobile/core/storage/session_manager.dart';
import 'package:speed_drive_mobile/core/storage/local_database.dart';
import 'package:speed_drive_mobile/features/auth/domain/repositories/auth_repository.dart';
import 'package:speed_drive_mobile/features/auth/data/models/user_model.dart';
import 'package:speed_drive_mobile/core/security/biometric_service.dart';

enum AuthStatus { authenticated, unauthenticated, onboarding, loading, error }

class AuthState {
  final AuthStatus status;
  final User? user;
  final String? errorMessage;

  AuthState({required this.status, this.user, this.errorMessage});

  factory AuthState.authenticated(User user) => AuthState(status: AuthStatus.authenticated, user: user);
  factory AuthState.unauthenticated() => AuthState(status: AuthStatus.unauthenticated);
  factory AuthState.loading() => AuthState(status: AuthStatus.loading);
  factory AuthState.error(String msg) => AuthState(status: AuthStatus.error, errorMessage: msg);
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(
    ref.watch(authRepositoryProvider),
    ref.watch(sessionProvider),
    ref.watch(dbServiceProvider),
    ref.watch(biometricsProvider),
  );
});

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repository;
  final SessionManager _session;
  final LocalDatabase _localDb;
  final BiometricService _biometrics;

  AuthNotifier(this._repository, this._session, this._localDb, this._biometrics) : super(AuthState.loading()) {
    _checkInitialSession();
  }

  Future<void> _checkInitialSession() async {
    final token = await _session.getToken();
    final user = await _localDb.getUser();
    
    if (!mounted) return;

    if (token != null && user != null) {
      state = AuthState.authenticated(user);
    } else {
      final onboardingDone = await _session.isOnboardingComplete();
      state = onboardingDone ? AuthState.unauthenticated() : AuthState(status: AuthStatus.onboarding);
    }
  }

  Future<bool> login(String email, String password) async {
    state = AuthState.loading();
    try {
      final result = await _repository.login(email, password);

      if (!mounted) return false;

      if (result.error != null) {
        state = AuthState.error(result.error!);
        return false;
      }

      if (result.token != null && result.user != null) {
        // Save the session
        await _session.saveToken(result.token!);
        await _session.saveCredentials(email, password); // Secure storage for password
        await _localDb.saveUser(result.user!); // SQLite for profile/speed
        
        if (!mounted) return true;
        state = AuthState.authenticated(result.user!);
        return true;
      }

      state = AuthState.unauthenticated();
      return false;
    } catch (e) {
      if (!mounted) return false;
      state = AuthState.error('Error de conexión');
      return false;
    }
  }

  Future<bool> loginWithBiometrics() async {
    final enabled = await _session.isBiometricsEnabled();
    if (!enabled) return false;

    final authenticated = await _biometrics.authenticate();
    if (!authenticated) return false;

    final creds = await _session.getCredentials();
    final email = creds['email'];
    final password = creds['password'];

    if (email != null && password != null) {
      return await login(email, password);
    }
    return false;
  }

  Future<void> setBiometricsEnabled(bool enabled) async {
    await _session.setBiometrics(enabled);
  }

  Future<void> completeOnboarding() async {
    await _session.setOnboardingComplete();
    state = AuthState.unauthenticated();
  }

  Future<void> logout() async {
    await _session.deleteSession();
    await _localDb.deleteUser();
    state = AuthState.unauthenticated();
  }
}
