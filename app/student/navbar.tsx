import React from "react";

import Image from "next/image";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 fixed top-0 z-10 flex justify-between lg:px-4">
      <div className="flex">
        {/* <a className="btn btn-ghost text-xl normal-case">daisyUI</a> */}
        <div className="mr-1.5 flex lg:hidden">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a>Homepage</a>
              </li>
              <li>
                <a>Portfolio</a>
              </li>
              <li>
                <a>About</a>
              </li>
            </ul>
          </div>
        </div>
        <Image src="/logo.png" width={50} height={45} alt="logo" />
        <p className="ml-0.5 text-xl normal-case">SIMS</p>
      </div>
      <div className="flex space-x-3 md:space-x-5">
        <div className="drawer drawer-end">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <label
            htmlFor="my-drawer"
            className="btn btn-ghost btn-circle drawer-button hover:bg-gray-100"
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="badge badge-xs indicator-item bg-red-600"></span>
            </div>
          </label>
          <div className="drawer-side z-20">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              {/* Sidebar content here */}
              <label
                htmlFor="my-drawer"
                className="btn btn-ghost btn-circle drawer-button"
              >
                X
              </label>
              <li>
                <a>Notification Item 1</a>
              </li>
              <li>
                <a>Notification Item 2</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar hover:bg-gray-100"
          >
            <div className="w-10 rounded-full">
              {/* <Image src="/gon.png" alt="Student Profile Image" /> */}
              <img src="/gon.png" alt="Student Profile Image" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
