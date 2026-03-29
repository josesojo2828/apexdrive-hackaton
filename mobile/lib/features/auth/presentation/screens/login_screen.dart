import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:speed_drive_mobile/core/theme/app_theme.dart';
import 'package:speed_drive_mobile/features/auth/presentation/providers/auth_provider.dart';
import 'package:speed_drive_mobile/features/auth/presentation/screens/register_screen.dart';
import 'package:speed_drive_mobile/features/home/presentation/screens/home_screen.dart';
import 'package:speed_drive_mobile/core/security/biometric_service.dart';

class LoginScreen extends HookConsumerWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final emailController = useTextEditingController();
    final passwordController = useTextEditingController();
    final isLoading = ref.watch(authProvider).status == AuthStatus.loading;

    // Listen to changes in the auth status to redirect
    ref.listen<AuthState>(authProvider, (previous, next) {
      if (next.status == AuthStatus.authenticated) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const MainScreen()),
        );
      }
      if (next.status == AuthStatus.error) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(next.errorMessage ?? 'Error')),
        );
      }
    });

    return Scaffold(
      backgroundColor: AppTheme.pearlPerfect,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 50),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'auth.login.welcome'.tr(),
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 48,
                  fontWeight: FontWeight.w900,
                  height: 1.1,
                  color: AppTheme.midnight,
                ),
              ),
              const SizedBox(height: 60),
              _buildTextField(
                controller: emailController,
                label: 'auth.login.email'.tr(),
                hint: 'your@email.com',
                icon: Icons.email_outlined,
              ),
              const SizedBox(height: 20),
              _buildTextField(
                controller: passwordController,
                label: 'auth.login.password'.tr(),
                hint: '••••••••',
                icon: Icons.lock_outline,
                isPassword: true,
              ),
              const SizedBox(height: 40),
              if (isLoading)
                const Center(child: CircularProgressIndicator(color: AppTheme.ocean))
              else
                ElevatedButton(
                  onPressed: () {
                    ref.read(authProvider.notifier).login(
                          emailController.text,
                          passwordController.text,
                        );
                  },
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 65),
                  ),
                  child: Text('auth.login.button'.tr()),
                ),
              const SizedBox(height: 20),
              Center(
                child: IconButton(
                  icon: const Icon(Icons.fingerprint, size: 40, color: AppTheme.ocean),
                  onPressed: () async {
                    final authService = ref.read(biometricsProvider);
                    final authenticated = await authService.authenticate();
                    if (authenticated) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Autenticación biométrica exitosa')),
                      );
                    }
                  },
                ),
              ),
              const SizedBox(height: 20),
              Center(
                child: TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const RegisterScreen()),
                    );
                  },
                  child: Text(
                    "auth.login.no_account".tr(),
                    style: GoogleFonts.plusJakartaSans(
                      color: AppTheme.ocean,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    bool isPassword = false,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.bold,
            color: AppTheme.midnight.withOpacity(0.7),
          ),
        ),
        const SizedBox(height: 10),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 5),
              ),
            ],
          ),
          child: TextField(
            controller: controller,
            obscureText: isPassword,
            decoration: InputDecoration(
              hintText: hint,
              prefixIcon: Icon(icon, color: AppTheme.ocean),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(vertical: 20),
            ),
          ),
        ),
      ],
    );
  }
}
