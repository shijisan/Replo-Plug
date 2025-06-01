"use client"

import { useState } from "react"
import MarkdownEditor from "@/components/dashboard/MarkdownEditor";

export default function Dashboard() {

   const [showTab, setShowTab] = useState<"overview" | "markdownEditor">("overview");

   return (
      <>
         <div className="flex h-screen w-full items-center justify-center pt-[8vh]">
               <aside className="flex flex-col md:w-[20vw] bg-secondary h-full md:border-e-2 border-primary">
                  <button className="btn" onClick={() => setShowTab("overview")}>Overview</button>
                  <button className="btn" onClick={() => setShowTab("markdownEditor")}>Markdown Editor</button>
               </aside>
               <main className="grow w-full h-full">
                  {showTab === "overview" &&
                     <div>
                        <h1>Overview</h1>
                     </div>
                  }
                  {showTab === "markdownEditor" &&
                     <MarkdownEditor />
                  }
               </main>
         </div>
      </>
   )
}