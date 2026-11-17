import Song from '../models/Song.js';
import Playlist from '../models/Playlist.js';

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

        const trimmedName = name.trim();
        const trimmedArtist = artist ? artist.trim() : 'Flux Artist';

        // Check if a song with identical name and artist already exists
        const duplicate = await Song.findOne({
            name: { $regex: new RegExp(`^${trimmedName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') },
            artist: { $regex: new RegExp(`^${trimmedArtist.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') }
        });

        if (duplicate) {
            return res.status(409).json({
                status: 'error',
                message: `Duplicate detected: "${trimmedName}" by "${trimmedArtist}" already exists in the library!`,
                existingSong: duplicate
            });
        }

        const song = await Song.create({
            name: trimmedName,
            desc: desc ? desc.trim() : '',
            album: album ? album.trim() : 'Trending Global',
            artist: trimmedArtist,
            image,
            file,
            duration,
            uploadedBy: req.user ? req.user._id : null
        });

        res.status(201).json({
            status: 'success',
            message: 'Song added successfully',
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
        const { name, desc, album, artist, image, duration } = req.body;
        if (name) song.name = name.trim();
        if (desc !== undefined) song.desc = desc;
        if (album) song.album = album.trim();
        if (artist) song.artist = artist.trim();
        if (image) song.image = image;
        if (duration) song.duration = duration;

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
        await Playlist.updateMany(
            { songs: song._id },
            { $pull: { songs: song._id } }
        );
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

export const removeDuplicates = async (req, res) => {
    try {
        const songs = await Song.find().sort({ createdAt: 1 });
        const seenMap = new Map();
        const duplicateIds = [];
        const removedSongsDetails = [];

        for (const song of songs) {
            const normalizedKey = `${song.name.trim().toLowerCase()}:::${(song.artist || '').trim().toLowerCase()}`;
            if (seenMap.has(normalizedKey)) {
                duplicateIds.push(song._id);
                removedSongsDetails.push({
                    id: song._id,
                    name: song.name,
                    artist: song.artist,
                    originalId: seenMap.get(normalizedKey)
                });
            } else {
                seenMap.set(normalizedKey, song._id);
            }
        }

        if (duplicateIds.length > 0) {
            await Song.deleteMany({ _id: { $in: duplicateIds } });
            await Playlist.updateMany(
                { songs: { $in: duplicateIds } },
                { $pull: { songs: { $in: duplicateIds } } }
            );
        }

        const remainingCount = await Song.countDocuments();

        res.status(200).json({
            status: 'success',
            message: duplicateIds.length > 0 
                ? `Cleaned up ${duplicateIds.length} duplicate song(s).` 
                : 'All songs are unique. No duplicates found!',
            duplicatesRemoved: duplicateIds.length,
            details: removedSongsDetails,
            totalRemainingSongs: remainingCount
        });
    } catch (error) {
        console.error('Remove duplicates error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
