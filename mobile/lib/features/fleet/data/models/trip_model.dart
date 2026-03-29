class Trip {
  final String id;
  final String status;
  final String originAddress;
  final String destAddress;
  final double fare;
  final DateTime? createdAt;
  final String? customerName;

  const Trip({
    required this.id,
    required this.status,
    required this.originAddress,
    required this.destAddress,
    required this.fare,
    this.createdAt,
    this.customerName,
  });

  factory Trip.fromJson(Map<String, dynamic> json) {
    return Trip(
      id: json['id'] ?? '',
      status: json['status'] ?? 'PENDING',
      originAddress: json['originAddress'] ?? '',
      destAddress: json['destAddress'] ?? '',
      fare: (json['fare'] ?? 0.0).toDouble(),
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
      customerName: json['customerName'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'status': status,
      'originAddress': originAddress,
      'destAddress': destAddress,
      'fare': fare,
      'createdAt': createdAt?.toIso8601String(),
    };
  }
}
