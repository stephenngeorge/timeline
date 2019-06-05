import { model, Schema } from 'mongoose'

const NodeSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    status: { type: String, default: 'PENDING' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    timeline: { type: Schema.Types.ObjectId, ref: 'timeline' },
    deadline: Date
})

export default model('node', NodeSchema)