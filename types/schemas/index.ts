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
  yearId: z.number(),
});

const lecturerSchema = z.object({
  firstName: z.string().min(3).max(20),
  lastName: z.string().min(3).max(20),
  password: z.string().min(3).max(20),
});

const studentRoleSchema = z.object({
  role: z.enum(studentRoles),
});

const academicYearSchema = z.object({
  year: z.string().min(4).max(10),
});

const departmentSchema = z.object({
  name: z.string().min(3).max(40),
});

const authSchema = z.object({
  username: z.string(),
  password: z.string().min(3),
});

export {
  studentSchema,
  studentRoleSchema,
  academicYearSchema,
  lecturerSchema,
  departmentSchema,
  authSchema,
};
