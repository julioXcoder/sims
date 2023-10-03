import React from "react";

import { getSubjects } from "@/actions";

const DashboardPage = async () => {
  const { data, error } = await getSubjects();

  return (
    <div>
      <div>DATA: {JSON.stringify(data)}</div>
      <div>ERROR: {JSON.stringify(error)}</div>
    </div>
  );
};

export default DashboardPage;
