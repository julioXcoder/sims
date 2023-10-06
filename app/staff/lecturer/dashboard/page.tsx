import React from "react";

import {
  getSubjects,
  getStudentsForSubjectInstanceFinalResults,
  getStudentsForSubjectInstanceCAResults,
} from "@/actions";

const DashboardPage = async () => {
  const { data, error } = await getSubjects();
  const response = await getStudentsForSubjectInstanceCAResults(2);

  return (
    <div>
      <div>DATA: {JSON.stringify(data)}</div>
      <div>ERROR: {JSON.stringify(response.data)}</div>
    </div>
  );
};

export default DashboardPage;
