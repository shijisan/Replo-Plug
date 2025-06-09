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
      <aside className="w-64 min-h-screen bg-secondary border-r border-gray-200 hidden md:block">
         <div className="fixed top-[8vh]">
            <h2 className="text-xl font-semibold mb-4 text-foreground px-6 py-4">Most Viewed Docs</h2>
            <div className="space-y-2">
               {fetchedDocs.length > 0 ? (
                  fetchedDocs.map(fetchedDoc => (
                     <div key={fetchedDoc.id} className="border-b border-gray-100 pb-2">
                        <Link 
                           className="block px-6 text-foreground hover:text-blue-600 hover:underline text-sm leading-relaxed transition-colors duration-200" 
                           href={`/docs/${fetchedDoc.id}`}
                        >
                           {fetchedDoc.title}
                        </Link>
                     </div>
                  ))
               ) : (
                  <div className="text-gray-500 text-sm">Loading...</div>
               )}
            </div>
         </div>
      </aside>
   )
}