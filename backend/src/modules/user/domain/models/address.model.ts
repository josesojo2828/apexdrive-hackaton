import { IAddressQueryFilter, IAddressWhereType } from "../../application/dtos/user.schema";

export default class AddressModel {

    public model = 'Address';

    public permits = {
        create: 'address:create',
        update: 'address:update',
        delete: 'address:delete',
        read: 'address:read',
        list: 'address:list',
    }

    public events = {
        created: 'address:created',
        updated: 'address:updated',
        deleted: 'address:deleted',
    }

    public getWhere(param: IAddressQueryFilter, search?: string): IAddressWhereType {
        const wh: any[] = [];

        // Filtros exactos
        // if (param.countryId) wh.push({ countryId: param.countryId });
        if (param.userId) wh.push({ userId: param.userId });

        // Búsqueda Global
        if (search) {
            wh.push({
                OR: [
                    { street: { contains: search, mode: 'insensitive' } },
                    { city: { contains: search, mode: 'insensitive' } },
                    { zipCode: { contains: search } },
                ]
            });
        }

        return wh.length > 0 ? { AND: [...wh, { deletedAt: null }] } : { deletedAt: null };
    }
}
