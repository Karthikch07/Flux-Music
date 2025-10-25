import express from 'express';
import { toggleLikeSong, getLikedSongs } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
router.use(protect);
router.post('/like/:songId', toggleLikeSong);
router.get('/liked-songs', getLikedSongs);
export default router;
