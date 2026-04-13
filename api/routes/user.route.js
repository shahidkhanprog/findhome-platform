import express from 'express';
import { deleteUser, getAllUsers, getUser, updateUser } from '../controllers/user.controller.js';
import { verifyAdmin, verifyToken, verifyTokenOrAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/',       verifyAdmin,         getAllUsers);    // admin only
router.get('/:id',    verifyTokenOrAdmin,  getUser);        // own profile or admin
router.put('/:id',    verifyTokenOrAdmin,  updateUser);     // own profile or admin
router.delete('/:id', verifyAdmin,         deleteUser);     // admin only

export default router;