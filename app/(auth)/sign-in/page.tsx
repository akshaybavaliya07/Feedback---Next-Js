"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInSchema } from "@/validators/auth-validators";
import Link from "next/link";
import { toast } from "react-toastify";
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
import { signIn } from "next-auth/react";

const Page = () => {
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setSubmitting(true);

    try {
      const response = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });

      if (response?.status === 401) {
        if (response.error?.startsWith("UNVERIFIED:")) {
          const [, username, message] = response.error.split(":");
          toast.error(message.trim());
          router.replace(`/verify/${username}`);
          return;
        }
        toast.error(response.error);
        return;
      }

      if (response?.ok) {
        toast.success("Successfully signed in!");
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155] text-white px-4">
      <div className="w-full max-w-md p-8 space-y-8 rounded-xl shadow-lg bg-[#1e293b] border border-gray-600">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-white">
            Welcome Back to{" "}
            <span className="text-yellow-400">Ghost Whisper</span>
          </h1>
          <p className="mb-4 text-gray-300">
            Sign in to continue your secret conversations
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Username or Email
                  </FormLabel>
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
              className={`w-full cursor-pointer bg-yellow-500 text-black hover:bg-yellow-400 transition-colors ${
                submitting ? "opacity-50" : ""
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-yellow-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
