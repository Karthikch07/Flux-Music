import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Song from '../models/Song.js';
import Playlist from '../models/Playlist.js';

dotenv.config();

const deduplicateDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🔍 Connected to MongoDB for deduplication check...');

        const allSongs = await Song.find().sort({ createdAt: 1 });
        console.log(`📊 Total songs in database: ${allSongs.length}`);

        const seen = new Map();
        const duplicateIds = [];
        const duplicatesList = [];

        for (const song of allSongs) {
            const key = `${song.name.trim().toLowerCase()}:::${(song.artist || '').trim().toLowerCase()}`;
            if (seen.has(key)) {
                duplicateIds.push(song._id);
                duplicatesList.push({
                    name: song.name,
                    artist: song.artist,
                    id: song._id,
                    keptId: seen.get(key)
                });
            } else {
                seen.set(key, song._id);
            }
        }

        if (duplicateIds.length === 0) {
            console.log('✨ No duplicate songs found! Every song in your database is unique.');
        } else {
            console.log(`⚠️  Found ${duplicateIds.length} duplicate song(s):`);
            duplicatesList.forEach((d, i) => {
                console.log(`   ${i + 1}. Duplicate: "${d.name}" by ${d.artist} (ID: ${d.id}) -> Keeping ID: ${d.keptId}`);
            });

            // Delete duplicate songs
            const deleteResult = await Song.deleteMany({ _id: { $in: duplicateIds } });
            console.log(`🗑️  Deleted ${deleteResult.deletedCount} duplicate songs from database.`);

            // Clean up any references in playlists
            const updateResult = await Playlist.updateMany(
                { songs: { $in: duplicateIds } },
                { $pull: { songs: { $in: duplicateIds } } }
            );
            console.log(`🧹 Cleaned up playlist song references.`);
        }

        // Also deduplicate song IDs inside individual playlists
        const playlists = await Playlist.find({});
        let playlistsCleaned = 0;
        for (const pl of playlists) {
            const initialLen = pl.songs.length;
            const uniqueSongIds = Array.from(new Set(pl.songs.map(s => s.toString())));
            if (uniqueSongIds.length < initialLen) {
                pl.songs = uniqueSongIds;
                await pl.save();
                playlistsCleaned++;
                console.log(`   Cleaned ${initialLen - uniqueSongIds.length} duplicate songs in playlist "${pl.name}"`);
            }
        }
        if (playlistsCleaned > 0) {
            console.log(`🧹 Fixed internal duplicates in ${playlistsCleaned} playlist(s).`);
        }

        const finalCount = await Song.countDocuments();
        console.log(`✅ Deduplication complete! Total active songs: ${finalCount}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during deduplication:', error.message);
        process.exit(1);
    }
};

deduplicateDatabase();

