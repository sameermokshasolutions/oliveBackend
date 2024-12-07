// Existing types
export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    userRole: string;
    // Add any other fields returned by your login API
}

// New types for forgot password functionality
export interface SendOtpData {
    email: string;
}

export interface VerifyOtpData {
    email: string;
    otp: string;
}

export interface ResetPasswordData {
    email: string;
    otp: string;
    newPassword: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface ErrorResponse {
    message: string;
}

