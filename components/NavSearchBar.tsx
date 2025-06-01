"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type DocResult = {
   id: string;
   title: string;
};

export default function SearchBar() {
   const [result, setResult] = useState<DocResult[]>([]);
   const [term, setTerm] = useState("");
   const [isFocused, setIsFocused] = useState(false);
   const inputRef = useRef<HTMLInputElement>(null);

   const router = useRouter();

   const fetchResults = async (value: string) => {
      try {
         const res = await fetch("/api/docs", {
            method: "POST",
            headers: {
               "Content-type": "application/json",
            },
            body: JSON.stringify({ term: value }),
         });
         const data: DocResult[] = await res.json();
         setResult(data);
      } catch (error) {
         console.error("Failed to fetch articles");
      }
   };

   useEffect(() => {
      fetchResults(""); // Fetch initial random results
   }, []);

   return (
      <div className="relative h-full flex items-center justify-center">
         <div className="relative z-50 w-full max-w-md">
            <input
               ref={inputRef}
               type="search"
               className="focus:rounded-b-none focus:rounded-t-md rounded-full focus:ring-0 border-2 border-primary focus:border-b-0 text-foreground bg-secondary py-3 px-4 w-full"
               value={term}
               onFocus={() => setIsFocused(true)}
               onBlur={() => setTimeout(() => setIsFocused(false), 150)} // slight delay to allow click
               onChange={(e) => {
                  setTerm(e.target.value);
                  fetchResults(e.target.value);
               }}
               placeholder="Enter search term"
            />

            {isFocused && (
               <ul className="absolute top-full left-0 w-full z-40 bg-secondary text-primary border-2 border-t-0 border-primary rounded-b-md max-h-60 overflow-y-auto shadow-lg">
                  {result.length === 0 ? (
                     <li className="px-4 py-2 text-sm text-muted">No results</li>
                  ) : (
                     result.map((item: DocResult) => (
                        <li
                           key={item.id}
                           className="hover:cursor-pointer hover:bg-primary/10"
                        >
                           <Link
                              className="px-4 py-2 block w-full"
                              href={`/docs/${item.id}`}
                           >
                              {item.title}
                           </Link>
                        </li>
                     ))
                  )}
               </ul>
            )}
         </div>
      </div>
   );
}
