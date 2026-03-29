import 'package:flutter/material.dart';

class AppTheme {
  // Brand Colors (Palette: Midnight, Pearl Perfect, Noir, Ocean)
  static const Color midnight = Color(0xFF122C4F);
  static const Color pearlPerfect = Color(0xFFFBF9E4);
  static const Color noir = Color(0xFF000000);
  static const Color ocean = Color(0xFF5B88B2);
  static const Color emerald = Color(0xFF10B981);
  static const Color slate = Color(0xFF94A3B8);

  // Light Theme
  static final ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    colorSchemeSeed: midnight,
    scaffoldBackgroundColor: pearlPerfect,
    brightness: Brightness.light,
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      surfaceTintColor: Colors.transparent,
      centerTitle: true,
      elevation: 0,
      iconTheme: IconThemeData(color: midnight),
    ),
    cardTheme: CardThemeData(
      elevation: 8,
      shadowColor: Colors.black.withOpacity(0.05),
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: midnight,
        foregroundColor: Colors.white,
        elevation: 10,
        shadowColor: midnight.withOpacity(0.3),
        padding: const EdgeInsets.symmetric(vertical: 18),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
      ),
    ),
  );

  // Dark Theme
  static final ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    colorSchemeSeed: midnight,
    brightness: Brightness.dark,
    appBarTheme: const AppBarTheme(
      centerTitle: true,
      elevation: 0,
    ),
    cardTheme: CardThemeData(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
    ),
  );
}
