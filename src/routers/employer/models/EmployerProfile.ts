import mongoose, { Document, Schema } from 'mongoose';
import { CompanyType, IndustryType, IndustrySector } from '../types/employerTypes';

export interface IEmployerProfile extends Document {
    userId: mongoose.Types.ObjectId;
    companyName: string;
    companySize: string;
    industryType: IndustryType;
    headquartersAddress: string;
    contactNumber: string;
    aboutUs: string;
    company_type: CompanyType;
    industrySector: IndustrySector;
    location: string;
    websiteLink: string;
    logoUrl: string;
    videoUrl: string;
    socialLinks: Array<{ title: string; url: string }>;
    brandingMessage: string;
    companyBrochureUrl: string;
    employerVisibility: boolean;
    branding_opted: boolean;
    custom_job_post_templates_enabled: boolean;
    bannerImage: string;
    yearOfEstablishment: string;
    companyVision: string;
    publicEmail: string;
}

const EmployerProfileSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    companySize: { type: String, required: true },
    industryType: { type: String, enum: Object.values(IndustryType), required: true },
    headquartersAddress: { type: String, required: true },
    contactNumber: { type: String, required: true },
    aboutUs: { type: String, required: true },
    company_type: { type: String, enum: Object.values(CompanyType), required: true },
    industrySector: { type: String, enum: Object.values(IndustrySector), required: true },
    location: { type: String, required: true },
    websiteLink: { type: String, required: true },
    logoUrl: { type: String },
    videoUrl: { type: String },
    socialLinks: [{ title: String, url: String }],
    brandingMessage: { type: String },
    companyBrochureUrl: { type: String },
    employerVisibility: { type: Boolean, default: false },
    branding_opted: { type: Boolean, default: false },
    custom_job_post_templates_enabled: { type: Boolean, default: false },
    bannerImage: { type: String },
    yearOfEstablishment: { type: String },
    companyVision: { type: String },
    publicEmail: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IEmployerProfile>('EmployerProfile', EmployerProfileSchema);

