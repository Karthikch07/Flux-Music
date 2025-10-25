import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide all required fields'
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            return res.status(400).json({
                status: 'error',
                message: 'User with this email or username already exists'
            });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password
        });

        // Return user data with token
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

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password'
            });
        }

        // Find user (include password field)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Return user data with token
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

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
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

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
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
