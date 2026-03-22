import { Router, Response } from 'express';
import { studentRoutes } from './student.routes.js';
import { certificateRoutes } from './certificate.routes.js';
import { certificateTemplateRoutes } from './certificate-template.routes.js';
import { emailTemplateRoutes } from './email-template.routes.js';
import { authRoutes } from './auth.routes.js';
import { emailLogRepository } from '../repository/email-log.repository.js';
import { certificateRepository } from '../repository/certificate.repository.js';
import { studentRepository } from '../repository/student.repository.js';
import { certificateTemplateRepository } from '../repository/certificate-template.repository.js';
import { emailTemplateRepository } from '../repository/email-template.repository.js';

const router = Router();

// Mount routes
router.use('/students', studentRoutes);
router.use('/certificates', certificateRoutes);
router.use('/certificate-templates', certificateTemplateRoutes);
router.use('/templates', emailTemplateRoutes);
router.use(authRoutes);

// GET /api/stats - Get dashboard statistics
router.get('/stats', async (_req: unknown, res: Response) => {
  try {
    const [
      totalStudents,
      totalEmailTemplates,
      totalCertificateTemplates,
      activeCertificateTemplates,
      pendingCerts,
      generatedCerts,
      sentCerts,
      failedCerts,
      sentEmails,
      failedEmails,
    ] = await Promise.all([
      studentRepository.count(),
      emailTemplateRepository.count(),
      certificateTemplateRepository.count(),
      certificateTemplateRepository.countActive(),
      certificateRepository.countByStatus('pending'),
      certificateRepository.countByStatus('generated'),
      certificateRepository.countByStatus('sent'),
      certificateRepository.countByStatus('failed'),
      emailLogRepository.countByStatus('sent'),
      emailLogRepository.countByStatus('failed'),
    ]);

    return res.json({
      success: true,
      data: {
        students: { total: totalStudents },
        templates: {
          total: totalEmailTemplates + totalCertificateTemplates,
          email: totalEmailTemplates,
          certificate: totalCertificateTemplates,
          activeCertificates: activeCertificateTemplates,
        },
        certificates: {
          pending: pendingCerts,
          generated: generatedCerts,
          sent: sentCerts,
          failed: failedCerts,
        },
        emails: {
          sent: sentEmails,
          failed: failedEmails,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
    });
  }
});

// Health check endpoint
router.get('/health', (_req: unknown, res: Response) => {
  return res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  });
});

export { router as apiRoutes };
