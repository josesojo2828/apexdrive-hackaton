class Vehicle {
  final String id;
  final String plate;
  final String model;
  final String brand;
  final String type;
  final String status;
  final String? color;
  final String? year;

  const Vehicle({
    required this.id,
    required this.plate,
    required this.model,
    required this.brand,
    required this.type,
    required this.status,
    this.color,
    this.year,
  });

  factory Vehicle.fromJson(Map<String, dynamic> json) {
    return Vehicle(
      id: json['id'] ?? '',
      plate: json['plate'] ?? '',
      model: json['model'] ?? '',
      brand: json['brand'] ?? '',
      type: json['type'] ?? 'AUTO',
      status: json['status'] ?? 'ACTIVE',
      color: json['color'],
      year: json['year'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'plate': plate,
      'model': model,
      'brand': brand,
      'type': type,
      'status': status,
      'color': color,
      'year': year,
    };
  }
}
