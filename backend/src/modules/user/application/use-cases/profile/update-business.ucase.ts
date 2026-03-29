import { BadRequestException, Injectable } from "@nestjs/common";
import { BusinessProfilePersistence } from "../../../infrastructure/persistence/profile/business-profile.persistence";
import { IUpdateBusinessProfileDto } from "../../../application/dtos/user.dto";

@Injectable()
export default class UpdateBusinessProfileUCase {

    constructor(
        private readonly persistence: BusinessProfilePersistence
    ) { }

    public async execute({ data, userId }: { data: IUpdateBusinessProfileDto, userId: string }) {
        const entity = await this.persistence.findByUserId(userId);
        if (!entity) throw new BadRequestException('business_profile_not_found');

        const entityUpdated = await this.persistence.update({ data, userId });

        return {
            message: 'success.update',
            data: entityUpdated
        };
    }
}
