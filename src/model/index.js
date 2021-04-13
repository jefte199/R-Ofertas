const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  id_user: {
    type: String,
    require: true
  }});

const ModelUser = model('user', UserSchema);

exports.ModelUser = ModelUser;