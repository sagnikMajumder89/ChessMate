"use client";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoSend } from "react-icons/io5";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

interface Message {
  uid: string;
  text: string;
}

interface ChatComponentProps {
  gameId: string;
  socket: Socket;
  playerId: string;
}

export default function ChatComponent({
  gameId,
  socket,
  playerId,
}: ChatComponentProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  const connectChat = () => {
    if (socket) {
      socket.emit("join-chat", { gameId });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    if (!isConnected) {
      toast.error("You must connect to the chat first");
      return;
    }
    if (!socket) {
      toast.error("Socket connection is not available");
      return;
    }
    socket.emit("chat-message", { gameId, message: newMessage });
    setMessages([...messages, { uid: playerId, text: newMessage }]);
    setNewMessage("");
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on("init-chat", (chatMessages: Message[]) => {
        setMessages(chatMessages);
      });
      socket.on("connect-chat", () =>{
        socket.emit("init-chat", { gameId });
        setIsConnected(true);
      });
      socket.on("chat-message", (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
      socket.on("message-error", (error: string) => {
        toast.error(error);
        toast.error("Failed to send message");
      });
      socket.on("disconnect-chat", () => setIsConnected(false));
      socket.on("connect_error", () => {
        toast.error("Error connecting to chat service");
        setIsConnected(false);
      });
    }
  }, []);

  return (
    <div className="w-full mt-3">
      <h2 className="text-lg font-semibold mb-2">Chat</h2>
      {isConnected ? (
        <div className="border rounded-lg bg-muted p-3">
          {/* Messages Area */}
          <ScrollArea className="h-[200px] w-full overflow-y-auto p-2">
            <div className="flex flex-col gap-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 rounded-md max-w-[80%] text-sm ${
                    msg.uid === playerId
                      ? "bg-primary text-gray-900 self-end"
                      : "bg-gray-200 text-gray-900 self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={endRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="flex items-center gap-2 mt-3">
            <Input
              type="text"
              placeholder="Type a message..."
              className="flex-1"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button size="icon" variant="default" onClick={sendMessage}>
              <IoSend className="w-5 h-5" />
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Button onClick={connectChat}>Accept Chat?</Button>
        </div>
      )}
    </div>
  );
}
