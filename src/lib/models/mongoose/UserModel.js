// models/User.js
import mongoose from 'mongoose';

const EntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    default: '',
    trim: true,
    maxlength: 600,
  },
  status: {
    type: String,
    enum: ['active', 'trash', 'archived'],
    default: 'active',
  },
  entry_date: {
    type: String,
  },
}, { timestamps: true });

const MoodSchema = new mongoose.Schema({
  mood: {
    type: String,
    default: 'neutral',
    trim: true,
  },
  secondary_mood: {
    type: String,
    default: 'neutral',
    trim: true,
  },
  mood_comment: {
    type: String,
    trim: true,
    maxlength: 300,
  },
  status: {
    type: String,
    enum: ['active', 'trash', 'archived'],
    default: 'active',
  },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  authProvider: {
    type: [String],
    required: true,
    default: ['credentials'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  profile: {
    bio: { type: String, default: '', trim: true },
    avatar: { type: String, default: '' },
  },
  entries_data: {
    type: [EntrySchema],
    default: [],
  },
  moods_data: {
    type: [MoodSchema],
    default: [],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
