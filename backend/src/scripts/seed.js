import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Song from '../models/Song.js';
dotenv.config();
const seedSongs = [
    {
        name: "Song One",
        desc: "Put a smile on your face with these happy tunes",
        album: "Album 1",
        artist: "Artist 1",
        image: "img1.jpg",
        file: "song1.mp3",
        duration: "3:00"
    },
    {
        name: "Song Two",
        desc: "Catch up on the most recent tracks",
        album: "Album 2",
        artist: "Artist 2",
        image: "img2.jpg",
        file: "song2.mp3",
        duration: "2:20"
    },
    {
        name: "Song Three",
        desc: "Get ready for some amazing beats",
        album: "Album 3",
        artist: "Artist 3",
        image: "img3.jpg",
        file: "song3.mp3",
        duration: "2:32"
    }
];
const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Ã¢Å“â€¦ MongoDB Connected for seeding');
        await Song.deleteMany({});
        console.log('Ã°Å¸â€”â€˜Ã¯Â¸Â  Cleared existing songs');
        const songs = await Song.insertMany(seedSongs);
        console.log(`Ã¢Å“â€¦ Successfully seeded ${songs.length} songs:`);
        songs.forEach((song, index) => {
            console.log(`   ${index + 1}. ${song.name} - ${song.artist}`);
        });
        await mongoose.disconnect();
        console.log('Ã¢Å“â€¦ Database seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Ã¢ÂÅ’ Error seeding database:', error.message);
        process.exit(1);
    }
};
seedDatabase();
