import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import CreateAddressUCase from "../../application/use-cases/address/create.ucase";
import UpdateAddressUCase from "../../application/use-cases/address/update.ucase";
import DeleteAddressUCase from "../../application/use-cases/address/delete.ucase";
import QueryAddressUCase from "../../application/use-cases/address/query.ucase";
import { ICreateAddressDto, IUpdateAddressDto } from "../../application/dtos/user.dto";
import { QueryOptions } from "src/shared/query/input";
import { Address } from "prisma/generated/client";
import { IAddressQueryFilter } from "../../application/dtos/user.schema";

@Controller('address')
export class AddressCrudController {
    constructor(
        private readonly createUseCase: CreateAddressUCase,
        private readonly updateUseCase: UpdateAddressUCase,
        private readonly deleteUseCase: DeleteAddressUCase,
        private readonly queryUseCase: QueryAddressUCase,
    ) { }

    @Post()
    async create(@Body() body: ICreateAddressDto) {
        return await this.createUseCase.execute({ data: body });
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: IUpdateAddressDto) {
        return await this.updateUseCase.execute({ data: body, id });
    }

    @Patch(':id')
    async patch(@Param('id') id: string, @Body() body: IUpdateAddressDto) {
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
    async getPaginate(@Query() q: QueryOptions<Address, IAddressQueryFilter>) {
        return await this.queryUseCase.pagination({ q });
    }
}
