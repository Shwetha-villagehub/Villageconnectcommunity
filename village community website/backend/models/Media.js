import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  url: { type: String, required: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Media', MediaSchema);
