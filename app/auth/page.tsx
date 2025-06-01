"use client"

import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

export default function Auth() {
   return (
      <>
         <main className="min-h-screen flex items-center justify-center">
            <div className="rounded-lg shadow-sm bg-secondary max-w-md w-full">
               <div className="px-8 pt-8">
                  <h1 className="text-3xl font-medium">Sign In</h1>
               </div>
               <div className="w-full px-4">
                  <hr className="mt-2 mb-4 text-primary border w-full" />
               </div>
               <div className="px-8 pb-8">
                  <p>Here is some text, I don&apos;t know how to make UI for auth page with only Google as auth provider. lol.</p>
                  <div className="mt-4">
                     <button className="btn bg-blue-500" onClick={() => signIn("google", {callbackUrl: "/account"})}>
                        <FaGoogle />
                        Sign In with Google
                     </button>
                  </div>

               </div>
            </div>
         </main>
      </>
   )
}