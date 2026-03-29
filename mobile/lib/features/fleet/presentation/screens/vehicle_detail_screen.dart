import 'package:flutter/material.dart';
import 'package:speed_drive_mobile/core/theme/app_theme.dart';
import 'package:speed_drive_mobile/core/widgets/glass_container.dart';
import 'package:speed_drive_mobile/core/widgets/typography.dart';
import 'package:speed_drive_mobile/features/fleet/data/models/vehicle_model.dart';

class VehicleDetailScreen extends StatelessWidget {
  final Vehicle vehicle;
  const VehicleDetailScreen({super.key, required this.vehicle});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.pearlPerfect,
      appBar: AppBar(
        title: const AppTypography(variant: AppTypographyVariant.H3, text: 'Detalle de Vehículo'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppTheme.midnight),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Hero(
              tag: 'vehicle_${vehicle.id}',
              child: GlassContainer(
                height: 200,
                width: double.infinity,
                opacity: 0.1,
                borderRadius: 30,
                child: Center(
                  child: Icon(
                    vehicle.type == 'MOTORCYCLE' ? Icons.motorcycle_rounded : Icons.directions_car_rounded,
                    size: 100,
                    color: AppTheme.ocean.withOpacity(0.5),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 30),
            _DetailCard(
              title: vehicle.plate,
              subtitle: '${vehicle.brand} ${vehicle.model}',
              status: vehicle.status,
            ),
            const SizedBox(height: 24),
            _InfoRow(label: 'Año', value: vehicle.year ?? 'N/A'),
            _InfoRow(label: 'Color', value: vehicle.color ?? 'N/A'),
            _InfoRow(label: 'Tipo', value: vehicle.type),
            const SizedBox(height: 40),
            ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.edit_rounded, color: Colors.white),
              label: const Text('Editar Información'),
              style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 60)),
            ),
          ],
        ),
      ),
    );
  }
}

class _DetailCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final String status;

  const _DetailCard({required this.title, required this.subtitle, required this.status});

  @override
  Widget build(BuildContext context) {
    return GlassContainer(
      padding: const EdgeInsets.all(24),
      opacity: 0.1,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: AppTheme.midnight)),
              Text(subtitle, style: const TextStyle(color: Colors.grey, fontSize: 16)),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(color: (status == 'ACTIVE' ? AppTheme.emerald : Colors.orange).withOpacity(0.2), borderRadius: BorderRadius.circular(10)),
            child: Text(status, style: TextStyle(color: (status == 'ACTIVE' ? AppTheme.emerald : Colors.orange), fontWeight: FontWeight.bold, fontSize: 10)),
          ),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;
  const _InfoRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.midnight)),
        ],
      ),
    );
  }
}
