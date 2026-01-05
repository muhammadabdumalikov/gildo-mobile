import { getDatabase } from '@/src/core/database';
import { Medication, MedicationSchedule, MedicationWithSchedules } from '@/src/core/types';

export class MedicationRepository {
  // Create medication
  async create(medication: Medication): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO medications (id, name, dosage, pillColor, pillShape, quantity, timing, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      medication.id,
      medication.name,
      medication.dosage,
      medication.pillColor,
      medication.pillShape,
      medication.quantity,
      medication.timing,
      medication.createdAt,
      medication.updatedAt
    );
  }

  // Get medication by ID
  async getById(id: string): Promise<Medication | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<Medication>(
      'SELECT * FROM medications WHERE id = ?',
      id
    );
    return result || null;
  }

  // Get all medications
  async getAll(): Promise<Medication[]> {
    const db = await getDatabase();
    const results = await db.getAllAsync<Medication>('SELECT * FROM medications ORDER BY name ASC');
    return results;
  }

  // Get medication with schedules
  async getWithSchedules(id: string): Promise<MedicationWithSchedules | null> {
    const medication = await this.getById(id);
    if (!medication) return null;

    const db = await getDatabase();
    const schedules = await db.getAllAsync<any>(
      'SELECT * FROM schedules WHERE medicationId = ? ORDER BY time ASC',
      id
    );

    const parsedSchedules: MedicationSchedule[] = schedules.map((s) => ({
      ...s,
      daysOfWeek: JSON.parse(s.daysOfWeek),
      isActive: Boolean(s.isActive),
    }));

    return {
      ...medication,
      schedules: parsedSchedules,
    };
  }

  // Get all medications with their schedules
  async getAllWithSchedules(): Promise<MedicationWithSchedules[]> {
    const medications = await this.getAll();
    const results: MedicationWithSchedules[] = [];

    for (const med of medications) {
      const withSchedules = await this.getWithSchedules(med.id);
      if (withSchedules) {
        results.push(withSchedules);
      }
    }

    return results;
  }

  // Update medication
  async update(medication: Medication): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE medications 
       SET name = ?, dosage = ?, pillColor = ?, pillShape = ?, quantity = ?, timing = ?, updatedAt = ?
       WHERE id = ?`,
      medication.name,
      medication.dosage,
      medication.pillColor,
      medication.pillShape,
      medication.quantity,
      medication.timing,
      medication.updatedAt,
      medication.id
    );
  }

  // Delete medication (cascades to schedules and logs)
  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM medications WHERE id = ?', id);
  }

  // Search medications by name
  async search(query: string): Promise<Medication[]> {
    const db = await getDatabase();
    const results = await db.getAllAsync<Medication>(
      'SELECT * FROM medications WHERE name LIKE ? ORDER BY name ASC',
      `%${query}%`
    );
    return results;
  }
}

export const medicationRepository = new MedicationRepository();

