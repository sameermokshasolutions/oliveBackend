import { Document } from 'mongoose';

export interface IJobInput {
    title: string;
    description: string;
    company: string;
    location: string;
    salary?: number;
    requirements: string[];
    employerId: string;
}

export interface IJobDocument extends IJobInput, Document {
    createdAt: Date;
    updatedAt: Date;
}

export interface IJobQuery {
    page?: number;
    limit?: number;
}