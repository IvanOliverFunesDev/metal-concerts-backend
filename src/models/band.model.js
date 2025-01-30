import mongoose from 'mongoose';
import { GENRES } from '../constants/genres.js';

const bandsSchema = new mongoose.Schema({
  bandName: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
    enum: GENRES, // 🔥 Solo permitirá valores de la lista
    trim: true,
  },
  image: {
    type: String,
    trim: true
  },
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'reject'],
    default: 'pending'
  },
  resetPasswordCode: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export default mongoose.model('Band', bandsSchema);
