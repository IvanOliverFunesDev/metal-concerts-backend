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
