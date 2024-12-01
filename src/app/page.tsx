"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useOkto, OktoContextType } from "okto-sdk-react";
import { EmailOTPVerification } from "@/components/emailOTPVerification";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"OKTO" | "Metamask">("Metamask");
  const {
    isLoggedIn,
    getWallets,
    getUserDetails,
    createWallet,
    logOut,
  } = useOkto() as OktoContextType;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getUserDetails();
        console.log("details :", details);
        const wallets = await createWallet();
        console.log("getWallets : ", wallets);

        if (!wallets) {
          console.log("No wallets found, creating a new wallet...");
          await createWallet();
          console.log("Wallet created successfully.");
        }
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    };
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-200">
      <header className="p-4 flex justify-end items-center">
        {activeTab === "OKTO" ? (
          <>
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
          </>
        ) : (
          <></>
        )}
      </header>
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
            {!isLoggedIn ? (
              <center>
                <div className="w-full max-w-lg mb-4">
                  <EmailOTPVerification
                    onVerificationSuccess={() =>
                      console.log("Verification successful")
                    }
                    onVerificationError={(error) =>
                      console.error("Verification failed:", error)
                    }
                  />
                </div>
              </center>
            ) : (
              <></>
            )}
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
