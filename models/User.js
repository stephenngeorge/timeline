import { model, Schema } from 'mongoose'

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})

export default model('user', UserSchema)