import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import GoogleProvider from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
   adapter: PrismaAdapter(prisma),
   secret: process.env.NEXTAUTH_SECRET!,
   session: {
      strategy: "jwt",
   },
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      })
   ],
   callbacks: {
      async signIn({ user, account, profile }) {
         const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
         });
         if (!existingUser) return false; // deny login if user not in DB
         return true; // allow login
      },
      async jwt({ token, user }) {
         if (user) {
            token.id = user.id as string;
            token.email = user.email as string;
         }
         return token;
      },
      async session({ session, token }) {
         if (session.user) {
            session.user.id = token.id as string;
            session.user.email = token.email as string;
         }
         return session;
      }
   }
})