import express from 'express';
import {
    getPlaylists,
    getPlaylistById,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist
} from '../controllers/playlist.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All playlist routes are protected
router.use(protect);

router.route('/')
    .get(getPlaylists)
    .post(createPlaylist);

router.route('/:id')
    .get(getPlaylistById)
    .put(updatePlaylist)
    .delete(deletePlaylist);

router.post('/:id/songs', addSongToPlaylist);
router.delete('/:id/songs/:songId', removeSongFromPlaylist);

export default router;
