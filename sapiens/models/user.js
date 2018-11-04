const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  lastname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  study_areas: {
    type: Array,
    default: []
  },
  organization: {
    type: String,
    maxlength: 50,
    default: ""
  },
  profile: {
    type: Object,
    required: true,
    default: {}
  },
  nationality: {
    type: String,
    default: "Colombiano"
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Indefinido'],
    default: 'Indefinido'
  },
  languages: {
    type: Array,
  },
  skills: {
    type: Array
  },
  publications: {
    type: Object,
    default: {}
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({
    _id: this.id,
    name: this.name
  }, config.get('jwtPrivateKey'))

  return token
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    lastname: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    languages: Joi.array().required(),
    skills: Joi.array().required(),
    organization: Joi.string(),
    study_areas: Joi.array(),
    nationality: Joi.string()
  }

  return Joi.validate(user, schema)
}

exports.User = User
exports.validate = validateUser