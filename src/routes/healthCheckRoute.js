import { Router } from 'express';

import * as hcController from '../controllers/healthCheckController';



const router = Router();

/**
 * GET /health
 */
router.get('/', hcController.get);



export default router;