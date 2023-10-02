/*
  Warnings:

  - You are about to drop the column `studentId` on the `CAResult` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `FinalResult` table. All the data in the column will be lost.
  - Added the required column `studentYearId` to the `CAResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentYearId` to the `FinalResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CAResult" DROP CONSTRAINT "CAResult_studentId_fkey";

-- DropForeignKey
ALTER TABLE "FinalResult" DROP CONSTRAINT "FinalResult_studentId_fkey";

-- AlterTable
ALTER TABLE "CAResult" DROP COLUMN "studentId",
ADD COLUMN     "studentYearId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FinalResult" DROP COLUMN "studentId",
ADD COLUMN     "studentYearId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "StudentYear" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "yearId" INTEGER NOT NULL,

    CONSTRAINT "StudentYear_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentYear_studentId_yearId_key" ON "StudentYear"("studentId", "yearId");

-- AddForeignKey
ALTER TABLE "FinalResult" ADD CONSTRAINT "FinalResult_studentYearId_fkey" FOREIGN KEY ("studentYearId") REFERENCES "StudentYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CAResult" ADD CONSTRAINT "CAResult_studentYearId_fkey" FOREIGN KEY ("studentYearId") REFERENCES "StudentYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentYear" ADD CONSTRAINT "StudentYear_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentYear" ADD CONSTRAINT "StudentYear_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
