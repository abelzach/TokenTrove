"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function Page() {
  const [activeTab, setActiveTab] = useState<"OKTO" | "Metamask">("Metamask");
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-200">
      <header className="p-4 flex justify-end items-center"></header>
      <div className="flex justify-center mt-4 mb-2">
        <div className="flex space-x-4 bg-white bg-opacity-30 backdrop-blur-md px-4 py-2 rounded-full">
          <button
            onClick={() => setActiveTab("OKTO")}
            className={`px-4 py-2 font-bold rounded-full ${
              activeTab === "OKTO"
                ? "bg-white text-purple-600"
                : "text-white hover:bg-white hover:text-purple-600"
            }`}
          >
            OKTO
          </button>
          <button
            onClick={() => setActiveTab("Metamask")}
            className={`px-4 py-2 font-bold rounded-full ${
              activeTab === "Metamask"
                ? "bg-white text-purple-600"
                : "text-white hover:bg-white hover:text-purple-600"
            }`}
          >
            Metamask
          </button>
        </div>
      </div>
      <main className="flex flex-col items-center justify-center pt-12 p-4 text-center">
        {activeTab === "OKTO" ? (
          <div className="text-center text-white animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
              Welcome to TokenTrove
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              Secure AI-powered crypto giveaways, unlocking digital treasures
            </p>
            <Link
              href="/payoutokto"
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold text-lg flex items-center space-x-2 transition-all hover:bg-purple-600 hover:text-white animate-pulse"
            >
              <span>Get Started with TokenTrove</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="text-center text-white animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
              Welcome to TokenTrove
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              Secure AI-powered crypto giveaways, unlocking digital treasures
            </p>
            <Link
              href="/payout"
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold text-lg flex items-center space-x-2 transition-all hover:bg-purple-600 hover:text-white animate-pulse"
            >
              <span>Get Started with TokenTrove</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
