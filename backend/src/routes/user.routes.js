import express from 'express';
import { toggleLikeSong, getLikedSongs } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All user routes are protected
router.use(protect);

router.post('/like/:songId', toggleLikeSong);
router.get('/liked-songs', getLikedSongs);

export default router;
