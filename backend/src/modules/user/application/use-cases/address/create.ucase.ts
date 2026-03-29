import { Injectable } from "@nestjs/common";
import AddressModel from "src/modules/user/domain/models/address.model";
import { CreateAddressPersistence } from "src/modules/user/infrastructure/persistence/address/address.persistence";
import { ICreateAddressDto } from "src/modules/user/application/dtos/user.dto";
import { IAddressCreateType } from "src/modules/user/application/dtos/user.schema";

@Injectable()
export default class CreateAddressUCase extends AddressModel {

    constructor(
        private readonly createPersistence: CreateAddressPersistence
    ) {
        super()
    }

    public async execute({ data }: { data: ICreateAddressDto }) {
        const { city, country, state, street, userId, zipCode } = data;

        const body: IAddressCreateType = {
            city,
            country,
            state,
            street,
            zipCode,
            user: { connect: { id: userId } }
        }

        const entityCreated = await this.createPersistence.save({ data: body });

        return {
            message: 'success.create',
            data: entityCreated
        };
    }
}
