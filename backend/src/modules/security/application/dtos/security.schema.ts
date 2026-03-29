import { Prisma } from "prisma/generated/client";

// ###################################
//      SCHEMA TYPES
// ###################################

// Permission
export type IPermissionCreateType = Prisma.PermissionCreateInput;
export type IPermissionUpdateType = Prisma.PermissionUpdateInput;
export type IPermissionWhereType = Prisma.PermissionWhereInput;
export type IPermissionWhereUniqueType = Prisma.PermissionWhereUniqueInput;
export type IPermissionOrderByType = Prisma.PermissionOrderByWithRelationInput;
export type IPermissionIncludeType = Prisma.PermissionInclude;

export const IDefaultPermissionInclude: IPermissionIncludeType = {
    users: false
}

export interface IPermissionQueryFilter {
    name?: string;
}
