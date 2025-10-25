import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide all required fields'
            });
        }
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({
                status: 'error',
                message: 'User with this email or username already exists'
            });
        }
        const user = await User.create({
            username,
            email,
            password
        });
        res.status(201).json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    isPremium: user.isPremium,
                    profileImage: user.profileImage
                },
                token: generateToken(user._id)
            }
        });
    } catch (error) {
        console.error('Register error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password'
            });
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    isPremium: user.isPremium,
                    profileImage: user.profileImage
                },
                token: generateToken(user._id)
            }
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('playlists')
            .populate('likedSongs');
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        console.error('Get profile error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const { username, profileImage } = req.body;
        const user = await User.findById(req.user._id);
        if (username) user.username = username;
        if (profileImage) user.profileImage = profileImage;
        const updatedUser = await user.save();
        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    isPremium: updatedUser.isPremium,
                    profileImage: updatedUser.profileImage
                }
            }
        });
    } catch (error) {
        console.error('Update profile error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
