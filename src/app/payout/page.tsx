"use client";

import { useState } from "react";
import { createPayout } from "./actions/createPayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowRight, Copy, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OktoContextType, useOkto } from "okto-sdk-react";
import { nanoid } from "nanoid";
import { approveToken, createPayoutTxData } from "@/lib/transaction";

const networkName = "POLYGON_TESTNET_AMOY";

export default function PayoutLinkGenerator() {
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const { getWallets, isLoggedIn, executeRawTransaction } = useOkto() as OktoContextType;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

    const formData = new FormData(event.currentTarget);
      if(!isLoggedIn) {return}
      const amount = (formData.get('amount') || -1) as number
      console.log(amount);
      if(amount<0) {return};
      const id = nanoid(10);
      const wallets = await getWallets();
      const wallet = wallets.wallets.find((wallet) => wallet.network_name === networkName)
      console.log(wallets)
      if (!wallet) {
          console.log("PolygonAmoy address not found");
          return;
      }
      const userAddress = wallet.address;
      console.log(userAddress)
      const approveTxData = approveToken(userAddress, amount)
      const createPaytoutTxData = createPayoutTxData(id, amount, password, userAddress)
      try {
        await executeRawTransaction(approveTxData).then((result) => {
          console.log('Transaction submitted', result);
      })
      await executeRawTransaction(createPaytoutTxData).then((result) => {
          console.log('Transaction submitted', result);
      })
      const payoutLink = `/payout/${id}`
      setGeneratedLink(payoutLink)
      } catch (error) {
        console.log(error)
      }

  };

  const fullLink = generatedLink
    ? `${window.location.origin}${generatedLink}`
    : "";

  const handleShare = async (platform?: string) => {
    const shareData = {
      title: "Payout Link",
      text: "Here's your secure payout link",
      url: fullLink,
    };

    if (platform) {
      let url = "";
      switch (platform) {
        case "whatsapp":
          url = `https://wa.me/?text=${encodeURIComponent(
            `${shareData.text}: ${shareData.url}`
          )}`;
          break;
        case "gmail":
          url = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${encodeURIComponent(
            shareData.title
          )}&body=${encodeURIComponent(`${shareData.text}: ${shareData.url}`)}`;
          break;
        case "telegram":
          url = `https://t.me/share/url?url=${encodeURIComponent(
            shareData.url
          )}&text=${encodeURIComponent(shareData.text)}`;
          break;
        case "discord":
          url = `https://discord.com/channels/@me?content=${encodeURIComponent(
            `${shareData.text}: ${shareData.url}`
          )}`;
          break;
      }
      window.open(url, "_blank");
    } else if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-200 flex flex-col">
      <header className="p-4 flex justify-between items-center"></header>
      <div className="h-full from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4 grow">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-purple-600">
              Generate Payout Link
            </CardTitle>
            <CardDescription className="text-purple-700">
              Create a secure payout link by entering the details below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-purple-700">
                  Amount (USD)
                </Label>
                <Input
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="Enter amount"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-purple-300 text-black focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-purple-700">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full text-lg font-extrabold bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <span>Create Payout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
          {generatedLink && (
            <CardFooter className="flex flex-col items-start space-y-4">
              <h3 className="font-semibold text-purple-700">
                Generated Payout Link:
              </h3>
              <div className="p-3 bg-purple-100 rounded-md w-full break-all text-purple-800">
                {fullLink}
              </div>
              <div className="flex w-full space-x-2">
                <Button
                  onClick={() => navigator.clipboard.writeText(fullLink)}
                  variant="outline"
                  className="flex-1 border-purple-500 text-purple-600 hover:bg-purple-100 transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Copy</span>
                  <Copy className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 border-purple-500 text-purple-600 hover:bg-purple-100 transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Share</span>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
                      WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("gmail")}>
                      Gmail
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("telegram")}>
                      Telegram
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("discord")}>
                      Discord
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare()}>
                      More options...
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
