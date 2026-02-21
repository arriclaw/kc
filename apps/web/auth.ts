import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

const emailAuthEnabled = process.env.ENABLE_EMAIL_AUTH === "true";

const emailProvider =
  emailAuthEnabled && process.env.EMAIL_FROM && (process.env.EMAIL_SERVER || process.env.EMAIL_SERVER_HOST)
    ? [
        Email({
          server:
            process.env.EMAIL_SERVER ||
            (process.env.EMAIL_SERVER_HOST
              ? {
                  host: process.env.EMAIL_SERVER_HOST,
                  port: Number(process.env.EMAIL_SERVER_PORT || 587),
                  auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD
                  }
                }
              : undefined),
          from: process.env.EMAIL_FROM
        })
      ]
    : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  logger: {
    error(error) {
      if (error.name === "CredentialsSignin") return;
      console.error("[auth][error]", error);
    }
  },
  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").trim().toLowerCase();
        const password = String(credentials?.password || "");
        if (!email) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;
        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, role: user.role, name: user.name };
      }
    }),
    ...emailProvider,
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
          })
        ]
      : [])
  ],
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.email) return token;
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email },
        select: { id: true, role: true, name: true, email: true }
      });
      if (dbUser) {
        token.id = dbUser.id;
        token.role = dbUser.role;
        token.name = dbUser.name ?? token.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id || "");
        session.user.role = (token.role as Role) ?? Role.OWNER;
        session.user.email = token.email ?? "";
        session.user.name = token.name ?? "";
      }
      return session;
    }
  }
});
