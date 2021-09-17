const mongoose = require('mongoose')
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema

const userSchema = new schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    images: [{
        type: schema.Types.ObjectId,
        ref: 'image'
    }],
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [8, 'Minimum password length is 8 characters']
    }
}, {
    timestamps: true
})

// function to hash the password before the user is saved to db
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const userProfile = mongoose.model('userprofile', userSchema)

module.exports = userProfile