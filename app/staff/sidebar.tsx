"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Path } from "@/types";

import { RxDashboard } from "react-icons/rx";
import { FaCreditCard } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";

const links: Path[] = [
  { title: "dashboard", path: "/staff/lecturer/dashboard", Icon: RxDashboard },
  { title: "results", path: "/staff/lecturer/results", Icon: FaListCheck },
];

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 left-0 hidden h-[calc(100vh-4rem)] w-52 rounded-tr-lg border-r border-gray-200 bg-gray-50 shadow-lg lg:flex">
      <nav className="flex w-full flex-col flex-wrap  p-6">
        <ul className="space-y-2">
          {links.map(({ title, path, Icon }) => (
            <li key={title}>
              <Link
                className={`flex items-center gap-x-3 rounded-md px-2.5 py-2 ${
                  pathname.startsWith(path)
                    ? "bg-gray-200 font-semibold text-blue-600"
                    : "bg-gray-100 text-sm text-slate-500 hover:bg-gray-200"
                }`}
                href={path}
              >
                <Icon size={16} />

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
