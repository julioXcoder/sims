import React, { ReactNode } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

const fetchStudent = async () => {};

const StudentLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div>
        <Sidebar />
        <div className="mt-20 lg:ml-52">{children}</div>
      </div>
    </div>
  );
};

export default StudentLayout;
