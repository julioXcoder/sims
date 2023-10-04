import { headers } from "next/headers";
const headersList = headers();
const userId = headersList.get("userId");

const ResultsPage = () => {
  return <div>user: {userId}</div>;
};

export default ResultsPage;
