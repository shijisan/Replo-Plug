"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

export default function Doc() {
   const [markdown, setMarkdown] = useState<string>("");
   const [loading, setLoading] = useState(true);
   const params = useParams();
   const id = params.docId as string;

   useEffect(() => {
      console.log("Full params:", params);
      console.log("Extracted ID:", id);

      const fetchDoc = async () => {
         if (!id) return;

         console.log("Fetching URL:", `/api/docs/${id}`);
         try {
            const res = await fetch(`/api/docs/${id}`, {
               headers: {
                  "Content-type": "application/json",
               },
            });

            const data = await res.json();
            console.log("fetched data:", data);
            setMarkdown(data.content);
         } catch (error) {
            console.error("Error fetching doc:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchDoc();
   }, [id]);

   useEffect(() => {
      const timeout = setTimeout(() => {
         fetch(`/api/docs/${id}/view`, { method: "POST" });
      }, 5000);

      return () => clearTimeout(timeout);
   }, [id]);

   return (
      <main className="pt-[9vh] flex items-center justify-center min-h-screen h-full pb-[1vh]">
         {loading ? (
            <div className="flex flex-col items-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
               <p className="mt-4 text-primary">Loading document...</p>
            </div>
         ) : (
            <div className="md:w-3xl border-2 border-primary h-full rounded-md p-8 bg-secondary min-h-[75vh]">
               <MarkdownPreview source={markdown} style={{ backgroundColor: "transparent" }} />
            </div>
         )}
      </main>
   );
}
