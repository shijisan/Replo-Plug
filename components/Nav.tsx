"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import NavSearchBar from "./NavSearchBar";

export default function Nav() {

   const path = usePathname();
   const [newPath, setNewPath] = useState("");
   const { data: session } = useSession();

   useEffect(() => {
      const splitPath = () => {
         let result = ""
         for (let i = 0; i < path.length; i++) {
            result += path[i] === "/" ? " / " : path[i];
         }
         setNewPath(result);
         console.log(result)
      }

      splitPath();
   }, [])



   return (
      <>
         <nav className="flex md:px-[10vw] h-[8vh] fixed top-0 left-0 w-full bg-primary items-center">
            <div className="flex items-center">
               <h1 className="text-3xl me-2">Replo Plug</h1>
               <span className="text-lg">{newPath === " / " && " / Home"}</span>
            </div>
            <div className="ps-[5vw] min-w-lg h-full items-center justify-center">
               <NavSearchBar />
            </div>
            <ul className="flex justify-evenly items-center grow">
               <li>
                  <Link href="/">Home</Link>
               </li>

               <li>
                  <Link href="/contact">Contact</Link>
               </li>
               {session?.user &&
                  <>

                     <li>
                        <Link href={"/dashboard"}>Dashboard</Link>
                     </li>

                     <li>
                        <Link href={"/account"}>Account</Link>
                     </li>
                  </>
               }
            </ul>
         </nav>
      </>
   )
}