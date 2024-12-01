'use client'

import { useState, useEffect, useContext } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User } from 'lucide-react'
import { Hex } from 'viem'
import { AppContext } from '@/components/AppContext'

type Message = {
  type: 'bot' | 'user'
  content: string
}

export default function Page() {
  const { hash }: {hash: string} = useParams()
  const {account, publicClient, walletClient, chain } = useContext(AppContext);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">Payout Chatbot</h2>
          <ScrollArea className="h-[400px] mb-4 p-4 border rounded-md">
          </ScrollArea>
          <div className="flex space-x-2">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
