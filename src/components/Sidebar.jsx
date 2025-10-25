import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { playlistAPI } from '../services/api';

const Sidebar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, showMessage } = useContext(AuthContext);
    const [showCreateModal, setShowCreateModal] = useState(false);
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
            const response = await playlistAPI.create(playlistName, playlistDesc, '', true);
            console.log('Playlist created:', response);
            showMessage('Playlist created successfully!', 'success');
            setShowCreateModal(false);
            setPlaylistName('');
            setPlaylistDesc('');
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
        // Navigate to playlists page when arrow is clicked
        if (isAuthenticated) {
            navigate('/playlists');
        } else {
            showMessage('Please login to view your library', 'info');
            navigate('/login');
        }
    };

    return (
        <>
        {/* Create Playlist Modal */}
        {showCreateModal && (
            <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50'>
                <div className='bg-gray-900 p-6 rounded-lg w-96 border border-gray-700'>
                    <h2 className='text-2xl font-bold text-white mb-4'>Create Playlist</h2>
                    <form onSubmit={handleSubmitPlaylist}>
                        <div className='mb-4'>
                            <label className='block text-gray-300 mb-2'>Playlist Name</label>
                            <input
                                type='text'
                                required
                                value={playlistName}
                                onChange={(e) => setPlaylistName(e.target.value)}
                                className='w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-purple-500'
                                placeholder='My Awesome Playlist'
                            />
                        </div>
                        <div className='mb-4'>
                            <label className='block text-gray-300 mb-2'>Description (optional)</label>
                            <textarea
                                value={playlistDesc}
                                onChange={(e) => setPlaylistDesc(e.target.value)}
                                className='w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-purple-500'
                                placeholder='Add a description...'
                                rows='3'
                            />
                        </div>
                        <div className='flex gap-2'>
                            <button
                                type='submit'
                                disabled={isCreating}
                                className='flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition disabled:opacity-50'
                            >
                                {isCreating ? 'Creating...' : 'Create'}
                            </button>
                            <button
                                type='button'
                                onClick={() => setShowCreateModal(false)}
                                className='flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600 transition'
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        <div className='w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex'>
            <div className='bg-[#121212] h-[15%] rounded flex flex-col justify-around'>
                <div onClick={() => navigate('/')} className='flex items-center gap-3 pl-8 cursor-pointer'>
                    <img className='w-6' src={assets.home_icon} alt="" />
                    <p className='font-bold'>Home</p>
                </div>
                <div onClick={() => navigate('/search')} className='flex items-center gap-3 pl-8 cursor-pointer'>
                    <img className='w-6' src={assets.search_icon} alt="" />
                    <p className='font-bold'>Search</p>
                </div>
            </div>

            <div className='bg-[#121212] h-[85%] rounded'>
                <div className='p-4 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <img className='w-8' src={assets.stack_icon} alt="" />
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

                {/* View My Playlists Button */}
                {isAuthenticated && (
                    <div className='px-4 pb-2'>
                        <button 
                            onClick={() => navigate('/playlists')}
                            className='w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition font-semibold'
                        >
                            📂 View My Playlists
                        </button>
                    </div>
                )}

                <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4'>
                    <h1>
                        Create Your First Playlist
                    </h1>
                    <p className='font-light'>It's easy we're there to help you</p>
                    <button onClick={handleCreatePlaylist} className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4 hover:scale-105 transition'>
                        Create Playlist
                    </button>
                </div>
                <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4'>
                    <h1>
                        Let's find some podcasts to follow
                    </h1>
                    <p className='font-light'>we'll keep you updated on new episodes</p>
                    <button onClick={handleBrowsePodcasts} className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4 hover:scale-105 transition'>
                        Browse Podcasts
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}

export default Sidebar