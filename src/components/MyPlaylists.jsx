import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthContext } from '../context/AuthContext';
import { playlistAPI } from '../services/api';

const MyPlaylists = () => {
    const navigate = useNavigate();
    const { isAuthenticated, showMessage } = useContext(AuthContext);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            showMessage('Please login to view your playlists', 'error');
            navigate('/login');
            return;
        }
        fetchPlaylists();
    }, [isAuthenticated]);

    const fetchPlaylists = async () => {
        try {
            setLoading(true);
            const response = await playlistAPI.getAll();
            setPlaylists(response.data.playlists);
        } catch (error) {
            showMessage(error.response?.data?.message || 'Failed to load playlists', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlaylist = async (playlistId, playlistName) => {
        if (!window.confirm(`Are you sure you want to delete "${playlistName}"?`)) {
            return;
        }

        try {
            await playlistAPI.delete(playlistId);
            showMessage('Playlist deleted successfully', 'success');
            fetchPlaylists(); // Refresh the list
        } catch (error) {
            showMessage(error.response?.data?.message || 'Failed to delete playlist', 'error');
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className='flex items-center justify-center h-64'>
                    <div className='text-white text-xl'>Loading playlists...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className='mb-4 mt-6'>
                <h1 className='text-3xl font-bold mb-2'>My Playlists</h1>
                <p className='text-gray-400'>Your personal music collections</p>
            </div>

            {playlists.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-64 text-center'>
                    <div className='text-6xl mb-4'>🎵</div>
                    <h2 className='text-2xl font-bold mb-2'>No playlists yet</h2>
                    <p className='text-gray-400 mb-4'>Create your first playlist to get started</p>
                    <button
                        onClick={() => navigate('/')}
                        className='bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition'
                    >
                        Go to Home
                    </button>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {playlists.map((playlist) => (
                        <div
                            key={playlist._id}
                            className='bg-gray-900/50 rounded-lg p-4 hover:bg-gray-800/50 transition cursor-pointer group'
                        >
                            <div className='flex gap-4'>
                                {/* Playlist Cover */}
                                <div className='w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 text-4xl'>
                                    🎵
                                </div>

                                {/* Playlist Info */}
                                <div className='flex-1 min-w-0'>
                                    <h3 className='text-white font-bold text-lg mb-1 truncate'>
                                        {playlist.name}
                                    </h3>
                                    <p className='text-gray-400 text-sm mb-2 line-clamp-2'>
                                        {playlist.description || 'No description'}
                                    </p>
                                    <div className='flex items-center gap-2 text-sm'>
                                        <span className='text-purple-400'>
                                            {playlist.songs?.length || 0} songs
                                        </span>
                                        <span className='text-gray-500'>•</span>
                                        <span className='text-gray-500'>
                                            {playlist.isPublic ? 'Public' : 'Private'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex gap-2 mt-4'>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/playlist/${playlist._id}`);
                                    }}
                                    className='flex-1 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition text-sm'
                                >
                                    Open
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePlaylist(playlist._id, playlist.name);
                                    }}
                                    className='bg-red-600/20 text-red-400 py-2 px-4 rounded hover:bg-red-600/30 transition text-sm'
                                >
                                    Delete
                                </button>
                            </div>

                            {/* Created Date */}
                            <div className='mt-2 text-xs text-gray-500'>
                                Created {new Date(playlist.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats Summary */}
            {playlists.length > 0 && (
                <div className='mt-8 bg-purple-900/20 border border-purple-500/30 rounded-lg p-6'>
                    <h3 className='text-xl font-bold text-purple-400 mb-2'>📊 Your Stats</h3>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
                        <div>
                            <div className='text-3xl font-bold text-white'>{playlists.length}</div>
                            <div className='text-gray-400 text-sm'>Playlists</div>
                        </div>
                        <div>
                            <div className='text-3xl font-bold text-white'>
                                {playlists.reduce((sum, p) => sum + (p.songs?.length || 0), 0)}
                            </div>
                            <div className='text-gray-400 text-sm'>Total Songs</div>
                        </div>
                        <div>
                            <div className='text-3xl font-bold text-white'>
                                {playlists.filter(p => p.isPublic).length}
                            </div>
                            <div className='text-gray-400 text-sm'>Public</div>
                        </div>
                        <div>
                            <div className='text-3xl font-bold text-white'>
                                {playlists.filter(p => !p.isPublic).length}
                            </div>
                            <div className='text-gray-400 text-sm'>Private</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyPlaylists;
