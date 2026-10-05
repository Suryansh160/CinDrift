import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: String, // bcrypt hash; absent for OAuth-only users
    provider: { type: String, default: 'credentials' }
  },
  { timestamps: true }
)

const BookingSchema = new Schema(
  {
    userId: { type: String, required: true },
    movieId: { type: Number, required: true },
    movieTitle: String,
    showtime: String,
    seats: [String],
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    stripeSessionId: String
  },
  { timestamps: true }
)

export type UserDoc = InferSchemaType<typeof UserSchema>
export type BookingDoc = InferSchemaType<typeof BookingSchema>

export const User: Model<UserDoc> =
  mongoose.models.User || mongoose.model<UserDoc>('User', UserSchema)
export const Booking: Model<BookingDoc> =
  mongoose.models.Booking ||
  mongoose.model<BookingDoc>('Booking', BookingSchema)
