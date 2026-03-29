import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl_phone_field/intl_phone_field.dart';
import 'package:speed_drive_mobile/core/theme/app_theme.dart';

class RegisterScreen extends StatelessWidget {
  const RegisterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              Text(
                'auth.register.title'.tr(),
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 42,
                  fontWeight: FontWeight.w800,
                  height: 1.1,
                  color: AppTheme.noir,
                ),
              ),
              const SizedBox(height: 40),
              Center(
                child: Stack(
                  children: [
                    Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: AppTheme.ocean.withOpacity(0.5),
                          width: 2,
                          style: BorderStyle.solid,
                        ),
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.camera_alt_outlined,
                          size: 40,
                          color: AppTheme.ocean,
                        ),
                      ),
                    ),
                    Positioned(
                      right: 0,
                      bottom: 0,
                      child: CircleAvatar(
                        backgroundColor: AppTheme.ocean,
                        radius: 18,
                        child: const Icon(Icons.add, color: Colors.white, size: 20),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 50),
              _buildInputContainer(
                child: TextField(
                  decoration: _inputDecoration('auth.register.email'.tr()),
                ),
              ),
              const SizedBox(height: 20),
              _buildInputContainer(
                child: TextField(
                  obscureText: true,
                  decoration: _inputDecoration('auth.register.password'.tr()).copyWith(
                    suffixIcon: const Icon(Icons.visibility_off_outlined, color: Colors.grey),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              _buildInputContainer(
                child: IntlPhoneField(
                  decoration: _inputDecoration('auth.register.phone'.tr()).copyWith(
                    border: InputBorder.none,
                    counterText: '',
                  ),
                  initialCountryCode: 'VE',
                  onChanged: (phone) {
                    print(phone.completeNumber);
                  },
                ),
              ),
              const SizedBox(height: 60),
              ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.ocean,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 65),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
                child: Text(
                  'auth.register.done'.tr(),
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 10),
              Center(
                child: TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text(
                    'auth.register.cancel'.tr(),
                    style: const TextStyle(color: Colors.grey, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInputContainer({required Widget child}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      decoration: BoxDecoration(
        color: const Color(0xFFF7F7F7),
        borderRadius: BorderRadius.circular(25),
      ),
      child: child,
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(color: Colors.grey),
      border: InputBorder.none,
      contentPadding: const EdgeInsets.symmetric(vertical: 20),
    );
  }
}
