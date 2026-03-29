import { BadRequestException, Injectable } from "@nestjs/common";
import AddressModel from "src/modules/user/domain/models/address.model";
import { DeleteAddressPersistence, FindAddressPersistence } from "src/modules/user/infrastructure/persistence/address/address.persistence";

@Injectable()
export default class DeleteAddressUCase extends AddressModel {

    constructor(
        private readonly deletePersistence: DeleteAddressPersistence,
        private readonly findPersistence: FindAddressPersistence
    ) {
        super()
    }

    public async execute({ id }: { id: string }) {
        const entity = await this.findPersistence.find({ where: { id } });
        if (!entity) throw new BadRequestException('not_found');

        const entityDeleted = await this.deletePersistence.delete({ id });

        return {
            message: 'success.delete',
            data: entityDeleted
        };
    }
}
