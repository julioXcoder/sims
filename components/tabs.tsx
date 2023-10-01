"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  title: string;
  path: string;
};

interface Props {
  items: Item[];
}

const Tabs = ({ items }: Props) => {
  const pathname = usePathname();
  return (
    <div className="tabs">
      {items.map(({ title, path }) => (
        <Link
          href={path}
          className={`tab tab-lifted ${
            pathname.endsWith(path)
              ? "tab-active font-semibold text-blue-600"
              : ""
          }`}
          key={path}
        >
          {title}
        </Link>
      ))}
    </div>
  );
};

export default Tabs;
