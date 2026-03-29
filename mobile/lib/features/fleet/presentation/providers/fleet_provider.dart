import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:speed_drive_mobile/features/fleet/data/models/vehicle_model.dart';
import 'package:speed_drive_mobile/features/fleet/data/models/trip_model.dart';
import 'package:speed_drive_mobile/features/fleet/domain/repositories/fleet_repository.dart';

class FleetState {
  final List<Vehicle> vehicles;
  final List<Trip> trips;
  final bool isLoading;
  final String? error;

  FleetState({
    required this.vehicles,
    required this.trips,
    this.isLoading = false,
    this.error,
  });

  FleetState copyWith({
    List<Vehicle>? vehicles,
    List<Trip>? trips,
    bool? isLoading,
    String? error,
  }) {
    return FleetState(
      vehicles: vehicles ?? this.vehicles,
      trips: trips ?? this.trips,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

final fleetProvider = StateNotifierProvider<FleetNotifier, FleetState>((ref) {
  return FleetNotifier(ref.watch(fleetRepositoryProvider));
});

class FleetNotifier extends StateNotifier<FleetState> {
  final FleetRepository _repository;

  FleetNotifier(this._repository) : super(FleetState(vehicles: [], trips: [])) {
    refreshData();
  }

  Future<void> refreshData() async {
    state = state.copyWith(isLoading: true);
    try {
      final vehicles = await _repository.getVehicles();
      final trips = await _repository.getTrips();
      state = state.copyWith(vehicles: vehicles, trips: trips, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: 'Error al cargar datos');
    }
  }

  Future<bool> addVehicle(Map<String, dynamic> data) async {
    final success = await _repository.createVehicle(data);
    if (success) refreshData();
    return success;
  }

  Future<bool> updateVehicle(String id, Map<String, dynamic> data) async {
    final success = await _repository.updateVehicle(id, data);
    if (success) refreshData();
    return success;
  }
}
