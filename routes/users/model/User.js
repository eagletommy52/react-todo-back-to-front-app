const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const now = moment();

const UserSchema = new mongoose.Schema({
  email: {type: String, unique: true, default: ""},
  todos: [{type: Schema.Types.ObjectId, ref: 'Todo'}],
  password: {type: String, default: ""},
  timestamp: {type: String, default: now.format('dddd, MMMM, do YYYY, h:mm:ss a')}
})

module.exports =  mongoose.model('User', UserSchema);