import express from 'express';
import { getAllAlbums, getAlbumById, createAlbum } from '../controllers/album.controller.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllAlbums);
router.get('/:id', getAlbumById);
router.post('/', optionalAuth, createAlbum);

export default router;

