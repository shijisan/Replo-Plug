"use client"
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

export default function Doc() {
   const [markdown, setMarkdown] = useState<string>("");
   const params = useParams();
   const id = params.docId as string; // Changed to match your API route folder name [docId]

   useEffect(() => {
      console.log("Full params:", params);
      console.log("Extracted ID:", id);

      const fetchDoc = async () => {
         if (!id) return;

         console.log("Fetching URL:", `/api/docs/${id}`);

         const res = await fetch(`/api/docs/${id}`, {
            headers: {
               "Content-type": "application/json",
            },
         });

         const data = await res.json();
         console.log("fetched data:", data);
         setMarkdown(data.content);
      };

      fetchDoc();
   }, [id]); // Also fixed the dependency array

   return (
      <main className="pt-[9vh] flex items-center justify-center min-h-screen h-full pb-[1vh]">
         <div className="md:w-3xl border-2 border-primary h-full rounded-md p-8 bg-secondary">
            <MarkdownPreview source={markdown} style={{ backgroundColor: "transparent" }} />

         </div>
      </main>
   );
}