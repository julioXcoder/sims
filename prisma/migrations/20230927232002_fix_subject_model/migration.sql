/*
  Warnings:

  - You are about to drop the column `finalMarks` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `levelId` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `maxAssessmentMarks` on the `Subject` table. All the data in the column will be lost.
  - Added the required column `yearId` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_levelId_fkey";

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "finalMarks",
DROP COLUMN "levelId",
DROP COLUMN "maxAssessmentMarks",
ADD COLUMN     "yearId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
