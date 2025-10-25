import User from '../models/User.js';
export const toggleLikeSong = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { songId } = req.params;
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        const isSongLiked = user.likedSongs.includes(songId);
        if (isSongLiked) {
            user.likedSongs = user.likedSongs.filter(
                id => id.toString() !== songId
            );
        } else {
            user.likedSongs.push(songId);
        }
        await user.save();
        res.status(200).json({
            status: 'success',
            data: {
                isLiked: !isSongLiked,
                likedSongs: user.likedSongs
            }
        });
    } catch (error) {
        console.error('Toggle like song error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
export const getLikedSongs = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('likedSongs');
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        res.status(200).json({
            status: 'success',
            results: user.likedSongs.length,
            data: {
                songs: user.likedSongs
            }
        });
    } catch (error) {
        console.error('Get liked songs error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
