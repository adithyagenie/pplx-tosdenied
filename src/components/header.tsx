"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="w-full border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex flex-col space-y-1">
              <div className="flex space-x-1">
                <div className="w-6 h-1 bg-green-500 rounded"></div>
                <div className="w-6 h-1 bg-yellow-500 rounded"></div>
              </div>
              <div className="flex space-x-1">
                <div className="w-6 h-1 bg-red-500 rounded"></div>
                <div className="w-6 h-1 bg-gray-500 rounded"></div>
              </div>
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold">Terms of Service</h1>
              <p className="text-sm text-gray-400">Didn't Read</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/services"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Services
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
            >
              Contribute
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
