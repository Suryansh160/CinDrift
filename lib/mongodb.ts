import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI!
const globalForMongo = globalThis as unknown as {
  _mongo?: Promise<MongoClient>
}

const clientPromise =
  globalForMongo._mongo ??
  (globalForMongo._mongo = new MongoClient(uri).connect())

export default clientPromise
