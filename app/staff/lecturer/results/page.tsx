"use client";

import {
  getStudentsForSubjectInstanceCAResults,
  getSubjects,
  updateStudentCAResults,
  createCAComponents,
} from "@/actions";
import {
  CAComponentInput,
  CAResult,
  StudentCAResults,
  SubjectInfo,
} from "@/types";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import ResultsTable from "./resultsTable";
import TableHeader from "./tableHeader";
import { Pagination } from "@/components";
import CreateCAComponents from "./createCAComponents ";

const studentCAResultsArray: StudentCAResults[] = Array.from(
  { length: 100 },
  (_, i) => ({
    id: i + 4,
    firstName: `Student ${i + 4}`,
    lastName: `Lastname ${i + 4}`,
    caResults: [
      { id: 1, name: "Test 1", marks: Math.floor(Math.random() * 100) },
      { id: 2, name: "Test 2", marks: Math.floor(Math.random() * 100) },
    ],
  }),
);

const ResultsPage = () => {
  const [data, setData] = useState<StudentCAResults[] | null>(null);
  const [subjects, setSubjects] = useState<SubjectInfo[] | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectInfo | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // Fetch subjects and initial CA results
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Fetch CA results when selected subject changes
  useEffect(() => {
    if (selectedSubject) {
      const fetchCAResults = async () => {
        const caResultsResult = await getStudentsForSubjectInstanceCAResults(
          selectedSubject.subjectInstanceId,
        );
        if (caResultsResult.data) {
          setData(caResultsResult.data);
        } else if (caResultsResult.error) {
          setError(caResultsResult.error);
        }
      };

      fetchCAResults();
    }
  }, [selectedSubject, subjects]);

  const fetchSubjects = async () => {
    const subjectsResult = await getSubjects();
    if (subjectsResult.data) {
      setSubjects(subjectsResult.data);
      setSelectedSubject(subjectsResult.data[0]);
    } else if (subjectsResult.error) {
      setError(subjectsResult.error);
    }
  };

  const handleSubmit = async (
    id: number,
    caResults: CAResult[],
    data: FieldValues,
  ) => {
    const studentCAResults = data.students[id].caResults.map(
      (result: { marks: string }, index: number) => ({
        componentId: caResults[index].id,
        marks: parseInt(result.marks),
      }),
    );

    if (selectedSubject) {
      const response = await updateStudentCAResults(
        id,
        selectedSubject.subjectInstanceId,
        studentCAResults,
      );

      if (response.error) {
        console.error(response.error);
        // Handle error (e.g., show an error message or revert the form values)
      } else {
        (
          document.getElementById(`my_modal_${id}`) as HTMLDialogElement
        ).close();
        const result = await getStudentsForSubjectInstanceCAResults(
          selectedSubject.subjectInstanceId,
        );
        if (result.data) {
          setData(result.data);
        } else if (result.error) {
          setError(result.error);
        }
      }
    }
  };

  const handleCreateCAComponent = async (components: CAComponentInput[]) => {
    if (selectedSubject) {
      const response = await createCAComponents(
        selectedSubject.subjectInstanceId,
        components,
      );

      if (response.data) {
        await fetchSubjects();
      } else if (response.error) {
        setError(response.error);
      }
    } else {
      setError("Error");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!data || !subjects) {
    return <div>Loading...</div>;
  }

  // Filter data based on search term
  const filteredData = data.filter(
    (student) =>
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.id.toString() === searchTerm,
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="h-[37rem]">
      <TableHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        subjects={subjects}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
      />
      {selectedSubject && !selectedSubject.caComponents.length ? (
        <>
          <CreateCAComponents onCreateCAComponent={handleCreateCAComponent} />
        </>
      ) : (
        <>
          <ResultsTable
            onSubmit={handleSubmit}
            data={data}
            filteredData={currentData}
          />
          <div className="mt-2">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ResultsPage;
