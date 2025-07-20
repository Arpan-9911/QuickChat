import express from 'express'
import { sendOTP, verifyOTP, createAccount, getAllUsers, updateProfile } from '../controllers/userController.js'
import upload from '../middleware/multer.js'
import auth from '../middleware/auth.js'

const router = express.Router()
router.post('/send-otp', sendOTP)
router.post('/verify-otp', verifyOTP)
router.post('/create', upload.single('profilePic'), createAccount)
router.get('/all', auth, getAllUsers)
router.post('/update', auth, upload.single('profilePic'), updateProfile)

export default router