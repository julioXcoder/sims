"use client";

import Image from "next/image";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "@/public/logo.png";
import z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authorizeStudent } from "@/actions";

const schema = z.object({
  username: z.string(),
  password: z
    .string()
    .min(7, { message: "Password must be at least 7 characters long" }),
});

type FormData = z.infer<typeof schema>;

const AuthPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const { redirect, error } = await authorizeStudent(data);

    if (redirect) {
      router.push(redirect);
      return;
    } else if (error) {
      setError(error);
    }

    setIsLoading(false);
  };

  return (
    <div className="mx-auto mt-20 w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-md">
      <div className="px-6 py-4">
        <div className="mx-auto flex justify-center">
          <Image className="h-7 w-auto sm:h-8" src={logo} alt="logo" />
        </div>
        <h3 className="mt-3 text-center text-xl font-medium text-gray-600">
          Welcome Back
        </h3>
        <form
          className="form-control w-full max-w-xs space-y-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            {errors.username?.message && <p>{errors.username?.message}</p>}
            <label className="label">
              <span className="label-text">username</span>
            </label>
            <input
              {...register("username")}
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div>
            {errors.password?.message && <p>{errors.password?.message}</p>}
            <label className="label">
              <span className="label-text">password</span>
              <span className="label-text cursor-pointer text-xs text-gray-600 hover:underline">
                forgot password?
              </span>
            </label>
            <input
              {...register("password")}
              type="password"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          {error && <p>{error}</p>}
          <button
            type="submit"
            role="button"
            disabled={!isValid}
            aria-disabled="true"
            className="btn bg-blue-500 text-white hover:bg-blue-400"
          >
            {loading ? (
              <span className="loading loading-dots loading-sm"></span>
            ) : (
              <>Sign In</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
