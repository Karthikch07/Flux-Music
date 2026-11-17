import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PlayerContext } from '../context/PlayerContext';
import { playlistAPI } from '../services/api';
import AddSongModal from './AddSongModal';
import { Radio, Crown } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, showMessage } = useContext(AuthContext);
    const { removeDuplicates } = useContext(PlayerContext);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAddSongModal, setShowAddSongModal] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const [playlistDesc, setPlaylistDesc] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreatePlaylist = async () => {
        if (!isAuthenticated) {
            showMessage('Please login to create playlists', 'error');
            navigate('/login');
            return;
        }
        setShowCreateModal(true);
    };

    const handleSubmitPlaylist = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            await playlistAPI.create(playlistName, playlistDesc, '', true);
            showMessage('Playlist created successfully!', 'success');
            setShowCreateModal(false);
            setPlaylistName('');
            setPlaylistDesc('');
            navigate('/playlists');
        } catch (error) {
            console.error('Playlist creation error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to create playlist. Please make sure you are logged in.';
            showMessage(errorMsg, 'error');
        } finally {
            setIsCreating(false);
        }
    };

    const handleBrowsePodcasts = () => {
        navigate('/podcasts');
    };

    const handleExpandLibrary = () => {
        if (isAuthenticated) {
            navigate('/playlists');
        } else {
            showMessage('Please login to view your library', 'info');
            navigate('/login');
        }
    };

    const handleQuickDedupe = async () => {
        const res = await removeDuplicates();
        if (res.success) {
            showMessage(res.message, res.duplicatesRemoved > 0 ? 'success' : 'info');
        } else {
            showMessage(res.error || 'Deduplication failed', 'error');
        }
    };

    return (
        <>
        {/* Create Playlist Modal */}
        {showCreateModal && (
            <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4'>
                <div className='bg-gray-900 p-6 rounded-lg w-full max-w-md border border-gray-700 shadow-2xl'>
                    <h2 className='text-2xl font-bold text-white mb-4 flex items-center gap-2'>
                        <span>📂</span> Create Playlist
                    </h2>
                    <form onSubmit={handleSubmitPlaylist}>
                        <div className='mb-4'>
                            <label className='block text-gray-300 mb-2 text-sm'>Playlist Name *</label>
                            <input
                                type='text'
                                required
                                value={playlistName}
                                onChange={(e) => setPlaylistName(e.target.value)}
                                className='w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-purple-500'
                                placeholder='e.g. Midnight Beats'
                            />
                        </div>
                        <div className='mb-4'>
                            <label className='block text-gray-300 mb-2 text-sm'>Description (optional)</label>
                            <textarea
                                value={playlistDesc}
                                onChange={(e) => setPlaylistDesc(e.target.value)}
                                className='w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-purple-500'
                                placeholder='Add a short description...'
                                rows='3'
                            />
                        </div>
                        <div className='flex gap-2'>
                            <button
                                type='submit'
                                disabled={isCreating}
                                className='flex-1 bg-purple-600 text-white py-2 rounded font-medium hover:bg-purple-700 transition disabled:opacity-50'
                            >
                                {isCreating ? 'Creating...' : 'Create'}
                            </button>
                            <button
                                type='button'
                                onClick={() => setShowCreateModal(false)}
                                className='flex-1 bg-gray-700 text-white py-2 rounded font-medium hover:bg-gray-600 transition'
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Add Song Modal */}
        <AddSongModal
            isOpen={showAddSongModal}
            onClose={() => setShowAddSongModal(false)}
        />

        <div className='w-[25%] h-full p-2 flex flex-col gap-2 text-white hidden lg:flex'>
            <div className='bg-[#121212] rounded-xl flex flex-col p-2 gap-1'>
                <div 
                    onClick={() => navigate('/')} 
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition ${
                        location.pathname === '/' ? 'bg-[#222222] text-purple-400 font-bold' : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a]'
                    }`}
                >
                    <img className='w-5' src={assets.home_icon} alt="Home" />
                    <p className='font-bold text-sm'>Home</p>
                </div>
                <div 
                    onClick={() => navigate('/search')} 
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition ${
                        location.pathname === '/search' ? 'bg-[#222222] text-purple-400 font-bold' : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a]'
                    }`}
                >
                    <img className='w-5' src={assets.search_icon} alt="Search" />
                    <p className='font-bold text-sm'>Search</p>
                </div>
                <div 
                    onClick={() => navigate('/podcasts')} 
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition ${
                        location.pathname === '/podcasts' ? 'bg-[#222222] text-purple-400 font-bold' : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a]'
                    }`}
                >
                    <Radio className='w-5 h-5 text-purple-400' />
                    <p className='font-bold text-sm'>Browse Podcasts</p>
                </div>
                <div 
                    onClick={() => navigate('/premium')} 
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition ${
                        location.pathname === '/premium' 
                            ? 'bg-gradient-to-r from-amber-500/20 to-purple-600/20 text-amber-300 font-bold border border-amber-500/30' 
                            : 'text-gray-300 hover:text-white hover:bg-[#1a1a1a]'
                    }`}
                >
                    <Crown className='w-5 h-5 text-amber-400' />
                    <div className='flex items-center gap-2'>
                        <p className='font-bold text-sm'>Explore Premium</p>
                        <span className='px-1.5 py-0.2 rounded text-[9px] font-black bg-gradient-to-r from-amber-400 to-orange-500 text-black'>VIP</span>
                    </div>
                </div>
            </div>

            <div className='bg-[#121212] flex-1 rounded-xl overflow-y-auto'>
                <div className='p-4 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <img className='w-8' src={assets.stack_icon} alt="Library" />
                        <p className='font-semibold'>Your Library</p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <img 
                            onClick={handleExpandLibrary}
                            className='w-5 cursor-pointer hover:scale-110 transition' 
                            src={assets.arrow_icon} 
                            alt="" 
                            title="View Library"
                        />
                        <img 
                            onClick={handleCreatePlaylist} 
                            className='w-5 cursor-pointer hover:scale-110 transition' 
                            src={assets.plus_icon} 
                            alt="" 
                            title="Create Playlist"
                        />
                    </div>
                </div>

                {/* Library Quick Access */}
                {isAuthenticated && (
                    <div className='px-4 pb-2'>
                        <button 
                            onClick={() => navigate('/playlists')}
                            className='w-full bg-purple-600/80 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition font-medium text-sm flex items-center justify-center gap-2'
                        >
                            <span>📂</span> View My Playlists
                        </button>
                    </div>
                )}

                {/* Studio Controls: Add Song & Remove Duplicates */}
                <div className='p-4 bg-[#1f1f1f] m-2 rounded font-semibold flex flex-col gap-2 border border-gray-800'>
                    <div className='flex items-center gap-2'>
                        <span className='text-lg'>✨</span>
                        <h1 className='text-sm'>Studio Actions</h1>
                    </div>
                    <p className='font-light text-xs text-gray-400'>Expand your catalog or cleanse duplicates</p>
                    <div className='flex flex-col gap-2 mt-2'>
                        <button 
                            onClick={() => setShowAddSongModal(true)} 
                            className='w-full py-1.5 bg-white text-xs font-bold text-black rounded-full hover:scale-102 transition flex items-center justify-center gap-1'
                        >
                            <span>➕</span> Add New Song
                        </button>
                        <button 
                            onClick={handleQuickDedupe} 
                            className='w-full py-1.5 bg-gray-800 border border-gray-600 text-xs font-semibold text-gray-200 rounded-full hover:bg-gray-700 transition flex items-center justify-center gap-1'
                        >
                            <span>🧹</span> Clean Duplicates
                        </button>
                    </div>
                </div>

                <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4'>
                    <h1>Create Your Playlist</h1>
                    <p className='font-light text-xs text-gray-300'>Organize your favorites into custom mixes</p>
                    <button onClick={handleCreatePlaylist} className='px-4 py-1.5 bg-white text-[13px] text-black rounded-full mt-3 hover:scale-105 transition'>
                        Create Playlist
                    </button>
                </div>

                <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-2'>
                    <h1>Browse Podcasts</h1>
                    <p className='font-light text-xs text-gray-300'>Follow shows & podcasts you love</p>
                    <button onClick={handleBrowsePodcasts} className='px-4 py-1.5 bg-white text-[13px] text-black rounded-full mt-3 hover:scale-105 transition'>
                        Browse Podcasts
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

export default Sidebar;
