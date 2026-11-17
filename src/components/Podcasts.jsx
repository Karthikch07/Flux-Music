import React, { useState, useContext, useMemo } from 'react';
import Navbar from './Navbar';
import { PlayerContext } from '../context/PlayerContext';
import { AuthContext } from '../context/AuthContext';
import { PODCAST_DATA, PODCAST_CATEGORIES } from '../assets/podcastData';
import {
  Play,
  Pause,
  Mic,
  Radio,
  Search,
  Sparkles,
  X,
  ChevronRight,
  Bookmark,
  SlidersHorizontal,
  Flame,
  Check,
  UserPlus,
  Laptop,
  Briefcase,
  ShieldAlert,
  Smile,
  Atom,
  Music,
  GraduationCap,
  Dumbbell,
  Layers
} from 'lucide-react';

// Icon mapping for categories
const CATEGORY_ICONS = {
  Technology: Laptop,
  Business: Briefcase,
  'True Crime': ShieldAlert,
  Comedy: Smile,
  Science: Atom,
  'Music Production': Music,
  Education: GraduationCap,
  'Health & Fitness': Dumbbell
};

// Safe image component that guarantees NO broken browser icon ever appears
const PodcastImage = ({ src, alt, className = '', category = 'Podcast' }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-purple-900/60 via-[#181818] to-[#101010] border border-purple-500/20 select-none ${className}`}>
        <div className='p-2 rounded-full bg-purple-600/30 text-purple-300 mb-1 shadow'>
          <Radio className='w-4 h-4' />
        </div>
        <span className='text-[9px] font-bold text-purple-300 uppercase tracking-wider line-clamp-1'>
          {category}
        </span>
        <span className='text-[11px] font-bold text-white/90 line-clamp-1 mt-0.5'>
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading='lazy'
      onError={() => setHasError(true)}
    />
  );
};

const Podcasts = () => {
  const { playSongObject, track, playStatus, pause, play, audioRef } = useContext(PlayerContext);
  const { showMessage } = useContext(AuthContext);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShow, setSelectedShow] = useState(null);
  const [savedEpisodes, setSavedEpisodes] = useState(new Set());
  const [followedShows, setFollowedShows] = useState(new Set(['pod-1', 'pod-6']));
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'saved'

  // Filter shows based on category & search term
  const filteredShows = useMemo(() => {
    return PODCAST_DATA.filter((show) => {
      const matchesCategory = selectedCategory === 'All' || show.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        show.title.toLowerCase().includes(q) ||
        show.host.toLowerCase().includes(q) ||
        show.category.toLowerCase().includes(q) ||
        show.description.toLowerCase().includes(q) ||
        show.episodes.some((ep) => ep.title.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // All episodes flattened for "Trending Episodes"
  const allEpisodes = useMemo(() => {
    const list = [];
    PODCAST_DATA.forEach((show) => {
      show.episodes.forEach((ep) => {
        list.push({ ...ep, showTitle: show.title, host: show.host, showImage: show.image, showCategory: show.category, show });
      });
    });
    return list;
  }, []);

  const savedEpisodesList = useMemo(() => {
    return allEpisodes.filter((ep) => savedEpisodes.has(ep.id));
  }, [allEpisodes, savedEpisodes]);

  // Hero Spotlight Show & Episode
  const heroShow = PODCAST_DATA[0];
  const heroEpisode = heroShow.episodes[0];

  const isEpisodePlaying = (episodeTitle) => {
    return playStatus && track && track.name === episodeTitle;
  };

  const isEpisodeLoaded = (episodeTitle) => {
    return track && track.name === episodeTitle;
  };

  // Play a podcast episode via PlayerContext
  const handlePlayEpisode = (show, episode) => {
    const isCurrent = isEpisodeLoaded(episode.title);
    if (isCurrent && playStatus) {
      pause();
    } else if (isCurrent && !playStatus) {
      play();
    } else {
      playSongObject({
        _id: episode.id,
        name: episode.title,
        artist: show.title,
        desc: `Ep. ${episode.number} • ${show.host}`,
        image: episode.image || show.image,
        file: episode.audioFile,
        duration: episode.duration,
        album: show.title
      });
      showMessage(`Now Playing: ${episode.title}`, 'success');
    }
  };

  // Toggle speed
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      showMessage(`Playback speed set to ${speed}x`, 'info');
    }
  };

  // Toggle save episode
  const toggleSaveEpisode = (epId, epTitle) => {
    setSavedEpisodes((prev) => {
      const next = new Set(prev);
      if (next.has(epId)) {
        next.delete(epId);
        showMessage(`Removed "${epTitle}" from saved episodes`, 'info');
      } else {
        next.add(epId);
        showMessage(`Saved "${epTitle}" to library!`, 'success');
      }
      return next;
    });
  };

  // Toggle follow show
  const toggleFollowShow = (showId, showTitle) => {
    setFollowedShows((prev) => {
      const next = new Set(prev);
      if (next.has(showId)) {
        next.delete(showId);
        showMessage(`Unfollowed ${showTitle}`, 'info');
      } else {
        next.add(showId);
        showMessage(`Now following ${showTitle}!`, 'success');
      }
      return next;
    });
  };

  return (
    <div className='pb-20 text-white select-none'>
      <Navbar />

      {/* Hero Header & Search Section */}
      <div className='my-6 flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2.5 mb-1'>
            <div className='p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-md'>
              <Radio className='w-5 h-5 animate-pulse' />
            </div>
            <h1 className='text-3xl font-black tracking-tight text-white'>Browse Podcasts</h1>
          </div>
          <p className='text-xs sm:text-sm text-gray-400'>
            Stream original audio stories, exclusive interviews, and discussions
          </p>
        </div>

        {/* Search & Tabs Controls */}
        <div className='flex items-center gap-3'>
          <div className='flex p-1 bg-[#181818] rounded-full border border-[#2a2a2a]'>
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                activeTab === 'explore'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bookmark className='w-3 h-3' />
              <span>Saved ({savedEpisodes.size})</span>
            </button>
          </div>

          <div className='relative w-full md:w-64'>
            <Search className='w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Search podcasts...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-9 pr-8 h-9 text-xs rounded-full bg-[#181818] border border-[#2e2e2e] text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-[#71717a]'
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className='absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white'
              >
                <X className='w-3.5 h-3.5' />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Playback Speed Bar */}
      <div className='mb-6 px-4 py-2 bg-[#141414] border border-[#252525] rounded-xl flex items-center justify-between text-xs'>
        <div className='flex items-center gap-2 text-gray-400'>
          <SlidersHorizontal className='w-3.5 h-3.5 text-purple-400' />
          <span>Podcast Playback Speed:</span>
        </div>
        <div className='flex items-center gap-1.5'>
          {[0.8, 1, 1.2, 1.5, 2].map((s) => (
            <button
              key={s}
              onClick={() => handleSpeedChange(s)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold transition ${
                playbackSpeed === s
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-[#1f1f1f] text-gray-400 hover:text-white hover:bg-[#282828]'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'saved' ? (
        /* SAVED EPISODES TAB */
        <div className='mb-12'>
          <h2 className='text-2xl font-bold mb-4 flex items-center gap-2'>
            <Bookmark className='w-5 h-5 text-purple-400' />
            <span>Saved Episodes ({savedEpisodesList.length})</span>
          </h2>
          {savedEpisodesList.length === 0 ? (
            <div className='p-12 text-center rounded-2xl bg-[#121212] border border-[#222222] text-gray-400'>
              <Bookmark className='w-10 h-10 mx-auto text-gray-600 mb-3' />
              <p className='text-base font-bold text-white'>No saved episodes yet</p>
              <p className='text-xs mt-1 text-gray-500'>
                Bookmark any episode while browsing to queue it up here for offline or quick listening.
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {savedEpisodesList.map((ep) => {
                const isPlaying = isEpisodePlaying(ep.title);
                return (
                  <div
                    key={ep.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                      isPlaying
                        ? 'bg-purple-950/30 border-purple-500/60 shadow-lg shadow-purple-950/40'
                        : 'bg-[#141414] border-[#242424] hover:bg-[#1a1a1a] hover:border-[#333333]'
                    }`}
                  >
                    <div className='flex items-center gap-3.5 min-w-0'>
                      <div className='w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-[#333] bg-[#1e1e1e]'>
                        <PodcastImage
                          src={ep.image || ep.showImage}
                          alt={ep.title}
                          category={ep.showCategory}
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <button
                        onClick={() => handlePlayEpisode(ep.show, ep)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition shadow ${
                          isPlaying ? 'bg-purple-500 text-white' : 'bg-white text-black hover:bg-gray-200'
                        }`}
                      >
                        {isPlaying ? <Pause className='w-4 h-4 fill-white' /> : <Play className='w-4 h-4 fill-black ml-0.5' />}
                      </button>
                      <div className='min-w-0'>
                        <h4 className='font-bold text-sm text-white truncate'>{ep.title}</h4>
                        <p className='text-xs text-gray-400 truncate'>{ep.showTitle} • Hosted by {ep.host}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span className='text-xs font-mono text-gray-400'>{ep.duration}</span>
                      <button
                        onClick={() => toggleSaveEpisode(ep.id, ep.title)}
                        className='text-purple-400 hover:text-red-400 p-1.5'
                        title='Remove from saved'
                      >
                        <X className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* EXPLORE TAB */
        <>
          {/* Featured Episode Hero Spotlight */}
          {!searchQuery && selectedCategory === 'All' && (
            <div className='mb-10 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-purple-950/80 via-[#161616] to-[#101010] border border-purple-500/40 relative overflow-hidden shadow-2xl'>
              <div className='absolute right-0 top-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none' />

              <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10'>
                <div className='flex gap-5 items-start sm:items-center'>
                  <div className='relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl border border-purple-400/30 group bg-[#1e1e1e]'>
                    <PodcastImage
                      src={heroEpisode.image || heroShow.image}
                      alt={heroShow.title}
                      category={heroShow.category}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                    <button
                      type='button'
                      onClick={() => handlePlayEpisode(heroShow, heroEpisode)}
                      className='absolute inset-0 m-auto w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all'
                      title='Play Episode'
                    >
                      {isEpisodePlaying(heroEpisode.title) ? (
                        <Pause className='w-5 h-5 fill-black text-black' />
                      ) : (
                        <Play className='w-5 h-5 fill-black text-black ml-0.5' />
                      )}
                    </button>
                  </div>

                  <div>
                    <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/25 text-purple-300 text-[11px] font-bold mb-2 uppercase tracking-wider border border-purple-500/40 shadow-sm'>
                      <Sparkles className='w-3.5 h-3.5 text-purple-300' />
                      <span>Featured Episode of the Week</span>
                    </div>
                    <h2 
                      onClick={() => handlePlayEpisode(heroShow, heroEpisode)}
                      className='text-xl sm:text-2xl font-black text-white hover:text-purple-300 transition-colors cursor-pointer'
                    >
                      {heroEpisode.title}
                    </h2>
                    <p className='text-xs sm:text-sm text-gray-300 mt-1'>
                      <strong className='text-purple-400'>{heroShow.title}</strong> • Hosted by {heroShow.host} • Episode {heroEpisode.number}
                    </p>
                    <p className='text-xs text-gray-400 mt-2 line-clamp-2 max-w-2xl leading-relaxed'>
                      {heroEpisode.desc}
                    </p>
                  </div>
                </div>

                <div className='flex sm:flex-col items-center sm:items-end gap-3 w-full lg:w-auto justify-between sm:justify-start pt-2 lg:pt-0 flex-shrink-0'>
                  <button
                    type='button'
                    onClick={() => handlePlayEpisode(heroShow, heroEpisode)}
                    className='px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-lg shadow-purple-900/50 hover:scale-105 transition-all'
                  >
                    {isEpisodePlaying(heroEpisode.title) ? (
                      <>
                        <Pause className='w-4 h-4 fill-white' />
                        <span>Pause Episode</span>
                      </>
                    ) : (
                      <>
                        <Play className='w-4 h-4 fill-white ml-0.5' />
                        <span>Play Episode ({heroEpisode.duration})</span>
                      </>
                    )}
                  </button>

                  <button
                    type='button'
                    onClick={() => setSelectedShow(heroShow)}
                    className='px-4 py-2 rounded-full border border-gray-700 hover:border-gray-500 bg-[#1e1e1e] text-xs font-semibold text-gray-300 hover:text-white transition'
                  >
                    View All {heroShow.episodes.length} Episodes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Clean Category Filter Bar - Replaces the broken category boxes */}
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-2 text-sm font-bold text-gray-300'>
                <Layers className='w-4 h-4 text-purple-400' />
                <span>Categories</span>
              </div>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className='text-xs text-purple-400 hover:text-purple-300 hover:underline font-semibold'
                >
                  Clear filter ({filteredShows.length} shown)
                </button>
              )}
            </div>

            {/* Horizontal responsive category pill navigation */}
            <div className='flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-800'>
              <button
                type='button'
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 ring-1 ring-purple-400 scale-102'
                    : 'bg-[#181818] text-gray-300 hover:text-white hover:bg-[#242424] border border-[#2b2b2b]'
                }`}
              >
                <Radio className='w-3.5 h-3.5' />
                <span>All Shows</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === 'All' ? 'bg-purple-800 text-purple-200' : 'bg-[#282828] text-gray-400'}`}>
                  {PODCAST_DATA.length}
                </span>
              </button>

              {PODCAST_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                const IconComp = CATEGORY_ICONS[cat.name] || Mic;

                return (
                  <button
                    key={cat.name}
                    type='button'
                    onClick={() => setSelectedCategory(isSelected ? 'All' : cat.name)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 ring-1 ring-purple-400 scale-102'
                        : 'bg-[#181818] text-gray-300 hover:text-white hover:bg-[#242424] border border-[#2b2b2b]'
                    }`}
                  >
                    <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-purple-400'}`} />
                    <span>{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-purple-800 text-purple-200' : 'bg-[#282828] text-gray-400'}`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trending Episodes Spotlight Row */}
          {!searchQuery && (
            <div className='mb-10'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2'>
                  <Flame className='w-5 h-5 text-orange-400 animate-pulse' />
                  <span>Trending Episodes This Week</span>
                </h2>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                {allEpisodes.slice(0, 4).map((ep, idx) => {
                  const isPlaying = isEpisodePlaying(ep.title);
                  return (
                    <div
                      key={ep.id}
                      onClick={() => handlePlayEpisode(ep.show, ep)}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
                        isPlaying
                          ? 'bg-purple-950/30 border-purple-500/60 shadow-lg shadow-purple-950/40'
                          : 'bg-[#121212] border-[#222222] hover:bg-[#181818] hover:border-[#383838]'
                      }`}
                    >
                      <div className='flex gap-3 items-center mb-3'>
                        <div className='relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#1e1e1e] border border-[#333]'>
                          <PodcastImage
                            src={ep.image || ep.showImage}
                            alt={ep.title}
                            category={ep.showCategory}
                            className='w-full h-full object-cover group-hover:scale-105 transition-transform'
                          />
                          <div className={`absolute inset-0 m-auto w-8 h-8 rounded-full flex items-center justify-center transition shadow-md ${
                            isPlaying ? 'bg-purple-500 text-white' : 'bg-white text-black opacity-0 group-hover:opacity-100 hover:scale-105'
                          }`}>
                            {isPlaying ? <Pause className='w-3.5 h-3.5 fill-white' /> : <Play className='w-3.5 h-3.5 fill-black ml-0.5' />}
                          </div>
                        </div>

                        <div className='min-w-0 flex-1'>
                          <span className='text-[10px] font-bold text-purple-400 block'>
                            #{idx + 1} TRENDING
                          </span>
                          <h4 className='text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors'>
                            {ep.title}
                          </h4>
                          <p className='text-[11px] text-gray-400 truncate'>{ep.showTitle}</p>
                        </div>
                      </div>

                      <div className='flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-[#1e1e1e]'>
                        <span className='font-mono'>{ep.duration}</span>
                        <span className='text-gray-500'>{ep.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Podcast Shows Catalog Grid */}
          <div className='mb-10'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2'>
                <span>🎙️</span>
                <span>
                  {selectedCategory === 'All' ? 'Popular Podcast Shows' : `${selectedCategory} Shows`}
                </span>
                <span className='text-xs text-gray-400 font-normal ml-1'>
                  ({filteredShows.length} shows)
                </span>
              </h2>
            </div>

            {filteredShows.length === 0 ? (
              <div className='p-12 text-center rounded-2xl bg-[#121212] border border-[#222222] text-gray-400'>
                <Mic className='w-10 h-10 mx-auto text-gray-600 mb-3' />
                <p className='text-base font-bold text-white'>No podcasts found</p>
                <p className='text-xs mt-1 text-gray-500'>
                  Try searching with different keywords or select another category.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className='mt-4 px-4 py-1.5 rounded-full bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition'
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                {filteredShows.map((show) => {
                  const latestEp = show.episodes[0];
                  const isPlaying = latestEp && isEpisodePlaying(latestEp.title);
                  const isFollowing = followedShows.has(show.id);

                  return (
                    <div
                      key={show.id}
                      className='bg-[#121212] hover:bg-[#181818] border border-[#222222] hover:border-[#383838] rounded-2xl p-4 transition-all duration-200 group flex flex-col justify-between shadow-lg relative'
                    >
                      <div>
                        {/* High-Resolution Show Cover Art with Floating Play Button */}
                        <div className='relative aspect-square rounded-xl overflow-hidden mb-3.5 bg-[#1e1e1e] border border-[#262626]'>
                          <PodcastImage
                            src={show.image}
                            alt={show.title}
                            category={show.category}
                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                          />
                          <div className='absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-purple-300 border border-purple-500/30'>
                            {show.category}
                          </div>

                          <div className='absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30'>
                            {show.rating}
                          </div>

                          {/* Floating Play / Pause Button on Hover */}
                          <button
                            type='button'
                            onClick={(e) => {
                              e.stopPropagation();
                              if (latestEp) handlePlayEpisode(show, latestEp);
                            }}
                            className={`absolute right-3 bottom-3 w-11 h-11 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-2xl shadow-black/80 transition-all duration-200 hover:scale-110 active:scale-95 ${
                              isPlaying
                                ? 'opacity-100 scale-100 ring-2 ring-purple-400'
                                : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                            }`}
                            title={isPlaying ? 'Pause Episode' : 'Play Latest Episode'}
                          >
                            {isPlaying ? (
                              <Pause className='w-5 h-5 fill-white text-white' />
                            ) : (
                              <Play className='w-5 h-5 fill-white text-white ml-0.5' />
                            )}
                          </button>
                        </div>

                        {/* Show Info */}
                        <h3 className='font-bold text-base text-white group-hover:text-purple-300 transition-colors truncate'>
                          {show.title}
                        </h3>
                        <p className='text-xs text-gray-400 mt-0.5 truncate'>By {show.host}</p>
                        <p className='text-[11px] text-gray-500 mt-2 line-clamp-2 leading-relaxed'>
                          {show.description}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className='mt-4 pt-3 border-t border-[#1e1e1e] flex items-center justify-between text-xs'>
                        <button
                          onClick={() => toggleFollowShow(show.id, show.title)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition flex items-center gap-1 ${
                            isFollowing
                              ? 'bg-purple-600/20 text-purple-300 border-purple-500/40'
                              : 'bg-[#181818] text-gray-400 border-gray-700 hover:text-white'
                          }`}
                        >
                          {isFollowing ? (
                            <>
                              <Check className='w-3 h-3 text-purple-400' />
                              <span>Following</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className='w-3 h-3' />
                              <span>Follow</span>
                            </>
                          )}
                        </button>

                        <button
                          type='button'
                          onClick={() => setSelectedShow(show)}
                          className='text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 hover:underline text-xs'
                        >
                          <span>{show.episodes.length} Episodes</span>
                          <ChevronRight className='w-3.5 h-3.5' />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Episode Drawer / Modal */}
      {selectedShow && (
        <div className='fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4'>
          <div className='bg-[#121212] border border-[#2a2a2a] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden'>
            {/* Modal Header */}
            <div className='p-6 border-b border-[#222222] flex items-start justify-between relative bg-gradient-to-r from-purple-950/40 via-[#181818] to-[#121212]'>
              <div className='flex gap-4 items-center'>
                <div className='w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-purple-500/30 shadow-xl bg-[#1e1e1e] flex-shrink-0'>
                  <PodcastImage
                    src={selectedShow.image}
                    alt={selectedShow.title}
                    category={selectedShow.category}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase'>
                      {selectedShow.category}
                    </span>
                    <span className='text-xs text-amber-400 font-bold'>
                      {selectedShow.rating}
                    </span>
                  </div>
                  <h3 className='text-xl font-bold text-white'>{selectedShow.title}</h3>
                  <p className='text-xs text-gray-300 mt-0.5'>
                    Hosted by {selectedShow.host} • {selectedShow.subscribers} listeners
                  </p>
                </div>
              </div>

              <button
                type='button'
                onClick={() => setSelectedShow(null)}
                className='p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-[#202020] transition'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            {/* Modal Body: Episode List */}
            <div className='p-6 overflow-y-auto space-y-3.5 flex-1'>
              <div className='flex items-center justify-between text-xs text-gray-400 font-semibold mb-2'>
                <span>AVAILABLE EPISODES ({selectedShow.episodes.length})</span>
                <span>DURATION</span>
              </div>

              {selectedShow.episodes.map((ep) => {
                const isPlaying = isEpisodePlaying(ep.title);
                const isSaved = savedEpisodes.has(ep.id);

                return (
                  <div
                    key={ep.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 group ${
                      isPlaying
                        ? 'bg-purple-950/35 border-purple-500/60 shadow-lg shadow-purple-950/50'
                        : 'bg-[#181818] border-[#262626] hover:bg-[#202020] hover:border-[#333333]'
                    }`}
                  >
                    <div className='flex items-center gap-3.5 flex-1 min-w-0'>
                      <div className='relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#222] border border-[#333]'>
                        <PodcastImage
                          src={ep.image || selectedShow.image}
                          alt={ep.title}
                          category={selectedShow.category}
                          className='w-full h-full object-cover'
                        />
                        <button
                          type='button'
                          onClick={() => handlePlayEpisode(selectedShow, ep)}
                          className={`absolute inset-0 m-auto w-8 h-8 rounded-full flex items-center justify-center transition shadow-md ${
                            isPlaying
                              ? 'bg-purple-500 text-white'
                              : 'bg-white text-black hover:bg-gray-200'
                          }`}
                          title={isPlaying ? 'Pause' : 'Play Episode'}
                        >
                          {isPlaying ? (
                            <Pause className='w-3.5 h-3.5 fill-white text-white' />
                          ) : (
                            <Play className='w-3.5 h-3.5 fill-black text-black ml-0.5' />
                          )}
                        </button>
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2'>
                          <span className='text-[10px] font-bold text-purple-400'>
                            EPISODE {ep.number}
                          </span>
                          <span className='text-[10px] text-gray-500'>• {ep.date}</span>
                        </div>
                        <h4
                          onClick={() => handlePlayEpisode(selectedShow, ep)}
                          className={`text-sm font-bold truncate cursor-pointer hover:underline ${
                            isPlaying ? 'text-purple-300' : 'text-white'
                          }`}
                        >
                          {ep.title}
                        </h4>
                        <p className='text-xs text-gray-400 mt-0.5 line-clamp-1'>{ep.desc}</p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3 flex-shrink-0'>
                      <span className='text-xs font-mono text-gray-400'>{ep.duration}</span>

                      {/* Bookmark Button */}
                      <button
                        type='button'
                        onClick={() => toggleSaveEpisode(ep.id, ep.title)}
                        className={`p-1.5 rounded-full transition ${
                          isSaved
                            ? 'text-purple-400 bg-purple-500/10'
                            : 'text-gray-500 hover:text-white'
                        }`}
                        title={isSaved ? 'Saved' : 'Save Episode'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className='p-4 border-t border-[#222222] bg-[#161616] flex justify-end'>
              <button
                type='button'
                onClick={() => setSelectedShow(null)}
                className='px-5 py-2 rounded-full bg-[#242424] hover:bg-[#303030] text-white text-xs font-semibold transition'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Podcasts;