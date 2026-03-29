import { IUser } from "../user/user";

export interface IPromotion {
    id: string;
    title: string;
    description?: string | null;
    discount: number;
    startDate: Date;
    endDate: Date;
    userId: string;
    user?: IUser;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
