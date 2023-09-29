import React from "react";

const Sidebar = () => {
  return (
    <div className="fixed bottom-0 left-0 hidden h-[calc(100vh-5rem)] w-52 lg:flex">
      <nav className="flex w-full flex-col flex-wrap p-6">
        <ul className="space-y-1.5">
          <li>
            <a
              className="flex items-center gap-x-3 rounded-md bg-gray-50 px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-100"
              href="#"
            >
              {/* <svg
                className="h-3.5 w-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
                />
                <path
                  fill-rule="evenodd"
                  d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
                />
              </svg> */}
              Dashboard
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
