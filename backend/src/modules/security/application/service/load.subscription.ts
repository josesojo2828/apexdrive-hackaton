import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export class LoadSubscriptionService {

    constructor(
        private readonly prisma: PrismaService
    ) {
        this.execute();
    }

    public async execute() {
        console.log('SEED SUBSCRIPCIONES DISABLED');
    }
}
