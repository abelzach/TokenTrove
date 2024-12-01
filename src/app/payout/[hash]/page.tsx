"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConversationChain } from "langchain/chains";
import {
  COMMAND,
  createChain,
  generateResponse,
  GptResponseType,
} from "@/lib/gpt";
import { OktoContextType, useOkto } from "okto-sdk-react";
import { redeemPayoutTxData } from "@/lib/transaction";

type Message = {
  type: "bot" | "user";
  content: string;
};

const networkName = "POLYGON_TESTNET_AMOY";

export default function Page() {
  const { hash }: { hash: string } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");
  const [gptChain, setGptChain] = useState<ConversationChain>();
  const {
    getWallets,
    isLoggedIn,
    getUserDetails,
    executeRawTransaction,
    logOut,
  } = useOkto() as OktoContextType;

  useEffect(() => {
    if (!gptChain) {
      const gptChain = createChain();
      setGptChain(gptChain);
    }
    setMessages([
      {
        type: "bot",
        content: `Welcome! I'm here to help you with your payout for link ${hash}.`,
      },
      {
        type: "bot",
        content:
          "Please enter your password. Multiple retires can cause the link to self destruct.",
      },
    ]);
  }, [hash]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getUserDetails();
        console.log("details :", details);
        setEmail(details?.email);
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    };
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  const handleSend = async () => {
    if (!isLoggedIn) {
      return;
    }
    if (gptChain && input.trim()) {
      setMessages((prev) => [...prev, { type: "user", content: input }]);
      setInput("");
      const data = await generateResponse(gptChain, input);
      await handleDataAction(data);
      console.log(data);
      setMessages((prev) => [...prev, { type: "bot", content: data.message }]);
    }
  };

  async function handleDataAction(data: GptResponseType) {
    if (data.type === "MSG") {
      return;
    }
    switch (data.cmdName) {
      case COMMAND.REDEEM_PAYOUT: {
        const wallets = await getWallets();
        const wallet = wallets.wallets.find(
          (wallet) => wallet.network_name === networkName
        );
        console.log(wallets);
        if (!wallet) {
          console.log("PolygonAmoy address not found");
          return;
        }
        const userAddress = wallet.address;
        console.log(userAddress);
        const password = data.args[0] as string;
        const redeemTxData = redeemPayoutTxData(hash, password, userAddress);
        try {
          await executeRawTransaction(redeemTxData).then((result) => {
            console.log("Transaction submitted", result);
          });
        } catch (error) {
          console.log(error);
        }
      }
      default: {
        console.log("Not a valid command");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-200 flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <>
          {email ? (
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm font-medium text-gray-700">{email}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm"></div>
          )}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
              <div
                className={`w-3 h-3 rounded-full ${
                  isLoggedIn ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm font-medium">
                Status: {isLoggedIn ? "Logged In" : "Not Logged In"}
              </span>
            </div>
            <button
              disabled={!isLoggedIn}
              onClick={() => {
                logOut();
              }}
              className="ml-4 relative inline-flex items-center justify-center  overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Logout
              </span>
            </button>
          </div>
        </>
      </header>
      <div className="h-full from-purple-400 via-pink-500 to-red-500 flex items-center justify-center grow">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">
              Payout Chatbot
            </h2>
            <ScrollArea className="h-[400px] mb-4 p-4 border rounded-md">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start mb-4 ${
                    message.type === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.type === "bot" && (
                    <Bot className="w-6 h-6 mr-2 text-purple-600" />
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.type === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-purple-800"
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.type === "user" && (
                    <User className="w-6 h-6 ml-2 text-purple-600" />
                  )}
                </div>
              ))}
            </ScrollArea>
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-grow border-purple-300 focus:border-purple-500 focus:ring-purple-500"
              />
              <Button
                onClick={handleSend}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
