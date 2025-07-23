import express from 'express';
import { getLogs, getLogById, getLogStats } from '../controllers/logController.js';

const router = express.Router();

router.get('/', getLogs);
router.get('/stats', getLogStats);
router.get('/:id', getLogById);

export default router;
