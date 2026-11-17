import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { assets } from '../assets/assets';

const AlbumItem = ({ image, name, desc, id }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/album/${id}`)} 
      className='min-w-[135px] sm:min-w-[180px] max-w-[135px] sm:max-w-[180px] p-2 sm:p-2.5 px-2 sm:px-3 rounded-xl cursor-pointer hover:bg-[#181818] transition-all duration-200 group relative border border-transparent hover:border-[#2a2a2a]'
    >
      <div className='relative overflow-hidden rounded-lg shadow-md aspect-square bg-[#1a1a1a]'>
        <img 
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' 
          src={image || assets.img1} 
          alt={name} 
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = assets.img1;
          }}
        />
        
        {/* Floating Play Icon on Album hover */}
        <div 
          className='absolute right-2.5 bottom-2.5 w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-xl shadow-black/50 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:scale-110 active:scale-95'
          title={`Play ${name}`}
        >
          <Play className='w-4 h-4 fill-white text-white ml-0.5' />
        </div>
      </div>
      <p className='font-bold mt-2.5 mb-1 text-sm text-white truncate group-hover:text-purple-300 transition-colors'>
        {name}
      </p>
      <p className='text-gray-400 text-xs truncate'>{desc}</p>
    </div>
  );
};

export default AlbumItem;
