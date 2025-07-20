// models/Document.js
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        default: '',
        trim: true,
        maxlength: 500
    },
    fileUrl: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        enum: ['pdf', 'image', 'doc', 'txt', 'zip', 'other'],
        default: 'other'
    },
    isPrivate: {
        type: Boolean,
        default: true
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    timestamps: true,
});

export default mongoose.models.Document || mongoose.model('Document', documentSchema);
