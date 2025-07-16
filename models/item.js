import mongoose from 'mongoose';

const item_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: false
    },
    taken: {
        type: Boolean,
        default: false
    },
    relatedTo: {
        type: String,
        required: true
    },
    takenBy: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    takenAt: {
        type: Date,
        default: null
    }
})


export default mongoose.models.items || mongoose.model('items', item_schema);