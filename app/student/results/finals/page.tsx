"use client";

import { useEffect, useState } from "react";
import { getStudentFinalResults } from "@/actions";
import { Data, FinalsSemester } from "@/types";

const FinalsPage = () => {
  const [data, setData] = useState<Data<FinalsSemester> | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await getStudentFinalResults();
      if (result.data) {
        setData(result.data);
        setSelectedYear(result.data.years[0].year);
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
    return <span className="loading loading-dots loading-md"></span>;
  }

  const yearData = data.years.find((year) => year.year === selectedYear);

  if (data) {
    return (
      <div>
        <div className="mb-4 flex items-center justify-between border-b border-red-500 py-2">
          <div>Students Final Results</div>
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
        </div>

        {yearData &&
          yearData.semesters.map((semester, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <div className="collapse bg-gray-50 shadow-md">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium">
                  {semester.semester}
                </div>
                <div className="collapse-content">
                  <div className="overflow-x-auto">
                    <table key={index} className="table">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="text-xs font-semibold uppercase tracking-wide text-gray-800 ">
                            subject name
                          </th>
                          <th className="text-xs font-semibold uppercase tracking-wide text-gray-800 ">
                            marks
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* <tr>
                            <td className="text-sm text-gray-600">
                              {result.subject}
                            </td>
                            {result.results.map((res, index) => (
                              <td className="text-sm text-gray-600" key={index}>
                                {res.marks}
                              </td>
                            ))}
                          </tr> */}
                        <tr>
                          <td className="text-sm text-gray-600">
                            {semester.result.name}
                          </td>
                          <td className="text-sm text-gray-600">
                            {semester.result.marks}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }
};

export default FinalsPage;
