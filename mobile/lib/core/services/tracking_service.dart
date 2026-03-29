import 'dart:async';
import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import 'package:geolocator/geolocator.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:speed_drive_mobile/features/auth/presentation/providers/auth_provider.dart';
import 'package:speed_drive_mobile/core/config/environment.dart';

final trackingServiceProvider = Provider((ref) {
  final authState = ref.watch(authProvider);
  return TrackingService(authState.user?.id, authState.user?.role);
});

class TrackingService {
  final String? userId;
  final String? role;
  io.Socket? socket;
  StreamSubscription<Position>? _positionStream;
  bool _isTracking = false;
  final ValueNotifier<bool> onlineStatusNotifier = ValueNotifier<bool>(false);

  TrackingService(this.userId, this.role);

  void connect() {
    if (userId == null) return;

    socket = io.io('${Environment.socketUrl}/tracking', {
      'transports': ['websocket'],
      'autoConnect': false,
      'query': {
        'userId': userId,
        'role': role ?? 'DRIVER',
      },
    });

    socket!.connect();

    socket!.onConnect((_) => print('Connected to Tracking WebSocket'));
    socket!.onDisconnect((_) => print('Disconnected from Tracking WebSocket'));
  }

  void _isOnlineStatus(bool online) {
    onlineStatusNotifier.value = online;
    if (socket != null && socket!.connected) {
      socket!.emit('setStatus', {'status': online ? 'ONLINE' : 'OFFLINE'});
    }
  }

  Future<bool> startTracking() async {
    // 1. Check permissions first
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      // Intentar abrir la configuración del sistema
      await Geolocator.openLocationSettings();
      // Re-verificar después de que el usuario regrese
      serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) return false;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) return false;
    }
    
    if (permission == LocationPermission.deniedForever) return false;

    if (socket == null || !socket!.connected) connect();
    
    _isOnlineStatus(true);
    _isTracking = true;
    return true;

    // Send initial location immediately
    try {
      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high
      );
      if (socket != null && socket!.connected) {
        socket!.emit('updateLocation', {
          'latitude': position.latitude,
          'longitude': position.longitude,
        });
        print('📡 Initial Location emitted: ${position.latitude}, ${position.longitude}');
      }
    } catch (e) {
      print('❌ Error getting current position: $e');
    }
    
    _positionStream = Geolocator.getPositionStream(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 2, // Update every 2 meters for extreme precision
      ),
    ).listen((Position position) {
      if (_isTracking && socket != null && socket!.connected) {
        socket!.emit('updateLocation', {
          'latitude': position.latitude,
          'longitude': position.longitude,
        });
        print('📡 Location emitted: ${position.latitude}, ${position.longitude}');
      }
    });
  }

  void stopTracking() {
    _isOnlineStatus(false);
    _isTracking = false;
    _positionStream?.cancel();
    socket?.disconnect();
  }

  void dispose() {
    stopTracking();
  }
}
