import { BadRequestException, Injectable } from "@nestjs/common";
import UserModel from "src/modules/user/domain/models/user.model";
import CreateUserPersistence from "src/modules/user/infrastructure/persistence/user/create.persistence";
import FindUserPersistence from "src/modules/user/infrastructure/persistence/user/find.persistence";
import { ICreateUserDto } from "src/modules/user/application/dtos/user.dto";
import FindPermissionPersistence from "src/modules/security/infrastructure/persistence/permission/find.persistence";
import * as bcrypt from 'bcrypt';

@Injectable()
export default class CreateUserUCase extends UserModel {

    constructor(
        private readonly createPersistence: CreateUserPersistence,
        private readonly findPersistence: FindUserPersistence,
        private readonly findPermissionPersistence: FindPermissionPersistence
    ) {
        super()
    }

    public async execute({ data }: { data: ICreateUserDto }) {
        const { email, passwordHash, firstName, lastName, phone, languaje, permissionId, role } = data;

        const existingUser = await this.findPersistence.findFirst({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(passwordHash, salt);


        const emailLower = data.email.toLowerCase();

        let finalPermissionId: string;
        if (permissionId) {
            finalPermissionId = permissionId;
        } else {
            const permitFound = await this.findPermissionPersistence.find({ where: { name: 'user' } });
            if (!permitFound) throw new BadRequestException('No permit found');
            finalPermissionId = permitFound.id;
        }

        const entityCreated = await this.createPersistence.save({
            data: {
                email: emailLower,
                passwordHash: pass,
                firstName,
                lastName,
                role: role || 'USER',
                profile: { create: {} },
                permissions: { connect: { id: finalPermissionId } },
            }
        });

        return {
            message: 'success.create',
            data: entityCreated
        };
    }

}
