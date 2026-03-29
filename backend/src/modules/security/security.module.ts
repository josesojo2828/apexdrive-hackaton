import { Module } from "@nestjs/common";
import { LoadPermitService } from "./application/service/load-permit";
import { PrismaService } from "src/config/prisma.service";
import { PermissionCrudController } from "./infrastructure/controllers/permission.crud";
import QueryPermissionUCase from "./application/use-cases/permission/query.ucase";
import FindPermissionPersistence from "./infrastructure/persistence/permission/find.persistence";
import { LoadSubscriptionService } from "./application/service/load.subscription";
import { LoadUserService } from "./application/service/load.user";
import { LoadServiceService } from "./application/service/load.service";
import { LoadDashboardDataService } from "./application/service/load.dashboard-data";
import { LoadSeedService } from "./application/service/load.seed";

@Module({
    imports: [],
    controllers: [PermissionCrudController],
    providers: [
        LoadPermitService,
        LoadSubscriptionService,
        LoadUserService,
        LoadServiceService,
        LoadDashboardDataService,
        LoadSeedService,

        PrismaService,
        QueryPermissionUCase,
        FindPermissionPersistence
    ],
    exports: [
        FindPermissionPersistence
    ],
})
export default class SecurityModule { }

