import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { emailTemplateRepository } from '../repository/email-template.repository.js';
import {
  createEmailTemplateSchema,
  updateEmailTemplateSchema,
  emailTemplateListQuerySchema,
  emailTemplateIdParamSchema,
} from '../validation/index.js';
import type { EmailTemplate } from '../types/index.js';
import type { ValidationError } from '../types/index.js';

const router = Router();

// GET /api/templates - Get all email templates
router.get('/', async (req: Request, res: Response) => {
  try {
    const validatedQuery = emailTemplateListQuerySchema.parse(req.query);

    const templates = await emailTemplateRepository.findAll({
      search: validatedQuery.search,
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

// GET /api/templates/:id - Get template by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const validatedParams = emailTemplateIdParamSchema.parse(req.params);

    if (isNaN(validatedParams.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID',
      });
    }

    const template = await emailTemplateRepository.findById(validatedParams.id);

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

// POST /api/templates - Create a new email template
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createEmailTemplateSchema.parse(req.body);

    const template = await emailTemplateRepository.create(validatedData);

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

// PUT /api/templates/:id - Update an email template
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const validatedParams = emailTemplateIdParamSchema.parse(req.params);

    if (isNaN(validatedParams.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID',
      });
    }

    const validatedData = updateEmailTemplateSchema.parse(req.body);

    const template = await emailTemplateRepository.update(validatedParams.id, validatedData);

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

// DELETE /api/templates/:id - Delete an email template
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const validatedParams = emailTemplateIdParamSchema.parse(req.params);

    if (isNaN(validatedParams.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID',
      });
    }

    const deleted = await emailTemplateRepository.delete(validatedParams.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Template not found',
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
    });
  }
});

export { router as emailTemplateRoutes };
