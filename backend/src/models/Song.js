import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Song name is required'],
        trim: true
    },
    desc: {
        type: String,
        default: '',
        trim: true
    },
    album: {
        type: String,
        default: 'Unknown Album'
    },
    artist: {
        type: String,
        default: 'Unknown Artist'
    },
    image: {
        type: String,
        required: [true, 'Song image is required']
    },
    file: {
        type: String,
        required: [true, 'Song file is required']
    },
    duration: {
        type: String,
        required: [true, 'Song duration is required']
    },
    plays: {
        type: Number,
        default: 0
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Method to increment play count
songSchema.methods.incrementPlays = async function() {
    this.plays += 1;
    await this.save();
};

const Song = mongoose.model('Song', songSchema);

export default Song;
