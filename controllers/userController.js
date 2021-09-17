const userProfile = require('../models/userModel')
const Image = require('../models/imageModel')
const jwt = require('jsonwebtoken');
const fs = require('fs')
const path  = require('path');
const { exist } = require('joi');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }
 
  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }
 
  // validation errors
  if (err.message.includes('userprofile validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }  

  return errors;
}

const createToken = (id) => {
  return jwt.sign({ id }, `${process.env.jkeys}`, {
    expiresIn: 6 * 60 * 60
    })
};

// Homepage
const homePage = (req, res) => {
    res.render('home')
}

// USERS

// Register actions
const signUpGet = (req, res) => {
  res.render('signup');
}

const signUpPost = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
  
    try {
      const user = await userProfile.create({ 
          firstName,
          lastName,
          email, 
          password,
          images: []
        });
      const token = createToken(user._id);
    //   console.log(token)
      res.cookie('jwt', token, { httpOnly: true, maxAge: 6 * 60 * 60 * 1000 });
      res.status(201).json({ user: user._id });
    }
    catch(err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
   
}


// Login actions
const signInGet = (req, res) => {
  res.render('login');
}

const signInPost = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userProfile.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 6 * 60 * 60 * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

// Get the dashboard
const getDashboard = (req, res) => {
  const user = req.user
  const profile = userProfile.findById(user.id)
  if(profile){
    console.log("LEts goo")
    // Image.find({_id: profile.images._id}, (err, items) => {
    Image.find({ user: user.id }, (err, items) => {
      if(err) {
        console.log(err)
        res.status(500).send('An error occured', err)
      }
      else {
        // console.log(profile)
        res.render('dashboard', { items, profile: user.id })
      }
    })
  } 
}

// Upload an image
const postImage = async (req, res) => {
  const user = req.user
  if(user){
    const profile = await userProfile.findById(user.id)
    if(profile){
      const newImage = await Image.create({
        name: req.body.name,
        img: {
          data: fs.readFileSync(path.resolve(__dirname, `../public/${req.file.originalname}`)),
          contentType: 'image/png'
        },
        user:[profile._id]
      })
      profile.images.push(newImage)
      const result = profile.save()
      console.log(result)
      return res.redirect('/dashboard')
    }
    return res.redirect('/login')
  }
}

// Delete an Image
const deleteImage = async (req, res) => {
  const user = req.user
  const profile = await userProfile.findById(user.id)
  if(profile){
    const photo = await Image.find({ user: user.id  })
    if(photo){
      await Image.deleteOne({ name: req.params.name, user: user.id }, (err) => {
        if(err){
          console.log(err)
        }
        console.log('Successful deletion')
        res.redirect('/dashboard')
      })
    }
    return res.status(404).json({ message: "User doesn't have any uploaded photo" })
  }
}

// Logout the user
const logoutGet = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}

const testRouteGet = (req, res) => {
  const user = req.user
  console.log(user)
  const profile = userProfile.findById(user._id)
  if(profile){
    // console.log(profile)
    console.log('Lets see oo')
    Image.find({}, (err, items) => {
      if(err) {
        console.log(err)
        res.status(500).send('An error occured', err)
      }
      else {
        res.render('dashboarded', { items })
      }
    })
  }
}

const testRoutePost = (req, res) => {
  Image.create({
    name: req.body.name,
    img: {
      data: fs.readFileSync(path.resolve(__dirname, `../public/${req.file.originalname}`)),
      contentType: 'image/png'
    }
  }, (err, item) => {
    if(err){
      console.log(err)
    }
    else{
      res.redirect('/test')
    }
  })
}

module.exports = {
    homePage,
    signUpGet,
    signUpPost,
    signInGet,
    signInPost, 
    getDashboard,
    logoutGet,
    postImage,
    deleteImage,
    testRouteGet,
    testRoutePost
}