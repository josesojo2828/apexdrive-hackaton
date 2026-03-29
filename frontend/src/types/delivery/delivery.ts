import { IUser } from "../user/user";
import { RouteStatus } from "../enums";

export interface IVehicle {
    id: string;
    brand: string;
    model: string;
    plate: string;
    type: string;
    year?: number | null;
    userId: string;
    user?: IUser;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export interface IRoute {
    id: string;
    origin: string;
    destination: string;
    status: RouteStatus;
    price: number;
    distance?: number | null;
    driverId?: string | null;
    driver?: IUser | null;
    customerId: string;
    customer?: IUser;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
