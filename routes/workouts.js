import express from 'express'

const router = express.Router()


router.get('/', (req, res) => {
  res.status(200).json({
    message: 'GET all workouts'
  })
})


router.get('/:id', (req, res) => {
  const { id } = req.params
  res.status(200).json({
    message: `GET workout with id ${id}`
  })
})


router.post('/', (req, res) => {
  res.status(201).json({
    message: 'POST a new workout'
  })
})


router.patch('/:id', (req, res) => {
  res.status(200).json({
    message: `PATCH workout with id ${req.params.id}`
  })
})


router.delete('/:id', (req, res) => {
  res.status(200).json({
    message: `DELETE workout with id ${req.params.id}`
  })
})

export default router
