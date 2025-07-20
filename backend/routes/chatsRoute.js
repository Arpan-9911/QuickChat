import express from 'express'
import { getAllChats, newChat, newImage, newFile, markAsRead } from '../controllers/chatsController.js'
import auth from '../middleware/auth.js'
import upload from '../middleware/multer.js'

const router = express.Router()

router.get('/:id', auth, getAllChats)
router.post('/new/text/:id', auth, newChat)
router.post('/new/image/:id', auth, upload.single('image'), newImage)
router.post('/new/file/:id', auth, upload.single('file'), newFile)
router.put('/mark-as-read/:id', auth, markAsRead)

export default router