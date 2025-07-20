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
import { toast } from "sonner";
import { ApiResponse } from "@/helpers/ApiResponse";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SuggestMessagesData } from "@/data/MessageData";

const specialChar = "||";

const splitSuggestedMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const page = () => {
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
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isSending ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSending}
                className="cursor-pointer"
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
          className="my-4 cursor-pointer"
        >
          Suggest Messages
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Messages</h3>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          {splitSuggestedMessages(suggestMessages).map((message, index) => (
            <Button
              key={index}
              variant="outline"
              className="mb-2"
              onClick={() => handleMessageClick(message)}
            >
              {message}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
