"use client";

import { useEffect, useState } from "react";
import { getStudentCAResults } from "@/actions";
import { Data, CASemester } from "@/types";

const CAResultsPage = () => {
  const [data, setData] = useState<Data<CASemester> | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await getStudentCAResults();
      if (result.data) {
        setData(result.data);
        // Check if result.data.years has at least one element
        if (result.data.years.length > 0) {
          setSelectedYear(result.data.years[0].year);
        }
      } else if (result.error) {
        setError(result.error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  if (error) {
    return <div>Oops something went wrong!</div>;
  }

  if (!data) {
    return (
      <div className="animate-pulse">
        <div className="mb-4 flex items-center justify-between border-b border-indigo-500 py-2">
          <div>Students CA Results</div>
        </div>
        <div>Retrieving Data</div>
        <div className="mt-2 flex h-16 w-full items-center justify-center rounded-lg bg-gray-50 p-2 shadow-md"></div>
        <div className="mt-2 flex h-16 w-full items-center justify-center rounded-lg bg-gray-50 p-2 shadow-md"></div>
      </div>
    );
  }

  const yearData = data.years.find((year) => year.year === selectedYear);

  if (data) {
    return (
      <div>
        <div className="mb-4 flex items-center justify-between border-b border-indigo-500 py-2">
          <div>Students CA Results</div>
          {data.years && data.years.length > 0 ? (
            <div className="form-control">
              <select
                className="select select-bordered select-sm"
                value={selectedYear}
                onChange={handleChange}
              >
                {data.years.map((year, index) => (
                  <option key={index} value={year.year}>
                    {year.year}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>

        {yearData &&
        yearData.studentYears &&
        yearData.studentYears.length > 0 ? (
          yearData.studentYears.map((studentYear, index) => (
            <div key={index}>
              <h2>{studentYear.year}</h2> {/* Student year heading */}
              {studentYear.semesters.map((semester, index) => (
                <div key={index} className="my-2 flex flex-col">
                  <div className="collapse bg-gray-50 shadow-md">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                      {semester.semester}
                    </div>

                    <div className="collapse-content">
                      <div className="overflow-x-auto">
                        {semester.results.map((result, index) => (
                          <table key={index} className="table">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="text-xs font-semibold uppercase tracking-wide text-gray-800 ">
                                  subject name
                                </th>
                                {result.results.map((res, index) => (
                                  <th
                                    className="text-xs font-semibold uppercase tracking-wide text-gray-800 "
                                    key={index}
                                  >
                                    {res.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-sm text-gray-600">
                                  {result.subject}
                                </td>
                                {result.results.map((res, index) => (
                                  <td
                                    className="text-sm text-gray-600"
                                    key={index}
                                  >
                                    {res.marks}
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div>No data available</div>
        )}
      </div>
    );
  }
};

export default CAResultsPage;
