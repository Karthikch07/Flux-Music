import Song from '../models/Song.js';
export const getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: 'success',
            results: songs.length,
            data: {
                songs
            }
        });
    } catch (error) {
        console.error('Get all songs error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
export const getSongById = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).json({
                status: 'error',
                message: 'Song not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                song
            }
        });
    } catch (error) {
        console.error('Get song error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
export const createSong = async (req, res) => {
    try {
        const { name, desc, album, artist, image, file, duration } = req.body;
        if (!name || !image || !file || !duration) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide all required fields: name, image, file, duration'
            });
        }
        const song = await Song.create({
            name,
            desc,
            album,
            artist,
            image,
            file,
            duration,
            uploadedBy: req.user._id
        });
        res.status(201).json({
            status: 'success',
            data: {
                song
            }
        });
    } catch (error) {
        console.error('Create song error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
export const updateSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).json({
                status: 'error',
                message: 'Song not found'
            });
        }
        const { name, desc, album, artist, image } = req.body;
        if (name) song.name = name;
        if (desc !== undefined) song.desc = desc;
        if (album) song.album = album;
        if (artist) song.artist = artist;
        if (image) song.image = image;
        const updatedSong = await song.save();
        res.status(200).json({
            status: 'success',
            data: {
                song: updatedSong
            }
        });
    } catch (error) {
        console.error('Update song error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
export const deleteSong = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).json({
                status: 'error',
                message: 'Song not found'
            });
        }
        await song.deleteOne();
        res.status(200).json({
            status: 'success',
            message: 'Song deleted successfully'
        });
    } catch (error) {
        console.error('Delete song error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
export const incrementPlayCount = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).json({
                status: 'error',
                message: 'Song not found'
            });
        }
        await song.incrementPlays();
        res.status(200).json({
            status: 'success',
            data: {
                plays: song.plays
            }
        });
    } catch (error) {
        console.error('Increment play count error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
export const searchSongs = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                status: 'error',
                message: 'Search query is required'
            });
        }
        const songs = await Song.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { artist: { $regex: q, $options: 'i' } },
                { album: { $regex: q, $options: 'i' } },
                { desc: { $regex: q, $options: 'i' } }
            ]
        }).sort({ plays: -1 });
        res.status(200).json({
            status: 'success',
            results: songs.length,
            data: {
                songs
            }
        });
    } catch (error) {
        console.error('Search songs error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
