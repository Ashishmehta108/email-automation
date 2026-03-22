import { db } from '../db/index.js';
import { students } from '../db/schema.js';
import { eq, like, desc } from 'drizzle-orm';
import type { Student, CreateStudentInput, UpdateStudentInput, StudentFilter } from '../types/index.js';

export class StudentRepository {
  /**
   * Create a new student
   */
  async create(input: CreateStudentInput): Promise<Student> {
    const result = await db
      .insert(students)
      .values(input)
      .returning();
    
    return result[0];
  }

  /**
   * Find a student by ID
   */
  async findById(id: number): Promise<Student | null> {
    const result = await db
      .select()
      .from(students)
      .where(eq(students.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Find a student by roll number
   */
  async findByRollNo(rollNo: string): Promise<Student | null> {
    const result = await db
      .select()
      .from(students)
      .where(eq(students.rollNo, rollNo))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Find a student by email
   */
  async findByEmail(email: string): Promise<Student | null> {
    const result = await db
      .select()
      .from(students)
      .where(eq(students.email, email))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Get all students with optional filtering and pagination
   */
  async findAll(filter?: StudentFilter): Promise<Student[]> {
    const conditions = [];
    
    if (filter?.search) {
      conditions.push(like(students.name, `%${filter.search}%`));
    }

    const query = db.select().from(students);
    
    if (conditions.length > 0) {
      // @ts-ignore - Drizzle query builder type issue
      query.where(conditions[0]);
    }

    // @ts-ignore - Drizzle query builder type issue
    const result = query.orderBy(desc(students.createdAt));
    
    if (filter?.limit) {
      // @ts-ignore
      result.limit(filter.limit);
    }
    
    if (filter?.offset) {
      // @ts-ignore
      result.offset(filter.offset);
    }
    
    return result;
  }

  /**
   * Update a student by ID
   */
  async update(id: number, input: UpdateStudentInput): Promise<Student | null> {
    const result = await db
      .update(students)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(students.id, id))
      .returning();
    
    return result[0] || null;
  }

  /**
   * Delete a student by ID
   */
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(students)
      .where(eq(students.id, id));
    
    return (result.rowCount || 0) > 0;
  }

  /**
   * Count total students
   */
  async count(): Promise<number> {
    const result = await db
      .select({ count: students.id })
      .from(students);
    
    return result.length;
  }

  /**
   * Bulk insert students
   */
  async bulkInsert(studentsData: CreateStudentInput[]): Promise<number> {
    const result = await db
      .insert(students)
      .values(studentsData)
      .returning();
    
    return result.length;
  }
}

export const studentRepository = new StudentRepository();
