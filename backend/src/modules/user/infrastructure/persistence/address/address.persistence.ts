import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import { IAddressCreateType, IAddressIncludeType, IAddressOrderByType, IAddressUpdateType, IAddressWhereType, IAddressWhereUniqueType, IDefaultAddressInclude } from "src/modules/user/application/dtos/user.schema";

@Injectable()
export class CreateAddressPersistence {
    constructor(private readonly prisma: PrismaService) { }
    public async save({ data }: { data: IAddressCreateType }) {
        return await this.prisma.address.create({ data });
    }
}

@Injectable()
export class UpdateAddressPersistence {
    constructor(private readonly prisma: PrismaService) { }
    public async update({ id, data }: { id: string, data: IAddressUpdateType }) {
        return await this.prisma.address.update({ where: { id }, data });
    }
}

@Injectable()
export class DeleteAddressPersistence {
    constructor(private readonly prisma: PrismaService) { }
    public async delete({ id }: { id: string }) {
        return await this.prisma.address.delete({ where: { id } });
    }
}

@Injectable()
export class FindAddressPersistence {
    constructor(private readonly prisma: PrismaService) { }

    public async getAll({ where, orderBy, skip, take, include }: { where?: IAddressWhereType, orderBy?: IAddressOrderByType, skip?: number, take?: number, include?: IAddressIncludeType }) {
        const t = await this.prisma.address.count({ where });
        const data = await this.prisma.address.findMany({
            where,
            orderBy,
            take,
            skip,
            include: include || IDefaultAddressInclude
        });

        return {
            total: t,
            data
        }
    }

    public async find({ where, include }: { where: IAddressWhereUniqueType, include?: IAddressIncludeType }) {
        return await this.prisma.address.findUnique({
            where,
            include: include || IDefaultAddressInclude
        })
    }
}
