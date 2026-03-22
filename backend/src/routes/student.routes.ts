import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { studentRepository } from '../repository/student.repository.js';
import {
  createStudentSchema,
  updateStudentSchema,
  studentListQuerySchema,
  studentIdParamSchema,
} from '../validation/index.js';
import type { StudentListResponse, StudentResponse, DeleteStudentResponse } from '../dto/student.dto.js';
import type { ValidationError } from '../types/index.js';

const router = Router();

// GET /api/students - Get all students
router.get('/', async (req: Request, res: Response<StudentListResponse>) => {
  try {
    const validatedQuery = studentListQuerySchema.parse(req.query);
    
    const students = await studentRepository.findAll({
      search: validatedQuery.search,
      limit: validatedQuery.limit,
      offset: validatedQuery.offset,
    });

    return res.json({
      success: true,
      data: students,
      count: students.length,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch students',
      count: 0,
    });
  }
});

// GET /api/students/:id - Get student by ID
router.get('/:id', async (req: Request, res: Response<StudentResponse>) => {
  try {
    const validatedParams = studentIdParamSchema.parse(req.params);
    
    if (isNaN(validatedParams.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid student ID',
      });
    }

    const student = await studentRepository.findById(validatedParams.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found',
      });
    }

    return res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch student',
    });
  }
});

// POST /api/students - Create a new student
router.post('/', async (req: Request, res: Response<StudentResponse>) => {
  try {
    const validatedData = createStudentSchema.parse(req.body);

    // Check if roll number already exists
    const existing = await studentRepository.findByRollNo(validatedData.rollNo);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Student with this roll number already exists',
      });
    }

    const student = await studentRepository.create(validatedData);

    return res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        issues: error.issues.map((issue) => ({
          code: issue.code,
          path: issue.path.map(String),
          message: issue.message,
        })) as ValidationError[],
      });
    }

    console.error('Error creating student:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create student',
    });
  }
});

// PUT /api/students/:id - Update a student
router.put('/:id', async (req: Request, res: Response<StudentResponse>) => {
  try {
    const validatedParams = studentIdParamSchema.parse(req.params);
    
    if (isNaN(validatedParams.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid student ID',
      });
    }

    const validatedData = updateStudentSchema.parse(req.body);

    const student = await studentRepository.update(validatedParams.id, validatedData);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found',
      });
    }

    return res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        issues: error.issues.map((issue) => ({
          code: issue.code,
          path: issue.path.map(String),
          message: issue.message,
        })) as ValidationError[],
      });
    }

    console.error('Error updating student:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update student',
    });
  }
});

// DELETE /api/students/:id - Delete a student
router.delete('/:id', async (req: Request, res: Response<DeleteStudentResponse>) => {
  try {
    const validatedParams = studentIdParamSchema.parse(req.params);
    
    if (isNaN(validatedParams.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid student ID',
        message: 'Invalid student ID',
      });
    }

    const deleted = await studentRepository.delete(validatedParams.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Student not found',
        message: 'Student not found',
      });
    }

    return res.json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete student',
      message: 'Failed to delete student',
    });
  }
});

export { router as studentRoutes };
