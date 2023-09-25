/*
  Warnings:

  - You are about to drop the column `email` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Staff_email_key";

-- DropIndex
DROP INDEX "Student_email_key";

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "email";
