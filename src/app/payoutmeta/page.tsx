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
import { ArrowRight, Copy } from "lucide-react";

export default function PayoutLinkGenerator() {
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

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
            <form className="space-y-4">
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
                {`${window.location.origin}${generatedLink}`}
              </div>
              <Button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}${generatedLink}`
                  )
                }
                variant="outline"
                className="w-full border-purple-500 text-purple-600 hover:bg-purple-100 transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <span>Copy Link</span>
                <Copy className="w-4 h-4" />
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
