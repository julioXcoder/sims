"use client";

import { useState } from "react";
import * as z from "zod";

import { MdDelete } from "react-icons/md";
import { BsExclamationLg } from "react-icons/bs";
import { CAComponentInput } from "@/types";

const maxMarks = 40;

interface CAFields {
  [key: string]: number;
}

const inputSchema = z.object({
  key: z.string().nonempty(),
  value: z.number(),
});

type Input = z.infer<typeof inputSchema>;

interface Props {
  onCreateCAComponent: (components: CAComponentInput[]) => Promise<void>;
}

const CreateCAComponents = ({ onCreateCAComponent }: Props) => {
  const [inputs, setInputs] = useState<Input[]>([{ key: "", value: 0 }]);
  const [error, setError] = useState<string | null>(null);

  const sum = inputs.reduce((acc, input) => acc + Number(input.value), 0);

  const handleAddInput = () => {
    setInputs([...inputs, { key: "", value: 0 }]);
  };

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newInputs = [...inputs];
    if (event.target.name === "key") {
      newInputs[index].key = event.target.value;
    } else if (event.target.name === "value") {
      newInputs[index].value = Number(event.target.value);
    }
    setInputs(newInputs);
  };

  const handleDeleteInput = (index: number) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

  const handleClearInputs = () => {
    setInputs([{ key: "", value: 0 }]);
    setError(null);
  };

  const handleSaveChanges = async () => {
    setError(null);

    try {
      inputSchema.array().parse(inputs);
    } catch (error) {
      setError("All fields must have a value.");
      return;
    }

    const keys = inputs.map((input) => input.key.toLowerCase());
    const uniqueKeys = new Set(keys);

    if (keys.length !== uniqueKeys.size) {
      setError("All fields must be unique.");
      return;
    }

    const sum = inputs.reduce((acc, input) => acc + input.value, 0);

    if (sum !== maxMarks) {
      setError(`The sum of all marks must be equal to ${maxMarks}.`);

      return;
    }

    const resultArray = inputs.map((input) => ({
      name: input.key.toLowerCase(),
      marks: input.value,
    }));

    (document.getElementById("my_modal_1") as HTMLDialogElement).close();

    await onCreateCAComponent(resultArray);
  };

  return (
    <div>
      <button
        className="btn"
        onClick={() =>
          (
            document.getElementById("my_modal_1") as HTMLDialogElement
          ).showModal()
        }
      >
        open modal
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <div className="overflow-y-auto p-4 text-gray-800 dark:text-gray-400">
            <>
              {inputs.map((input, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <div className="flex w-[47%] rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-200 bg-gray-50 px-4 text-sm text-gray-500">
                      Field
                    </span>
                    <input
                      type="text"
                      name="key"
                      value={input.key}
                      onChange={(event) => handleInputChange(index, event)}
                      className="block w-[calc(100%-3rem)] rounded-r-md border-gray-200 px-3 py-2 text-sm shadow-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex w-[47%] rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-200 bg-gray-50 px-4 text-sm text-gray-500">
                      Marks
                    </span>
                    <input
                      type="number"
                      name="value"
                      value={input.value}
                      onChange={(event) => handleInputChange(index, event)}
                      className="block w-[calc(100%-3rem)] rounded-r-md border-gray-200 px-3 py-2 text-sm shadow-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  {index > 0 && (
                    <button
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteInput(index)}
                    >
                      <MdDelete size={22} />
                    </button>
                  )}
                </div>
              ))}
              <div className="flex w-full items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={handleClearInputs}
                    className="btn btn-warning"
                  >
                    clear
                  </button>
                  <button onClick={handleAddInput} className="btn btn-success">
                    Add
                  </button>
                </div>
                <div>
                  <span
                    className={`${
                      sum == maxMarks ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {`${sum}/${maxMarks}`}
                  </span>
                </div>
              </div>
              {error && (
                <div className="mt-2 flex items-center rounded-md border border-red-200 bg-red-50 p-2">
                  <BsExclamationLg className="text-red-400" />
                  <h3 className="ml-2 text-sm font-semibold text-red-800">
                    {error}
                  </h3>
                </div>
              )}
            </>
          </div>
          <div className="flex items-center justify-end gap-x-2 border-t px-4 py-3">
            <button
              onClick={() =>
                (
                  document.getElementById("my_modal_1") as HTMLDialogElement
                ).close()
              }
              className="btn btn-error btn-outline"
            >
              Close
            </button>
            {/* <button
              onClick={() =>
                (
                  document.getElementById("my_modal_1") as HTMLDialogElement
                ).close()
              }
              className="hs-dropdown-toggle inline-flex items-center justify-center gap-2 rounded-md border bg-white px-4 py-3 align-middle text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white"
            >
              Close
            </button> */}
            {/* FIXME: add save changes functionality */}
            <button
              onClick={handleSaveChanges}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save changes
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop cursor-default">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default CreateCAComponents;
