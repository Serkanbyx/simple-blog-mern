const mongoose = require('mongoose');

const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid ID format.');
    error.statusCode = 400;
    throw error;
  }
};

module.exports = validateObjectId;
