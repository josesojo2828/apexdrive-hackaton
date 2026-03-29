import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import SecurityModel from "../../domain/models/security.model";

@Injectable()
export class LoadPermitService extends SecurityModel {

    constructor(
        private readonly prisma: PrismaService
    ) {
        super();
        this.execute();
    }

    async execute() {
        // Roles originales
        const user = this.user();
        const admin = this.admin();

        const upsert = (name: string, permits: string[]) => this.prisma.permission.upsert({
            create: { name, list: permits },
            update: { name, list: permits },
            where: { name }
        });

        await Promise.all([
            upsert(user.name, user.permits),
            upsert(admin.name, admin.permits)
        ]);

        console.log('[LoadPermitService] Permisos cargados: user, admin');
    }
}
