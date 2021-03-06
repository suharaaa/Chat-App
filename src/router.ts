import Controller from './controller';
import { Router } from 'express';
import { auth } from './middleware';

const router = Router();

router.post('/login', Controller.login);
router.get('/sessions/:id', auth, Controller.getSession);
router.post('/sessions', auth, Controller.createSession);
router.get('/sessions/state/:sessionState', auth, Controller.getSessionsByState);
router.put('/sessions/:id', auth, Controller.endSession);
router.get('/sessions/:id/messages', auth, Controller.getAllMessages);
router.put('/sessions/:id/strokes', auth, Controller.addStrokesAsBatch);

export default router;
