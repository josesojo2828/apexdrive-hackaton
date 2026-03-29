import { ICreateProfileDto, IUpdateProfileDto, IUpdateBusinessProfileDto } from "../../application/dtos/user.dto";
import UpdateBusinessProfileUCase from "../../application/use-cases/profile/update-business.ucase";
import CreateProfileUCase from "../../application/use-cases/profile/create.ucase";
import UpdateProfileUCase from "../../application/use-cases/profile/update.ucase";
import DeleteProfileUCase from "../../application/use-cases/profile/delete.ucase";
import QueryProfileUCase from "../../application/use-cases/profile/query.ucase";
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/modules/auth/guards/permissions.guard";
import { Permissions } from "src/modules/auth/decorators/permissions.decorator";
import { QueryOptions } from "src/shared/query/input";
import { Profile } from "prisma/generated/client";
import { IProfileQueryFilter } from "../../application/dtos/user.schema";

@Controller('profile')
export class ProfileCrudController {
    constructor(
        private readonly createUseCase: CreateProfileUCase,
        private readonly updateUseCase: UpdateProfileUCase,
        private readonly deleteUseCase: DeleteProfileUCase,
        private readonly queryUseCase: QueryProfileUCase,
        private readonly updateBusinessUseCase: UpdateBusinessProfileUCase,
    ) { }

    @Post()
    async create(@Body() body: ICreateProfileDto) {
        return await this.createUseCase.execute({ data: body });
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: IUpdateProfileDto) {
        return await this.updateUseCase.execute({ data: body, id });
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.deleteUseCase.execute({ id });
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions('business-profile:update')
    @Patch('business/:userId')
    async updateBusiness(@Param('userId') userId: string, @Body() body: IUpdateBusinessProfileDto, @Request() req: any) {
        // Business can only update their own profile
        const targetUserId = req.user.role === 'business' ? req.user.userId : userId;
        return await this.updateBusinessUseCase.execute({ data: body, userId: targetUserId });
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.queryUseCase.findOne({ id });
    }

    @Get('')
    async getPaginate(@Query() q: QueryOptions<Profile, IProfileQueryFilter>) {
        return await this.queryUseCase.pagination({ q });
    }
}
