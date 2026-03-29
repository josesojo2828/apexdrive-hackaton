import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'package:speed_drive_mobile/features/auth/data/models/user_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final dbServiceProvider = Provider<LocalDatabase>((ref) => LocalDatabase());

class LocalDatabase {
  static Database? _database;

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB();
    return _database!;
  }

  Future<Database> _initDB() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'speeddrive.db');

    return await openDatabase(
      path,
      version: 2, // Incremented version to add phone column
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE users(
            id TEXT PRIMARY KEY,
            email TEXT,
            firstName TEXT,
            lastName TEXT,
            phone TEXT,
            role TEXT,
            avatar TEXT
          )
        ''');
      },
      onUpgrade: (db, oldVersion, newVersion) async {
        if (oldVersion < 2) {
          await db.execute('ALTER TABLE users ADD COLUMN phone TEXT');
        }
      },
    );
  }

  Future<void> saveUser(User user) async {
    final db = await database;
    await db.insert(
      'users',
      user.toJson(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<User?> getUser() async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query('users', limit: 1);
    
    if (maps.isEmpty) return null;
    return User.fromJson(maps.first);
  }

  Future<void> deleteUser() async {
    final db = await database;
    await db.delete('users');
  }
}
