import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

enum AppTypographyVariant { H1, H2, H3, Body, Small }

class AppTypography extends StatelessWidget {
  final String text;
  final AppTypographyVariant variant;
  final Color? color;
  final TextAlign? textAlign;
  final FontWeight? fontWeight;

  const AppTypography({
    super.key,
    required this.text,
    this.variant = AppTypographyVariant.Body,
    this.color,
    this.textAlign,
    this.fontWeight,
  });

  @override
  Widget build(BuildContext context) {
    double fontSize;
    FontWeight defaultWeight = fontWeight ?? FontWeight.normal;

    switch (variant) {
      case AppTypographyVariant.H1:
        fontSize = 32;
        defaultWeight = fontWeight ?? FontWeight.w900;
        break;
      case AppTypographyVariant.H2:
        fontSize = 24;
        defaultWeight = fontWeight ?? FontWeight.w800;
        break;
      case AppTypographyVariant.H3:
        fontSize = 18;
        defaultWeight = fontWeight ?? FontWeight.w700;
        break;
      case AppTypographyVariant.Small:
        fontSize = 12;
        break;
      case AppTypographyVariant.Body:
      default:
        fontSize = 16;
        break;
    }

    return Text(
      text,
      textAlign: textAlign,
      style: GoogleFonts.plusJakartaSans(
        fontSize: fontSize,
        fontWeight: defaultWeight,
        color: color ?? Colors.black,
      ),
    );
  }
}
