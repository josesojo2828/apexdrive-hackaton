import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:speed_drive_mobile/core/config/environment.dart';

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: Environment.apiUrl, 
      connectTimeout: const Duration(milliseconds: Environment.connectTimeout),
      receiveTimeout: const Duration(milliseconds: Environment.receiveTimeout),
      contentType: 'application/json',
    ),
  );

  // Add Logging Interceptor
  dio.interceptors.add(InterceptorsWrapper(
    onRequest: (options, handler) {
      print('🚀 [HTTP REQUEST] ${options.method} -> ${options.baseUrl}${options.path}');
      print('Payload: ${options.data}');
      return handler.next(options);
    },
    onResponse: (response, handler) {
      print('✅ [HTTP RESPONSE] ${response.statusCode} from ${response.requestOptions.path}');
      print('Response: ${response.data}');
      return handler.next(response);
    },
    onError: (DioException e, handler) {
      print('❌ [HTTP ERROR] ${e.response?.statusCode} - ${e.message}');
      print('Path: ${e.requestOptions.path}');
      print('Response Data: ${e.response?.data}');
      return handler.next(e);
    },
  ));

  return dio;
});
