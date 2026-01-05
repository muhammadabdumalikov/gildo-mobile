import { getDatabase } from '@/src/core/database';
import { MedicationSchedule } from '@/src/core/types';

export class ScheduleRepository {
  // Create schedule
  async create(schedule: MedicationSchedule): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO schedules (id, medicationId, time, daysOfWeek, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      schedule.id,
      schedule.medicationId,
      schedule.time,
      JSON.stringify(schedule.daysOfWeek),
      schedule.isActive ? 1 : 0,
      schedule.createdAt,
      schedule.updatedAt
    );
  }

  // Get schedule by ID
  async getById(id: string): Promise<MedicationSchedule | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<any>(
      'SELECT * FROM schedules WHERE id = ?',
      id
    );
    
    if (!result) return null;

    return {
      ...result,
      daysOfWeek: JSON.parse(result.daysOfWeek),
      isActive: Boolean(result.isActive),
    };
  }

  // Get schedules by medication ID
  async getByMedicationId(medicationId: string): Promise<MedicationSchedule[]> {
    const db = await getDatabase();
    const results = await db.getAllAsync<any>(
      'SELECT * FROM schedules WHERE medicationId = ? ORDER BY time ASC',
      medicationId
    );

    return results.map((s) => ({
      ...s,
      daysOfWeek: JSON.parse(s.daysOfWeek),
      isActive: Boolean(s.isActive),
    }));
  }

  // Get all active schedules
  async getActiveSchedules(): Promise<MedicationSchedule[]> {
    const db = await getDatabase();
    const results = await db.getAllAsync<any>(
      'SELECT * FROM schedules WHERE isActive = 1 ORDER BY time ASC'
    );

    return results.map((s) => ({
      ...s,
      daysOfWeek: JSON.parse(s.daysOfWeek),
      isActive: Boolean(s.isActive),
    }));
  }

  // Update schedule
  async update(schedule: MedicationSchedule): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE schedules 
       SET time = ?, daysOfWeek = ?, isActive = ?, updatedAt = ?
       WHERE id = ?`,
      schedule.time,
      JSON.stringify(schedule.daysOfWeek),
      schedule.isActive ? 1 : 0,
      schedule.updatedAt,
      schedule.id
    );
  }

  // Delete schedule
  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM schedules WHERE id = ?', id);
  }

  // Delete all schedules for a medication
  async deleteByMedicationId(medicationId: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM schedules WHERE medicationId = ?', medicationId);
  }

  // Toggle schedule active status
  async toggleActive(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE schedules 
       SET isActive = CASE WHEN isActive = 1 THEN 0 ELSE 1 END, updatedAt = ?
       WHERE id = ?`,
      Date.now(),
      id
    );
  }
}

export const scheduleRepository = new ScheduleRepository();

