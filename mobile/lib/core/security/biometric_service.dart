import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final biometricsProvider = Provider<BiometricService>((ref) => BiometricService());

class BiometricService {
  final LocalAuthentication auth = LocalAuthentication();

  Future<bool> isDeviceSupported() async {
    return await auth.isDeviceSupported();
  }

  Future<bool> canCheckBiometrics() async {
    try {
      return await auth.canCheckBiometrics;
    } on PlatformException {
      return false;
    }
  }

  Future<bool> authenticate() async {
    final bool canAuthenticateWithBiometrics = await canCheckBiometrics();
    final bool canAuthenticate = canAuthenticateWithBiometrics || await isDeviceSupported();

    if (!canAuthenticate) return false;

    try {
      // The most basic call possible.
      return await auth.authenticate(
        localizedReason: 'Accede a tu cuenta de Speed Drive con biometría',
      );
    } on PlatformException catch (e) {
      print('Biometric error: $e');
      return false;
    } catch (e) {
      print('Biometric general error: $e');
      return false;
    }
  }
}
