import Controller from './controller';
import { Router } from 'express';
import { auth } from './middleware';

const router = Router();

router.post('/login', Controller.login);
router.get('/sessions/:id', auth, Controller.getSession);
router.post('/sessions', auth, Controller.createSession);

export default router;
