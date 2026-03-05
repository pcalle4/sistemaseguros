-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('QUOTED');

-- CreateEnum
CREATE TYPE "BreakdownConcept" AS ENUM ('BASE', 'AGE_FACTOR', 'LOCATION_FACTOR', 'COVERAGE_FACTOR');

-- CreateTable
CREATE TABLE "insurance_types" (
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "insurance_types_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "coverages" (
    "id" UUID NOT NULL,
    "insurance_type_code" VARCHAR(20) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "coverages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" UUID NOT NULL,
    "status" "QuoteStatus" NOT NULL,
    "insurance_type" VARCHAR(20) NOT NULL,
    "coverage" VARCHAR(20) NOT NULL,
    "age" INTEGER NOT NULL,
    "location" VARCHAR(30) NOT NULL,
    "estimated_premium" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_breakdown" (
    "id" UUID NOT NULL,
    "quote_id" UUID NOT NULL,
    "concept" "BreakdownConcept" NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "quote_breakdown_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coverages_insurance_type_code_code_key" ON "coverages"("insurance_type_code", "code");

-- CreateIndex
CREATE INDEX "quote_breakdown_quote_id_idx" ON "quote_breakdown"("quote_id");

-- AddForeignKey
ALTER TABLE "coverages" ADD CONSTRAINT "coverages_insurance_type_code_fkey" FOREIGN KEY ("insurance_type_code") REFERENCES "insurance_types"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_insurance_type_fkey" FOREIGN KEY ("insurance_type") REFERENCES "insurance_types"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_insurance_type_coverage_fkey" FOREIGN KEY ("insurance_type", "coverage") REFERENCES "coverages"("insurance_type_code", "code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_location_fkey" FOREIGN KEY ("location") REFERENCES "locations"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_breakdown" ADD CONSTRAINT "quote_breakdown_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
