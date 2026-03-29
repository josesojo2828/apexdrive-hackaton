import { IUserStatus } from "src/types/enums";
import { IUserCreateType, IUserQueryFilter, IUserWhereType } from "../../application/dtos/user.schema";

export default class UserModel {

    public model = 'User';

    public permits = {
        create: 'user:create',
        update: 'user:update',
        delete: 'user:delete',
        read: 'user:read',
        list: 'user:list',
    }

    public events = {
        created: 'user:created',
        updated: 'user:updated',
        deleted: 'user:deleted',
    }

    public getWhere(param: IUserQueryFilter, search?: string): IUserWhereType {
        const wh: IUserWhereType[] = [];

        // 1. Filtros específicos (Exactos)
        if (param.status) wh.push({ status: (param.status as IUserStatus) });

        // 2. Búsqueda Global (Lo que viene del input del header)
        if (search) {
            wh.push({
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } },
                ]
            });
        }

        return wh.length > 0 ? { AND: {...wh, deletedAt: null } } : { deletedAt: null };
    }
}
