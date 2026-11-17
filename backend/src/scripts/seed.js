import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Song from '../models/Song.js';
import Album from '../models/Album.js';

dotenv.config();

const seedAlbums = [
    {   
        id: 0,
        name: "Top 50 Global",
        image: "img8.jpg",
        desc: "Your weekly update of the most played tracks globally",
        bgColor: "#2a4365"
    },
    {   
        id: 1,
        name: "Top 50 India",
        image: "img9.jpg",
        desc: "Trending chartbusters from across the nation",
        bgColor: "#22543d"
    },
    {   
        id: 2,
        name: "Trending India",
        image: "img10.jpg",
        desc: "The most viral hits taking India by storm",
        bgColor: "#742a2a"
    },
    {   
        id: 3,
        name: "Trending Global",
        image: "img16.jpg",
        desc: "Catch what listeners worldwide are obsessing over",
        bgColor: "#44337a"
    },
    {   
        id: 4,
        name: "Mega Hits",
        image: "img11.jpg",
        desc: "Unstoppable anthems and stadium-sized bangers",
        bgColor: "#234e52"
    },
    {   
        id: 5,
        name: "Happy Favorites",
        image: "img15.jpg",
        desc: "Feel-good acoustic and melodic vibes to lift your mood",
        bgColor: "#744210"
    }
];

const seedSongs = [
    {
        name: "Melody Dreams",
        desc: "Relaxing instrumental vibes and gentle piano chords",
        album: "Top 50 Global",
        artist: "Aura Sound",
        image: "img1.jpg",
        file: "song1.mp3",
        duration: "3:00"
    },
    {
        name: "Summer Breeze",
        desc: "Chill beats for sunny afternoons and coastal drives",
        album: "Top 50 India",
        artist: "Solaris Duo",
        image: "img2.jpg",
        file: "song2.mp3",
        duration: "2:20"
    },
    {
        name: "Night Lights",
        desc: "Evening ambient sounds and warm synths",
        album: "Trending India",
        artist: "Luna Beat",
        image: "img3.jpg",
        file: "song3.mp3",
        duration: "2:32"
    },
    {
        name: "Ocean Waves",
        desc: "Peaceful ocean melody with rhythmic soft percussion",
        album: "Trending Global",
        artist: "Deep Blue",
        image: "img4.jpg",
        file: "song1.mp3",
        duration: "2:50"
    },
    {
        name: "Sunrise Harmony",
        desc: "Morning energy boost to start your day with focus",
        album: "Mega Hits",
        artist: "Ray Dawn",
        image: "img5.jpg",
        file: "song2.mp3",
        duration: "3:10"
    },
    {
        name: "Moonlight Serenade",
        desc: "Gentle nighttime tunes for restful evenings",
        album: "Happy Favorites",
        artist: "Nocturne",
        image: "img14.jpg",
        file: "song3.mp3",
        duration: "2:45"
    },
    {
        name: "Forest Echo",
        desc: "Nature inspired acoustic sounds and forest atmosphere",
        album: "Top 50 Global",
        artist: "Woodland Project",
        image: "img7.jpg",
        file: "song1.mp3",
        duration: "2:18"
    },
    {
        name: "Urban Rhythm",
        desc: "City life background music with energetic basslines",
        album: "Top 50 India",
        artist: "Metro Groove",
        image: "img12.jpg",
        file: "song2.mp3",
        duration: "2:35"
    },
    {
        name: "Electric Horizon",
        desc: "Pulsing retro synthesizer vibes under twilight skies",
        album: "Trending Global",
        artist: "Neon Sky",
        image: "img6.jpg",
        file: "song3.mp3",
        duration: "2:40"
    },
    {
        name: "Cosmic Reverie",
        desc: "Spacious ethereal soundscapes and dreamy reverbs",
        album: "Mega Hits",
        artist: "Starlight Echo",
        image: "img13.jpg",
        file: "song1.mp3",
        duration: "3:05"
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected for seeding');

        // Clear existing songs and albums
        await Song.deleteMany({});
        await Album.deleteMany({});
        console.log('🗑️  Cleared existing songs and albums');

        // Deduplicate songs before inserting (safety check)
        const uniqueSongsMap = new Map();
        for (const s of seedSongs) {
            const key = `${s.name.toLowerCase()}:::${s.artist.toLowerCase()}`;
            if (!uniqueSongsMap.has(key)) {
                uniqueSongsMap.set(key, s);
            }
        }
        const cleanSongs = Array.from(uniqueSongsMap.values());

        // Insert Songs
        const insertedSongs = await Song.insertMany(cleanSongs);
        console.log(`✅ Successfully seeded ${insertedSongs.length} unique songs:`);
        insertedSongs.forEach((song, index) => {
            console.log(`   ${index + 1}. "${song.name}" by ${song.artist} [${song.album}]`);
        });

        // Insert Albums and link songs
        for (const albumData of seedAlbums) {
            const matchingSongIds = insertedSongs
                .filter(s => s.album === albumData.name)
                .map(s => s._id);
            await Album.create({
                ...albumData,
                songs: matchingSongIds
            });
        }
        console.log(`✅ Successfully seeded ${seedAlbums.length} albums with linked songs.`);

        await mongoose.disconnect();
        console.log('🎉 Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
};

seedDatabase();
