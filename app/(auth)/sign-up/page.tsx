"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signUpSchema } from "@/validators/auth-validators";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ApiResponse } from "@/helpers/ApiResponse";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const debounce = useDebounceCallback(setUsername, 300);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const checkForUniqueUsername = async () => {
    if (username && username.trim().length >= 3) {
      setUsernameMessage("");
      try {
        await axios.get(`/api/check-unique-username?username=${username}`);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response?.status === 409) {
          setUsernameMessage(axiosError.response?.data?.message);
        } else {
          toast.error("An error occurred while checking the username.");
        }
      }
    } else {
      setUsernameMessage("");
    }
  };

  useEffect(() => {
    checkForUniqueUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      if (response.data.success) {
        toast.success("Sign up successful! Redirecting...");
        router.replace(`/verify/${username}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred during sign up.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155] text-white px-4">
      <div className="w-full max-w-md p-8 space-y-8 rounded-xl shadow-lg bg-[#1e293b] border border-gray-600">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-white">
            Join <span className="text-yellow-400">Mystery Message</span>
          </h1>
          <p className="mb-4 text-gray-300">
            Signup to start your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounce(e.target.value);
                      }}
                      className="bg-[#334155] border border-gray-500 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {usernameMessage && (
              <p className="text-sm text-red-500 -mt-4">{usernameMessage}</p>
            )}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-[#334155] border border-gray-500 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className="bg-[#334155] border border-gray-500 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={submitting}
              className={`w-full bg-yellow-500 text-black hover:bg-yellow-400 transition-colors ${
                submitting ? "opacity-50" : ""
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing Up...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-yellow-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
