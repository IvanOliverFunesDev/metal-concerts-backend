import mongoose from 'mongoose';

const concertsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  band: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Band',
    requred: true
  },
  averageRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
});

export default mongoose.model('Concert', concertsSchema);
