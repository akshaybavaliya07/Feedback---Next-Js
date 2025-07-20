"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { acceptMessageSchema } from "@/validators/auth-validators";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/helpers/ApiResponse";
import MessageCard from "@/components/MessageCard";
import { Message } from "@/models/user.model";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");

  const router = useRouter();
  const { data: session, status } = useSession();

  const { register, watch, setValue } = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    console.log("Fetching messages...");
    try {
      const response = await axios.get<ApiResponse>("/api/accepting-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages ?? true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/get-all-messages");
      setMessages(response.data.messages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/sign-in");
    }

    if (status === "authenticated" && session?.user) {
      const username = session.user.username;
      setProfileUrl(`${window.location.origin}/u/${username}`);
    }

    fetchAcceptMessages();
    fetchMessages();
  }, [status, session]);

  const handleSwitchChange = async () => {
    try {
      await axios.post("/api/accepting-messages", {
        isAcceptingMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success("Messages accepting status updated");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId)
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("URL copied");
  };

  if (!session || !session.user) {
    return null;
  }

  return (
    <div className="my-4 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            className="w-full p-2 mr-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
            disabled
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-6 pl-2 flex items-center space-x-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          className="scale-150 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
        />
        <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
          Accept Messages:{" "}
          <span className={acceptMessages ? "text-green-600" : "text-red-500"}>
            {acceptMessages ? "On" : "Off"}
          </span>
        </span>
      </div>
      <Separator />
      <Button className="mt-4" variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages();
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {!isLoading ? (
          messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )
        ) : null}
      </div>
    </div>
  );
};

export default page;
