import React, { ReactNode } from "react";
import { Sidebar, Navbar } from "@/components";

const LecturerLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div>
        <Sidebar />
        <div className="mx-auto mt-10 h-full max-w-[85rem] px-4 py-10 sm:px-6 lg:ml-52 lg:px-8 lg:py-14">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LecturerLayout;
