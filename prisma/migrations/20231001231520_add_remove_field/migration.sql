/*
  Warnings:

  - You are about to drop the column `userId` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `StaffRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[roleId]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roleId` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_userId_fkey";

-- DropForeignKey
ALTER TABLE "StaffRole" DROP CONSTRAINT "StaffRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "StaffRole" DROP CONSTRAINT "StaffRole_staffId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_fkey";

-- DropIndex
DROP INDEX "Staff_userId_key";

-- DropIndex
DROP INDEX "Student_userId_key";

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "userId",
ADD COLUMN     "roleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "userId";

-- DropTable
DROP TABLE "StaffRole";

-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE UNIQUE INDEX "Staff_roleId_key" ON "Staff"("roleId");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
