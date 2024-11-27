import mongoose from 'mongoose';

const audioSchema = new mongoose.Schema({
    text: {
        type: String
    },
    date: {
        type: Date
    },
    audioUrl: String
});

const Audiopost = mongoose.models.Audiopost || mongoose.model('Audiopost', audioSchema);

export default Audiopost;