import { IAccountStatus, IInvestmentStatus, INetwork, ITransactionStatus, ITransactionType } from "../enums";
import { ICurrency } from "../infrastructura/infrastuctura";
import { IUser } from "../user/user";
import { IDecimal, IJson } from "../utils";

export interface ITierLevel {
  id: string;
  name: string;
  rank: number;
  pointsRequired: number;
  allowedPackages: IJson;
  roiPercentage: IDecimal;
  users?: IUser[];
}

export interface IInvestment {
  id: string;
  amount: IDecimal;
  profitAmount: IDecimal;
  totalReturn: IDecimal;
  status: IInvestmentStatus;
  startDate: Date;
  maturityDate: Date;
  completedAt?: Date | null;
  userId: string;
  user?: IUser;
  currencyId: string;
  currency?: ICurrency;
  sourceTransactionId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBankAccount {
  id: string;
  accountNumber: string;
  availableBalance: IDecimal;
  lockedBalance: IDecimal;
  status: IAccountStatus;
  currencyId: string;
  currency?: ICurrency;
  userId: string;
  user?: IUser;
  sentTransactions?: ITransaction[];
  receivedTransactions?: ITransaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICryptoWallet {
  id: string;
  address: string;
  network: INetwork;
  balance: IDecimal;
  currencyId: string;
  currency?: ICurrency;
  userId: string;
  user?: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction {
  id: string;
  amount: IDecimal;
  fee: IDecimal;
  status: ITransactionStatus;
  type: ITransactionType;
  currencyId: string;
  currency?: ICurrency;
  txHash?: string | null;
  blockchainNetwork?: INetwork | null;
  senderAccountId?: string | null;
  senderAccount?: IBankAccount | null;
  receiverAccountId?: string | null;
  receiverAccount?: IBankAccount | null;
  metadata?: IJson | null;
  createdAt: Date;
}