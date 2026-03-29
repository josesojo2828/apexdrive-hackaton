import { IUserRole, IUserStatus } from "../enums";
import { IAuditLog, IDevice, IPermission, ISecurityLimit, ISession } from "../infrastructura/infrastuctura";

export interface IUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: IUserRole;
  status: IUserStatus;
  token?: string;
  permissionId: string;
  permissions?: IPermission;
  profile?: IProfile | null;
  address?: IAddress | null;
  limits?: ISecurityLimit | null;
  sessions?: ISession[];
  devices?: IDevice[];
  auditLogs?: IAuditLog[];
  notifications?: Notification[];
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