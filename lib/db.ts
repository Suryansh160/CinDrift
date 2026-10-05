import mongoose from 'mongoose'

const g = global as typeof globalThis & { _mongoose?: Promise<typeof mongoose> }

export function connectDB () {
  if (!g._mongoose) g._mongoose = mongoose.connect(process.env.MONGODB_URI!)
  return g._mongoose
}
