/*
  Warnings:

  - Added the required column `finalMarks` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxAssessmentMarks` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "finalMarks" INTEGER NOT NULL,
ADD COLUMN     "maxAssessmentMarks" INTEGER NOT NULL;
