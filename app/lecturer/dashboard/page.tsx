import React from "react";

import { getSubjects, getStudentsForSubjectInstance } from "@/actions";

const DashboardPage = async () => {
  const { data, error } = await getSubjects();
  const response = await getStudentsForSubjectInstance(3);

  return (
    <div>
      <div>DATA: {JSON.stringify(data)}</div>
      <div>ERROR: {JSON.stringify(response.error)}</div>
    </div>
  );
};

export default DashboardPage;
