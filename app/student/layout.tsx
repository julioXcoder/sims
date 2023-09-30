import React, { ReactNode } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { getStudentData } from "@/actions";

const StudentLayout = async ({ children }: { children: ReactNode }) => {
  const { firstName, lastName } = await getStudentData();
  return (
    <div className="flex flex-col">
      <Navbar name={`${firstName} ${lastName}`} />
      <div>
        <Sidebar />
        <div className="mt-20 h-full lg:ml-52">{children}</div>
      </div>
    </div>
  );
};

export default StudentLayout;
