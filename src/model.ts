import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    username: string;
    message: string;
}

const messageSchema: Schema = new Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IMessage>('message', messageSchema);

