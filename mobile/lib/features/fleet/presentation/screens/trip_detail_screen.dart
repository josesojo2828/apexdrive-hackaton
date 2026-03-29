import 'package:flutter/material.dart';
import 'package:speed_drive_mobile/core/theme/app_theme.dart';
import 'package:speed_drive_mobile/core/widgets/glass_container.dart';
import 'package:speed_drive_mobile/core/widgets/typography.dart';
import 'package:speed_drive_mobile/features/fleet/data/models/trip_model.dart';

class TripDetailScreen extends StatelessWidget {
  final Trip trip;
  const TripDetailScreen({super.key, required this.trip});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.pearlPerfect,
      appBar: AppBar(
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.transparent,
        title: const Text('Resumen de Carrera', style: TextStyle(color: AppTheme.midnight, fontWeight: FontWeight.w900, fontSize: 18)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppTheme.midnight),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
        child: Column(
          children: [
            _TripStatusHeader(status: trip.status, fare: trip.fare),
            const SizedBox(height: 24),
            _LocationTimeline(origin: trip.originAddress, destination: trip.destAddress),
            const SizedBox(height: 24),
            _CustomerInfo(name: trip.customerName ?? 'Cliente Speed'),
            const SizedBox(height: 40),
            _ActionButton(
              label: 'REPORTE DE INCIDENCIA', 
              color: Colors.orange[50]!, 
              textColor: Colors.orange[900]!,
              onTap: () {}
            ),
            const SizedBox(height: 12),
            _ActionButton(
              label: 'VOLVER', 
              color: AppTheme.midnight, 
              textColor: Colors.white,
              onTap: () => Navigator.pop(context)
            ),
          ],
        ),
      ),
    );
  }
}

class _TripStatusHeader extends StatelessWidget {
  final String status;
  final double fare;

  const _TripStatusHeader({required this.status, required this.fare});

  @override
  Widget build(BuildContext context) {
    return GlassContainer(
      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
      opacity: 0.1,
      color: Colors.white,
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            textBaseline: TextBaseline.alphabetic,
            crossAxisAlignment: CrossAxisAlignment.baseline,
            children: [
              const Text('\$', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.ocean)),
              Text(fare.toStringAsFixed(1), style: const TextStyle(fontSize: 64, fontWeight: FontWeight.w900, color: AppTheme.midnight, letterSpacing: -2)),
            ],
          ),
          const Text('TARIFA TOTAL FINAL', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.w900, fontSize: 10, letterSpacing: 2)),
          const SizedBox(height: 30),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            decoration: BoxDecoration(
              color: (status == 'COMPLETED' ? AppTheme.emerald : AppTheme.ocean).withOpacity(0.1), 
              borderRadius: BorderRadius.circular(30),
              border: Border.all(color: (status == 'COMPLETED' ? AppTheme.emerald : AppTheme.ocean).withOpacity(0.2))
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(status == 'COMPLETED' ? Icons.check_circle : Icons.info_outline, size: 16, color: (status == 'COMPLETED' ? AppTheme.emerald : AppTheme.ocean)),
                const SizedBox(width: 8),
                Text(status, style: TextStyle(color: (status == 'COMPLETED' ? AppTheme.emerald : AppTheme.ocean), fontWeight: FontWeight.w900, fontSize: 12, letterSpacing: 1.5)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _LocationTimeline extends StatelessWidget {
  final String origin;
  final String destination;

  const _LocationTimeline({required this.origin, required this.destination});

  @override
  Widget build(BuildContext context) {
    return GlassContainer(
      padding: const EdgeInsets.all(28),
      opacity: 0.1,
      color: Colors.white,
      child: Column(
        children: [
          _LocationRow(
            icon: Icons.my_location, 
            color: AppTheme.emerald, 
            label: 'ORIGEN', 
            address: origin.isEmpty ? 'Ubicación de partida no disponible' : origin
          ),
          Padding(
            padding: const EdgeInsets.only(left: 11),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Container(width: 2, height: 30, color: Colors.grey.withOpacity(0.2)),
            ),
          ),
          _LocationRow(
            icon: Icons.location_on, 
            color: Colors.redAccent, 
            label: 'DESTINO', 
            address: destination.isEmpty ? 'Destino no especificado' : destination
          ),
        ],
      ),
    );
  }
}

class _LocationRow extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String label;
  final String address;

  const _LocationRow({required this.icon, required this.color, required this.label, required this.address});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: color, size: 24),
        const SizedBox(width: 20),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1)),
              const SizedBox(height: 4),
              Text(address, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.midnight)),
            ],
          ),
        ),
      ],
    );
  }
}

class _CustomerInfo extends StatelessWidget {
  final String name;
  const _CustomerInfo({required this.name});

  @override
  Widget build(BuildContext context) {
    return GlassContainer(
      padding: const EdgeInsets.all(20),
      opacity: 0.1,
      color: Colors.white,
      child: Row(
        children: [
          CircleAvatar(
            radius: 24, 
            backgroundColor: AppTheme.ocean.withOpacity(0.1), 
            child: const Icon(Icons.person_rounded, color: AppTheme.ocean)
          ),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('CLIENTE', style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1)),
              const SizedBox(height: 2),
              Text(name, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: AppTheme.midnight)),
            ],
          ),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final String label;
  final Color color;
  final Color textColor;
  final VoidCallback onTap;

  const _ActionButton({required this.label, required this.color, required this.textColor, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 60,
      child: ElevatedButton(
        onPressed: onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: textColor,
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        ),
        child: Text(label, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, letterSpacing: 1.2)),
      ),
    );
  }
}

