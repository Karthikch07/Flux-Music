import React, { useState, useContext, useEffect } from 'react';
import Navbar from './Navbar';
import { albumsData, assets } from '../assets/assets';
import AlbumItem from './AlbumItem';
import SongItem from './SongItem';
import { PlayerContext } from '../context/PlayerContext';
import { PODCAST_DATA } from '../assets/podcastData';
import { useNavigate } from 'react-router-dom';
import { Radio, Play, Pause, ChevronRight } from 'lucide-react';

const Search = () => {
  const { songs, playSongObject, track, playStatus, pause, play } = useContext(PlayerContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAlbums, setFilteredAlbums] = useState(albumsData);
  const [filteredSongs, setFilteredSongs] = useState(songs);
  const [filteredPodcasts, setFilteredPodcasts] = useState(PODCAST_DATA);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredAlbums(albumsData);
      setFilteredSongs(songs);
      setFilteredPodcasts(PODCAST_DATA);
    } else {
      const query = searchTerm.toLowerCase().trim();
      const albums = albumsData.filter(
        (album) =>
          album.name.toLowerCase().includes(query) ||
          album.desc.toLowerCase().includes(query)
      );
      const matchingSongs = songs.filter(
        (song) =>
          song.name.toLowerCase().includes(query) ||
          (song.artist && song.artist.toLowerCase().includes(query)) ||
          (song.album && song.album.toLowerCase().includes(query)) ||
          (song.desc && song.desc.toLowerCase().includes(query))
      );
      const matchingPodcasts = PODCAST_DATA.filter(
        (pod) =>
          pod.title.toLowerCase().includes(query) ||
          pod.host.toLowerCase().includes(query) ||
          pod.category.toLowerCase().includes(query) ||
          pod.description.toLowerCase().includes(query) ||
          pod.episodes.some((ep) => ep.title.toLowerCase().includes(query))
      );

      setFilteredAlbums(albums);
      setFilteredSongs(matchingSongs);
      setFilteredPodcasts(matchingPodcasts);
    }
  }, [searchTerm, songs]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
      <div className='mt-8 pb-16'>
        {/* Search Input */}
        <div className='flex items-center justify-center mb-8'>
          <div className='relative w-[90%] md:w-[65%]'>
            <span className='absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400'>
              🔍
            </span>
            <input
              type='text'
              placeholder='Search songs, albums, artists, podcasts...'
              value={searchTerm}
              onChange={handleSearch}
              className='w-full pl-11 pr-10 py-3 rounded-full bg-[#181818] border border-[#2a2a2a] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 shadow-inner text-sm transition'
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className='absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white'
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {searchTerm && (
          <div>
            {/* Albums Results */}
            {filteredAlbums.length > 0 && (
              <div className='mb-8'>
                <h2 className='text-2xl font-bold mb-4 flex items-center gap-2'>
                  <span>💿</span>
                  <span>Albums ({filteredAlbums.length})</span>
                </h2>
                <div className='flex overflow-auto gap-4 pb-2'>
                  {filteredAlbums.map((item, index) => (
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
            )}

            {/* Songs Results */}
            {filteredSongs.length > 0 && (
              <div className='mb-8'>
                <h2 className='text-2xl font-bold mb-4 flex items-center gap-2'>
                  <span>🎵</span>
                  <span>Songs ({filteredSongs.length})</span>
                </h2>
                <div className='flex overflow-auto gap-4 pb-2'>
                  {filteredSongs.map((item, index) => (
                    <SongItem
                      key={item._id || item.id || index}
                      name={item.name}
                      desc={item.artist || item.desc}
                      image={item.image}
                      id={item.id !== undefined ? item.id : item._id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Podcasts Results */}
            {filteredPodcasts.length > 0 && (
              <div className='mb-8'>
                <h2 className='text-2xl font-bold mb-4 flex items-center gap-2'>
                  <Radio className='w-5 h-5 text-purple-400' />
                  <span>Podcasts &amp; Shows ({filteredPodcasts.length})</span>
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                  {filteredPodcasts.map((pod) => {
                    const latestEp = pod.episodes[0];
                    const isPlaying = latestEp && track && track.name === latestEp.title && playStatus;

                    return (
                      <div
                        key={pod.id}
                        className='bg-[#121212] hover:bg-[#181818] border border-[#242424] hover:border-[#383838] rounded-xl p-3.5 transition group flex flex-col justify-between'
                      >
                        <div>
                          <div className='relative aspect-square rounded-lg overflow-hidden mb-2.5 bg-[#202020]'>
                            <img
                              src={pod.image || assets.img1}
                              alt={pod.title}
                              className='w-full h-full object-cover group-hover:scale-105 transition-transform'
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = assets.img1;
                              }}
                            />
                            <button
                              type='button'
                              onClick={() => handlePlayPodcast(pod)}
                              className={`absolute right-2.5 bottom-2.5 w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg transition-all ${
                                isPlaying
                                  ? 'opacity-100 scale-100'
                                  : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                              }`}
                              title='Play Podcast'
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
                          <h4 className='text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors'>
                            {pod.title}
                          </h4>
                          <p className='text-xs text-gray-400 truncate'>By {pod.host}</p>
                        </div>
                        <div className='mt-3 pt-2.5 border-t border-[#1e1e1e] flex items-center justify-between'>
                          <span className='text-[11px] text-gray-500'>
                            {pod.episodes.length} episodes
                          </span>
                          <button
                            onClick={() => navigate('/podcasts')}
                            className='text-xs text-purple-400 hover:underline flex items-center gap-0.5'
                          >
                            <span>Browse</span>
                            <ChevronRight className='w-3 h-3' />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredAlbums.length === 0 &&
              filteredSongs.length === 0 &&
              filteredPodcasts.length === 0 && (
                <div className='text-center text-gray-400 mt-16'>
                  <p className='text-2xl'>🔎 No results found for "{searchTerm}"</p>
                  <p className='text-sm mt-2 text-gray-500'>
                    Check for typos or try searching with a different keyword
                  </p>
                </div>
              )}
          </div>
        )}

        {!searchTerm && (
          <div className='text-center text-gray-400 mt-16'>
            <div className='text-5xl mb-4'>🎧</div>
            <p className='text-xl font-medium'>Search across all songs, albums, and podcasts</p>
            <p className='text-sm text-gray-500 mt-1'>Type in the box above to find tracks instantly</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
