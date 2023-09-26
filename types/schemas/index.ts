import z from "zod";

const studentRoles = [
  "STUDENT",
  "CLASS_REPRESENTATIVE",
  "STUDENT_PRESIDENT",
] as const;

const studentSchema = z.object({
  firstName: z.string().min(3).max(20),
  lastName: z.string().min(3).max(20),
  password: z.string().min(3).max(20),
});

const studentRoleSchema = z.object({
  role: z.enum(studentRoles),
});

const courseSchema = z.object({
  name: z.string().min(1).max(50),
  maxAssessmentMarks: z.number(),
  finalMarks: z.number(),
});

const academicYearSchema = z.object({
  year: z.string().min(4).max(10),
});

export { studentSchema, studentRoleSchema, courseSchema, academicYearSchema };
