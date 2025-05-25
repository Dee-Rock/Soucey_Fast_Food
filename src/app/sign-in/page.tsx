"use client"

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center mb-6">
            <div className="relative w-12 h-12 mr-2">
              <Image 
                src="/logo.png" 
                alt="Soucey Logo" 
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-2xl text-pink-600">Soucey</span>
          </Link>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/sign-up" className="font-medium text-pink-600 hover:text-pink-500">
              create a new account
            </Link>
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-pink-600 hover:bg-pink-700 text-sm normal-case',
                footerActionLink: 'text-pink-600 hover:text-pink-700',
              },
            }}
            redirectUrl="/menu"
          />
        </div>
      </div>
    </div>
  );
}
