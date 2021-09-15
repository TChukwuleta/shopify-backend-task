const express = require('express')
const router = express.Router()
const { requireAuth, checkUser } = require('../middleware/auth')
const userController = require('../controllers/userController')
const multer = require('multer')

// Multer configuration
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

// const multerFiler = (req, file, cb) => {
//   if(file.mimetype.split('/')[1] === 'png' || file.mimetype.split('/')[1] === 'jpg'){
//     cb(null, true)
//   }
//   else{
//     cb(new Error('Not an Image'), false)
//   }
// }

const upload = multer({
  storage: multerStorage
})
 

// Check all routes for user
router.get('*', checkUser)

// Get the home page
router.get('/', userController.homePage) 

// Register users
router.get('/register', userController.signUpGet)
router.post('/register', userController.signUpPost) 

// Login users
router.get('/login', userController.signInGet)
router.post('/login', userController.signInPost)

// images 
router.get('/dashboard', requireAuth, userController.getDashboard)

// Uploading images
router.post('/dashboard', upload.single('image'), userController.postImage)

// logout
router.get('/logout', userController.logoutGet)

// TEst route
router.get('/test', requireAuth, userController.testRouteGet)
router.post('/test', upload.single('image'), userController.testRoutePost)

module.exports = router 