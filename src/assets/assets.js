import bell_icon from './bell.png'
import home_icon from './home.png'
import like_icon from './like.png'
import loop_icon from './loop.png'
import mic_icon from './mic.png'
import next_icon from './next.png'
import play_icon from './play.png'
import pause_icon from './pause.png'
import plays_icon from './plays.png'
import prev_icon from './prev.png'
import search_icon from './search.png'
import shuffle_icon from './shuffle.png'
import speaker_icon from './speaker.png'
import stack_icon from './stack.png'
import zoom_icon from './zoom.png'
import plus_icon from './plus.png'
import arrow_icon from './arrow.png'
import mini_player_icon from './mini-player.png'
import queue_icon from './queue.png'
import volume_icon from './volume.png'
import arrow_right from './right_arrow.png'
import arrow_left from './left_arrow.png'
import spotify_logo from './spotify_logo.png'
import flux_logo from './FluxMusic_logo.png'
import clock_icon from './clock_icon.png'
import img1 from './img1.jpg'
import img2 from './img2.jpg'
import img3 from './img3.jpg'
import img4 from './img4.jpg'
import img5 from './img5.jpg'
import img6 from './img6.jpg'
import img7 from './img7.jpg'
import img8 from './img8.jpg'
import img9 from './img9.jpg'
import img10 from './img10.jpg'
import img11 from './img11.jpg'
import img12 from './img12.jpg'
import img13 from './img13.jpg'
import img14 from './img14.jpg'
import img15 from './img15.jpg'
import img16 from './img16.jpg'
import song1 from  './song1.mp3'
import song2 from  './song2.mp3'
import song3 from  './song3.mp3'
export const assets = {
    bell_icon,
    home_icon,
    like_icon,
    loop_icon,
    mic_icon,
    next_icon,
    play_icon,
    plays_icon,
    prev_icon,
    search_icon,
    shuffle_icon,
    speaker_icon,
    stack_icon,
    zoom_icon,
    plus_icon,
    arrow_icon,
    mini_player_icon,
    volume_icon,
    queue_icon,
    pause_icon,
    arrow_left,
    arrow_right,
    spotify_logo,
    flux_logo,
    clock_icon,
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12,
    img13,
    img14,
    img15,
    img16,
    song1,
    song2,
    song3
}
export const albumsData = [
    {   
        id:0,
        name: "Top 50 Global",
        image: img8,
        desc:"Your weekly update of the most played tracks",
        bgColor:"#2a4365"
    },
    {   
        id:1,
        name: "Top 50 India",
        image: img9,
        desc:"Your weekly update of the most played tracks",
        bgColor:"#22543d"
    },
    {   
        id:2,
        name: "Trending India",
        image: img10,
        desc:"Your weekly update of the most played tracks",
        bgColor:"#742a2a"
    },
    {   
        id:3,
        name: "Trending Global",
        image: img16,
        desc:"Your weekly update of the most played tracks",
        bgColor:"#44337a"
    },
    {   
        id:4,
        name: "Mega Hits",
        image: img11,
        desc:"Your weekly update of the most played tracks",
        bgColor:"#234e52"
    },
    {   
        id:5,
        name: "Happy Favorites",
        image: img15,
        desc:"Your weekly update of the most played tracks",
        bgColor:"#744210"
    }
]

export const imageMap = {
    'img1': img1, 'img1.jpg': img1,
    'img2': img2, 'img2.jpg': img2,
    'img3': img3, 'img3.jpg': img3,
    'img4': img4, 'img4.jpg': img4,
    'img5': img5, 'img5.jpg': img5,
    'img6': img6, 'img6.jpg': img6,
    'img7': img7, 'img7.jpg': img7,
    'img8': img8, 'img8.jpg': img8,
    'img9': img9, 'img9.jpg': img9,
    'img10': img10, 'img10.jpg': img10,
    'img11': img11, 'img11.jpg': img11,
    'img12': img12, 'img12.jpg': img12,
    'img13': img13, 'img13.jpg': img13,
    'img14': img14, 'img14.jpg': img14,
    'img15': img15, 'img15.jpg': img15,
    'img16': img16, 'img16.jpg': img16
};

export const songAudioMap = {
    'song1': song1, 'song1.mp3': song1,
    'song2': song2, 'song2.mp3': song2,
    'song3': song3, 'song3.mp3': song3
};

export const resolveSongImage = (img) => {
    if (!img) return img1;
    if (typeof img === 'string') {
        const basename = img.split('/').pop().split('\\').pop();
        if (imageMap[basename]) return imageMap[basename];
        if (imageMap[img]) return imageMap[img];
    }
    return img;
};

export const resolveSongAudio = (file) => {
    if (!file) return song1;
    if (typeof file === 'string') {
        const basename = file.split('/').pop().split('\\').pop();
        if (songAudioMap[basename]) return songAudioMap[basename];
        if (songAudioMap[file]) return songAudioMap[file];
    }
    return file;
};

export const availableArtworkList = [
    { label: 'Cover 1 (Acoustic Sunrise)', value: 'img1.jpg', src: img1 },
    { label: 'Cover 2 (Sunset Chill)', value: 'img2.jpg', src: img2 },
    { label: 'Cover 3 (Neon Dusk)', value: 'img3.jpg', src: img3 },
    { label: 'Cover 4 (Ocean Deep)', value: 'img4.jpg', src: img4 },
    { label: 'Cover 5 (Morning Glow)', value: 'img5.jpg', src: img5 },
    { label: 'Cover 6 (Electric Sky)', value: 'img6.jpg', src: img6 },
    { label: 'Cover 7 (Forest Trail)', value: 'img7.jpg', src: img7 },
    { label: 'Cover 8 (Global Top)', value: 'img8.jpg', src: img8 },
    { label: 'Cover 9 (India Top)', value: 'img9.jpg', src: img9 },
    { label: 'Cover 10 (Trending Flame)', value: 'img10.jpg', src: img10 },
    { label: 'Cover 11 (Mega Hits)', value: 'img11.jpg', src: img11 },
    { label: 'Cover 12 (Urban Beats)', value: 'img12.jpg', src: img12 },
    { label: 'Cover 13 (Cosmic Reverie)', value: 'img13.jpg', src: img13 },
    { label: 'Cover 14 (Moonlight Night)', value: 'img14.jpg', src: img14 },
    { label: 'Cover 15 (Happy Acoustic)', value: 'img15.jpg', src: img15 },
    { label: 'Cover 16 (Deep Purple Wave)', value: 'img16.jpg', src: img16 }
];

export const availableAudioTracks = [
    { label: 'Audio Track 1 (Gentle Melodic)', value: 'song1.mp3', file: song1, duration: '3:00' },
    { label: 'Audio Track 2 (Upbeat Groove)', value: 'song2.mp3', file: song2, duration: '2:20' },
    { label: 'Audio Track 3 (Ambient Synth)', value: 'song3.mp3', file: song3, duration: '2:32' }
];
export const songsData = [
    {
        id:0,
        name: "Melody Dreams",
        image: img1,
        file:song1,
        desc:"Relaxing instrumental vibes",
        duration:"3:00"
    },
    {
        id:1,
        name: "Summer Breeze",
        image: img2,
        file:song2,
        desc:"Chill beats for your day",
        duration:"2:20"
    },
    {
        id:2,
        name: "Night Lights",
        image: img3,
        file:song3,
        desc:"Evening ambient sounds",
        duration:"2:32"
    },
    {
        id:3,
        name: "Ocean Waves",
        image: img4,
        file:song1,
        desc:"Peaceful ocean melody",
        duration:"2:50"
    },
    {
        id:4,
        name: "Sunrise Harmony",
        image: img5,
        file:song2,
        desc:"Morning energy boost",
        duration:"3:10"
    },
    {
        id:5,
        name: "Moonlight Serenade",
        image: img14,
        file:song3,
        desc:"Gentle nighttime tunes",
        duration:"2:45"
    },
    {
        id:6,
        name: "Forest Echo",
        image: img7,
        file:song1,
        desc:"Nature inspired sounds",
        duration:"2:18"
    },
    {
        id:7,
        name: "Urban Rhythm",
        image: img12,
        file:song2,
        desc:"City life background music",
        duration:"2:35"
    }
]
