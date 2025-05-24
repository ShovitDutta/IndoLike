import "next-auth";

declare module "next-auth" {
  interface User {
    geminiApiKey?: string | null;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      geminiApiKey?: string | null;
    } & DefaultSession["user"];
  }
}
