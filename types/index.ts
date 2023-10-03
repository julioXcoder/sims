import { IconType } from "react-icons";

interface Path {
  title: string;
  path: string;
  Icon: IconType;
}

interface Result {
  name: string;
  marks: number | null;
}

interface StudentResults {
  id: number;
  password: string;
  firstName: string;
  lastName: string;
  yearId: number;
  role: string;
  caResults: Result[];
  finalResults: Result[];
}

interface SubjectResult {
  subject: string;
  results: Result[];
}

interface FinalsResult {
  name: string;
  marks: number | null;
}

interface CASemester {
  semester: string;
  results: SubjectResult[];
}

interface CAComponentInput {
  name: string;
  marks: number;
}

interface CreateCAComponentsResponse {
  data?: CAComponentInfo[];
  error?: string;
}

interface CAComponentInfo {
  name: string;
  marks: number;
}

interface SubjectInfo {
  college: string;
  department: string;
  course: string;
  level: string;
  year: string;
  name: string;
  id: number;
  caComponents: CAComponentInfo[];
}

interface GetSubjectsResponse {
  data?: SubjectInfo[];
  error?: string;
}

interface FinalsSemester {
  semester: string;
  result: FinalsResult;
}

interface StudentYear<T> {
  year: string;
  semesters: T[];
}

interface Year<T> {
  year: string;
  studentYears: StudentYear<T>[];
}

interface Data<T> {
  years: Year<T>[];
}

interface GetStudentResultsResponse<T> {
  data?: Data<T>;
  error?: string;
}

interface AuthorizeUserResponse {
  redirect?: string;
  error?: string;
}

interface GetStudentsForSubjectInstanceResponse {
  data?: StudentResults[];
  error?: string;
}

type GetStudentCAResultsResponse = GetStudentResultsResponse<CASemester>;
type GetStudentFinalResultsResponse = GetStudentResultsResponse<FinalsSemester>;

export type {
  Data,
  GetStudentCAResultsResponse,
  GetStudentFinalResultsResponse,
  FinalsSemester,
  CASemester,
  AuthorizeUserResponse,
  Path,
  GetSubjectsResponse,
  SubjectInfo,
  CAComponentInput,
  CreateCAComponentsResponse,
  GetStudentsForSubjectInstanceResponse,
};
