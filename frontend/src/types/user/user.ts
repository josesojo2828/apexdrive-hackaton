import { IKYCLevel, IUserRole, IUserStatus } from "../enums";
import { IBankAccount, ICryptoWallet, IInvestment, ITierLevel } from "../finanzas/finanzas";
import { IAuditLog, IBeneficiary, IDevice, IPermission, ISecurityLimit, ISession } from "../infrastructura/infrastuctura";
import { IVehicle, IRoute } from "../delivery/delivery";
import { IPromotion } from "../business/business";

export interface IUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: IUserRole;
  status: IUserStatus;
  kycLevel: IKYCLevel;
  totalPoints: number;
  levelId?: string | null;
  level?: ITierLevel | null;
  referralCode: string;
  referredById?: string | null;
  referredBy?: IUser | null;
  referrals?: IUser[];
  token: string;
  permissionId: string;
  permissions?: IPermission;
  profile?: IProfile | null;
  address?: IAddress | null;
  limits?: ISecurityLimit | null;
  sessions?: ISession[];
  devices?: IDevice[];
  auditLogs?: IAuditLog[];
  bankAccounts?: IBankAccount[];
  cryptoWallets?: ICryptoWallet[];
  investments?: IInvestment[];
  beneficiaries?: IBeneficiary[];
  notifications?: Notification[];
  vehicles?: IVehicle[];
  commonAddresses?: ICommonAddress[];
  routesAsDriver?: IRoute[];

  routesAsCustomer?: IRoute[];
  promotions?: IPromotion[];
  businessProfile?: Record<string, unknown>;
  trips?: Record<string, unknown>[];
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface IProfile {
  id: string;
  birthDate?: Date | null;
  avatarUrl?: Date | null;
  userId: string;
  user?: IUser;
}

export interface IAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string | null;
  userId: string;
  user?: IUser;
}

export interface ICommonAddress {
  id: string;
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  userId?: string | null;
}