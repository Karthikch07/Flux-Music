import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthContext } from '../context/AuthContext';
import { PlayerContext } from '../context/PlayerContext';
import { playlistAPI } from '../services/api';
import { assets } from '../assets/assets';
import { Play, Pause } from 'lucide-react';

const DisplayPlaylist = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, showMessage } = useContext(AuthContext);
    const { playSongObject, songs, track, playStatus, pause, play } = useContext(PlayerContext);

    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddSong, setShowAddSong] = useState(false);
    const [selectedSongId, setSelectedSongId] = useState('');

    const fetchPlaylist = async () => {
        try {
            setLoading(true);
            const res = await playlistAPI.getById(id);
            setPlaylist(res.data.playlist);
        } catch (error) {
            console.error('Fetch playlist error:', error);
            showMessage(error.response?.data?.message || 'Failed to load playlist', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            showMessage('Please login to view this playlist', 'info');
            navigate('/login');
            return;
        }
        fetchPlaylist();
    }, [id, isAuthenticated]);

    const handleAddSong = async (e) => {
        e.preventDefault();
        if (!selectedSongId) return;

        try {
            await playlistAPI.addSong(id, selectedSongId);
            showMessage('Song added to playlist!', 'success');
            setShowAddSong(false);
            setSelectedSongId('');
            fetchPlaylist();
        } catch (error) {
            showMessage(error.response?.data?.message || 'Failed to add song to playlist', 'error');
        }
    };

    const handleRemoveSong = async (songId, songName) => {
        try {
            await playlistAPI.removeSong(id, songId);
            showMessage(`Removed "${songName}" from playlist`, 'info');
            fetchPlaylist();
        } catch (error) {
            showMessage(error.response?.data?.message || 'Failed to remove song', 'error');
        }
    };

    const handleRemoveDuplicates = async () => {
        try {
            const res = await playlistAPI.removeDuplicates(id);
            showMessage(res.message, res.duplicatesRemoved > 0 ? 'success' : 'info');
            fetchPlaylist();
        } catch (error) {
            showMessage(error.response?.data?.message || 'Failed to deduplicate playlist', 'error');
        }
    };

    const handlePlayAll = () => {
        if (playlist?.songs && playlist.songs.length > 0) {
            playSongObject(playlist.songs[0]);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className='flex items-center justify-center h-64 text-white text-lg'>
                    Loading playlist...
                </div>
            </>
        );
    }

    if (!playlist) {
        return (
            <>
                <Navbar />
                <div className='flex flex-col items-center justify-center h-64 text-center text-white'>
                    <h2 className='text-2xl font-bold mb-2'>Playlist Not Found</h2>
                    <p className='text-gray-400 mb-4'>This playlist may have been deleted.</p>
                    <button
                        onClick={() => navigate('/playlists')}
                        className='bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700'
                    >
                        Back to Playlists
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            {/* Playlist Header */}
            <div className='mt-8 flex gap-6 flex-col md:flex-row md:items-end'>
                <div className='w-48 h-48 bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 rounded-lg flex items-center justify-center text-6xl shadow-2xl flex-shrink-0'>
                    🎵
                </div>
                <div className='flex flex-col'>
                    <p className='text-xs font-bold uppercase tracking-wider text-purple-400'>
                        {playlist.isPublic ? 'Public Playlist' : 'Private Playlist'}
                    </p>
                    <h2 className='text-3xl font-bold my-2 md:text-5xl text-white'>{playlist.name}</h2>
                    <h4 className='text-gray-300 text-sm'>{playlist.description || 'No description provided'}</h4>
                    <p className='mt-2 flex items-center gap-2 text-sm text-gray-400'>
                        <span>By {playlist.user?.username || 'You'}</span>
                        <span>•</span>
                        <span>{playlist.songs?.length || 0} songs</span>
                    </p>

                    <div className='flex flex-wrap items-center gap-3 mt-4'>
                        {playlist.songs?.length > 0 && (
                            <button
                                onClick={handlePlayAll}
                                className='bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2.5 rounded-full text-sm flex items-center gap-2 transition hover:scale-105 shadow-lg shadow-purple-900/30'
                            >
                                <Play className='w-4 h-4 fill-white text-white ml-0.5' />
                                <span>Play All</span>
                            </button>
                        )}
                        <button
                            onClick={() => setShowAddSong(true)}
                            className='bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-medium px-4 py-2 rounded-full text-sm flex items-center gap-2 transition hover:scale-105'
                        >
                            <span>➕</span> Add Song
                        </button>
                        <button
                            onClick={handleRemoveDuplicates}
                            className='bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-medium px-4 py-2 rounded-full text-sm flex items-center gap-2 transition hover:scale-105'
                            title='Remove any duplicate songs in this playlist'
                        >
                            <span>🧹</span> Clean Duplicates
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal to add a song to this playlist */}
            {showAddSong && (
                <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4'>
                    <div className='bg-gray-900 p-6 rounded-xl w-full max-w-md border border-gray-700'>
                        <h3 className='text-xl font-bold text-white mb-4'>Add Song to "{playlist.name}"</h3>
                        <form onSubmit={handleAddSong}>
                            <label className='block text-gray-300 text-sm mb-2'>Choose a track from your library</label>
                            <select
                                required
                                value={selectedSongId}
                                onChange={(e) => setSelectedSongId(e.target.value)}
                                className='w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 mb-4 focus:outline-none focus:border-purple-500'
                            >
                                <option value=''>-- Select a song --</option>
                                {songs.map((s) => (
                                    <option key={s._id || s.id} value={s._id || s.id}>
                                        {s.name} - {s.artist}
                                    </option>
                                ))}
                            </select>
                            <div className='flex gap-2'>
                                <button
                                    type='submit'
                                    className='flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-medium transition'
                                >
                                    Add Track
                                </button>
                                <button
                                    type='button'
                                    onClick={() => setShowAddSong(false)}
                                    className='flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded font-medium transition'
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Song Table */}
            <div className='grid grid-cols-3 sm:grid-cols-4 mt-8 mb-4 pl-2 text-[#a7a7a7] text-sm'>
                <p><b className='mr-4'>#</b>Title</p>
                <p>Artist</p>
                <p className='hidden sm:block'>Duration</p>
                <p className='text-center'>Actions</p>
            </div>
            <hr className='border-gray-800 mb-2' />

            {(!playlist.songs || playlist.songs.length === 0) ? (
                <div className='text-center py-12 text-gray-400'>
                    <p className='text-lg'>This playlist is currently empty.</p>
                    <p className='text-sm mt-1'>Click "Add Song" above to start curating your mix!</p>
                </div>
            ) : (
                playlist.songs.map((item, index) => {
                    const isCurrentSong = track && (track.id === item.id || track._id === item._id || track.name === item.name);
                    const isPlayingThis = isCurrentSong && playStatus;

                    return (
                        <div
                            key={item._id || index}
                            className={`grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff15] rounded-lg cursor-pointer transition group ${
                                isCurrentSong ? 'bg-purple-950/20 text-purple-300' : ''
                            }`}
                        >
                            <div 
                                onClick={() => {
                                    if (isPlayingThis) {
                                        pause();
                                    } else if (isCurrentSong) {
                                        play();
                                    } else {
                                        playSongObject(item);
                                    }
                                }}
                                className='text-white flex items-center min-w-0 pr-2 truncate'
                            >
                                <div className='mr-4 w-5 text-center flex items-center justify-center flex-shrink-0'>
                                    {isPlayingThis ? (
                                        <Pause className='w-4 h-4 text-purple-400 fill-purple-400' />
                                    ) : (
                                        <>
                                            <span className='group-hover:hidden text-[#a7a7a7] font-bold text-xs'>{index + 1}</span>
                                            <Play className='w-3.5 h-3.5 text-white fill-white hidden group-hover:block ml-0.5' />
                                        </>
                                    )}
                                </div>
                                <span className={`font-medium truncate ${isCurrentSong ? 'text-purple-400 font-bold' : ''}`}>
                                    {item.name}
                                </span>
                            </div>
                            <p 
                                onClick={() => playSongObject(item)}
                                className='text-[14px] truncate'
                            >
                                {item.artist || 'Unknown'}
                            </p>
                            <p 
                                onClick={() => playSongObject(item)}
                                className='text-[14px] hidden sm:block font-mono'
                            >
                                {item.duration || '3:00'}
                            </p>
                            <div className='flex justify-center'>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveSong(item._id, item.name);
                                    }}
                                    className='text-xs text-red-400 hover:text-red-300 bg-red-950/40 border border-red-800/50 px-2 py-1 rounded transition opacity-0 group-hover:opacity-100'
                                    title='Remove from playlist'
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </>
    );
};

export default DisplayPlaylist;

