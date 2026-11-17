import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const DUMMY_PATTERNS = [
    /^test@/i,
    /^dummy/i,
    /^fake/i,
    /^temp/i,
    /^sample/i,
    /@example\.com$/i,
    /@test\.com$/i,
    /@dummy\.com$/i,
    /@fake\.com$/i
];

export const isValidRealEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const clean = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(clean)) return false;

    for (const pattern of DUMMY_PATTERNS) {
        if (pattern.test(clean)) return false;
    }
    return true;
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

        const cleanEmail = email.trim().toLowerCase();
        if (!isValidRealEmail(cleanEmail)) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide a valid, real email address (e.g. yourname@gmail.com). Dummy or placeholder accounts are not allowed.'
            });
        }

        const userExists = await User.findOne({ $or: [{ email: cleanEmail }, { username: username.trim() }] });
        if (userExists) {
            return res.status(400).json({
                status: 'error',
                message: 'User with this email or username already exists'
            });
        }

        const user = await User.create({
            username: username.trim(),
            email: cleanEmail,
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

        const cleanEmail = email.trim().toLowerCase();
        if (!isValidRealEmail(cleanEmail)) {
            return res.status(400).json({
                status: 'error',
                message: 'Please enter a valid, real email address.'
            });
        }

        const user = await User.findOne({ email: cleanEmail }).select('+password');
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials. User not found with this email.'
            });
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials. Incorrect password.'
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

export const googleAuth = async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Gmail address is required.'
            });
        }
        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail.endsWith('@gmail.com') && !cleanEmail.endsWith('@googlemail.com')) {
            return res.status(400).json({
                status: 'error',
                message: 'Please use a valid Google account ending with @gmail.com'
            });
        }
        if (!isValidRealEmail(cleanEmail)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid Gmail address. Dummy accounts are blocked.'
            });
        }

        let user = await User.findOne({ email: cleanEmail });
        if (!user) {
            const randomPassword = 'G_' + Math.random().toString(36).substring(2, 15) + '!Flux2025';
            const baseName = name && name.trim() ? name.trim() : cleanEmail.split('@')[0];
            
            let finalUsername = baseName;
            const existing = await User.findOne({ username: finalUsername });
            if (existing) {
                finalUsername = `${baseName}_${Math.floor(100 + Math.random() * 900)}`;
            }

            user = await User.create({
                username: finalUsername,
                email: cleanEmail,
                password: randomPassword,
                profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(finalUsername)}&background=9333ea&color=fff`
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Signed in with Google account',
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
        console.error('Google auth error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

export const cleverAuth = async (req, res) => {
    try {
        const { email, name, school } = req.body;
        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Clever email or identifier is required.'
            });
        }
        const cleanEmail = email.trim().toLowerCase();
        if (!isValidRealEmail(cleanEmail) && !cleanEmail.endsWith('@clever.org') && !cleanEmail.includes('.edu')) {
            return res.status(400).json({
                status: 'error',
                message: 'Please enter a valid, real school or Clever account email. Dummy accounts are blocked.'
            });
        }

        let user = await User.findOne({ email: cleanEmail });
        if (!user) {
            const randomPassword = 'C_' + Math.random().toString(36).substring(2, 15) + '!Clever2025';
            const baseName = name && name.trim() ? name.trim() : cleanEmail.split('@')[0];
            let finalUsername = baseName;
            const existing = await User.findOne({ username: finalUsername });
            if (existing) {
                finalUsername = `${baseName}_${Math.floor(100 + Math.random() * 900)}`;
            }

            user = await User.create({
                username: finalUsername,
                email: cleanEmail,
                password: randomPassword,
                profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(finalUsername)}&background=1877F2&color=fff`
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Signed in with Clever account',
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
        console.error('Clever auth error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

export const officeAuth = async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Office 365 email is required.'
            });
        }
        const cleanEmail = email.trim().toLowerCase();
        if (!isValidRealEmail(cleanEmail)) {
            return res.status(400).json({
                status: 'error',
                message: 'Please enter a valid, real Microsoft/Office 365 email address. Dummy accounts are blocked.'
            });
        }

        let user = await User.findOne({ email: cleanEmail });
        if (!user) {
            const randomPassword = 'O_' + Math.random().toString(36).substring(2, 15) + '!Office365';
            const baseName = name && name.trim() ? name.trim() : cleanEmail.split('@')[0];
            let finalUsername = baseName;
            const existing = await User.findOne({ username: finalUsername });
            if (existing) {
                finalUsername = `${baseName}_${Math.floor(100 + Math.random() * 900)}`;
            }

            user = await User.create({
                username: finalUsername,
                email: cleanEmail,
                password: randomPassword,
                profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(finalUsername)}&background=D83B01&color=fff`
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Signed in with Office 365 account',
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
        console.error('Office 365 auth error:', error.message);
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
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        if (username) user.username = username.trim();
        if (profileImage) user.profileImage = profileImage;
        await user.save();
        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage
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
