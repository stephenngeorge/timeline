import { model, Schema } from 'mongoose'

const TimelineSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    nodes: [{type: Schema.Types.ObjectId, ref: 'node'}],
    tags: [String],
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    deadline: Date,
    status: { type: String, default: 'ACTIVE' }
})

export default model('timeline', TimelineSchema)