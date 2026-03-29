import { Controller, Get, Param, Query } from "@nestjs/common";
import QueryPermissionUCase from "../../application/use-cases/permission/query.ucase";
import { QueryOptions } from "src/shared/query/input";
import { Permission } from "prisma/generated/client";
import { IPermissionQueryFilter } from "../../application/dtos/security.schema";

@Controller('permission')
export class PermissionCrudController {
    constructor(
        private readonly queryUseCase: QueryPermissionUCase,
    ) { }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.queryUseCase.findOne({ id });
    }

    @Get('')
    async getPaginate(@Query() q: QueryOptions<Permission, IPermissionQueryFilter>) {
        return await this.queryUseCase.pagination({ q });
    }
}
