import React, { ReactNode } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

const fetchStudent = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/students");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Fetch failed: ${error.message}`);
    }
  }
};

const StudentLayout = async ({ children }: { children: ReactNode }) => {
  const data = await fetchStudent();
  console.log(data);
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
