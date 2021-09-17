const express = require('express')
const router = express.Router()
const { requireAuth, checkUser } = require('../middleware/auth')
const userController = require('../controllers/userController')
const multer = require('multer')

// Multer configuration
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const supported = ["image/jpeg", "image/png"]
    const found = supported.find(extension => extension === file.mimetype)
    if(found){
        cb(null, 'public/')
    }
    else {
        cb({ message: "Not an Image file"}, false)
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'public/')
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.originalname)
//     }
// })

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
router.post('/dashboard', upload.single('image'), requireAuth, userController.postImage)

// Delete an image
router.get('/deleteimage/:name', requireAuth, userController.deleteImage)

// logout
router.get('/logout', userController.logoutGet)

// TEst route
router.get('/test', requireAuth, userController.testRouteGet)
router.post('/test', upload.single('image'), userController.testRoutePost)

module.exports = router 