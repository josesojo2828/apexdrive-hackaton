import { Controller, Get, Param, Query } from "@nestjs/common";
import { IUserWhereType } from "src/modules/user/application/dtos/user.schema";
import FindUserPersistence from "src/modules/user/infrastructure/persistence/user/find.persistence";
import { ObjectSelect, SUPPORT_SELECT } from "src/types/support";
import { IUserRole } from "src/types/enums";
import FindPermissionPersistence from "src/modules/security/infrastructure/persistence/permission/find.persistence";
import { IPermissionWhereType } from "src/modules/security/application/dtos/security.schema";

@Controller('app')
export default class AppicationController {

    constructor(
        private readonly userService: FindUserPersistence,
        private readonly permissionService: FindPermissionPersistence,
    ) { }

    @Get('check')
    private check() {
        return { status: 'ok' };
    }

    @Get('select/:slug')
    private select(@Param('slug') slug: SUPPORT_SELECT, @Query() query: { param: string, parentId?: string }): Promise<ObjectSelect[]> {

        if (slug === 'USER') {
            const wh: IUserWhereType = {
                OR: [
                    { firstName: { contains: query.param, mode: 'insensitive' } },
                    { lastName: { contains: query.param, mode: 'insensitive' } },
                    { email: { contains: query.param, mode: 'insensitive' } },
                ]
            }
            return this.userService.select({ where: wh });
        }
        else if (slug === 'PERMISSION') {
            const wh: IPermissionWhereType = {
                name: { contains: query.param, mode: 'insensitive' }
            }
            return this.permissionService.select({ where: wh });
        }
        else if (slug === 'PERMISSION_USER') {
            const wh: IPermissionWhereType = {
                AND: [
                    { name: { contains: query.param, mode: 'insensitive' } },
                    { name: { in: ['user', 'customer', 'support'] } }
                ]
            }
            return this.permissionService.select({ where: wh });
        }
        
        return Promise.resolve([]);
    }

}
