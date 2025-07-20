"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs"
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
import { X, Calendar as CalendarIcon } from "lucide-react";
import { Message } from "@/models/user.model";
import axios from "axios";
import { toast } from "sonner";

interface MessageCardProps {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {

  const handleDelete = async () => {
    try {
    const response = await axios.delete(`/api/delete-message/${message._id}`);
    toast.success(response.data.message);
    onMessageDelete(message._id);
  } catch (error: any) {
    console.error("Delete failed:", error);
    toast.error(error?.response?.data?.message || "Something went wrong!");
  }
  };

  return (
    <Card className="p-4 shadow-sm border rounded-2xl hover:shadow-md transition-shadow duration-300 bg-white">
  <CardHeader className="flex flex-row items-start justify-between space-y-0">
    <div className="flex flex-col gap-2">
      <CardTitle className="text-base font-medium text-gray-800 flex items-center gap-2">
        {message.content || "No message content"}
      </CardTitle>

      <div className="text-xs text-muted-foreground flex items-center gap-1">
        {dayjs(message.createdAt).format("MMM D, YYYY • h:mm A")}
      </div>
    </div>

    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-red-100 w-8 h-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this message?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove the
            message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
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
