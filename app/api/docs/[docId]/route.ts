import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context : {params: Promise<{docId: string}>}){
   const {docId} = await  context.params; // Changed from params.id to params.docId
   console.log("Document ID:", docId);
   
   if (!docId) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
   }
   
   try {
      const fetchedDoc = await prisma.article.findUnique({
         where: {
            id: docId,
         }
      });
      
      if (!fetchedDoc) {
         return NextResponse.json({ error: "Document not found" }, { status: 404 });
      }
      
      return NextResponse.json(fetchedDoc);
   } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
   }
}