import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:speed_drive_mobile/core/theme/app_theme.dart';
import 'package:speed_drive_mobile/features/onboarding/presentation/screens/onboarding_screen.dart';
import 'package:speed_drive_mobile/features/auth/presentation/providers/auth_provider.dart';
import 'package:speed_drive_mobile/features/home/presentation/screens/home_screen.dart';
import 'package:speed_drive_mobile/features/auth/presentation/screens/login_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await EasyLocalization.ensureInitialized();

  runApp(
    EasyLocalization(
      supportedLocales: const [Locale('en'), Locale('es')],
      path: 'assets/translations',
      fallbackLocale: const Locale('es'),
      useOnlyLangCode: true,
      child: const ProviderScope(
        child: SpeedDriveApp(),
      ),
    ),
  );
}

class SpeedDriveApp extends ConsumerWidget {
  const SpeedDriveApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    return MaterialApp(
      title: 'Speed Drive',
      debugShowCheckedModeBanner: false,
      localizationsDelegates: context.localizationDelegates,
      supportedLocales: context.supportedLocales,
      locale: context.locale,
      theme: AppTheme.lightTheme,
      home: _getHomeWidget(authState.status),
    );
  }

  Widget _getHomeWidget(AuthStatus status) {
    switch (status) {
      case AuthStatus.authenticated:
        return const MainScreen();
      case AuthStatus.loading:
        return const Scaffold(
          body: Center(
            child: CircularProgressIndicator(color: AppTheme.ocean),
          ),
        );
      case AuthStatus.onboarding:
        return const OnboardingScreen();
      case AuthStatus.unauthenticated:
      case AuthStatus.error:
      default:
        return const LoginScreen();
    }
  }
}
