import Link from "next/link";

import { IconType } from "react-icons";

type Links = {
  title: string;
  path: string;
  Icon: IconType;
};

import { RxDashboard } from "react-icons/rx";
import { FaRegListAlt } from "react-icons/fa";

const links: Links[] = [
  { title: "dashboard", path: "/student/dashboard", Icon: RxDashboard },
  { title: "results", path: "/student/results", Icon: FaRegListAlt },
];

const Sidebar = () => {
  return (
    <div className="fixed bottom-0 left-0 hidden h-[calc(100vh-4rem)] w-52 lg:flex">
      <nav className="flex w-full flex-col flex-wrap  p-6">
        <ul className="space-y-1.5">
          {links.map(({ title, path, Icon }) => (
            <li key={title}>
              <Link
                className="flex items-center gap-x-3 rounded-md bg-gray-100 px-2.5 py-2 text-sm text-slate-700 hover:bg-gray-200"
                href={path}
              >
                <Icon className="h-3.5 w-3.5" />

                {title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
