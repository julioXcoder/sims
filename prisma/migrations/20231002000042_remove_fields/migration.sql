/*
  Warnings:

  - The values [STUDENT_PRESIDENT,CLASS_REPRESENTATIVE] on the enum `RoleName` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `lecturerId` on the `SubjectInstance` table. All the data in the column will be lost.
  - You are about to drop the `StudentRole` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lectererId` to the `SubjectInstance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PositionName" AS ENUM ('STUDENT_PRESIDENT', 'CLASS_REPRESENTATIVE');

-- AlterEnum
BEGIN;
CREATE TYPE "RoleName_new" AS ENUM ('EXAMINATION_OFFICER', 'LECTURE', 'STUDENT');
ALTER TABLE "Role" ALTER COLUMN "name" TYPE "RoleName_new" USING ("name"::text::"RoleName_new");
ALTER TYPE "RoleName" RENAME TO "RoleName_old";
ALTER TYPE "RoleName_new" RENAME TO "RoleName";
DROP TYPE "RoleName_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "StudentRole" DROP CONSTRAINT "StudentRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "StudentRole" DROP CONSTRAINT "StudentRole_studentId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectInstance" DROP CONSTRAINT "SubjectInstance_lecturerId_fkey";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'STUDENT';

-- AlterTable
ALTER TABLE "SubjectInstance" DROP COLUMN "lecturerId",
ADD COLUMN     "lectererId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "StudentRole";

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "name" "PositionName" NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentPosition" (
    "studentId" INTEGER NOT NULL,
    "positionId" INTEGER NOT NULL,

    CONSTRAINT "StudentPosition_pkey" PRIMARY KEY ("studentId","positionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Position_name_key" ON "Position"("name");

-- AddForeignKey
ALTER TABLE "StudentPosition" ADD CONSTRAINT "StudentPosition_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPosition" ADD CONSTRAINT "StudentPosition_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectInstance" ADD CONSTRAINT "SubjectInstance_lectererId_fkey" FOREIGN KEY ("lectererId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
