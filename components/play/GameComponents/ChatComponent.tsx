"use client";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoSend } from "react-icons/io5";

interface Message {
    sender: "player" | "opponent";
    text: string;
}

export default function ChatComponent() {
    const [messages, setMessages] = useState<Message[]>([
        { sender: "opponent", text: "Good luck!" },
        { sender: "player", text: "Thanks! You too!" },
    ]);
    const [newMessage, setNewMessage] = useState("");

    const sendMessage = () => {
        if (!newMessage.trim()) return;
        setMessages([...messages, { sender: "player", text: newMessage }]);
        setNewMessage("");
    };

    return (
        <div className="w-full mt-3">
            <h2 className="text-lg font-semibold mb-2">Chat</h2>
            <div className="border rounded-lg bg-muted p-3">
                {/* Messages Area */}
                <ScrollArea className="h-[200px] w-full overflow-y-auto p-2">
                    <div className="flex flex-col gap-2">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`px-3 py-2 rounded-md max-w-[80%] text-sm ${msg.sender === "player"
                                    ? "bg-primary text-gray-900 self-end"
                                    : "bg-gray-200 text-gray-900 self-start"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
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
        </div>
    );
}
