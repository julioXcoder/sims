"use client";

import { useState } from "react";

import Image from "next/image";

const images = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
];

const GazettePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };
  return (
    <div className="grid gap-y-8 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-0">
      <div className="lg:order-2 lg:col-span-1 lg:flex lg:h-[85vh] lg:w-full lg:flex-col lg:bg-gradient-to-r lg:from-gray-50 lg:via-transparent lg:to-transparent">
        <h1 className="font-semibold">BLOG POSTS</h1>
        <div className="overflow-auto pt-2 lg:py-8 lg:pl-4">
          <div className="lg:space-y-6">
            {images.map((image, index) => (
              <a
                key={index}
                className={`group items-center ${
                  currentIndex === index
                    ? "active flex gap-x-6"
                    : "hidden gap-x-6 lg:flex"
                }`}
                href="#"
              >
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    className="absolute left-0 top-0 h-full w-full rounded-lg object-cover"
                    fill
                    src={image}
                    alt="Image Description"
                  />
                </div>
                <div className="grow">
                  <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600">
                    5 Reasons to Not start a UX Designer Career in 2022/2023
                  </span>
                </div>
              </a>
            ))}
          </div>
          <div className="flex justify-center gap-2.5 lg:hidden">
            {images.map((image, index) => (
              <div
                key={index}
                className={`h-3.5 w-3.5 cursor-pointer rounded-full shadow-md ${
                  currentIndex === index ? "bg-gray-600" : "bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                {/* {index + 1} */}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:order-1 lg:col-span-2">
        <h1 className="mb-5 font-semibold uppercase">Campus Pulse</h1>
        <div className="grid gap-6 sm:grid-cols-2  lg:grid-cols-3">
          <a className="group block" href="#">
            <div className="relative h-40 w-full">
              <Image
                className="w-full rounded-xl object-cover"
                fill
                src="/images/1.jpg"
                alt="Image Description"
              />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-800 group-hover:text-blue-600">
              Unity’s inside sales team drives 80% of its revenue with Preline.
            </h3>
            <p className="mt-2 text-xs text-gray-600">
              By Julio Njeza | 4 mins read | 12 sep 2022
            </p>
          </a>
          <a className="group block" href="#">
            <div className="relative h-40 w-full">
              <Image
                className="w-full rounded-xl object-cover"
                fill
                src="/images/1.jpg"
                alt="Image Description"
              />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-800 group-hover:text-blue-600">
              Unity’s inside sales team drives 80% of its revenue with Preline.
            </h3>
            <p className="mt-2 text-xs text-gray-600">
              By Julio Njeza | 4 mins read | 12 sep 2022
            </p>
          </a>
          <a className="group block" href="#">
            <div className="relative h-40 w-full">
              <Image
                className="w-full rounded-xl object-cover"
                fill
                src="/images/1.jpg"
                alt="Image Description"
              />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-800 group-hover:text-blue-600">
              Unity’s inside sales team drives 80% of its revenue with Preline.
            </h3>
            <p className="mt-2 text-xs text-gray-600">
              By Julio Njeza | 4 mins read | 12 sep 2022
            </p>
          </a>
          <a className="group block" href="#">
            <div className="relative h-40 w-full">
              <Image
                className="w-full rounded-xl object-cover"
                fill
                src="/images/1.jpg"
                alt="Image Description"
              />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-800 group-hover:text-blue-600">
              Unity’s inside sales team drives 80% of its revenue with Preline.
            </h3>
            <p className="mt-2 text-xs text-gray-600">
              By Julio Njeza | 4 mins read | 12 sep 2022
            </p>
          </a>
          <a className="group block" href="#">
            <div className="relative h-40 w-full">
              <Image
                className="w-full rounded-xl object-cover"
                fill
                src="/images/1.jpg"
                alt="Image Description"
              />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-800 group-hover:text-blue-600">
              Unity’s inside sales team drives 80% of its revenue with Preline.
            </h3>
            <p className="mt-2 text-xs text-gray-600">
              By Julio Njeza | 4 mins read | 12 sep 2022
            </p>
          </a>
          <a className="group block" href="#">
            <div className="relative h-40 w-full">
              <Image
                className="w-full rounded-xl object-cover"
                fill
                src="/images/1.jpg"
                alt="Image Description"
              />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-800 group-hover:text-blue-600">
              Unity’s inside sales team drives 80% of its revenue with Preline.
            </h3>
            <p className="mt-2 text-xs text-gray-600">
              By Julio Njeza | 4 mins read | 12 sep 2022
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default GazettePage;
