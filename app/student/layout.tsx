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
        <div className="mx-auto mt-10 h-full max-w-[85rem] px-4 py-10 sm:px-6 lg:ml-52 lg:px-8 lg:py-14">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
