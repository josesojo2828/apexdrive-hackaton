import { Prisma } from "prisma/generated/client";

// ###################################
//      USER
// ###################################

export type IUserCreateType = Prisma.UserCreateInput;
export type IUserUpdateType = Prisma.UserUpdateInput;
export type IUserWhereType = Prisma.UserWhereInput;
export type IUserWhereUniqueType = Prisma.UserWhereUniqueInput;
export type IUserOrderByType = Prisma.UserOrderByWithRelationInput;
export type IUserIncludeType = Prisma.UserInclude;

export const IDefaultUserInclude: IUserIncludeType = {
    profile: true,
    address: true,
    sessions: false,
    devices: false,
    notifications: false,
    permissions: true
}

export interface IUserQueryFilter {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    status?: string; // Enum
    role?: string; // Enum
    referralCode?: string;
}

// ###################################
//      ADDRESS
// ###################################

export type IAddressCreateType = Prisma.AddressCreateInput;
export type IAddressUpdateType = Prisma.AddressUpdateInput;
export type IAddressWhereType = Prisma.AddressWhereInput;
export type IAddressWhereUniqueType = Prisma.AddressWhereUniqueInput;
export type IAddressOrderByType = Prisma.AddressOrderByWithRelationInput;
export type IAddressIncludeType = Prisma.AddressInclude;

export const IDefaultAddressInclude: IAddressIncludeType = {
    user: false
}

export interface IAddressQueryFilter {
    city?: string;
    country?: string;
    state?: string;
    userId?: string;
}

// ###################################
//      PROFILE
// ###################################

export type IProfileCreateType = Prisma.ProfileCreateInput;
export type IProfileUpdateType = Prisma.ProfileUpdateInput;
export type IProfileWhereType = Prisma.ProfileWhereInput;
export type IProfileWhereUniqueType = Prisma.ProfileWhereUniqueInput;
export type IProfileOrderByType = Prisma.ProfileOrderByWithRelationInput;
export type IProfileIncludeType = Prisma.ProfileInclude;

export const IDefaultProfileInclude: IProfileIncludeType = {
    user: false
}

export interface IProfileQueryFilter {
    userId?: string;
}

// ###################################
//      SESSION
// ###################################

export type ISessionCreateType = Prisma.SessionCreateInput;
export type ISessionUpdateType = Prisma.SessionUpdateInput;
export type ISessionWhereType = Prisma.SessionWhereInput;
export type ISessionWhereUniqueType = Prisma.SessionWhereUniqueInput;
export type ISessionOrderByType = Prisma.SessionOrderByWithRelationInput;
export type ISessionIncludeType = Prisma.SessionInclude;

export const IDefaultSessionInclude: ISessionIncludeType = {
    user: false
}

export interface ISessionQueryFilter {
    userId?: string;
    token?: string;
    ipAddress?: string;
}

// ###################################
//      DEVICE
// ###################################

export type IDeviceCreateType = Prisma.DeviceCreateInput;
export type IDeviceUpdateType = Prisma.DeviceUpdateInput;
export type IDeviceWhereType = Prisma.DeviceWhereInput;
export type IDeviceWhereUniqueType = Prisma.DeviceWhereUniqueInput;
export type IDeviceOrderByType = Prisma.DeviceOrderByWithRelationInput;
export type IDeviceIncludeType = Prisma.DeviceInclude;

export const IDefaultDeviceInclude: IDeviceIncludeType = {
    user: false
}

export interface IDeviceQueryFilter {
    userId?: string;
    deviceId?: string;
}

// ###################################
//      NOTIFICATION
// ###################################

export type INotificationCreateType = Prisma.NotificationCreateInput;
export type INotificationUpdateType = Prisma.NotificationUpdateInput;
export type INotificationWhereType = Prisma.NotificationWhereInput;
export type INotificationWhereUniqueType = Prisma.NotificationWhereUniqueInput;
export type INotificationOrderByType = Prisma.NotificationOrderByWithRelationInput;
export type INotificationIncludeType = Prisma.NotificationInclude;

export const IDefaultNotificationInclude: INotificationIncludeType = {
    user: false
}

export interface INotificationQueryFilter {
    userId?: string;
    isRead?: boolean;
    title?: string;
}
