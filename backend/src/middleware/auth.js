import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authorized. Please login to access this resource.'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'User not found'
            });
        }
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token or token expired'
        });
    }
};
export const optionalAuth = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        }
        next();
    } catch (error) {
        next();
    }
};
