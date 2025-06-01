"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react";
import type { User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Account() {

   const [user, setUser] = useState<User | null>(null);

   const { data: session } = useSession();

   const router = useRouter();

   useEffect(() => {
      const fetchUserInfo = async () => {
         try {
            const res = await fetch("/api/user", {
               headers: {
                  "Content-type": "application/json",
               }
            });
            const data = await res.json();
            setUser(data);
         }
         catch (error) {
            console.error("Failed to fetch user info");
         }
      }
      fetchUserInfo();
   }, []);


   return (
      <>
         <main className="min-h-screen flex justify-center items-center">
            <div className="max-w-2xl gap-4 flex flex-col w-full">
               <h1 className="text-3xl font-medium">Your Account Info</h1>
               <div className="flex md:flex-row flex-col gap-4">
                  <div className="bg-primary text-background p-8 rounded-lg shadow-sm flex flex-col space-y-2 md:w-1/2 w-full">
                     {/* <h1>Your Account Info:</h1> */}
                     <Image className="rounded-sm" height={64} width={64} src={user?.image || "https://placehold.co/64/webp"} alt=""></Image>
                     <div>
                        <p className="font-medium text-2xl">{user?.name}</p>
                        <p>{session?.user.email}</p>
                     </div>
                  </div>
                  <div className="bg-secondary p-8 rounded-lg shadow-sm w-full md:w-1/2">
                     {/* <h1>More Account Info Here</h1> */}
                     <div className="text-sm flex flex-col space-y-3">
                        <p>Id: {session?.user.id}</p>
                        <p>Created at: {user?.createdAt ? new Date(user?.createdAt).toLocaleDateString() : "Unknown"}</p>
                        <button className="underline text-foreground/80 text-sm hover:cursor-pointer hover:brightness-95 active:opacity-95 w-fit" onClick={() => signOut()}>Sign Out</button>
                     </div>
                  </div>
               </div>
               <div className="bg-secondary p-8 rounded-lg shadow-sm space-y-2">
                  <h1 className="text-3xl font-medium">Get Started</h1>
                  <div className="flex gap-2">
                     <button className="btn bg-blue-500" onClick={() => router.push("/dashboard")}>Open dashboard</button>
                     <button className="btn bg-blue-500">Another Action</button>
                  </div>
               </div>
            </div>
         </main>
      </>
   )
}