import Playlist from '../models/Playlist.js';
import User from '../models/User.js';

// @desc    Get all playlists for current user
// @route   GET /api/playlists
// @access  Private
export const getPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ user: req.user._id })
            .populate('songs')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: playlists.length,
            data: {
                playlists
            }
        });
    } catch (error) {
        console.error('Get playlists error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get single playlist by ID
// @route   GET /api/playlists/:id
// @access  Private
export const getPlaylistById = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id)
            .populate('songs')
            .populate('user', 'username profileImage');

        if (!playlist) {
            return res.status(404).json({
                status: 'error',
                message: 'Playlist not found'
            });
        }

        // Check if user has access
        if (!playlist.isPublic && playlist.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have access to this playlist'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                playlist
            }
        });
    } catch (error) {
        console.error('Get playlist error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Create new playlist
// @route   POST /api/playlists
// @access  Private
export const createPlaylist = async (req, res) => {
    try {
        const { name, description, coverImage, isPublic } = req.body;

        if (!name) {
            return res.status(400).json({
                status: 'error',
                message: 'Playlist name is required'
            });
        }

        const playlist = await Playlist.create({
            name,
            description,
            coverImage,
            isPublic: isPublic !== undefined ? isPublic : true,
            user: req.user._id
        });

        // Add playlist to user's playlists array
        await User.findByIdAndUpdate(req.user._id, {
            $push: { playlists: playlist._id }
        });

        res.status(201).json({
            status: 'success',
            data: {
                playlist
            }
        });
    } catch (error) {
        console.error('Create playlist error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Update playlist
// @route   PUT /api/playlists/:id
// @access  Private
export const updatePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) {
            return res.status(404).json({
                status: 'error',
                message: 'Playlist not found'
            });
        }

        // Check if user owns the playlist
        if (playlist.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'error',
                message: 'You can only update your own playlists'
            });
        }

        const { name, description, coverImage, isPublic } = req.body;

        if (name) playlist.name = name;
        if (description !== undefined) playlist.description = description;
        if (coverImage) playlist.coverImage = coverImage;
        if (isPublic !== undefined) playlist.isPublic = isPublic;

        const updatedPlaylist = await playlist.save();

        res.status(200).json({
            status: 'success',
            data: {
                playlist: updatedPlaylist
            }
        });
    } catch (error) {
        console.error('Update playlist error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Delete playlist
// @route   DELETE /api/playlists/:id
// @access  Private
export const deletePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) {
            return res.status(404).json({
                status: 'error',
                message: 'Playlist not found'
            });
        }

        // Check if user owns the playlist
        if (playlist.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'error',
                message: 'You can only delete your own playlists'
            });
        }

        await playlist.deleteOne();

        // Remove playlist from user's playlists array
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { playlists: playlist._id }
        });

        res.status(200).json({
            status: 'success',
            message: 'Playlist deleted successfully'
        });
    } catch (error) {
        console.error('Delete playlist error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Add song to playlist
// @route   POST /api/playlists/:id/songs
// @access  Private
export const addSongToPlaylist = async (req, res) => {
    try {
        const { songId } = req.body;

        if (!songId) {
            return res.status(400).json({
                status: 'error',
                message: 'Song ID is required'
            });
        }

        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) {
            return res.status(404).json({
                status: 'error',
                message: 'Playlist not found'
            });
        }

        // Check if user owns the playlist
        if (playlist.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'error',
                message: 'You can only add songs to your own playlists'
            });
        }

        // Check if song already in playlist
        if (playlist.songs.includes(songId)) {
            return res.status(400).json({
                status: 'error',
                message: 'Song already in playlist'
            });
        }

        playlist.songs.push(songId);
        await playlist.save();

        const updatedPlaylist = await Playlist.findById(playlist._id).populate('songs');

        res.status(200).json({
            status: 'success',
            data: {
                playlist: updatedPlaylist
            }
        });
    } catch (error) {
        console.error('Add song to playlist error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Remove song from playlist
// @route   DELETE /api/playlists/:id/songs/:songId
// @access  Private
export const removeSongFromPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) {
            return res.status(404).json({
                status: 'error',
                message: 'Playlist not found'
            });
        }

        // Check if user owns the playlist
        if (playlist.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'error',
                message: 'You can only remove songs from your own playlists'
            });
        }

        playlist.songs = playlist.songs.filter(
            song => song.toString() !== req.params.songId
        );

        await playlist.save();

        const updatedPlaylist = await Playlist.findById(playlist._id).populate('songs');

        res.status(200).json({
            status: 'success',
            data: {
                playlist: updatedPlaylist
            }
        });
    } catch (error) {
        console.error('Remove song from playlist error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
