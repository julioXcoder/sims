/*
  Warnings:

  - The values [STUDENT] on the enum `RoleName` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `lectererId` on the `SubjectInstance` table. All the data in the column will be lost.
  - Added the required column `lecturerId` to the `SubjectInstance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoleName_new" AS ENUM ('EXAMINATION_OFFICER', 'LECTURE');
ALTER TABLE "Role" ALTER COLUMN "name" TYPE "RoleName_new" USING ("name"::text::"RoleName_new");
ALTER TYPE "RoleName" RENAME TO "RoleName_old";
ALTER TYPE "RoleName_new" RENAME TO "RoleName";
DROP TYPE "RoleName_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "SubjectInstance" DROP CONSTRAINT "SubjectInstance_lectererId_fkey";

-- AlterTable
ALTER TABLE "SubjectInstance" DROP COLUMN "lectererId",
ADD COLUMN     "lecturerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SubjectInstance" ADD CONSTRAINT "SubjectInstance_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
