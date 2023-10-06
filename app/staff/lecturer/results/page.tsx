"use client";

import {
  getStudentsForSubjectInstanceCAResults,
  updateStudentCAResults,
  getSubjects,
} from "@/actions";
import { useForm, FieldValues } from "react-hook-form";
import { MdModeEdit } from "react-icons/md";
import { StudentCAResults, CAResult, SubjectInfo } from "@/types";
import { useState, useEffect } from "react";

const ResultsPage = () => {
  const [data, setData] = useState<StudentCAResults[] | null>(null);
  const [subjects, setSubjects] = useState<SubjectInfo[] | null>(null);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      const subjects = await getSubjects();
      const result = await getStudentsForSubjectInstanceCAResults(1);
      if (result.data) {
        setData(result.data);
      } else if (result.error) {
        setError(result.error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (
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

    const response = await updateStudentCAResults(id, 1, studentCAResults);

    if (response.error) {
      console.error(response.error);
      // Handle error (e.g., show an error message or revert the form values)
    } else {
      (document.getElementById(`my_modal_${id}`) as HTMLDialogElement).close();
      const result = await getStudentsForSubjectInstanceCAResults(1);
      if (result.data) {
        setData(result.data);
      } else if (result.error) {
        setError(result.error);
      }
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  if (data) {
    return (
      <div className="h-[30rem]">
        <div className="grid gap-3 border-b border-gray-200 px-6 pb-3 dark:border-gray-700 md:flex md:items-center md:justify-between">
          <div className="sm:col-span-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full pl-11"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <svg
                  className="h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
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
                <select className="select select-bordered w-full max-w-xs">
                  <option disabled selected>
                    Who shot first?
                  </option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[calc(100%-4rem)] overflow-x-auto">
          <table className="table table-pin-rows table-md">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                {data[0].caResults.map((result, index) => (
                  <th key={index}>{result.name}</th>
                ))}
                <th>EDIT</th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ id, firstName, lastName, caResults }) => (
                <tr className="hover" key={id}>
                  <th>{id}</th>
                  <td>{`${firstName} ${lastName}`}</td>
                  {caResults.map((result, index) => (
                    // <td key={index}>{result.marks ? result.marks : "null"}</td>
                    <td key={index}>{result.marks}</td>
                  ))}
                  <td>
                    <label htmlFor={`my_modal_${id}`}>
                      <MdModeEdit
                        onClick={() =>
                          (
                            document.getElementById(
                              `my_modal_${id}`,
                            ) as HTMLDialogElement
                          ).showModal()
                        }
                        className="hover:cursor-pointer"
                        size={16}
                      />
                    </label>
                    {/* FIXME: MODAL */}
                    <div>
                      <dialog id={`my_modal_${id}`} className="modal">
                        <div className="modal-box">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">
                              Edit CA Results
                            </h3>
                            <div className="-mt-2">
                              <form method="dialog">
                                <button className="btn btn-circle btn-sm outline-none">
                                  X
                                </button>
                              </form>
                            </div>
                          </div>

                          <form className="form-control w-full max-w-xs">
                            {caResults.map((result, index) => (
                              <div className="mb-2" key={index}>
                                <label className="label">
                                  <span className="label-text">
                                    {result.name}
                                  </span>
                                </label>
                                <input
                                  type="number"
                                  {...register(
                                    `students[${id}].caResults[${index}].marks`,
                                  )}
                                  defaultValue={result.marks ? result.marks : 0}
                                  className="input input-bordered w-full max-w-xs"
                                />
                              </div>
                            ))}
                          </form>
                          <div className="modal-action">
                            <button
                              className="btn"
                              onClick={handleSubmit((data) =>
                                onSubmit(id, caResults, data),
                              )}
                            >
                              submit
                            </button>
                          </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                          <button className="cursor-default">close</button>
                        </form>
                      </dialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </div>
    );
  }
};

export default ResultsPage;
