"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { messageSchema } from "@/validators/auth-validators";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ApiResponse } from "@/types/ApiResponse";
import { SuggestMessagesData } from "@/data/MessageData";

const specialChar = "||";

const splitSuggestedMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const Page = () => {
  const [isSending, setIsSending] = useState(false);
  const [suggestMessages, setSuggestMessages] = useState(initialMessageString);
  const [suggestMessageLoading, setSuggestMessageLoading] = useState(false);
  const { username } = useParams<{ username: string }>();

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSending(true);
    try {
      const response = await axios.post("/api/send-message", {
        message: data.content,
        sendTo: username,
      });
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError?.response?.data?.message);
    } finally {
      setIsSending(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setSuggestMessageLoading(true);
    try {
      // use useComplition hook to fetch suggested messages stream resoonse
      const randomIndex = Math.floor(Math.random() * SuggestMessagesData.length);
      setSuggestMessages(SuggestMessagesData[randomIndex]);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError?.response?.data?.message || "something went wrong!"
      );
    } finally {
      setSuggestMessageLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155] text-white px-4 py-12">
      <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Write your message here..." className="bg-[#1e293b] text-white border border-gray-600 placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isSending ? (
              <Button disabled className="bg-yellow-400 text-black">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending...
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSending}
                className="bg-yellow-400 text-black hover:bg-yellow-300 cursor-pointer"
              >
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <Button
          onClick={fetchSuggestedMessages}
          disabled={suggestMessageLoading}
          className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold px-6 py-2 rounded-lg shadow-md transition cursor-pointer"
        >
          Suggest Messages
        </Button>
      </div>

      {suggestMessages.length > 0 && (
        <div className="flex flex-col gap-4 mt-6">
          {splitSuggestedMessages(suggestMessages).map((message, index) => (
            <div
              key={index}
              onClick={() => handleMessageClick(message)}
              className="bg-[#1e293b] text-white border border-gray-700 rounded-xl p-4 shadow-md hover:bg-[#2d3748] cursor-pointer transition"
            >
              <p className="text-sm font-medium">{message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default Page;
