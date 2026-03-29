import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoadUserService {
    constructor(
        private readonly prisma: PrismaService
    ) {
        this.execute();
    }

    public async execute() {
        // Obtener permisos
        const [
            permitAdmin,
            permitUser,
        ] = await Promise.all([
            this.prisma.permission.findFirst({ where: { name: 'admin' } }),
            this.prisma.permission.findFirst({ where: { name: 'user' } })
        ]);

        if (!permitAdmin) {
            console.log('[LoadUserService] ❌ No se encontró el permiso admin. Ejecuta LoadPermitService primero.');
            return;
        }

        const salt = 10;
        const rawPassword = process.env.INITIAL_USER_PASSWORD || 'ChangeMe123!';
        const passwordHash = await bcrypt.hash(rawPassword, salt);

        const upsertUser = (
            email: string,
            firstName: string,
            lastName: string,
            role: string,
            permissionId: string
        ) => this.prisma.user.upsert({
            where: { email },
            update: { passwordHash, status: 'ACTIVE', permissions: { connect: { id: permissionId } } },
            create: {
                email,
                passwordHash,
                status: 'ACTIVE',
                firstName,
                lastName,
                role: role as any,
                permissions: { connect: { id: permissionId } },
                profile: { create: {} }
            }
        });

        const results = await Promise.all([
            upsertUser('admin@example.com', 'Admin', 'App', 'ADMIN', permitAdmin.id),
            upsertUser('user@example.com', 'Demo', 'User', 'USER', permitUser?.id || permitAdmin.id)
        ]);

        const labels = ['admin', 'user'];
        results.forEach((u, i) => console.log(`[LoadUserService] ✅ ${labels[i]}: ${u.email}`));
    }
}
