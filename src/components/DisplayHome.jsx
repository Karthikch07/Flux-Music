import React, { useContext, useState } from 'react';
import Navbar from './Navbar';
import { albumsData, assets } from '../assets/assets';
import AlbumItem from './AlbumItem';
import SongItem from './SongItem';
import { PlayerContext } from '../context/PlayerContext';
import { AuthContext } from '../context/AuthContext';
import AddSongModal from './AddSongModal';
import { PODCAST_DATA } from '../assets/podcastData';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, ChevronRight, Radio, Crown } from 'lucide-react';

const DisplayHome = () => {
    const { songs, removeDuplicates, isLoadingSongs, playSongObject, track, playStatus, pause, play } = useContext(PlayerContext);
    const { showMessage } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isAddSongOpen, setIsAddSongOpen] = useState(false);
    const [isDeduplicating, setIsDeduplicating] = useState(false);

    const handleRemoveDuplicates = async () => {
        setIsDeduplicating(true);
        const result = await removeDuplicates();
        setIsDeduplicating(false);
        if (result.success) {
            showMessage(result.message, result.duplicatesRemoved > 0 ? 'success' : 'info');
        } else {
            showMessage(result.error || 'Failed to remove duplicates', 'error');
        }
    };

    const handlePlayPodcast = (show) => {
        const ep = show.episodes[0];
        if (ep) {
            const isCurrent = track && track.name === ep.title;
            if (isCurrent && playStatus) {
                pause();
            } else if (isCurrent && !playStatus) {
                play();
            } else {
                playSongObject({
                    _id: ep.id,
                    name: ep.title,
                    artist: show.title,
                    desc: `Ep. ${ep.number} • ${show.host}`,
                    image: ep.image || show.image,
                    file: ep.audioFile,
                    duration: ep.duration,
                    album: show.title
                });
            }
        }
    };

    return (
        <>
            <Navbar />

            {/* Quick Action Bar */}
            <div className='my-6 p-4 bg-gradient-to-r from-purple-900/40 via-purple-800/20 to-transparent border border-purple-500/30 rounded-xl flex flex-wrap items-center justify-between gap-4'>
                <div>
                    <h2 className='text-lg font-bold text-white flex items-center gap-2'>
                        <span>⚡</span> Music Studio &amp; Library Controls
                    </h2>
                    <p className='text-gray-400 text-sm'>
                        {isLoadingSongs ? 'Syncing with MongoDB...' : `${songs.length} active songs in your stream catalog`}
                    </p>
                </div>
                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => navigate('/premium')}
                        className='bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 hover:from-amber-300 hover:to-orange-400 text-black font-extrabold px-4 py-2 rounded-full text-sm flex items-center gap-1.5 transition hover:scale-105 shadow-lg shadow-orange-950/40'
                    >
                        <Crown className='w-4 h-4 fill-black' />
                        <span>Explore Premium</span>
                    </button>
                    <button
                        onClick={() => setIsAddSongOpen(true)}
                        className='bg-purple-600 hover:bg-purple-500 text-white font-medium px-4 py-2 rounded-full text-sm flex items-center gap-2 transition hover:scale-105 shadow-lg shadow-purple-900/30'
                    >
                        <span>➕</span> Add Song
                    </button>
                    <button
                        onClick={handleRemoveDuplicates}
                        disabled={isDeduplicating}
                        className='bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-medium px-4 py-2 rounded-full text-sm flex items-center gap-2 transition hover:scale-105 disabled:opacity-50'
                        title='Scan and remove duplicate songs from the library'
                    >
                        <span>🧹</span> {isDeduplicating ? 'Cleaning...' : 'Remove Duplicates'}
                    </button>
                </div>
            </div>

            {/* Featured Charts */}
            <div className='mb-6'>
                <h1 className='my-4 font-bold text-2xl text-white'>Featured Charts</h1>
                <div className='flex overflow-auto gap-2 pb-2'>
                    {albumsData.map((item, index) => (
                        <AlbumItem 
                            key={item.id !== undefined ? item.id : index} 
                            name={item.name} 
                            desc={item.desc} 
                            image={item.image} 
                            id={item.id} 
                        />
                    ))}
                </div>
            </div>

            {/* Trending Songs */}
            <div className='mb-8'>
                <div className='flex items-center justify-between my-4'>
                    <h1 className='font-bold text-2xl text-white'>Trending Songs</h1>
                    <span className='text-xs text-gray-400 font-normal'>Click any track to stream</span>
                </div>
                <div className='flex overflow-auto gap-2 pb-2'>
                    {songs.map((item, index) => (
                        <SongItem 
                            key={item._id || item.id || index} 
                            name={item.name} 
                            desc={item.desc || item.artist} 
                            id={item.id !== undefined ? item.id : item._id} 
                            image={item.image} 
                        />
                    ))}
                </div>
            </div>

            {/* Popular Podcasts Preview */}
            <div className='mb-12'>
                <div className='flex items-center justify-between my-4'>
                    <h1 className='font-bold text-2xl text-white flex items-center gap-2'>
                        <Radio className='w-6 h-6 text-purple-400' />
                        <span>Popular Podcasts &amp; Shows</span>
                    </h1>
                    <button
                        onClick={() => navigate('/podcasts')}
                        className='text-xs font-semibold text-purple-400 hover:text-purple-300 hover:underline flex items-center gap-0.5'
                    >
                        <span>Explore All Podcasts</span>
                        <ChevronRight className='w-4 h-4' />
                    </button>
                </div>
                <div className='flex overflow-auto gap-4 pb-3'>
                    {PODCAST_DATA.slice(0, 5).map((pod) => {
                        const latestEp = pod.episodes[0];
                        const isPlaying = latestEp && track && track.name === latestEp.title && playStatus;

                        return (
                            <div
                                key={pod.id}
                                onClick={() => navigate('/podcasts')}
                                className='min-w-[180px] max-w-[180px] p-2.5 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-[#222222] hover:border-[#383838] transition cursor-pointer group relative'
                            >
                                <div className='relative aspect-square rounded-lg overflow-hidden mb-2 bg-[#202020]'>
                                    <img 
                                        src={pod.image || assets.img1} 
                                        alt={pod.title} 
                                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' 
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = assets.img1;
                                        }}
                                    />
                                    <button
                                        type='button'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlayPodcast(pod);
                                        }}
                                        className={`absolute right-2 bottom-2 w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg transition-all ${
                                            isPlaying ? 'opacity-100 scale-100' : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'
                                        }`}
                                        title='Play Latest Episode'
                                    >
                                        {isPlaying ? (
                                            <Pause className='w-4 h-4 fill-white' />
                                        ) : (
                                            <Play className='w-4 h-4 fill-white ml-0.5' />
                                        )}
                                    </button>
                                </div>
                                <span className='text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-0.5'>
                                    {pod.category}
                                </span>
                                <h4 className='font-bold text-sm text-white truncate group-hover:text-purple-300 transition-colors'>
                                    {pod.title}
                                </h4>
                                <p className='text-xs text-gray-400 truncate'>By {pod.host}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <AddSongModal
                isOpen={isAddSongOpen}
                onClose={() => setIsAddSongOpen(false)}
            />
        </>
    );
};

export default DisplayHome;
