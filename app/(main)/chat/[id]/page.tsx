"use client";

import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { useGetMessagesQuery } from "@/redux/features/chat/chat.api";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Loader2, Send, User as UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch } from "@/redux/hooks";
import { chatApi } from "@/redux/features/chat/chat.api";

export default function Messages() {
  const params = useParams();
  const conversationId = params.id as string;

  const { data: userData } = useGetMeQuery({});
  const {
    data: messagesData,
    isLoading,
    error,
  } = useGetMessagesQuery(
    { conversationId, userId: userData?._id },
    {
      skip: !conversationId || !userData?._id,
    }
  );

  const messages = messagesData?.data?.messages;
  const receiverInfo = messagesData?.data?.receiver;

  const { register, handleSubmit, reset } = useForm();
  const dispatch = useAppDispatch();

  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string);

    socketRef.current.on("connect", () => {
      console.log("Frontend connected, socketID:", socketRef.current?.id);
    });

    if (userData?._id) {
      socketRef.current?.emit("identify", { userId: userData?._id });
    }

    socketRef.current.on("new-message", (data) => {
      dispatch(
        chatApi.util.updateQueryData(
          "getMessages",
          { conversationId, userId: userData?._id },
          (draft) => {
            if (draft?.data?.messages) {
              draft.data.messages.push({
                _id: data.createdAt || Math.random().toString(),
                senderId: data.from,
                message: data.text,
                createdAt: data.createdAt,
              });
            }
          }
        )
      );
    });

    return () => {
      socketRef?.current?.disconnect();
    };
  }, [conversationId, userData?._id, dispatch]);

  const onSubmit = (data: any) => {
    if (!data.chatMessage?.trim()) return;

    socketRef.current?.emit("send-message", {
      receiverId: receiverInfo?._id,
      messageText: data.chatMessage,
    });

    reset();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load messages.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-100 flex-shrink-0">
            {receiverInfo?.image ? (
              <Image
                src={receiverInfo.image}
                alt={receiverInfo.name || "Receiver"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500">
                <UserIcon className="w-5 h-5" />
              </div>
            )}
          </div>
          <h1 className="font-bold text-gray-900">
            {receiverInfo?.name || "Loading..."}
          </h1>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        >
          {messages && messages.length > 0 ? (
            messages.map((m: any) => {
              const isMe = m.senderId === userData?._id;
              return (
                <div
                  key={m._id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${
                      isMe
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    {m.message ||
                      m.text ||
                      m.content ||
                      (typeof m === "string" ? m : JSON.stringify(m))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
              No messages yet...
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              {...register("chatMessage")}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleSubmit(onSubmit)}
              type="submit"
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
