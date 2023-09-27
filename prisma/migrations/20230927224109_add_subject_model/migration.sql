/*
  Warnings:

  - You are about to drop the column `courseInstanceId` on the `CA` table. All the data in the column will be lost.
  - You are about to drop the column `courseInstanceId` on the `CAResult` table. All the data in the column will be lost.
  - You are about to drop the column `finalMarks` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `maxAssessmentMarks` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `courseInstanceId` on the `FinalResult` table. All the data in the column will be lost.
  - You are about to drop the `CourseInstance` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subjectInstanceId` to the `CA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectInstanceId` to the `CAResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectInstanceId` to the `FinalResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CA" DROP CONSTRAINT "CA_courseInstanceId_fkey";

-- DropForeignKey
ALTER TABLE "CAResult" DROP CONSTRAINT "CAResult_courseInstanceId_fkey";

-- DropForeignKey
ALTER TABLE "CourseInstance" DROP CONSTRAINT "CourseInstance_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseInstance" DROP CONSTRAINT "CourseInstance_lecturerId_fkey";

-- DropForeignKey
ALTER TABLE "CourseInstance" DROP CONSTRAINT "CourseInstance_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "FinalResult" DROP CONSTRAINT "FinalResult_courseInstanceId_fkey";

-- AlterTable
ALTER TABLE "CA" DROP COLUMN "courseInstanceId",
ADD COLUMN     "subjectInstanceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CAResult" DROP COLUMN "courseInstanceId",
ADD COLUMN     "subjectInstanceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "finalMarks",
DROP COLUMN "maxAssessmentMarks";

-- AlterTable
ALTER TABLE "FinalResult" DROP COLUMN "courseInstanceId",
ADD COLUMN     "subjectInstanceId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CourseInstance";

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "maxAssessmentMarks" INTEGER NOT NULL,
    "finalMarks" INTEGER NOT NULL,
    "levelId" INTEGER NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectInstance" (
    "id" SERIAL NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "semesterId" INTEGER NOT NULL,
    "lecturerId" INTEGER NOT NULL,

    CONSTRAINT "SubjectInstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubjectInstance_subjectId_semesterId_key" ON "SubjectInstance"("subjectId", "semesterId");

-- AddForeignKey
ALTER TABLE "FinalResult" ADD CONSTRAINT "FinalResult_subjectInstanceId_fkey" FOREIGN KEY ("subjectInstanceId") REFERENCES "SubjectInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CAResult" ADD CONSTRAINT "CAResult_subjectInstanceId_fkey" FOREIGN KEY ("subjectInstanceId") REFERENCES "SubjectInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CA" ADD CONSTRAINT "CA_subjectInstanceId_fkey" FOREIGN KEY ("subjectInstanceId") REFERENCES "SubjectInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectInstance" ADD CONSTRAINT "SubjectInstance_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectInstance" ADD CONSTRAINT "SubjectInstance_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectInstance" ADD CONSTRAINT "SubjectInstance_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
