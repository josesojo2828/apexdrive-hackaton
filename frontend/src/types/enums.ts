export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    DRIVER = 'DRIVER',
    BUSINESS = 'BUSINESS',
    SUPPORT = 'SUPPORT',
    ADMIN = 'ADMIN'
}

export const IUserRole = UserRole;
export type IUserRole = UserRole;

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    PENDING_VERIFICATION = 'PENDING_VERIFICATION',
    BANNED = 'BANNED'
}

export const IUserStatus = UserStatus;
export type IUserStatus = UserStatus;

export enum KYCLevel {
    NONE = 'NONE',
    BASIC = 'BASIC',
    INTERMEDIATE = 'INTERMEDIATE',
    FULL = 'FULL'
}

export const IKYCLevel = KYCLevel;
export type IKYCLevel = KYCLevel;

export enum Network {
    TRC20 = 'TRC20',
    ERC20 = 'ERC20',
    BEP20 = 'BEP20',
    POLYGON = 'POLYGON',
    SOLANA = 'SOLANA'
}

export const INetwork = Network;
export type INetwork = Network;

export enum AccountStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    FROZEN = 'FROZEN'
}

export const IAccountStatus = AccountStatus;
export type IAccountStatus = AccountStatus;

export enum InvestmentStatus {
    ACTIVE = 'ACTIVE',
    MATURED = 'MATURED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export const IInvestmentStatus = InvestmentStatus;
export type IInvestmentStatus = InvestmentStatus;

export enum TransactionType {
    TRANSFER = 'TRANSFER',
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
    INVESTMENT = 'INVESTMENT',
    PROFIT = 'PROFIT',
    REFERRAL_COMMISSION = 'REFERRAL_COMMISSION',
    FEE = 'FEE'
}

export const ITransactionType = TransactionType;
export type ITransactionType = TransactionType;

export enum TransactionStatus {
    PENDING = 'PENDING',
    CONFIRMING = 'CONFIRMING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED'
}

export const ITransactionStatus = TransactionStatus;
export type ITransactionStatus = TransactionStatus;

export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    PRELOADED = 'PRELOADED'
}

export const ISubscriptionStatus = SubscriptionStatus;
export type ISubscriptionStatus = SubscriptionStatus;

export enum RouteStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export const IRouteStatus = RouteStatus;
export type IRouteStatus = RouteStatus;
