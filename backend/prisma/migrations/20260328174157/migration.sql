/*
  Warnings:

  - The values [CUSTOMER,DRIVER,BUSINESS,SUPPORT] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `is_online` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `kyc_level` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `referral_code` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `referred_by_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `total_points` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `two_factor_enabled` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `ApplicationAbout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ApplicationObjetives` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ApplicationSocialMedia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ApplicationValues` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bank_accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `business_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `business_profile_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `business_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `business_schedules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `business_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories_by_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `common_addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `countries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `crypto_wallets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `currencies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `messages_in_to_web` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `promotions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `regions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `states` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscription_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `testimonials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `trips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vehicles` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('AVAILABLE', 'RENTED', 'IN_AUCTION', 'SOLD', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'CLOSED', 'RESOLVED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "bank_accounts" DROP CONSTRAINT "bank_accounts_currency_id_fkey";

-- DropForeignKey
ALTER TABLE "bank_accounts" DROP CONSTRAINT "bank_accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "business_categories" DROP CONSTRAINT "business_categories_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "business_profile_categories" DROP CONSTRAINT "business_profile_categories_business_category_id_fkey";

-- DropForeignKey
ALTER TABLE "business_profile_categories" DROP CONSTRAINT "business_profile_categories_business_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "business_profiles" DROP CONSTRAINT "business_profiles_business_type_id_fkey";

-- DropForeignKey
ALTER TABLE "business_profiles" DROP CONSTRAINT "business_profiles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "business_schedules" DROP CONSTRAINT "business_schedules_business_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "cities" DROP CONSTRAINT "cities_state_id_fkey";

-- DropForeignKey
ALTER TABLE "common_addresses" DROP CONSTRAINT "common_addresses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "countries" DROP CONSTRAINT "countries_currency_id_fkey";

-- DropForeignKey
ALTER TABLE "countries" DROP CONSTRAINT "countries_region_id_fkey";

-- DropForeignKey
ALTER TABLE "crypto_wallets" DROP CONSTRAINT "crypto_wallets_currency_id_fkey";

-- DropForeignKey
ALTER TABLE "crypto_wallets" DROP CONSTRAINT "crypto_wallets_user_id_fkey";

-- DropForeignKey
ALTER TABLE "promotions" DROP CONSTRAINT "promotions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "resources" DROP CONSTRAINT "resources_category_id_fkey";

-- DropForeignKey
ALTER TABLE "service_plans" DROP CONSTRAINT "service_plans_category_id_fkey";

-- DropForeignKey
ALTER TABLE "states" DROP CONSTRAINT "states_country_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_currency_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_receiver_account_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_sender_account_id_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_business_id_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_destination_address_id_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_driver_id_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_origin_address_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_referred_by_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_user_id_fkey";

-- DropIndex
DROP INDEX "users_referral_code_idx";

-- DropIndex
DROP INDEX "users_referral_code_key";

-- DropIndex
DROP INDEX "users_token_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_online",
DROP COLUMN "kyc_level",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "referral_code",
DROP COLUMN "referred_by_id",
DROP COLUMN "token",
DROP COLUMN "total_points",
DROP COLUMN "two_factor_enabled",
ALTER COLUMN "role" SET DEFAULT 'USER';

-- DropTable
DROP TABLE "ApplicationAbout";

-- DropTable
DROP TABLE "ApplicationObjetives";

-- DropTable
DROP TABLE "ApplicationSocialMedia";

-- DropTable
DROP TABLE "ApplicationValues";

-- DropTable
DROP TABLE "bank_accounts";

-- DropTable
DROP TABLE "business_categories";

-- DropTable
DROP TABLE "business_profile_categories";

-- DropTable
DROP TABLE "business_profiles";

-- DropTable
DROP TABLE "business_schedules";

-- DropTable
DROP TABLE "business_types";

-- DropTable
DROP TABLE "categories_by_items";

-- DropTable
DROP TABLE "cities";

-- DropTable
DROP TABLE "common_addresses";

-- DropTable
DROP TABLE "countries";

-- DropTable
DROP TABLE "crypto_wallets";

-- DropTable
DROP TABLE "currencies";

-- DropTable
DROP TABLE "messages_in_to_web";

-- DropTable
DROP TABLE "promotions";

-- DropTable
DROP TABLE "questions";

-- DropTable
DROP TABLE "regions";

-- DropTable
DROP TABLE "resources";

-- DropTable
DROP TABLE "service_categories";

-- DropTable
DROP TABLE "service_plans";

-- DropTable
DROP TABLE "states";

-- DropTable
DROP TABLE "subscription_plans";

-- DropTable
DROP TABLE "subscriptions";

-- DropTable
DROP TABLE "testimonials";

-- DropTable
DROP TABLE "transactions";

-- DropTable
DROP TABLE "trips";

-- DropTable
DROP TABLE "vehicles";

-- DropEnum
DROP TYPE "AccountStatus";

-- DropEnum
DROP TYPE "BusinessDayOfWeek";

-- DropEnum
DROP TYPE "BusinessStatus";

-- DropEnum
DROP TYPE "InvestmentStatus";

-- DropEnum
DROP TYPE "KYCLevel";

-- DropEnum
DROP TYPE "Network";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- DropEnum
DROP TYPE "TransactionStatus";

-- DropEnum
DROP TYPE "TransactionType";

-- DropEnum
DROP TYPE "TripStatus";

-- CreateTable
CREATE TABLE "cars" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "plate" TEXT NOT NULL,
    "color" TEXT,
    "type" TEXT NOT NULL,
    "mileage" INTEGER NOT NULL DEFAULT 0,
    "status" "CarStatus" NOT NULL DEFAULT 'AVAILABLE',
    "base_price" DECIMAL(18,2),
    "description" TEXT,
    "images" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rentals" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "RentalStatus" NOT NULL DEFAULT 'PENDING',
    "total_amount" DECIMAL(18,2) NOT NULL,
    "comments" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "rentals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auctions" (
    "id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "starting_price" DECIMAL(18,2) NOT NULL,
    "current_price" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" "AuctionStatus" NOT NULL DEFAULT 'UPCOMING',
    "winner_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "auctions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bids" (
    "id" TEXT NOT NULL,
    "auction_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bids_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cars_plate_key" ON "cars"("plate");

-- CreateIndex
CREATE INDEX "cars_status_idx" ON "cars"("status");

-- CreateIndex
CREATE INDEX "rentals_status_start_date_end_date_idx" ON "rentals"("status", "start_date", "end_date");

-- CreateIndex
CREATE INDEX "auctions_status_end_date_idx" ON "auctions"("status", "end_date");

-- CreateIndex
CREATE INDEX "bids_auction_id_amount_idx" ON "bids"("auction_id", "amount" DESC);

-- AddForeignKey
ALTER TABLE "rentals" ADD CONSTRAINT "rentals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rentals" ADD CONSTRAINT "rentals_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
