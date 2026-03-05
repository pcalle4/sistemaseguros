-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('ACTIVE');

-- CreateTable
CREATE TABLE "policies" (
    "id" UUID NOT NULL,
    "quote_id" UUID NOT NULL,
    "status" "PolicyStatus" NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "policies_quote_id_key" ON "policies"("quote_id");
