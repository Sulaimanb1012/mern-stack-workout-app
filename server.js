import express from 'express'

const app = express()


app.use(express.json())


app.get('/', (req, res) => {
  res.status(200).send('Hello MERN Stack')
})


import workoutRoutes from './routes/workouts.js'
app.use('/api/workouts', workoutRoutes)


const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
