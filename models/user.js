import mongoose from "mongoose";

const user_schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        default: []
    }],
    selectedItems: [{
        type: mongoose.Schema.Types.ObjectId,
        default: []
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.users || mongoose.model('users', user_schema);