"use client"

import { useState, useEffect } from "react"
import Link from "next/link";

type DocResult = {
   id: string,
   title: string;
};

export default function SearchBar() {
   const [result, setResult] = useState<DocResult[]>([]);
   const [term, setTerm] = useState("");


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
         console.error("Failed to fetch articles", error);
      }
   };

   useEffect(() => {

      fetchResults("");
   }, [])

   return (
      <div className="group">
         <input
            type="search"
            className="focus:rounded-b-none focus:rounded-t-md rounded-full focus:ring-0 border-2 border-primary focus:border-b-0 text-foreground bg-secondary py-3"
            value={term}
            onChange={(e) => {
               setTerm(e.target.value);
               fetchResults(e.target.value);
            }}
            placeholder="Enter search term"
         />
         <ul className="group-focus-within:flex flex-col hidden bg-secondary text-primary group-focus-within:rounded-b-md group-focus-within:border-2 group-focus-within:border-primary group-focus-within:border-t-0 absolute max-w-3xl w-full">
            {result.length === 0 ? (
               <p>No results</p>
            ) : (
               result.map((item: DocResult, id: number) => (
                  <li className="hover:cursor-pointer hover:backdrop-brightness-105" key={id}>{
                     <Link className="px-4 py-1 w-full flex transition-opacity backdrop-brightness-100 hover:underline" href={`/docs/${item.id}`}>{item.title}</Link>
                  }</li>
               ))
            )}
         </ul>
      </div>
   );
}
