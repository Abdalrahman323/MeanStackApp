const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
  email: {type: String , required: true , unique:true},
  // unique it will act as a validator (means it's not autmatically throw an exception of error if we try to add a new entry)
  // with email address that already exist ,it will eventually leads to problems
  // But we can't rely on this when we try validating data when we try to save it , we'll have to it diffently
  // unique  instead allows mongos nd mongodb, to do some internal optimization from performance perspective,since it knows it will be
  // unique
  // it's not there to validate input , unlike required which would throw an error , if you don't provide an email
  password: {type: String , required: true}
});

// plugin extra functino will run on the schema
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User',userSchema);
