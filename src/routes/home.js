import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
  res.send({
    message: 'Welcome to ACECOM\'s Covid-19 API'
  })
})

export { router as Home }
