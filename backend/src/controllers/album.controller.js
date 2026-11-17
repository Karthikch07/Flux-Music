import Album from '../models/Album.js';

export const getAllAlbums = async (req, res) => {
    try {
        const albums = await Album.find().populate('songs').sort({ id: 1 });
        res.status(200).json({
            status: 'success',
            results: albums.length,
            data: {
                albums
            }
        });
    } catch (error) {
        console.error('Get all albums error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

export const getAlbumById = async (req, res) => {
    try {
        const param = req.params.id;
        const query = isNaN(param) ? { _id: param } : { id: Number(param) };
        const album = await Album.findOne(query).populate('songs');
        if (!album) {
            return res.status(404).json({
                status: 'error',
                message: 'Album not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                album
            }
        });
    } catch (error) {
        console.error('Get album error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

export const createAlbum = async (req, res) => {
    try {
        const { id, name, image, desc, bgColor, songs } = req.body;
        if (id === undefined || !name || !image) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide id, name, and image for the album'
            });
        }
        const existing = await Album.findOne({ $or: [{ id }, { name }] });
        if (existing) {
            return res.status(409).json({
                status: 'error',
                message: 'Album with this ID or name already exists'
            });
        }
        const album = await Album.create({ id, name, image, desc, bgColor, songs });
        res.status(201).json({
            status: 'success',
            data: {
                album
            }
        });
    } catch (error) {
        console.error('Create album error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

