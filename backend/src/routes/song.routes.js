import express from 'express';
import {
    getAllSongs,
    getSongById,
    createSong,
    updateSong,
    deleteSong,
    incrementPlayCount,
    searchSongs
} from '../controllers/song.controller.js';
import { protect, optionalAuth } from '../middleware/auth.js';
const router = express.Router();
router.get('/', getAllSongs);
router.get('/search', searchSongs);
router.get('/:id', getSongById);
router.post('/:id/play', incrementPlayCount);
router.post('/', protect, createSong);
router.put('/:id', protect, updateSong);
router.delete('/:id', protect, deleteSong);
export default router;
