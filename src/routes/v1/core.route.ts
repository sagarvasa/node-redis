import { Router } from 'express';
import { CoreController } from '../../controllers/v1';

const router = Router();
const coreController = new CoreController();

// all routes belong to core controllers

router.post('/otp/generate', coreController.generateOTP);
router.post('/otp/verify', coreController.verifyOTP);

export default router;
