export interface ICreateUserDto {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
    languaje?: string;
    referralCode?: string;
    referredById?: string;
    permissionId?: string;
    role?: any; // UserRole
}

export interface IUpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    languaje?: string;
    status?: any; // UserStatus
    kycLevel?: any; // KYCLevel
    twoFactorEnabled?: boolean;
    passwordHash?: string;
    permissionId?: string;
    role?: any; // UserRole
}


export interface ICreateAddressDto {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
    userId: string;
}

export interface IUpdateAddressDto {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
}


export interface ICreateProfileDto {
    birthDate?: Date;
    avatarUrl?: string;
    userId: string;
}

export interface IUpdateProfileDto {
    birthDate?: Date;
    avatarUrl?: string;
}


export interface ICreateSessionDto {
    token: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
    userId: string;
}

export interface IUpdateSessionDto {
    ipAddress?: string;
    userAgent?: string;
    expiresAt?: Date;
}


export interface ICreateDeviceDto {
    deviceId: string;
    fcmToken?: string;
    userId: string;
}

export interface IUpdateDeviceDto {
    fcmToken?: string;
}


export interface ICreateNotificationDto {
    title: string;
    content: string;
    userId: string;
}

export interface IUpdateNotificationDto {
    title?: string;
    content?: string;
    isRead?: boolean;
}

export interface IUpdateBusinessProfileDto {
    name?: string;
    description?: string;
    logoUrl?: string;
    bannerUrl?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
}
