import React, { useState, useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { AuthContext } from '../context/AuthContext';
import { availableArtworkList, availableAudioTracks, albumsData } from '../assets/assets';

const AddSongModal = ({ isOpen, onClose }) => {
    const { addSong } = useContext(PlayerContext);
    const { showMessage } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [artist, setArtist] = useState('');
    const [album, setAlbum] = useState(albumsData[0]?.name || 'Top 50 Global');
    const [desc, setDesc] = useState('');
    const [duration, setDuration] = useState('3:00');
    const [image, setImage] = useState(availableArtworkList[0].value);
    const [file, setFile] = useState(availableAudioTracks[0].value);
    const [customAudio, setCustomAudio] = useState('');
    const [customImage, setCustomImage] = useState('');
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Song title is required');
            return;
        }

        setIsSubmitting(true);

        const chosenFile = isCustomMode && customAudio.trim() ? customAudio.trim() : file;
        const chosenImage = isCustomMode && customImage.trim() ? customImage.trim() : image;

        const songData = {
            name: name.trim(),
            artist: artist.trim() || 'Flux Artist',
            album: album.trim() || 'Single',
            desc: desc.trim() || 'Added to Flux Music collection',
            duration: duration.trim() || '3:00',
            file: chosenFile,
            image: chosenImage
        };

        const result = await addSong(songData);
        setIsSubmitting(false);

        if (result.success) {
            showMessage(`🎵 Successfully added "${songData.name}"!`, 'success');
            onClose();
            setName('');
            setArtist('');
            setDesc('');
        } else {
            setError(result.error || 'Failed to add song');
        }
    };

    return (
        <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto'>
            <div className='bg-[#181818] p-6 rounded-xl w-full max-w-lg border border-gray-700 shadow-2xl my-8'>
                <div className='flex justify-between items-center mb-5'>
                    <h2 className='text-2xl font-bold text-white flex items-center gap-2'>
                        <span>🎵</span> Add New Song
                    </h2>
                    <button 
                        onClick={onClose}
                        className='text-gray-400 hover:text-white text-xl font-bold'
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className='mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm'>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-4 text-sm'>
                    <div>
                        <label className='block text-gray-300 font-medium mb-1'>Song Title *</label>
                        <input
                            type='text'
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='w-full px-3 py-2 bg-[#282828] text-white rounded border border-gray-700 focus:outline-none focus:border-purple-500'
                            placeholder='e.g. Starlight Symphony'
                        />
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <div>
                            <label className='block text-gray-300 font-medium mb-1'>Artist Name</label>
                            <input
                                type='text'
                                value={artist}
                                onChange={(e) => setArtist(e.target.value)}
                                className='w-full px-3 py-2 bg-[#282828] text-white rounded border border-gray-700 focus:outline-none focus:border-purple-500'
                                placeholder='e.g. Nova Eclipse'
                            />
                        </div>
                        <div>
                            <label className='block text-gray-300 font-medium mb-1'>Album</label>
                            <select
                                value={album}
                                onChange={(e) => setAlbum(e.target.value)}
                                className='w-full px-3 py-2 bg-[#282828] text-white rounded border border-gray-700 focus:outline-none focus:border-purple-500'
                            >
                                {albumsData.map((a) => (
                                    <option key={a.id} value={a.name}>{a.name}</option>
                                ))}
                                <option value='Single'>Single / Other</option>
                            </select>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <div>
                            <label className='block text-gray-300 font-medium mb-1'>Duration</label>
                            <input
                                type='text'
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className='w-full px-3 py-2 bg-[#282828] text-white rounded border border-gray-700 focus:outline-none focus:border-purple-500'
                                placeholder='e.g. 3:15'
                            />
                        </div>
                        <div>
                            <label className='block text-gray-300 font-medium mb-1'>Audio Track</label>
                            <select
                                value={file}
                                onChange={(e) => setFile(e.target.value)}
                                disabled={isCustomMode}
                                className='w-full px-3 py-2 bg-[#282828] text-white rounded border border-gray-700 focus:outline-none focus:border-purple-500 disabled:opacity-50'
                            >
                                {availableAudioTracks.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className='block text-gray-300 font-medium mb-1'>Cover Artwork</label>
                        <select
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            disabled={isCustomMode}
                            className='w-full px-3 py-2 bg-[#282828] text-white rounded border border-gray-700 focus:outline-none focus:border-purple-500 disabled:opacity-50'
                        >
                            {availableArtworkList.map((art) => (
                                <option key={art.value} value={art.value}>{art.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className='block text-gray-300 font-medium mb-1'>Description (Optional)</label>
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            className='w-full px-3 py-2 bg-[#282828] text-white rounded border border-gray-700 focus:outline-none focus:border-purple-500'
                            placeholder='Vibe, genre or notes...'
                            rows='2'
                        />
                    </div>

                    <div className='flex items-center gap-2 pt-1'>
                        <input
                            type='checkbox'
                            id='customMode'
                            checked={isCustomMode}
                            onChange={(e) => setIsCustomMode(e.target.checked)}
                            className='rounded bg-gray-800'
                        />
                        <label htmlFor='customMode' className='text-xs text-gray-400 cursor-pointer'>
                            Use custom external audio/image URLs instead of presets
                        </label>
                    </div>

                    {isCustomMode && (
                        <div className='space-y-2 p-3 bg-black/40 rounded border border-gray-800'>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Audio URL (.mp3)</label>
                                <input
                                    type='text'
                                    value={customAudio}
                                    onChange={(e) => setCustomAudio(e.target.value)}
                                    placeholder='https://example.com/audio.mp3'
                                    className='w-full px-3 py-1.5 bg-[#282828] text-white rounded text-xs border border-gray-700'
                                />
                            </div>
                            <div>
                                <label className='block text-xs text-gray-400 mb-1'>Cover Image URL</label>
                                <input
                                    type='text'
                                    value={customImage}
                                    onChange={(e) => setCustomImage(e.target.value)}
                                    placeholder='https://example.com/cover.jpg'
                                    className='w-full px-3 py-1.5 bg-[#282828] text-white rounded text-xs border border-gray-700'
                                />
                            </div>
                        </div>
                    )}

                    <div className='flex gap-3 pt-4 border-t border-gray-800'>
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50'
                        >
                            {isSubmitting ? 'Adding...' : '➕ Add Song'}
                        </button>
                        <button
                            type='button'
                            onClick={onClose}
                            className='flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-lg transition'
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSongModal;

