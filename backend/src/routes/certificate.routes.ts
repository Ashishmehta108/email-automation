import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { certificateRepository } from '../repository/certificate.repository.js';
import { certificateService } from '../services/certificate.service.js';
import {
  createCertificateSchema,
  generateCertificateSchema,
  bulkGenerateCertificatesSchema,
  updateCertificateSchema,
  certificateListQuerySchema,
  certificateIdParamSchema,
} from '../validation/index.js';
import type {
  CertificateListResponse,
  CertificateResponse,
  DeleteCertificateResponse,
  GenerateCertificateResponse,
  BulkGenerateCertificatesResponse,
} from '../dto/certificate.dto.js';
import type { ValidationError } from '../types/index.js';

const router = Router();

// GET /api/certificates - Get all certificates
router.get('/', async (req: Request, res: Response<CertificateListResponse>) => {
  try {
    const validatedQuery = certificateListQuerySchema.parse(req.query);
    
    const certificates = await certificateRepository.findAll({
      studentId: validatedQuery.studentId,
      status: validatedQuery.status,
      eventName: validatedQuery.eventName,
      limit: validatedQuery.limit,
      offset: validatedQuery.offset,
    });

    return res.json({
      success: true,
      data: certificates,
      count: certificates.length,
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch certificates',
      count: 0,
    });
  }
});

// GET /api/certificates/:id - Get certificate by ID
router.get('/:id', async (req: Request, res: Response<CertificateResponse>) => {
  try {
    const validatedParams = certificateIdParamSchema.parse(req.params);
    
    if (isNaN(validatedParams.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid certificate ID',
      });
    }

    const certificate = await certificateRepository.findById(validatedParams.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: 'Certificate not found',
      });
    }

    return res.json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch certificate',
    });
  }
});

// POST /api/certificates - Create a certificate record
router.post('/', async (req: Request, res: Response<CertificateResponse>) => {
  try {
    const validatedData = createCertificateSchema.parse(req.body);

    const certificate = await certificateRepository.create(validatedData);

    return res.status(201).json({
      success: true,
      data: certificate,
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

    console.error('Error creating certificate:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create certificate',
    });
  }
});

// POST /api/certificates/generate - Generate a PDF certificate
router.post('/generate', async (req: Request, res: Response<GenerateCertificateResponse>) => {
  try {
    const validatedData = generateCertificateSchema.parse(req.body);

    let result;
    if (validatedData.templateId) {
      result = await certificateService.generateCertificateWithTemplate(
        validatedData.studentId,
        {
          eventName: validatedData.eventName,
          issuedBy: validatedData.issuedBy,
          date: validatedData.issueDate,
        },
        validatedData.templateId
      );
    } else {
      result = await certificateService.generateCertificate(
        validatedData.studentId,
        {
          eventName: validatedData.eventName,
          issuedBy: validatedData.issuedBy,
          date: validatedData.issueDate,
        }
      );
    }

    return res.status(201).json({
      success: true,
      data: result,
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

    console.error('Error generating certificate:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate certificate',
    });
  }
});

// POST /api/certificates/generate/bulk - Generate multiple certificates
router.post('/generate/bulk', async (req: Request, res: Response<BulkGenerateCertificatesResponse>) => {
  try {
    const validatedData = bulkGenerateCertificatesSchema.parse(req.body);

    const results = await certificateService.generateBulkCertificates(
      validatedData.studentIds,
      {
        eventName: validatedData.eventName,
        issuedBy: validatedData.issuedBy,
        date: validatedData.issueDate,
      },
      validatedData.templateId
    );

    return res.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        count: 0,
        issues: error.issues.map((issue) => ({
          code: issue.code,
          path: issue.path.map(String),
          message: issue.message,
        })) as ValidationError[],
      });
    }

    console.error('Error generating bulk certificates:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate certificates',
      count: 0,
    });
  }
});

// PUT /api/certificates/:id - Update a certificate
router.put('/:id', async (req: Request, res: Response<CertificateResponse>) => {
  try {
    const validatedParams = certificateIdParamSchema.parse(req.params);
    
    if (isNaN(validatedParams.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid certificate ID',
      });
    }

    const validatedData = updateCertificateSchema.parse(req.body);

    const certificate = await certificateRepository.update(validatedParams.id, validatedData);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: 'Certificate not found',
      });
    }

    return res.json({
      success: true,
      data: certificate,
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

    console.error('Error updating certificate:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update certificate',
    });
  }
});

// DELETE /api/certificates/:id - Delete a certificate
router.delete('/:id', async (req: Request, res: Response<DeleteCertificateResponse>) => {
  try {
    const validatedParams = certificateIdParamSchema.parse(req.params);
    
    if (isNaN(validatedParams.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid certificate ID',
        message: 'Invalid certificate ID',
      });
    }

    const deleted = await certificateRepository.delete(validatedParams.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Certificate not found',
        message: 'Certificate not found',
      });
    }

    return res.json({
      success: true,
      message: 'Certificate deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete certificate',
      message: 'Failed to delete certificate',
    });
  }
});

export { router as certificateRoutes };
