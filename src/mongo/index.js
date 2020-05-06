import mongoose from 'mongoose'

const mongoUri = process.env.MONGO

mongoose.connect(mongoUri, {
  useNewUrlParser   : true,
  useUnifiedTopology: true
})

const connection = mongoose.connection

export { connection }