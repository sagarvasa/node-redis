import { Router } from 'express';
import { PingController } from '../../controllers/v1';

const router = Router();
const pingController = new PingController();

router.get('/', pingController.ping);

export default router;
