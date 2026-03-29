import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:speed_drive_mobile/core/network/dio_provider.dart';
import 'package:speed_drive_mobile/core/storage/session_manager.dart';
import 'package:speed_drive_mobile/features/fleet/data/models/vehicle_model.dart';
import 'package:speed_drive_mobile/features/fleet/data/models/trip_model.dart';

final fleetRepositoryProvider = Provider<FleetRepository>((ref) {
  final dio = ref.watch(dioProvider);
  final session = ref.watch(sessionProvider);
  return FleetRepository(dio, session);
});

class FleetRepository {
  final Dio _dio;
  final SessionManager _session;

  FleetRepository(this._dio, this._session);

  Future<Options> _getOptions() async {
    final token = await _session.getToken();
    return Options(headers: {
      'Authorization': 'Bearer $token',
    });
  }

  Future<List<Vehicle>> getVehicles() async {
    try {
      final options = await _getOptions();
      final response = await _dio.get('/vehicle', options: options);
      final body = response.data['body'];
      if (body == null || body['data'] == null) return [];
      
      return (body['data'] as List)
          .map((v) => Vehicle.fromJson(v))
          .toList();
    } catch (e) {
      print('Error fetching vehicles: $e');
      return [];
    }
  }

  Future<List<Trip>> getTrips() async {
    try {
      final options = await _getOptions();
      // Use role-based filtering logic handled by backend
      final response = await _dio.get('/trip', options: options);
      final body = response.data['body'];
      if (body == null || body['data'] == null) return [];
      
      return (body['data'] as List)
          .map((t) => Trip.fromJson(t))
          .toList();
    } catch (e) {
      print('Error fetching trips: $e');
      return [];
    }
  }

  Future<bool> createVehicle(Map<String, dynamic> data) async {
    try {
      final options = await _getOptions();
      await _dio.post('/vehicle', data: data, options: options);
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> updateVehicle(String id, Map<String, dynamic> data) async {
    try {
      final options = await _getOptions();
      await _dio.put('/vehicle/$id', data: data, options: options);
      return true;
    } catch (e) {
      return false;
    }
  }
}
