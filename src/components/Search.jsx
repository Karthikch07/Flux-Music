import React, { useState } from 'react'
import Navbar from './Navbar'
import { albumsData, songsData } from '../assets/assets'
import AlbumItem from './AlbumItem'
import SongItem from './SongItem'
const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAlbums, setFilteredAlbums] = useState(albumsData);
    const [filteredSongs, setFilteredSongs] = useState(songsData);
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        if (value === '') {
            setFilteredAlbums(albumsData);
            setFilteredSongs(songsData);
        } else {
            const albums = albumsData.filter(album => 
                album.name.toLowerCase().includes(value) || 
                album.desc.toLowerCase().includes(value)
            );
            const songs = songsData.filter(song => 
                song.name.toLowerCase().includes(value) || 
                song.desc.toLowerCase().includes(value)
            );
            setFilteredAlbums(albums);
            setFilteredSongs(songs);
        }
    };
    return (
        <>
            <Navbar />
            <div className='mt-10'>
                <div className='flex items-center justify-center mb-8'>
                    <input
                        type="text"
                        placeholder="Search for songs, albums..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className='w-[80%] md:w-[60%] px-6 py-3 rounded-full bg-[#242424] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500'
                    />
                </div>
                {searchTerm && (
                    <div>
                        {filteredAlbums.length > 0 && (
                            <div className='mb-8'>
                                <h2 className='text-2xl font-bold mb-4'>Albums</h2>
                                <div className='flex overflow-auto gap-4'>
                                    {filteredAlbums.map((item, index) => (
                                        <AlbumItem key={index} name={item.name} desc={item.desc} image={item.image} id={item.id} />
                                    ))}
                                </div>
                            </div>
                        )}
                        {filteredSongs.length > 0 && (
                            <div className='mb-8'>
                                <h2 className='text-2xl font-bold mb-4'>Songs</h2>
                                <div className='flex overflow-auto gap-4'>
                                    {filteredSongs.map((item, index) => (
                                        <SongItem key={index} name={item.name} desc={item.desc} image={item.image} id={item.id} />
                                    ))}
                                </div>
                            </div>
                        )}
                        {filteredAlbums.length === 0 && filteredSongs.length === 0 && (
                            <div className='text-center text-gray-400 mt-16'>
                                <p className='text-xl'>No results found for "{searchTerm}"</p>
                                <p className='text-sm mt-2'>Try searching for something else</p>
                            </div>
                        )}
                    </div>
                )}
                {!searchTerm && (
                    <div className='text-center text-gray-400 mt-16'>
                        <p className='text-xl'>Start typing to search for music</p>
                    </div>
                )}
            </div>
        </>
    )
}
export default Search
