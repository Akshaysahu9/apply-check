import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        name: { label: "Full Name", type: "text" },
        email: { label: "Email", type: "email" },
      },
      authorize: async (credentials) => {
        const name = credentials?.name?.toString().trim();
        const email = credentials?.email?.toString().trim().toLowerCase();

        if (!name || name.length < 2) return null;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

        return {
          id: email,
          name,
          email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) return isLoggedIn;
      return true;
    },
  },
  trustHost: true,
});
