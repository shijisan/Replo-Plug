import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";


export async function GET(){
   const session = await auth();
   
   const fetchedUser = await prisma.user.findUnique({
      where:{
         id: session?.user.id,
      }
   })

   return NextResponse.json(fetchedUser);
}