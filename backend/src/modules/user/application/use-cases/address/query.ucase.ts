import { Injectable } from "@nestjs/common";
import AddressModel from "src/modules/user/domain/models/address.model";
import { FindAddressPersistence } from "src/modules/user/infrastructure/persistence/address/address.persistence";
import { IAddressQueryFilter } from "src/modules/user/application/dtos/user.schema";
import { QueryOptions } from "src/shared/query/input";
import { Address } from "prisma/generated/client";

@Injectable()
export default class QueryAddressUCase extends AddressModel {

    constructor(
        private readonly findPersistence: FindAddressPersistence
    ) {
        super()
    }

    public async findOne({ id }: { id: string }) {
        return await this.findPersistence.find({ where: { id } });
    }

    public async pagination({ q }: { q: QueryOptions<Address, IAddressQueryFilter> }) {
        const where = this.getWhere(q.filters || {});

        return await this.findPersistence.getAll({
            where,
            skip: q.skip ? Number(q.skip) : 0,
            take: q.take ? Number(q.take) : 10,
            orderBy: q.orderBy as any
        });
    }
}
