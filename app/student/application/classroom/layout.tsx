import React, { ReactNode } from "react";

import { Tabs } from "@/components";

const items = [
  { title: "Assignments", path: "/student/application/classroom" },
  { title: "Resources", path: "/student/application/classroom/resources" },
  { title: "Schedule", path: "/student/application/classroom/schedule" },
];

const StudentClassroomLayout = async ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div>
      <div className="mb-3 flex justify-between">
        <Tabs items={items} />
      </div>
      {children}
    </div>
  );
};

export default StudentClassroomLayout;
