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

export { studentSchema, studentRoleSchema };
