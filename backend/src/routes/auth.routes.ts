import { Router, Request, Response } from 'express';
import { auth } from '../services/auth.service.js';
import type { SessionResponse } from '../dto/auth.dto.js';

const router = Router();

// Mount Better-Auth endpoints
// These handle sign up, sign in, session management, etc.
router.use('/auth', auth.handler);

// GET /api/session - Get current session
router.get('/session', async (req: Request, res: Response<SessionResponse>) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as Record<string, string>,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    return res.json({
      success: true,
      data: {
        session: session.session as any,
        user: session.user as any,
      },
    });
  } catch (error) {
    console.error('Error getting session:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get session',
    });
  }
});

export { router as authRoutes };
