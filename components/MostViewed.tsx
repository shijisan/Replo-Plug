"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Article } from "@prisma/client"

export default function MostViewed() {

   const [fetchedDocs, setFetchedDocs] = useState<Article[]>([])

   useEffect(() => {
      const fetchMostViews = async () => {
         const res = await fetch("/api/docs/most-viewed");
         const data = await res.json();
         setFetchedDocs(data);
      }
      fetchMostViews();
   }, [])

   return (
      <>
         <div>
            <h1 className="text-xl">Most Viewed Docs:</h1>
            <ul className="list-disc text-start list-inside">
               {fetchedDocs.map(fetchedDoc => (
                  <li key={fetchedDoc.id}>
                     <Link className="hover:underline" href={`/docs/${fetchedDoc.id}`}>{fetchedDoc.title}</Link>
                  </li>
               ))}
            </ul>
         </div>
      </>
   )
}