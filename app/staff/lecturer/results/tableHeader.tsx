"use client";

import { SubjectInfo } from "@/types";
import { BiSearchAlt2 } from "react-icons/bi";

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedSubject: SubjectInfo | null;
  setSelectedSubject: (value: SubjectInfo | null) => void;
  subjects: SubjectInfo[];
}

const TableHeader = ({
  searchTerm,
  setSearchTerm,
  selectedSubject,
  setSelectedSubject,
  subjects,
}: Props) => {
  return (
    <div className="grid gap-3 border-b border-gray-200 px-6 pb-3 dark:border-gray-700 md:flex md:items-center md:justify-between">
      <div className="sm:col-span-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full pl-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <BiSearchAlt2 size={20} className="text-gray-400" />
          </div>
        </div>
      </div>
      <div className="sm:col-span-2 md:grow">
        <div className="flex justify-end gap-x-2">
          <div className="relative inline-block">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn m-1">
                Options
              </label>
              <ul
                tabIndex={0}
                className="menu dropdown-content rounded-box z-[2] w-52 bg-base-100 p-2 shadow"
              >
                <h1>Title</h1>
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
                <h1>Title</h1>
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="relative inline-block">
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedSubject ? selectedSubject.subjectInstanceId : ""}
              onChange={(e) => {
                const selectedSubjectId = parseInt(e.target.value);
                setSelectedSubject(
                  subjects.find(
                    (subject) =>
                      subject.subjectInstanceId === selectedSubjectId,
                  ) || null,
                );
              }}
            >
              {subjects.map((subject) => (
                <option
                  key={subject.subjectInstanceId}
                  value={subject.subjectInstanceId}
                >
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
