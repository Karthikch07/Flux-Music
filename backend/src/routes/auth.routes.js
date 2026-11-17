import express from 'express';
import { register, login, googleAuth, cleverAuth, officeAuth, getProfile, updateProfile } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/clever', cleverAuth);
router.post('/office365', officeAuth);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
