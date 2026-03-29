import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import CreateUserUCase from "../../application/use-cases/user/create.ucase";
import UpdateUserUCase from "../../application/use-cases/user/update.ucase";
import DeleteUserUCase from "../../application/use-cases/user/delete.ucase";
import QueryUserUCase from "../../application/use-cases/user/query.ucase";
import { ICreateUserDto, IUpdateUserDto } from "../../application/dtos/user.dto";
import { QueryOptions } from "src/shared/query/input";
import { User } from "prisma/generated/client";
import { IUserQueryFilter } from "../../application/dtos/user.schema";

@Controller('user')
export class UserCrudController {
    constructor(
        private readonly createUseCase: CreateUserUCase,
        private readonly updateUseCase: UpdateUserUCase,
        private readonly deleteUseCase: DeleteUserUCase,
        private readonly queryUseCase: QueryUserUCase,
    ) { }

    @Post()
    async create(@Body() body: ICreateUserDto) {
        return await this.createUseCase.execute({ data: body });
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: IUpdateUserDto) {
        return await this.updateUseCase.execute({ data: body, id });
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.deleteUseCase.execute({ id });
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.queryUseCase.findOne({ id });
    }

    @Get('')
    async getPaginate(@Query() q: QueryOptions<User, IUserQueryFilter>) {
        return await this.queryUseCase.pagination({ q });
    }
}
