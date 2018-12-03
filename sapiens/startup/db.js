const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function() {
  mongoose.connect('mongodb://mongo/sapiensbook')
    .then(() => winston.info('Connected to MongoDB...'));
} 