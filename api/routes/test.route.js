// we can test everthing here and we can also test the database connection

import express from 'express';
import { shouldBeAdmin, shouldBeLoginedIn } from '../controllers/test.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/should-be-logined-in', verifyToken, shouldBeLoginedIn);

router.get('/should-be-admin', shouldBeAdmin);

export default router;