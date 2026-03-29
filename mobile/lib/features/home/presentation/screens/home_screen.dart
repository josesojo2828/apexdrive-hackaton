import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:ui';
import 'package:speed_drive_mobile/core/theme/app_theme.dart';
import 'package:speed_drive_mobile/core/services/tracking_service.dart';
import 'package:speed_drive_mobile/features/auth/presentation/providers/auth_provider.dart';
import 'package:speed_drive_mobile/core/widgets/glass_container.dart';
import 'package:speed_drive_mobile/core/widgets/typography.dart';
import 'package:speed_drive_mobile/features/fleet/presentation/providers/fleet_provider.dart';
import 'package:speed_drive_mobile/features/fleet/presentation/screens/vehicle_detail_screen.dart';
import 'package:speed_drive_mobile/features/fleet/presentation/screens/trip_detail_screen.dart';
import 'package:speed_drive_mobile/features/fleet/presentation/widgets/vehicle_upsert_modal.dart';

class MainScreen extends ConsumerStatefulWidget {
  const MainScreen({super.key});

  @override
  ConsumerState<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends ConsumerState<MainScreen> {
  int _currentIndex = 0;
  final PageController _pageController = PageController();

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final tracking = ref.watch(trackingServiceProvider);

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: AppTheme.midnight,
        statusBarIconBrightness: Brightness.light,
        statusBarBrightness: Brightness.dark,
      ),
      child: Scaffold(
        extendBody: true,
        backgroundColor: AppTheme.pearlPerfect,
        body: Stack(
          children: [
            PageView(
              controller: _pageController,
              onPageChanged: (index) => setState(() => _currentIndex = index),
              children: [
                _DashboardContent(user: user),
                const _GarageContent(),
                const _TripsContent(),
                const _ProfilePage(),
              ],
            ),
          ],
        ),
        bottomNavigationBar: _GlassBottomBar(
          currentIndex: _currentIndex,
          onTap: (index) {
            _pageController.animateToPage(
              index,
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeInOut,
            );
          },
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
        floatingActionButton: _StatusToggleButton(tracking: tracking),
      ),
    );
  }
}

class _StatusToggleButton extends StatelessWidget {
  final TrackingService tracking;

  const _StatusToggleButton({required this.tracking});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<bool>(
      valueListenable: tracking.onlineStatusNotifier,
      builder: (context, isOnline, _) {
        return GestureDetector(
          onTap: () => _showStatusModal(context, tracking),
          child: Container(
            width: 70,
            height: 70,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isOnline ? AppTheme.emerald : AppTheme.slate,
              boxShadow: [
                BoxShadow(
                  color: (isOnline ? AppTheme.emerald : AppTheme.slate).withOpacity(0.4),
                  blurRadius: 20,
                  spreadRadius: 2,
                  offset: const Offset(0, 10),
                ),
              ],
              border: Border.all(color: Colors.white, width: 4),
            ),
            child: Icon(
              isOnline ? Icons.sensors : Icons.sensors_off,
              color: Colors.white,
              size: 32,
            ),
          ),
        );
      },
    );
  }

  void _showStatusModal(BuildContext context, TrackingService tracking) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => GlassContainer(
        borderRadius: 40,
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 24),
            const Text('Estado del Conductor', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('Cambia tu disponibilidad en tiempo real', style: TextStyle(color: Colors.white70, fontSize: 14)),
            const SizedBox(height: 40),
            _StatusOption(
              title: 'Disponible',
              subtitle: 'Transmite ubicación y recibe pedidos',
              icon: Icons.check_circle,
              color: AppTheme.emerald,
              isActive: tracking.onlineStatusNotifier.value,
              onTap: () async {
                final success = await tracking.startTracking();
                if (success) {
                  if (context.mounted) Navigator.pop(context);
                } else {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Error: Activá el GPS para ponerte en línea'),
                        backgroundColor: Colors.redAccent,
                      ),
                    );
                  }
                }
              },
            ),
            const SizedBox(height: 16),
            _StatusOption(
              title: 'Fuera de Línea',
              subtitle: 'No visible para los despachadores',
              icon: Icons.power_settings_new,
              color: AppTheme.slate,
              isActive: !tracking.onlineStatusNotifier.value,
              onTap: () {
                tracking.stopTracking();
                Navigator.pop(context);
              },
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

class _StatusOption extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final bool isActive;
  final VoidCallback onTap;

  const _StatusOption({required this.title, required this.subtitle, required this.icon, required this.color, required this.isActive, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: GlassContainer(
        opacity: isActive ? 0.2 : 0.05,
        color: isActive ? color : Colors.white,
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Icon(icon, color: color, size: 30),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  Text(subtitle, style: const TextStyle(color: Colors.white60, fontSize: 12)),
                ],
              ),
            ),
            if (isActive) const Icon(Icons.radio_button_checked, color: Colors.white),
          ],
        ),
      ),
    );
  }
}

class _GlassBottomBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const _GlassBottomBar({required this.currentIndex, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24, left: 16, right: 16),
      child: GlassContainer(
        height: 70,
        opacity: 0.1,
        blur: 20,
        borderRadius: 30,
        padding: const EdgeInsets.symmetric(horizontal: 10),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _NavItem(icon: Icons.grid_view_rounded, label: 'Panel', isSelected: currentIndex == 0, onTap: () => onTap(0)),
            _NavItem(icon: Icons.directions_car_rounded, label: 'Garaje', isSelected: currentIndex == 1, onTap: () => onTap(1)),
            const SizedBox(width: 60), // Space for status button
            _NavItem(icon: Icons.local_shipping_rounded, label: 'Carreras', isSelected: currentIndex == 2, onTap: () => onTap(2)),
            _NavItem(icon: Icons.person_rounded, label: 'Perfil', isSelected: currentIndex == 3, onTap: () => onTap(3)),
          ],
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _NavItem({required this.icon, required this.label, required this.isSelected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: isSelected ? AppTheme.ocean : Colors.grey[600], size: 26),
          const SizedBox(height: 4),
          Text(label, style: TextStyle(color: isSelected ? AppTheme.ocean : Colors.grey[600], fontSize: 10, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
        ],
      ),
    );
  }
}

class _DashboardContent extends ConsumerWidget {
  final dynamic user;
  const _DashboardContent({this.user});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final fleetState = ref.watch(fleetProvider);
    
    return SafeArea(
      child: RefreshIndicator(
        onRefresh: () => ref.read(fleetProvider.notifier).refreshData(),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const AppTypography(variant: AppTypographyVariant.H2, text: '¡Hola! 👋'),
                      Text('${user?.firstName ?? "Conductor"}', style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: AppTheme.midnight)),
                    ],
                  ),
                  _MapQuickButton(),
                ],
              ),
              const SizedBox(height: 30),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const AppTypography(variant: AppTypographyVariant.H3, text: 'Monitor de Operaciones', color: AppTheme.ocean),
                  if (fleetState.isLoading) const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)),
                ],
              ),
              const SizedBox(height: 20),
              
              // Stats Grid
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 1.1,
                children: [
                   _StatCard(
                    title: 'MIS CARRERAS', 
                    value: fleetState.trips.length.toString(), 
                    subtitle: 'TOTAL', 
                    icon: Icons.local_shipping_outlined, 
                    color: AppTheme.ocean
                  ),
                  _StatCard(
                    title: 'INGRESOS',
                    value: '\$${fleetState.trips.fold(0.0, (sum, trip) => sum + trip.fare).toStringAsFixed(1)}',
                    subtitle: 'BRUTOS',
                    icon: Icons.attach_money_outlined,
                    color: AppTheme.emerald,
                  ),
                  const _StatCard(
                    title: 'PENDIENTES', 
                    value: '0', 
                    subtitle: 'ALERTA', 
                    icon: Icons.warning_amber_rounded, 
                    color: Colors.orange
                  ),
                  _StatCard(
                    title: 'DISPONIBLES', 
                    value: fleetState.vehicles.length.toString(), 
                    subtitle: 'GARAJE', 
                    icon: Icons.directions_car_outlined, 
                    color: AppTheme.midnight.withOpacity(0.5)
                  ),
                ],
              ),
              
              const SizedBox(height: 30),
              const AppTypography(variant: AppTypographyVariant.H3, text: 'Última Actividad', color: AppTheme.ocean),
              const SizedBox(height: 16),
              if (fleetState.trips.isNotEmpty)
                _ActivityTripCard(trip: fleetState.trips.first)
              else
                _EmptyActivityCard(),
              const SizedBox(height: 120), // Padding for bottom bar
            ],
          ),
        ),
      ),
    );
  }
}

class _MapQuickButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Mapa en tiempo real (Próximamente)')));
      },
      child: GlassContainer(
        padding: const EdgeInsets.all(12),
        opacity: 0.1,
        borderRadius: 16,
        child: const Row(
          children: [
            Icon(Icons.map_outlined, color: AppTheme.ocean, size: 28),
            SizedBox(width: 8),
            Text('MAPA', style: TextStyle(fontWeight: FontWeight.w900, color: AppTheme.ocean, fontSize: 12)),
          ],
        ),
      ),
    );
  }
}

class _GarageContent extends ConsumerWidget {
  const _GarageContent();

  void _showAddVehicle(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const VehicleUpsertModal(),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final fleetState = ref.watch(fleetProvider);

    return RefreshIndicator(
      onRefresh: () => ref.read(fleetProvider.notifier).refreshData(),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const AppTypography(variant: AppTypographyVariant.H2, text: 'Mi Garaje'),
                  IconButton(
                    onPressed: () => _showAddVehicle(context),
                    icon: const Icon(Icons.add_circle_outline, color: AppTheme.ocean, size: 30),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Expanded(
                child: fleetState.vehicles.isEmpty
                    ? SingleChildScrollView(
                        physics: const AlwaysScrollableScrollPhysics(),
                        child: SizedBox(
                          height: MediaQuery.of(context).size.height * 0.6,
                          child: const _EmptyFleetPlaceholder(icon: Icons.directions_car_rounded, title: 'No tienes vehículos registrados'),
                        ),
                      )
                    : ListView.separated(
                        physics: const AlwaysScrollableScrollPhysics(),
                        padding: const EdgeInsets.only(bottom: 100),
                        itemCount: fleetState.vehicles.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 16),
                        itemBuilder: (context, index) {
                          final vehicle = fleetState.vehicles[index];
                          return _VehicleCard(vehicle: vehicle);
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _TripsContent extends ConsumerWidget {
  const _TripsContent();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final fleetState = ref.watch(fleetProvider);

    return RefreshIndicator(
      onRefresh: () => ref.read(fleetProvider.notifier).refreshData(),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const AppTypography(variant: AppTypographyVariant.H2, text: 'Carreras Realizadas'),
              const SizedBox(height: 20),
              Expanded(
                child: fleetState.trips.isEmpty
                    ? SingleChildScrollView(
                        physics: const AlwaysScrollableScrollPhysics(),
                        child: SizedBox(
                          height: MediaQuery.of(context).size.height * 0.6,
                          child: const _EmptyFleetPlaceholder(icon: Icons.local_shipping_outlined, title: 'Aún no has realizado carreras'),
                        ),
                      )
                    : ListView.separated(
                        physics: const AlwaysScrollableScrollPhysics(),
                        padding: const EdgeInsets.only(bottom: 100),
                        itemCount: fleetState.trips.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 16),
                        itemBuilder: (context, index) {
                          final trip = fleetState.trips[index];
                          return _TripCard(trip: trip);
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _VehicleCard extends StatelessWidget {
  final dynamic vehicle;
  const _VehicleCard({required this.vehicle});

  @override
  Widget build(BuildContext context) {
    return Hero(
      tag: 'vehicle_${vehicle.id}',
      child: GestureDetector(
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => VehicleDetailScreen(vehicle: vehicle))),
        child: GlassContainer(
          opacity: 0.1,
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: AppTheme.ocean.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                child: const Icon(Icons.directions_car_rounded, color: AppTheme.ocean),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(vehicle.plate, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppTheme.midnight)),
                    Text('${vehicle.brand} ${vehicle.model}', style: const TextStyle(color: Colors.grey, fontSize: 13)),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: Colors.grey),
            ],
          ),
        ),
      ),
    );
  }
}

class _TripCard extends StatelessWidget {
  final dynamic trip;
  const _TripCard({required this.trip});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => TripDetailScreen(trip: trip))),
      child: GlassContainer(
        opacity: 0.1,
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Carrera Completada', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.emerald)),
                Text('\$${trip.fare}', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: AppTheme.midnight)),
              ],
            ),
            const Divider(height: 24, color: Colors.white24),
            Row(
              children: [
                const Icon(Icons.location_on, size: 16, color: Colors.grey),
                const SizedBox(width: 8),
                Expanded(child: Text(trip.originAddress.isEmpty ? 'Ubicación Desconocida' : trip.originAddress, style: const TextStyle(fontSize: 12, color: AppTheme.midnight))),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.location_on, size: 16, color: AppTheme.ocean),
                const SizedBox(width: 8),
                Expanded(child: Text(trip.destAddress.isEmpty ? 'Destino Desconocido' : trip.destAddress, style: const TextStyle(fontSize: 12, color: AppTheme.midnight))),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _EmptyFleetPlaceholder extends ConsumerWidget {
  final IconData icon;
  final String title;
  const _EmptyFleetPlaceholder({required this.icon, required this.title});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 80, color: AppTheme.ocean.withOpacity(0.2)),
          const SizedBox(height: 16),
          Text(title, style: const TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          TextButton.icon(
            onPressed: () => ref.read(fleetProvider.notifier).refreshData(),
            icon: const Icon(Icons.refresh_rounded),
            label: const Text('ACTUALIZAR'),
            style: TextButton.styleFrom(foregroundColor: AppTheme.ocean),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final String subtitle;
  final IconData icon;
  final Color color;

  const _StatCard({required this.title, required this.value, required this.subtitle, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return GlassContainer(
      opacity: 0.1,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(icon, color: color, size: 20),
              Text(subtitle, style: TextStyle(color: Colors.grey[600], fontSize: 8, fontWeight: FontWeight.bold)),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppTheme.midnight)),
              Text(title, style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.grey[500])),
            ],
          ),
        ],
      ),
    );
  }
}

class _ActivityTripCard extends StatelessWidget {
  final dynamic trip;
  const _ActivityTripCard({required this.trip});

  @override
  Widget build(BuildContext context) {
    return GlassContainer(
      opacity: 0.1,
      color: Colors.white,
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
           Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Última Carrera', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.midnight)),
              Text('\$${trip.fare}', style: const TextStyle(color: AppTheme.ocean, fontWeight: FontWeight.w900, fontSize: 20)),
            ],
          ),
          const Divider(height: 30, color: Colors.grey),
          Row(
            children: [
              Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: AppTheme.ocean.withOpacity(0.1), shape: BoxShape.circle), child: const Icon(Icons.check_circle_outline, color: AppTheme.ocean)),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(trip.destAddress.isEmpty ? 'Destino No Especificado' : trip.destAddress, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.midnight), overflow: TextOverflow.ellipsis),
                    const Text('Completada con éxito', style: TextStyle(fontSize: 11, color: Colors.grey)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _EmptyActivityCard extends StatelessWidget {
  const _EmptyActivityCard();

  @override
  Widget build(BuildContext context) {
    return GlassContainer(
      opacity: 0.05,
      padding: const EdgeInsets.all(30),
      child: const Center(child: Text('Sin actividad reciente', style: TextStyle(color: Colors.grey))),
    );
  }
}

class _ProfilePage extends ConsumerWidget {
  const _ProfilePage();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).user;
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            const AppTypography(variant: AppTypographyVariant.H2, text: 'Mi Perfil'),
            const SizedBox(height: 40),
            Center(
              child: Stack(
                children: [
                   Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: AppTheme.ocean, width: 3),
                      image: const DecorationImage(image: NetworkImage('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'), fit: BoxFit.cover),
                    ),
                  ),
                  Positioned(bottom: 0, right: 0, child: Container(padding: const EdgeInsets.all(8), decoration: const BoxDecoration(color: AppTheme.midnight, shape: BoxShape.circle), child: const Icon(Icons.edit, color: Colors.white, size: 16))),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Text('${user?.firstName} ${user?.lastName}', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.midnight)),
            const Text('Conductor Certificado', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
            const SizedBox(height: 40),
            const _ProfileItem(icon: Icons.person_outline, title: 'Datos Personales'),
            const _ProfileItem(icon: Icons.notifications_none, title: 'Notificaciones'),
            const _ProfileItem(icon: Icons.security, title: 'Seguridad'),
            const SizedBox(height: 40),
            ElevatedButton(
              onPressed: () => ref.read(authProvider.notifier).logout(),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red[50], 
                foregroundColor: Colors.red, 
                elevation: 0, 
                minimumSize: const Size(double.infinity, 60),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              ),
              child: const Text('CERRAR SESIÓN', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1.2)),
            ),
            const SizedBox(height: 120), // Height for Bottom Bar
          ],
        ),
      ),
    );
  }
}

class _ProfileItem extends StatelessWidget {
  final IconData icon;
  final String title;

  const _ProfileItem({required this.icon, required this.title});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.grey[100]!)),
      child: Row(
        children: [
          Icon(icon, color: AppTheme.ocean),
          const SizedBox(width: 16),
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
          const Spacer(),
          const Icon(Icons.chevron_right, color: Colors.grey),
        ],
      ),
    );
  }
}
