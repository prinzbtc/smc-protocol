/*
  Warnings:

  - You are about to drop the column `holdings` on the `TreasuryUpdate` table. All the data in the column will be lost.
  - Added the required column `snapshot` to the `TreasuryUpdate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `treasuryId` to the `TreasuryUpdate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TreasuryUpdate" DROP COLUMN "holdings",
ADD COLUMN     "snapshot" JSONB NOT NULL,
ADD COLUMN     "treasuryId" TEXT NOT NULL,
ALTER COLUMN "previousNAV" DROP NOT NULL,
ALTER COLUMN "percentChange" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Treasury" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "netAssetValue" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Treasury_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "treasuryId" TEXT NOT NULL,
    "mint" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "usdValue" DOUBLE PRECISION NOT NULL,
    "logoURI" TEXT,
    "color" TEXT,
    "isAutoUpdated" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Treasury_address_key" ON "Treasury"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Token_treasuryId_mint_key" ON "Token"("treasuryId", "mint");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_treasuryId_fkey" FOREIGN KEY ("treasuryId") REFERENCES "Treasury"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreasuryUpdate" ADD CONSTRAINT "TreasuryUpdate_treasuryId_fkey" FOREIGN KEY ("treasuryId") REFERENCES "Treasury"("id") ON DELETE CASCADE ON UPDATE CASCADE;
