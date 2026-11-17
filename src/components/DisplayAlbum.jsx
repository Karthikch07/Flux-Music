import React, { useContext, useState } from 'react'
import Navbar from './Navbar'
import { useParams, useNavigate } from 'react-router-dom';
import { albumsData, assets } from '../assets/assets';
import { PlayerContext } from '../context/PlayerContext';
import AddSongModal from './AddSongModal';
import { Play, Pause } from 'lucide-react';

const DisplayAlbum = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { playWithId, playSongObject, songs, track, playStatus, pause, play } = useContext(PlayerContext);
    const [isAddSongOpen, setIsAddSongOpen] = useState(false);

    const albumData = albumsData.find(a => a.id.toString() === id) || albumsData[Number(id)];

    if (!albumData) {
        return (
            <>
                <Navbar />
                <div className='flex flex-col items-center justify-center h-96 text-center text-white'>
                    <div className='text-6xl mb-4'>💿</div>
                    <h2 className='text-3xl font-bold mb-2'>Album Not Found</h2>
                    <p className='text-gray-400 mb-6'>The album you are looking for does not exist.</p>
                    <button 
                        onClick={() => navigate('/')} 
                        className='bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-full transition'
                    >
                        Back to Home
                    </button>
                </div>
            </>
        );
    }

    // Filter songs matching this album or fallback to all songs
    const albumSongs = songs.filter(s => s.album && s.album.toLowerCase() === albumData.name.toLowerCase());
    const displaySongs = albumSongs.length > 0 ? albumSongs : songs;

    const handlePlayAlbum = () => {
        if (displaySongs.length > 0) {
            playSongObject(displaySongs[0]);
        }
    };

    return (
        <>
            <Navbar />
            <div className='mt-10 flex gap-8 flex-col md:flex-row md:items-end'>
                <img 
                    className='w-48 h-48 object-cover rounded-lg shadow-2xl' 
                    src={albumData.image || assets.img1} 
                    alt={albumData.name} 
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = assets.img1;
                    }}
                />
                <div className='flex flex-col'>
                    <p className='text-xs font-bold uppercase tracking-wider text-purple-400'>Album Playlist</p>
                    <h2 className='text-4xl font-bold my-2 md:text-6xl text-white'>{albumData.name}</h2>
                    <h4 className='text-gray-300 text-sm md:text-base'>{albumData.desc}</h4>
                    <p className='mt-2 flex items-center gap-2 text-sm'>
                        <img className='inline-block w-5' src={assets.spotify_logo} alt="Flux" />
                        <b>Flux Music</b>
                        <span className='text-gray-400'>• {displaySongs.length} songs available</span>
                    </p>
                    <div className='flex items-center gap-3 mt-4'>
                        <button
                            onClick={handlePlayAlbum}
                            className='bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2.5 rounded-full text-sm flex items-center gap-2 transition hover:scale-105 shadow-lg shadow-purple-900/30'
                        >
                            <Play className='w-4 h-4 fill-white text-white ml-0.5' />
                            <span>Play All</span>
                        </button>
                        <button
                            onClick={() => setIsAddSongOpen(true)}
                            className='bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-medium px-4 py-2 rounded-full text-sm flex items-center gap-2 transition hover:scale-105'
                        >
                            <span>➕</span> Add Song to Album
                        </button>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7] text-sm'>
                <p><b className='mr-4'>#</b>Title</p>
                <p>Artist / Album</p>
                <p className='hidden sm:block'>Date Added</p>
                <img className='m-auto w-4' src={assets.clock_icon} alt="Duration" />
            </div>
            <hr className='border-gray-800 mb-2' />

            {displaySongs.map((item, index) => {
                const isCurrentSong = track && (track.id === item.id || track._id === item._id || track.name === item.name);
                const isPlayingThis = isCurrentSong && playStatus;

                return (
                    <div 
                        onClick={() => {
                            if (isPlayingThis) {
                                pause();
                            } else if (isCurrentSong) {
                                play();
                            } else {
                                playWithId(item.id !== undefined ? item.id : item._id);
                            }
                        }} 
                        key={item._id || item.id || index} 
                        className={`grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff15] rounded-lg cursor-pointer transition group ${
                            isCurrentSong ? 'bg-purple-950/20 text-purple-300' : ''
                        }`}
                    >
                        <div className='text-white flex items-center min-w-0 pr-2'>
                            <div className='mr-4 w-5 text-center flex items-center justify-center'>
                                {isPlayingThis ? (
                                    <Pause className='w-4 h-4 text-purple-400 fill-purple-400' />
                                ) : (
                                    <>
                                        <span className='group-hover:hidden text-[#a7a7a7] font-bold text-xs'>{index + 1}</span>
                                        <Play className='w-3.5 h-3.5 text-white fill-white hidden group-hover:block ml-0.5' />
                                    </>
                                )}
                            </div>
                            <img 
                                className='w-10 h-10 object-cover rounded mr-3 flex-shrink-0' 
                                src={item.image || assets.img1} 
                                alt={item.name} 
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = assets.img1;
                                }}
                            />
                            <span className={`truncate font-medium ${isCurrentSong ? 'text-purple-400 font-bold' : ''}`}>
                                {item.name}
                            </span>
                        </div>
                        <p className='text-[14px] truncate'>{item.artist || albumData.name}</p>
                        <p className='text-[14px] hidden sm:block text-gray-500'>Recent</p>
                        <p className='text-[14px] text-center font-mono'>{item.duration || '3:00'}</p>
                    </div>
                );
            })}

            <AddSongModal
                isOpen={isAddSongOpen}
                onClose={() => setIsAddSongOpen(false)}
            />
        </>
    );
};

export default DisplayAlbum;
