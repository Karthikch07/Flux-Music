import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import playlistRoutes from './routes/playlist.routes.js';
import songRoutes from './routes/song.routes.js';
import userRoutes from './routes/user.routes.js';
dotenv.config();
const app = express();
connectDB();
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (origin.startsWith('http:
            return callback(null, true);
        }
        if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/users', userRoutes);
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'success', 
        message: 'Flux Music API is running!',
        timestamp: new Date().toISOString()
    });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Ã°Å¸Å½Âµ Flux Music API server running on port ${PORT}`);
    console.log(`Ã°Å¸Å’Â Environment: ${process.env.NODE_ENV}`);
    console.log(`Ã°Å¸â€œÂ¡ Health check: http:
});
export default app;
