import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'gildo.db';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;
  
  db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await runMigrations(db);
  return db;
};

const runMigrations = async (database: SQLite.SQLiteDatabase) => {
  try {
    // Enable foreign keys
    await database.execAsync('PRAGMA foreign_keys = ON;');
    
    // Create medications table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS medications (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        dosage TEXT NOT NULL,
        pillColor TEXT NOT NULL,
        pillShape TEXT NOT NULL CHECK(pillShape IN ('round', 'capsule')),
        quantity INTEGER NOT NULL,
        timing TEXT NOT NULL CHECK(timing IN ('before_meal', 'after_meal', 'with_meal')),
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
    `);
    
    // Create schedules table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS schedules (
        id TEXT PRIMARY KEY NOT NULL,
        medicationId TEXT NOT NULL,
        time TEXT NOT NULL,
        daysOfWeek TEXT NOT NULL,
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        FOREIGN KEY (medicationId) REFERENCES medications (id) ON DELETE CASCADE
      );
    `);
    
    // Create medication logs table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS medication_logs (
        id TEXT PRIMARY KEY NOT NULL,
        medicationId TEXT NOT NULL,
        scheduleId TEXT NOT NULL,
        takenAt INTEGER NOT NULL,
        scheduledTime TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('taken', 'skipped', 'missed')),
        FOREIGN KEY (medicationId) REFERENCES medications (id) ON DELETE CASCADE,
        FOREIGN KEY (scheduleId) REFERENCES schedules (id) ON DELETE CASCADE
      );
    `);
    
    // Create app preferences table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS app_preferences (
        id INTEGER PRIMARY KEY CHECK(id = 1),
        userName TEXT NOT NULL DEFAULT '',
        email TEXT DEFAULT NULL,
        dateOfBirth TEXT DEFAULT NULL,
        gender TEXT DEFAULT NULL,
        profileImageUri TEXT DEFAULT NULL,
        hasCompletedOnboarding INTEGER NOT NULL DEFAULT 0,
        notificationsEnabled INTEGER NOT NULL DEFAULT 1,
        theme TEXT NOT NULL DEFAULT 'light' CHECK(theme IN ('light', 'dark', 'auto'))
      );
    `);
    
    // Add new columns if they don't exist (for existing databases)
    try {
      await database.execAsync(`ALTER TABLE app_preferences ADD COLUMN email TEXT DEFAULT NULL;`);
    } catch (e) {
      // Column already exists, ignore
    }
    try {
      await database.execAsync(`ALTER TABLE app_preferences ADD COLUMN dateOfBirth TEXT DEFAULT NULL;`);
    } catch (e) {
      // Column already exists, ignore
    }
    try {
      await database.execAsync(`ALTER TABLE app_preferences ADD COLUMN gender TEXT DEFAULT NULL;`);
    } catch (e) {
      // Column already exists, ignore
    }
    try {
      await database.execAsync(`ALTER TABLE app_preferences ADD COLUMN profileImageUri TEXT DEFAULT NULL;`);
    } catch (e) {
      // Column already exists, ignore
    }
    
    // Insert default preferences if not exists
    await database.execAsync(`
      INSERT OR IGNORE INTO app_preferences (id, userName, hasCompletedOnboarding, notificationsEnabled, theme)
      VALUES (1, '', 0, 1, 'light');
    `);
    
    // Create indexes for better performance
    await database.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_schedules_medicationId ON schedules(medicationId);
      CREATE INDEX IF NOT EXISTS idx_logs_medicationId ON medication_logs(medicationId);
      CREATE INDEX IF NOT EXISTS idx_logs_scheduleId ON medication_logs(scheduleId);
    `);
    
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Database migration error:', error);
    throw error;
  }
};

export const resetDatabase = async () => {
  if (db) {
    await db.closeAsync();
  }
  db = null;
  // Note: expo-sqlite doesn't have a direct delete method
  // The database will be recreated on next getDatabase() call
};

