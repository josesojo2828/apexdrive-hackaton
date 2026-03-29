import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:speed_drive_mobile/core/theme/app_theme.dart';
import 'package:speed_drive_mobile/core/widgets/glass_container.dart';
import 'package:speed_drive_mobile/features/fleet/data/models/vehicle_model.dart';
import 'package:speed_drive_mobile/features/fleet/presentation/providers/fleet_provider.dart';

class VehicleUpsertModal extends ConsumerStatefulWidget {
  final Vehicle? vehicle;
  const VehicleUpsertModal({super.key, this.vehicle});

  @override
  ConsumerState<VehicleUpsertModal> createState() => _VehicleUpsertModalState();
}

class _VehicleUpsertModalState extends ConsumerState<VehicleUpsertModal> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _plateController;
  late TextEditingController _brandController;
  late TextEditingController _modelController;
  late TextEditingController _yearController;
  String _type = 'AUTO';

  @override
  void initState() {
    super.initState();
    _plateController = TextEditingController(text: widget.vehicle?.plate);
    _brandController = TextEditingController(text: widget.vehicle?.brand);
    _modelController = TextEditingController(text: widget.vehicle?.model);
    _yearController = TextEditingController(text: widget.vehicle?.year);
    _type = widget.vehicle?.type ?? 'AUTO';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      decoration: const BoxDecoration(
        color: AppTheme.pearlPerfect,
        borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
      ),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(30),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(child: Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(2)))),
              const SizedBox(height: 24),
              Text(widget.vehicle == null ? 'Nuevo Vehículo' : 'Actualizar Vehículo', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.midnight)),
              const SizedBox(height: 24),
              _buildField('Placa', _plateController, 'ABC-123'),
              const SizedBox(height: 16),
              _buildField('Marca', _brandController, 'Toyota'),
              const SizedBox(height: 16),
              _buildField('Modelo', _modelController, 'Corolla'),
              const SizedBox(height: 16),
              _buildField('Año', _yearController, '2024', keyboardType: TextInputType.number),
              const SizedBox(height: 20),
              const Text('Tipo de Vehículo', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
              const SizedBox(height: 8),
              _buildTypeSelector(),
              const SizedBox(height: 40),
              ElevatedButton(
                onPressed: _submit,
                style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 60)),
                child: Text(widget.vehicle == null ? 'REGISTRAR' : 'GUARDAR CAMBIOS'),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildField(String label, TextEditingController controller, String hint, {TextInputType? keyboardType}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          style: const TextStyle(color: AppTheme.midnight, fontWeight: FontWeight.bold),
          decoration: InputDecoration(
            hintText: hint,
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(15), borderSide: BorderSide.none),
          ),
          validator: (v) => v!.isEmpty ? 'Campo requerido' : null,
        ),
      ],
    );
  }

  Widget _buildTypeSelector() {
    return Row(
      children: [
        _TypeChip(label: 'AUTO', icon: Icons.directions_car_rounded, isSelected: _type == 'AUTO', onTap: (s) => setState(() => _type = s)),
        const SizedBox(width: 12),
        _TypeChip(label: 'MOTO', icon: Icons.motorcycle_rounded, isSelected: _type == 'MOTORCYCLE', onTap: (s) => setState(() => _type = 'MOTORCYCLE')),
      ],
    );
  }

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final data = {
      'plate': _plateController.text,
      'brand': _brandController.text,
      'model': _modelController.text,
      'year': _yearController.text,
      'type': _type,
    };

    final notifier = ref.read(fleetProvider.notifier);
    bool success;
    if (widget.vehicle == null) {
      success = await notifier.addVehicle(data);
    } else {
      success = await notifier.updateVehicle(widget.vehicle!.id, data);
    }

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(widget.vehicle == null ? 'Vehículo registrado' : 'Vehículo actualizado'),
          backgroundColor: AppTheme.emerald,
        ),
      );
      Navigator.pop(context);
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error al procesar la solicitud'), backgroundColor: Colors.redAccent),
      );
    }
  }
}

class _TypeChip extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool isSelected;
  final Function(String) onTap;

  const _TypeChip({required this.label, required this.icon, required this.isSelected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => onTap(label == 'MOTO' ? 'MOTORCYCLE' : 'AUTO'),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.ocean : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? Colors.transparent : Colors.grey[200]!),
        ),
        child: Row(
          children: [
            Icon(icon, color: isSelected ? Colors.white : Colors.grey, size: 20),
            const SizedBox(width: 8),
            Text(label, style: TextStyle(color: isSelected ? Colors.white : Colors.grey, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}
