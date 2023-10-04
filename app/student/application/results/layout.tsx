import React, { ReactNode } from "react";

import { Tabs } from "@/components";

const items = [
  { title: "CA", path: "/student/application/results" },
  { title: "Finals", path: "/student/application/results/finals" },
];

const StudentResultsLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <div className="mb-3 flex justify-between">
        <Tabs items={items} />
      </div>
      {children}
    </div>
  );
};

export default StudentResultsLayout;
