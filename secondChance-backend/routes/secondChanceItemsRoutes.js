const express = require('express')
const multer = require('multer')
const router = express.Router()
const connectToDatabase = require('../models/db')
const logger = require('../logger')

// Define the upload directory path
const directoryPath = 'public/images'

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, directoryPath) // Use shorthand
  },
  filename(req, file, cb) {
    cb(null, file.originalname) // Use shorthand
  },
}) // Trailing comma removed

const upload = multer({ storage }) // Use shorthand

// Get all secondChanceItems
router.get('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('secondChanceItems')
    const secondChanceItems = await collection.find({}).toArray()
    res.json(secondChanceItems)
  } catch (e) {
    logger.console.error('Something went wrong ', e)
    next(e)
  }
})

// Get a single secondChanceItem by ID
router.get('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('secondChanceItems')
    const id = req.params.id
    const secondChanceItem = await collection.findOne({ id })

    if (!secondChanceItem) {
      return res.status(404).send('secondChanceItem not found')
    }

    res.json(secondChanceItem)
  } catch (e) {
    next(e)
  }
})

// Add a new item
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('secondChanceItems')
    const lastItemQuery = await collection.find().sort({ id: -1 }).limit(1)
    let secondChanceItem = req.body

    await lastItemQuery.forEach((item) => {
      secondChanceItem.id = (parseInt(item.id) + 1).toString()
    })
    const dateAdded = Math.floor(new Date().getTime() / 1000) // camelCase
    secondChanceItem.dateAdded = dateAdded // camelCase

    secondChanceItem = await collection.insertOne(secondChanceItem)
    console.log(secondChanceItem)
    res.status(201).json(secondChanceItem)
  } catch (e) {
    next(e)
  }
})

// Update an existing item
router.put('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('secondChanceItems')
    const id = req.params.id
    const secondChanceItem = await collection.findOne({ id })

    if (!secondChanceItem) {
      logger.error('secondChanceItem not found')
      return res.status(404).json({ error: 'secondChanceItem not found' })
    }

    secondChanceItem.category = req.body.category
    secondChanceItem.condition = req.body.condition
    secondChanceItem.age_days = req.body.age_days
    secondChanceItem.description = req.body.description
    secondChanceItem.age_years = Number(
      (secondChanceItem.age_days / 365).toFixed(1)
    )
    secondChanceItem.updatedAt = new Date()

    const updatedItem = await collection.findOneAndUpdate(
      // new variable name
      { id },
      { $set: secondChanceItem },
      { returnDocument: 'after' }
    )

    if (updatedItem) {
      res.json({ uploaded: 'success' }) // property shorthand
    } else {
      res.json({ uploaded: 'failed' }) // property shorthand
    }
  } catch (e) {
    next(e)
  }
})

// Delete an existing item
router.delete('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('secondChanceItems')
    const id = req.params.id
    const secondChanceItem = await collection.findOne({ id })

    if (!secondChanceItem) {
      logger.error('secondChanceItem not found')
      return res.status(404).json({ error: 'secondChanceItem not found' })
    }

    await collection.deleteOne({ id }) // Remove assignment to unused variable

    res.json({ deleted: 'success' }) // property shorthand
  } catch (e) {
    next(e)
  }
})

module.exports = router
