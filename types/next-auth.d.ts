import { User as PrismaUser } from "@prisma/client"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: PrismaUser["id"]
      email: PrismaUser["email"]
    } & DefaultSession["user"]
  }

  interface User extends PrismaUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    id: PrismaUser["id"]
    email: PrismaUser["email"]
  }
}

// Interfaces for the Markdown Editor component
export interface Article {
  id: string;
  title: string;
  keywords: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleFormData {
  title: string;
  keywords: string;
  author: string;
}