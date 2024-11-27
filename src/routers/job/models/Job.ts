import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
    title: string;
    description: string;
    company: string;
    location: string;
    salary?: number;
    requirements: string[];
    employerId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const JobSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number },
    requirements: [{ type: String }],
    employerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model<IJob>('Job', JobSchema);