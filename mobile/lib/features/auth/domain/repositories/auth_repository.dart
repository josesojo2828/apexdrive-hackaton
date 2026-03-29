import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:speed_drive_mobile/core/network/dio_provider.dart';
import 'package:speed_drive_mobile/features/auth/data/models/user_model.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.watch(dioProvider));
});

class AuthRepository {
  final Dio _dio;

  AuthRepository(this._dio);

  Future<AuthResponse> login(String email, String password) async {
    try {
      final response = await _dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 201 || response.statusCode == 200) {
        // Wrap access based on ResponseInterceptor: { body: { token: ..., user: ... }, ... }
        final body = response.data['body'];
        if (body == null) return AuthResponse.error('Invalid response format');
        
        return AuthResponse.success(
          token: body['token'] ?? body['access_token'],
          user: User.fromJson(body['user']),
        );
      }
      return AuthResponse.error('Unexpected error: ${response.statusCode}');
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? 'Login failed';
      return AuthResponse.error(msg is List ? msg.join(', ') : msg);
    } catch (e) {
      print('Auth error: $e');
      return AuthResponse.error('Connection error');
    }
  }

  Future<AuthResponse> register(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/auth/register', data: data);
      if (response.statusCode == 201) {
        final body = response.data['body'];
        return AuthResponse.success(
          token: body['token'],
          user: User.fromJson(body['user']),
        );
      }
      return AuthResponse.error('Registration failed');
    } on DioException catch (e) {
      return AuthResponse.error(e.response?.data?['message'] ?? 'Registration error');
    }
  }
}

class AuthResponse {
  final String? token;
  final User? user;
  final String? error;

  AuthResponse({this.token, this.user, this.error});

  factory AuthResponse.success({required String token, required User user}) =>
      AuthResponse(token: token, user: user);
  factory AuthResponse.error(String msg) => AuthResponse(error: msg);
}
