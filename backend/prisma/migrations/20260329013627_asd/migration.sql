-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'CAR_PURCHASE';

-- AlterTable
ALTER TABLE "cars" ADD COLUMN     "owner_id" TEXT;

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
