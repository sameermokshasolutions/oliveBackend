export enum CompanyType {
    Pharma = "Pharma",
    Hospital = "Hospital",
    Clinic = "Clinic",
    HealthCare = "Healthcare Services"
}

export enum IndustryType {
    Tech = "tech",
    Finance = "finance",
    Healthcare = "healthcare"
}

export enum IndustrySector {
    IT = "it",
    Manufacturing = "manufacturing",
    Services = "services"
}

export interface EmployerProfile {
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

