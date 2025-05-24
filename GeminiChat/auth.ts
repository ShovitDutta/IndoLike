import NextAuth from "next-auth";
import { PrismaClient } from "@prisma/client";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
export const { handlers, auth, signIn, signOut } = NextAuth({ adapter: PrismaAdapter(new PrismaClient()), providers: [Google], pages: { signIn: "/" } });
