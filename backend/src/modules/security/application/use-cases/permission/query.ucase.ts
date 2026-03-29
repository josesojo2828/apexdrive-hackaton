import { Injectable } from "@nestjs/common";
import FindPermissionPersistence from "../../../infrastructure/persistence/permission/find.persistence";
import { IPermissionQueryFilter, IPermissionWhereType } from "../../dtos/security.schema";
import { QueryOptions } from "src/shared/query/input";
import { Permission } from "prisma/generated/client";

@Injectable()
export default class QueryPermissionUCase {

    constructor(
        private readonly findPersistence: FindPermissionPersistence
    ) { }

    public async findOne({ id }: { id: string }) {
        return await this.findPersistence.find({ where: { id } });
    }

    public async pagination({ q }: { q: QueryOptions<Permission, IPermissionQueryFilter> }) {
        const { search, filters, skip, take, orderBy } = q as any;

        const where = this.getWhere(filters || {}, search);

        const entity = await this.findPersistence.getAll({
            where,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
            orderBy: orderBy ? (typeof orderBy === 'string' ? JSON.parse(orderBy) : orderBy) : undefined
        });

        return entity;
    }

    private getWhere(param: IPermissionQueryFilter, search?: string): IPermissionWhereType {
        const wh: IPermissionWhereType[] = [];

        if (search) {
            wh.push({
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                ]
            });
        }

        if (param.name) {
            wh.push({ name: { contains: param.name, mode: 'insensitive' } });
        }

        return wh.length > 0 ? { AND: [...wh, { deletedAt: null }] } : { deletedAt: null };
    }
}
