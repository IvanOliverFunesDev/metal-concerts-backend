import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
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
