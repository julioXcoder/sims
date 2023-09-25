-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('EXAMINATION_OFFICER', 'LECTURE', 'STUDENT', 'STUDENT_PRESIDENT', 'CLASS_REPRESENTATIVE');

-- CreateTable
CREATE TABLE "Staff" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" "RoleName" NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffRole" (
    "staffId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "StaffRole_pkey" PRIMARY KEY ("staffId","roleId")
);

-- CreateTable
CREATE TABLE "StudentRole" (
    "studentId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "StudentRole_pkey" PRIMARY KEY ("studentId","roleId")
);

-- CreateTable
CREATE TABLE "AcademicYear" (
    "id" SERIAL NOT NULL,
    "year" TEXT NOT NULL,

    CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "maxAssessmentMarks" INTEGER NOT NULL,
    "finalMarks" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CAComponent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "marks" INTEGER NOT NULL,
    "CAId" INTEGER NOT NULL,

    CONSTRAINT "CAComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinalResult" (
    "id" SERIAL NOT NULL,
    "marks" INTEGER,
    "studentId" INTEGER NOT NULL,
    "courseInstanceId" INTEGER NOT NULL,

    CONSTRAINT "FinalResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semester" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "academicYearId" INTEGER NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CAResult" (
    "id" SERIAL NOT NULL,
    "marks" INTEGER,
    "studentId" INTEGER NOT NULL,
    "componentId" INTEGER NOT NULL,
    "courseInstanceId" INTEGER NOT NULL,

    CONSTRAINT "CAResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CA" (
    "id" SERIAL NOT NULL,
    "courseInstanceId" INTEGER NOT NULL,

    CONSTRAINT "CA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseInstance" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "semesterId" INTEGER NOT NULL,
    "lecturerId" INTEGER NOT NULL,

    CONSTRAINT "CourseInstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicYear_year_key" ON "AcademicYear"("year");

-- CreateIndex
CREATE UNIQUE INDEX "CourseInstance_courseId_semesterId_key" ON "CourseInstance"("courseId", "semesterId");

-- AddForeignKey
ALTER TABLE "StaffRole" ADD CONSTRAINT "StaffRole_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffRole" ADD CONSTRAINT "StaffRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentRole" ADD CONSTRAINT "StudentRole_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentRole" ADD CONSTRAINT "StudentRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CAComponent" ADD CONSTRAINT "CAComponent_CAId_fkey" FOREIGN KEY ("CAId") REFERENCES "CA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalResult" ADD CONSTRAINT "FinalResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalResult" ADD CONSTRAINT "FinalResult_courseInstanceId_fkey" FOREIGN KEY ("courseInstanceId") REFERENCES "CourseInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Semester" ADD CONSTRAINT "Semester_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CAResult" ADD CONSTRAINT "CAResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CAResult" ADD CONSTRAINT "CAResult_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "CAComponent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CAResult" ADD CONSTRAINT "CAResult_courseInstanceId_fkey" FOREIGN KEY ("courseInstanceId") REFERENCES "CourseInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CA" ADD CONSTRAINT "CA_courseInstanceId_fkey" FOREIGN KEY ("courseInstanceId") REFERENCES "CourseInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseInstance" ADD CONSTRAINT "CourseInstance_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseInstance" ADD CONSTRAINT "CourseInstance_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseInstance" ADD CONSTRAINT "CourseInstance_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
