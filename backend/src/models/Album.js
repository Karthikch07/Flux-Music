import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Album name is required'],
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Album image is required']
    },
    desc: {
        type: String,
        default: '',
        trim: true
    },
    bgColor: {
        type: String,
        default: '#121212'
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }]
}, {
    timestamps: true
});

const Album = mongoose.model('Album', albumSchema);
export default Album;

