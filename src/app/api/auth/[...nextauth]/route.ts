import type { NextRequest } from "next/server";
import NextAuth, { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";

interface RouteHandlerContext {
  params: { nextauth: string[] }
}

export const kakaoProvider = KakaoProvider({
  clientId: process.env.KAKAO_CLIENT_ID ?? '',
  clientSecret: process.env.KAKAO_CLIENT_SECRET ?? '',
});

export const providers = [
  kakaoProvider,
];

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers,

  // callback 은 [GET] http://localhost:3000/api/auth/session 이 호출되면 호출됨.
  callbacks: {
    async jwt({ token, account }) {
      console.log('jwt callback called!');
      // console.log('@jwt', { token, account });
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log('session callback called!');
      // console.log('@session', { session, token, user });
      // Send properties to the client, like an access_token from a provider.
      if (typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken;
        if (session.user !== undefined) {
          session.user.email = 'zzz';
        }
      }
      console.log('session', session);
      return session;
    },
  },
};

async function auth(req: NextRequest, context: RouteHandlerContext) {
  // console.log('================ /api/auth/[...nextauth] ================');
  // console.log('@req', req);
  // console.log('@context', context);

  const url = req.url;
  const body = req.body;
  const headers = JSON.stringify(req.headers.entries(), undefined, 4);

  console.log('');
  console.log(`[${req.method}] url: ${url}`, { body, headers });
  console.log('');

  return await NextAuth(req, context, authOptions);
}

export { auth as GET, auth as POST };