import { BadRequestException, Injectable } from "@nestjs/common";
import AddressModel from "src/modules/user/domain/models/address.model";
import { UpdateAddressPersistence, FindAddressPersistence } from "src/modules/user/infrastructure/persistence/address/address.persistence";
import { IUpdateAddressDto } from "src/modules/user/application/dtos/user.dto";
import { IAddressUpdateType } from "src/modules/user/application/dtos/user.schema";

@Injectable()
export default class UpdateAddressUCase extends AddressModel {

    constructor(
        private readonly updatePersistence: UpdateAddressPersistence,
        private readonly findPersistence: FindAddressPersistence
    ) {
        super()
    }

    public async execute({ data, id }: { data: IUpdateAddressDto, id: string }) {
        const { city, country, state, street, zipCode } = data;

        const entity = await this.findPersistence.find({ where: { id } });
        if (!entity) throw new BadRequestException('not_found');

        const body: IAddressUpdateType = {};
        if (city) body.city = city;
        if (country) body.country = country;
        if (state) body.state = state;
        if (street) body.street = street;
        if (zipCode) body.zipCode = zipCode;

        const entityUpdated = await this.updatePersistence.update({ data: body, id });

        return {
            message: 'success.update',
            data: entityUpdated
        };
    }
}
