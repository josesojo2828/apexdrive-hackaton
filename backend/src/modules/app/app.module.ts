import { Module } from "@nestjs/common";
import AppicationController from "./infrastructure/controller/app.controller";
import SecurityModule from "../security/security.module";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        SecurityModule,
        UserModule,
    ],
    controllers: [AppicationController],
    providers: [],
    exports: [],
})
export default class AppicationModule { }
