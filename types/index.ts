import { IconType } from "react-icons";

interface Path {
  title: string;
  path: string;
  Icon: IconType;
}

interface Result {
  subject: string;
  results: { marks: number; name: string }[];
}

interface FinalsResult {
  name: string;
  marks: number;
}

interface CASemester {
  semester: string;
  results: Result[];
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
};
