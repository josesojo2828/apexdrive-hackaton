import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { IDefaultPermissionInclude, IPermissionIncludeType, IPermissionOrderByType, IPermissionWhereType, IPermissionWhereUniqueType } from "../../../application/dtos/security.schema";
import { ObjectSelect } from "src/types/support";

@Injectable()
export default class FindPermissionPersistence {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async getAll({ where, orderBy, skip, take, include }: { where?: IPermissionWhereType, orderBy?: IPermissionOrderByType, skip?: number, take?: number, include?: IPermissionIncludeType }) {
        const [total, data] = await Promise.all([
            this.prisma.permission.count({ where }),
            this.prisma.permission.findMany({
                where,
                orderBy,
                take,
                skip,
                include: include || IDefaultPermissionInclude
            })
        ]);

        return {
            total,
            data
        };
    }

    public async find({ where, include }: { where: IPermissionWhereUniqueType, include?: IPermissionIncludeType }) {
        return await this.prisma.permission.findUnique({
            where,
            include: include || IDefaultPermissionInclude
        })
    }

    public async select({ where }: { where: IPermissionWhereType }): Promise<ObjectSelect[]> {
        const entiy = await this.prisma.permission.findMany({
            where,
            select: {
                id: true,
                name: true,
            },
            skip: 0,
            take: 100,
        })

        if (!entiy || !entiy.length) return [];

        return entiy.map((item) => ({
            id: item.id,
            label: item.name,
        }));
    }
}
