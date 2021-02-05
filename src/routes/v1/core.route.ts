import { Router } from 'express';
import { CoreController } from '../../controllers/v1';

const router = Router();
const coreController = new CoreController();

// all routes belong to core controllers

export default router;
