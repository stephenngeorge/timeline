import { model, Schema } from 'mongoose'

const TimelineSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})

export default model('timeline', TimelineSchema)