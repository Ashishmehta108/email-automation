import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { certificateTemplateRepository } from '../repository/certificate-template.repository.js';
import { certificateService } from '../services/certificate.service.js';
import {
  createTemplateSchema,
  updateTemplateSchema,
  templateListQuerySchema,
  templateIdParamSchema,
  previewTemplateSchema,
} from '../validation/index.js';
import type {
  CertificateTemplateListResponse,
  CertificateTemplateResponse,
  DeleteTemplateResponse,
  PreviewTemplateResponse,
} from '../dto/certificate-template.dto.js';
import type { ValidationError } from '../types/index.js';

const router = Router();

// GET /api/templates - Get all certificate templates
router.get('/', async (req: Request, res: Response<CertificateTemplateListResponse>) => {
  try {
    const validatedQuery = templateListQuerySchema.parse(req.query);
    
    const templates = await certificateTemplateRepository.findAll({
      isActive: validatedQuery.isActive,
      limit: validatedQuery.limit,
      offset: validatedQuery.offset,
    });

    return res.json({
      success: true,
      data: templates,
      count: templates.length,
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch templates',
      count: 0,
    });
  }
});

// GET /api/templates/active - Get active templates only
router.get('/active', async (_req: Request, res: Response<CertificateTemplateListResponse>) => {
  try {
    const templates = await certificateTemplateRepository.findActive();

    return res.json({
      success: true,
      data: templates,
      count: templates.length,
    });
  } catch (error) {
    console.error('Error fetching active templates:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch active templates',
      count: 0,
    });
  }
});

// GET /api/templates/:id - Get template by ID
router.get('/:id', async (req: Request, res: Response<CertificateTemplateResponse>) => {
  try {
    const validatedParams = templateIdParamSchema.parse(req.params);
    
    if (isNaN(validatedParams.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID',
      });
    }

    const template = await certificateTemplateRepository.findById(validatedParams.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found',
      });
    }

    return res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch template',
    });
  }
});

// POST /api/templates - Create a new certificate template
router.post('/', async (req: Request, res: Response<CertificateTemplateResponse>) => {
  try {
    const validatedData = createTemplateSchema.parse(req.body);

    const template = await certificateTemplateRepository.create(validatedData);

    return res.status(201).json({
      success: true,
      data: template,
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

    console.error('Error creating template:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create template',
    });
  }
});

// PUT /api/templates/:id - Update a certificate template
router.put('/:id', async (req: Request, res: Response<CertificateTemplateResponse>) => {
  try {
    const validatedParams = templateIdParamSchema.parse(req.params);
    
    if (isNaN(validatedParams.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID',
      });
    }

    const validatedData = updateTemplateSchema.parse(req.body);

    const template = await certificateTemplateRepository.update(validatedParams.id, validatedData);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found',
      });
    }

    return res.json({
      success: true,
      data: template,
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

    console.error('Error updating template:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update template',
    });
  }
});

// PATCH /api/templates/:id/toggle - Toggle template active status
router.patch('/:id/toggle', async (req: Request, res: Response<CertificateTemplateResponse>) => {
  try {
    const validatedParams = templateIdParamSchema.parse(req.params);
    
    if (isNaN(validatedParams.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID',
      });
    }

    const template = await certificateTemplateRepository.toggleActive(validatedParams.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found',
      });
    }

    return res.json({
      success: true,
      data: template,
      message: `Template ${template.isActive ? 'activated' : 'deactivated'}`,
    });
  } catch (error) {
    console.error('Error toggling template status:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to toggle template status',
    });
  }
});

// POST /api/templates/:id/preview - Generate a preview of a template
router.post('/:id/preview', async (req: Request, res: Response<PreviewTemplateResponse>) => {
  try {
    const validatedParams = templateIdParamSchema.parse(req.params);
    
    if (isNaN(validatedParams.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID',
      });
    }

    const validatedBody = previewTemplateSchema.parse(req.body);

    const pdfPath = await certificateService.previewTemplate(validatedParams.id, {
      eventName: validatedBody.eventName,
      issuedBy: validatedBody.issuedBy,
      date: validatedBody.issueDate,
    });

    const template = await certificateTemplateRepository.findById(validatedParams.id);

    return res.json({
      success: true,
      data: {
        pdfPath,
        downloadUrl: `/api/templates/${validatedParams.id}/preview/download`,
        template: template as any,
      },
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

    console.error('Error generating template preview:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate preview',
    });
  }
});

// DELETE /api/templates/:id - Delete a certificate template
router.delete('/:id', async (req: Request, res: Response<DeleteTemplateResponse>) => {
  try {
    const validatedParams = templateIdParamSchema.parse(req.params);
    
    if (isNaN(validatedParams.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID',
        message: 'Invalid template ID',
      });
    }

    const deleted = await certificateTemplateRepository.delete(validatedParams.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Template not found',
        message: 'Template not found',
      });
    }

    return res.json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete template',
      message: 'Failed to delete template',
    });
  }
});

export { router as certificateTemplateRoutes };
