"use client";

import {
  getStudentsForSubjectInstanceCAResults,
  updateStudentCAResults,
} from "@/actions";
import { useForm, FieldValues } from "react-hook-form";
import { MdModeEdit } from "react-icons/md";
import { StudentCAResults, CAResult } from "@/types";
import { useState, useEffect } from "react";

const ResultsPage = () => {
  const [data, setData] = useState<StudentCAResults[] | null>(null);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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

  return (
    <div>
      <div className="h-[35rem] overflow-x-auto">
        <table className="table table-pin-rows table-md">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              {data &&
                data[0].caResults.map((result, index) => (
                  <th key={index}>{result.name}</th>
                ))}
              <th>EDIT</th>
            </tr>
          </thead>
          <tbody>
            {data?.map(({ id, firstName, lastName, caResults }) => (
              <tr className="hover" key={id}>
                <th>{id}</th>
                <td>{`${firstName} ${lastName}`}</td>
                {caResults.map((result, index) => (
                  <td key={index}>{result.marks ? result.marks : "null"}</td>
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
                          <h3 className="text-lg font-bold">Edit CA Results</h3>
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
};

export default ResultsPage;
