const mongoose = require('mongoose')
const Schema = mongoose.Schema
let UserSchema = new Schema({
    name: { type: 'string', index: true, unique: true },
    password: { type: 'string' },
    avator: { type: 'string' },
    gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
    bio: { type: 'string' }
}, { timestamps: true })
let User = mongoose.model('User', UserSchema)
module.exports = User