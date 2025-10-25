import React from 'react';
import Navbar from './Navbar';

const Podcasts = () => {
    const podcastCategories = [
        { name: 'Technology', count: 125, color: 'bg-blue-500' },
        { name: 'Business', count: 98, color: 'bg-green-500' },
        { name: 'True Crime', count: 87, color: 'bg-red-500' },
        { name: 'Comedy', count: 156, color: 'bg-yellow-500' },
        { name: 'Education', count: 74, color: 'bg-purple-500' },
        { name: 'Health & Fitness', count: 63, color: 'bg-pink-500' },
        { name: 'News & Politics', count: 92, color: 'bg-orange-500' },
        { name: 'Sports', count: 81, color: 'bg-indigo-500' },
    ];

    const featuredPodcasts = [
        { 
            title: 'Tech Talk Daily', 
            host: 'Sarah Johnson',
            episodes: 342,
            description: 'Latest technology news and insights'
        },
        { 
            title: 'Business Minds', 
            host: 'Michael Chen',
            episodes: 215,
            description: 'Interviews with successful entrepreneurs'
        },
        { 
            title: 'Mystery & Crime', 
            host: 'Emma Davis',
            episodes: 156,
            description: 'True crime stories that captivate'
        },
        { 
            title: 'The Comedy Hour', 
            host: 'James Wilson',
            episodes: 289,
            description: 'Stand-up comedy and hilarious stories'
        },
    ];

    return (
        <>
            <Navbar />
            <div className='mb-4 mt-6'>
                <h1 className='text-3xl font-bold mb-2'>Browse Podcasts</h1>
                <p className='text-gray-400'>Discover amazing podcasts across different categories</p>
            </div>

            {/* Categories */}
            <div className='mb-8'>
                <h2 className='text-2xl font-bold mb-4'>Categories</h2>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {podcastCategories.map((category, index) => (
                        <div 
                            key={index}
                            className={`${category.color} rounded-lg p-6 cursor-pointer hover:scale-105 transition`}
                        >
                            <h3 className='text-white font-bold text-xl mb-2'>{category.name}</h3>
                            <p className='text-white/80 text-sm'>{category.count} podcasts</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Podcasts */}
            <div className='mb-8'>
                <h2 className='text-2xl font-bold mb-4'>Featured Podcasts</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {featuredPodcasts.map((podcast, index) => (
                        <div 
                            key={index}
                            className='bg-gray-900/50 rounded-lg p-4 hover:bg-gray-800/50 transition cursor-pointer'
                        >
                            <div className='flex gap-4'>
                                <div className='w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0'>
                                    <span className='text-4xl'>🎙️</span>
                                </div>
                                <div className='flex-1'>
                                    <h3 className='text-white font-bold text-lg mb-1'>{podcast.title}</h3>
                                    <p className='text-gray-400 text-sm mb-2'>by {podcast.host}</p>
                                    <p className='text-gray-500 text-sm mb-2'>{podcast.description}</p>
                                    <p className='text-purple-400 text-sm'>{podcast.episodes} episodes</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coming Soon Note */}
            <div className='bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 text-center'>
                <h3 className='text-xl font-bold text-purple-400 mb-2'>🎧 Podcast Player Coming Soon!</h3>
                <p className='text-gray-400'>
                    We're working on bringing you a full podcast listening experience. 
                    Stay tuned for updates!
                </p>
            </div>
        </>
    );
};

export default Podcasts;
