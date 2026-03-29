import { ISubscriptionStatus } from "../enums";
import { ITierLevel } from "../finanzas/finanzas";
import { IUser } from "../user/user";

export interface ISubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number; // Representación de Decimal en TS
  durationDays: number;
  isActive: boolean;
  
  // Relaciones opcionales (incluidas mediante Prisma)
  tierLevelId: string | null;
  tierLevel?: ITierLevel | null; 
  subscriptions?: Subscription[];

  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  status: ISubscriptionStatus;
  startDate: Date;
  endDate: Date;
  
  userId: string;
  user?: IUser; // Interfaz User definida anteriormente
  
  planId: string;
  plan?: ISubscriptionPlan;

  transactionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}