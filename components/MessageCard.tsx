"use client";

import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/user.model";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ApiResponse } from "@/types/ApiResponse";

interface MessageCardProps {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/delete-message/${message._id}`);
      toast.success(response.data.message);
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error("Delete failed:", axiosError);
      toast.error(axiosError?.response?.data?.message || "Something went wrong!");
    }
  };

  return (
  <Card className="p-5 bg-[#1e293b] border border-gray-600 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-white">
    <CardHeader className="flex flex-row items-start justify-between space-y-0">
      <div className="flex flex-col gap-2">
        <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
          {message.content || "No message content"}
        </CardTitle>

        <div className="text-xs text-gray-400 flex items-center gap-1">
          {dayjs(message.createdAt).format("MMM D, YYYY • h:mm A")}
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-400 hover:bg-red-500/50 w-8 h-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#1e293b] border border-gray-600 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this message?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently remove the message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 text-white hover:bg-red-500" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CardHeader>
  </Card>
);

};

export default MessageCard;
