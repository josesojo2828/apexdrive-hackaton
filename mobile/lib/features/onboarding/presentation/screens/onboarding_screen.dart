import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:animate_do/animate_do.dart';
import 'package:speed_drive_mobile/core/theme/app_theme.dart';
import 'package:speed_drive_mobile/features/auth/presentation/screens/login_screen.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:speed_drive_mobile/features/auth/presentation/providers/auth_provider.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final PageController _controller = PageController();
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final pages = [
      OnboardingPage(
        title: 'onboarding.step1.title'.tr(),
        description: 'onboarding.step1.desc'.tr(),
        svgPath: 'assets/images/transport.svg',
      ),
      OnboardingPage(
        title: 'onboarding.step2.title'.tr(),
        description: 'onboarding.step2.desc'.tr(),
        svgPath: 'assets/images/navigation.svg',
      ),
      OnboardingPage(
        title: 'onboarding.step3.title'.tr(),
        description: 'onboarding.step3.desc'.tr(),
        svgPath: 'assets/images/delivery.svg',
      ),
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          if (_currentIndex != pages.length - 1)
            TextButton(
              onPressed: () => _controller.jumpToPage(pages.length - 1),
              child: Text(
                'onboarding.skip'.tr(),
                style: GoogleFonts.plusJakartaSans(
                  color: AppTheme.midnight,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: PageView.builder(
              controller: _controller,
              onPageChanged: (index) => setState(() => _currentIndex = index),
              itemCount: pages.length,
              itemBuilder: (context, index) {
                final page = pages[index];
                return Padding(
                  padding: const EdgeInsets.all(40.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      FadeInDown(
                        child: SvgPicture.asset(
                          page.svgPath,
                          height: 300,
                        ),
                      ),
                      const SizedBox(height: 50),
                      FadeInUp(
                        delay: const Duration(milliseconds: 200),
                        child: Text(
                          page.title,
                          textAlign: TextAlign.center,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -1,
                            color: Colors.black,
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      FadeInUp(
                        delay: const Duration(milliseconds: 400),
                        child: Text(
                          page.description,
                          textAlign: TextAlign.center,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 18,
                            color: Colors.grey.shade600,
                            height: 1.5,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(bottom: 60),
            child: Column(
              children: [
                SmoothPageIndicator(
                  controller: _controller,
                  count: pages.length,
                  onDotClicked: (index) => _controller.animateToPage(
                    index,
                    duration: const Duration(milliseconds: 500),
                    curve: Curves.easeInOut,
                  ),
                  effect: const ExpandingDotsEffect(
                    activeDotColor: AppTheme.ocean,
                    dotColor: Color(0xFFD9D9D9),
                    dotHeight: 12,
                    dotWidth: 12,
                    expansionFactor: 3,
                  ),
                ),
                const SizedBox(height: 40),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 40),
                  child: ElevatedButton(
                    onPressed: () {
                      if (_currentIndex < pages.length - 1) {
                        _controller.nextPage(
                          duration: const Duration(milliseconds: 500),
                          curve: Curves.easeInOut,
                        );
                      } else {
                        ref.read(authProvider.notifier).completeOnboarding();
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.midnight,
                      foregroundColor: Colors.white,
                      minimumSize: const Size(double.infinity, 60),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 0,
                    ),
                    child: Text(
                      _currentIndex == pages.length - 1 ? 'onboarding.start'.tr() : 'onboarding.next'.tr(),
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class OnboardingPage {
  final String title;
  final String description;
  final String svgPath;

  OnboardingPage({
    required this.title,
    required this.description,
    required this.svgPath,
  });
}
