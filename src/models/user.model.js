import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true // esto puede que tenga que quitarlo de alguna manera no?
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetPasswordCode: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  favoriteConcerts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Concert'
  }],
  subscribedBands: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Band'
  }]
}, {
  timestamps: true,
});

export default mongoose.model('User', userSchema);
