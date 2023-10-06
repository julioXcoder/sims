"use client";

import { CAResult, StudentCAResults } from "@/types";
import { MdModeEdit } from "react-icons/md";
import { useForm, FieldValues } from "react-hook-form";

interface Props {
  data: StudentCAResults[];
  filteredData: StudentCAResults[];
  onSubmit: (
    id: number,
    caResults: CAResult[],
    data: FieldValues,
  ) => Promise<void>;
}

const ResultsTable = ({ data, filteredData, onSubmit }: Props) => {
  const { register, handleSubmit } = useForm();

  return (
    <div className="h-[calc(100%-6rem)] overflow-x-auto">
      <table className="table table-pin-rows table-md md:table-sm">
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
          {filteredData.map(({ id, firstName, lastName, caResults }) => (
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
                          {firstName} {lastName}
                        </h3>
                        <div className="-mt-2">
                          <form method="dialog">
                            <button className="btn btn-circle btn-sm outline-none">
                              X
                            </button>
                          </form>
                        </div>
                      </div>

                      <div className="px-4 pt-2">
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
                      </div>
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
      </table>
    </div>
  );
};

export default ResultsTable;
